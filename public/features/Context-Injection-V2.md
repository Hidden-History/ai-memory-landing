# Context Injection V2.0

> **DEPRECATION NOTICE (v2.2.2)**: This document has been superseded by AI-Memory-Behavior-Spec-V1.md §4 (Context Injection). Retained for historical context.

**Status**: Source of Truth
**Created**: 2026-02-22
**Last Updated**: 2026-02-22
**Owner**: AI Memory Module
**Implements**: SPEC-012 (Progressive Context Injection), AD-6
**Supersedes**: Core-Architecture-Principle-V2.md Section 7.2 (simple injection model)
**Research**: BP-076 (Progressive Staged Context Injection), BP-089 (Adaptive Token Budgets)

---

## Purpose

This document defines the **authoritative progressive context injection architecture** for the AI Memory Module. The system uses a two-tier injection model: Tier 1 provides bootstrap context on every session start, Tier 2 provides adaptive per-turn context injection with confidence gating, collection routing, and greedy fill.

**What changed from Core Architecture V2**: Section 7.2 of Core Architecture V2 stated "startup: Fresh session, no prior context" and Section 8 stated "Session start (startup/clear) is NOT automatic." AD-6, decided after Core V2 with full best practice research (BP-076), intentionally overrides this — startup now gets bootstrap injection. This is NOT conversation restoration (still resume/compact only) but foundational project context.

---

## 1. Two-Tier Injection Architecture

```
                    SESSION LIFECYCLE
                           │
            ┌──────────────┼──────────────┐
            │              │              │
         startup        resume         clear
            │           compact           │
            │              │              │
    ┌───────▼───────┐  ┌──▼───────┐  ┌──▼───────┐
    │   TIER 1      │  │ Existing │  │ No       │
    │   Bootstrap   │  │ session  │  │ injection│
    │   (2-3K tok)  │  │ restore  │  │          │
    │               │  │ (4K tok) │  │          │
    │ • Conventions │  │          │  │          │
    │ • Decisions   │  │          │  │          │
    │ • Agent ctx   │  │          │  │          │
    └───────┬───────┘  └──────────┘  └──────────┘
            │
            ▼
    ┌───────────────────────────────┐
    │         TIER 2                │
    │    Per-Turn Injection         │
    │    (500-1500 tokens/turn)     │
    │                               │
    │  UserPromptSubmit hook fires  │
    │  on EVERY user message        │
    │                               │
    │  1. Confidence gate (>= 0.6)  │
    │  2. Collection routing        │
    │  3. Adaptive budget           │
    │  4. Greedy fill + dedup       │
    └───────────────────────────────┘
```

### 1.1 Design Rationale

| Problem | Solution | Research |
|---------|----------|----------|
| Front-loading wastes 60-75% of tokens | Tier 2 per-turn injection delivers only what's needed | BP-076 §3 |
| Unconditional retrieval hurts accuracy | Confidence gating skips injection for irrelevant turns | BP-089 (TARG) |
| Fixed budgets under/over-allocate | Adaptive budgets based on quality/density/drift signals | BP-089 (TALE, ACL 2025) |
| Startup has no project context | Tier 1 bootstrap injects conventions + recent decisions | AD-6 |
| Re-injection wastes tokens | Session state tracks injected IDs for deduplication | BP-076 §5.2 |

---

## 2. Tier 1: Bootstrap Injection (SessionStart Hook)

### 2.1 Trigger Behavior

| Trigger | Injection Behavior |
|---------|-------------------|
| `startup` | **Bootstrap**: conventions + guidelines + recent decisions + agent context (2-3K tokens) |
| `resume` | Session summaries + related memories (4K tokens) — **unchanged** |
| `compact` | Same as resume, plus reset injection dedup state — **unchanged** |
| `clear` | No injection. Deletes session injection state file. |

### 2.2 Bootstrap Content (startup trigger)

Retrieved in priority order:

1. **Project conventions** — rules and guidelines from `conventions` collection (`type` in `["rule", "guideline"]`, `group_id=None` for shared)
2. **Recent decisions** — most recent architecture/pattern decisions from `discussions` collection (`type` in `["decision"]`, project-scoped)
3. **Active agent context** — when Parzival is enabled: last handoff, recent insights, and GitHub enrichment since last session. When disabled: generic agent handoff/memory (project-scoped)

**Implementation**: `retrieve_bootstrap_context()` in `src/memory/injection.py:222-344`

```python
def retrieve_bootstrap_context(
    search_client: MemorySearch,
    project_name: str,
    config: MemoryConfig,
) -> list[dict]:
    results = []

    # 1. Conventions (shared, no group_id filter)
    conventions = search_client.search(
        query="project conventions rules guidelines standards",
        collection=COLLECTION_CONVENTIONS,
        group_id=None, limit=5, fast_mode=True,
    )
    results.extend(conventions)

    # 2. Recent decisions (project-scoped)
    decisions = search_client.search(
        query="recent decisions architecture patterns",
        collection=COLLECTION_DISCUSSIONS,
        group_id=project_name, limit=3,
        memory_type=["decision"], fast_mode=True,
    )
    results.extend(decisions)

    # 3. Agent context (Parzival-aware or generic fallback)
    if config.parzival_enabled:
        # Last handoff + recent insights + GitHub enrichment
        ...
    else:
        # Generic: agent_handoff + agent_memory, limit=2
        ...

    results.sort(key=lambda r: r.get("score", 0), reverse=True)
    return results
```

### 2.3 Bootstrap Token Budget

**Config field**: `bootstrap_token_budget` (default 2500, range [500, 5000])

Budget enforcement uses greedy fill (`select_results_greedy()`) with `count_tokens()` from `truncation.py` (tiktoken, cl100k_base).

### 2.4 Session State Initialization

After Tier 1 bootstrap, `init_session_state()` creates a new `InjectionSessionState` with the injected point IDs. This enables Tier 2 deduplication — points already injected by Tier 1 are not re-injected.

---

## 3. Tier 2: Per-Turn Injection (UserPromptSubmit Hook)

### 3.1 Hook: `context_injection_tier2.py`

**Replaces**: `unified_keyword_trigger.py` (archived, not deleted). All keyword trigger functionality is preserved within `route_collections()`.

**Event**: UserPromptSubmit (synchronous retrieval hook, runs BEFORE Claude processes the turn)

### 3.2 Processing Flow

```
UserPromptSubmit event
    │
    ├─ 1. PARSE       Read hook input (session_id, prompt, cwd)
    ├─ 2. GATE        Confidence gating: embed prompt, check best score
    │     └── best_score < 0.6 → SKIP injection (exit)
    ├─ 3. ROUTE       Detect injection intent (collection routing)
    │     ├── Keyword triggers → targeted collection (backward compat)
    │     ├── File paths → code-patterns
    │     ├── HOW/WHAT/WHY → mapped collection
    │     └── UNKNOWN → cascade all collections
    ├─ 4. BUDGET      Compute adaptive budget [500, 1500]
    │     ├── quality_signal (50%): best retrieval score
    │     ├── density_signal (30%): results above threshold / total
    │     └── session_signal (20%): topic drift from previous query
    ├─ 5. SEARCH      Search routed collection(s) with decay scoring
    ├─ 6. DEDUP       Filter out already-injected point IDs
    ├─ 7. SELECT      Greedy fill by score until budget exhausted
    ├─ 8. FORMAT      Format results in <retrieved_context> tags
    ├─ 9. STATE       Update session state (IDs, embedding, drift)
    ├─ 10. AUDIT      Log to .audit/logs/injection-log.jsonl
    └─ 11. OUTPUT     Print hookSpecificOutput JSON to stdout
```

### 3.3 Confidence Gating

**Purpose**: Skip injection when no retrieved results are relevant. Prevents injecting noise on vague or conversational messages.

| Parameter | Value |
|-----------|-------|
| Config field | `injection_confidence_threshold` |
| Default | `0.6` |
| Expected skip rate | ~30-40% of turns |

**Evidence**: BP-089 (TARG research) shows unconditional retrieval hurts accuracy: 48.6% vs 57.6% with gating.

**Implementation**: After searching all routed collections, the best score across all results is compared to the threshold. If below threshold, injection is skipped entirely, an audit log entry with `skipped_confidence=true` is written, and session state is saved without modification.

### 3.4 Collection Routing

**Implementation**: `route_collections()` in `injection.py:347-406`

Priority order:

1. **Keyword triggers** (backward-compatible with `unified_keyword_trigger.py`):
   - `detect_decision_keywords()` → `discussions`
   - `detect_session_history_keywords()` → `discussions`
   - `detect_best_practices_keywords()` → `conventions`
   - If any keyword matches, deduplicate by collection and return

2. **File path detection** → `code-patterns`:
   - Regex: file extensions (`.py`, `.ts`, `.js`, `.go`, etc.) or path patterns (`/src/`, `/tests/`, `/docker/`)

3. **Intent detection** (via existing `intent.py`):
   - HOW/WHAT/WHY → mapped collection via `get_target_collection()`

4. **Unknown** → cascade all collections:
   - `discussions` → `code-patterns` → `conventions`

**Conventions routing**: When `conventions` is targeted, `group_id=None` (shared, no project filter). For `code-patterns` and `discussions`, `group_id` is the project name.

### 3.5 Adaptive Token Budget

**Implementation**: `compute_adaptive_budget()` in `injection.py:409-467`

Three weighted signals determine budget within [floor, ceiling]:

```
budget = floor + (ceiling - floor) × combined_signal

combined = quality_weight × quality_signal
         + density_weight × density_signal
         + drift_weight   × drift_signal
```

| Signal | Weight | Range | Description |
|--------|--------|-------|-------------|
| `quality_signal` | 0.5 (50%) | [0.0, 1.0] | Best retrieval score. Higher = more budget. |
| `density_signal` | 0.3 (30%) | [0.0, 1.0] | Proportion of results above confidence threshold. |
| `drift_signal` | 0.2 (20%) | [0.0, 1.0] | Topic drift from previous query. High drift = new topic = more context. |

| Parameter | Config Field | Default |
|-----------|-------------|---------|
| Budget floor | `injection_budget_floor` | 500 tokens |
| Budget ceiling | `injection_budget_ceiling` | 1500 tokens |
| Quality weight | `injection_quality_weight` | 0.5 |
| Density weight | `injection_density_weight` | 0.3 |
| Drift weight | `injection_drift_weight` | 0.2 |

**Validation**: Floor must be <= ceiling. Weights must sum to 1.0 (±0.01). Both enforced by `validate_injection_config()` model validator in `config.py`.

### 3.6 Topic Drift Computation

**Implementation**: `compute_topic_drift()` in `injection.py:470-505`

```python
def compute_topic_drift(current_embedding, previous_embedding) -> float:
    if previous_embedding is None:
        return 0.5  # Neutral — first turn
    similarity = dot(current, previous) / (norm(current) * norm(previous))
    return max(0.0, min(1.0, 1.0 - similarity))  # Drift = 1 - cosine_similarity
```

- `0.0` = same topic (no drift)
- `0.5` = neutral (first turn or moderate change)
- `1.0` = completely different topic

**Performance**: numpy dot product on 768-dim vectors is <0.01ms.

### 3.7 Greedy Fill Selection

**Implementation**: `select_results_greedy()` in `injection.py:508-553`

Rules (per AD-6):
- No truncation of individual results
- Each chunk is fully included or fully excluded
- Skip-and-continue for oversized results (try next smaller result)
- Deduplication via `excluded_ids` (already-injected point IDs from session state)
- Token counting via `count_tokens()` (tiktoken, cl100k_base)

---

## 4. Session State Management

### 4.1 State File

**Location**: `/tmp/ai-memory-{session_id}-injection-state.json`
**Max size**: ~50KB (768 floats + a few hundred UUIDs)
**Cleanup**: Auto-cleaned by OS (temp directory)

### 4.2 State Schema

```python
@dataclass
class InjectionSessionState:
    session_id: str
    injected_point_ids: list[str] = []     # Dedup tracking
    last_query_embedding: list[float] = None  # For topic drift
    topic_drift: float = 0.5               # Last computed drift
    turn_count: int = 0                    # UserPromptSubmit turns
    total_tokens_injected: int = 0         # Cumulative
```

**Implementation**: `InjectionSessionState` in `injection.py:87-158`. Uses atomic write (write to `.tmp`, then `os.replace()`) to prevent corruption from concurrent writes. Session ID is sanitized (alphanumeric + dash/underscore only, max 64 chars).

### 4.3 State Lifecycle

| Event | Action |
|-------|--------|
| SessionStart (`startup`) | Create new state, populate `injected_point_ids` from Tier 1 |
| SessionStart (`resume`) | Load existing state if exists, else create new |
| SessionStart (`compact`) | Load state, call `reset_after_compact()` — clears injected IDs but preserves embedding + drift |
| SessionStart (`clear`) | Delete state file |
| UserPromptSubmit (Tier 2) | Load state, filter dedup, update IDs + embedding + drift, save |

### 4.4 Deduplication Reset

`reset_after_compact()` clears `injected_point_ids` but keeps `last_query_embedding` and `topic_drift`. After compaction, the context window is cleared so previous injections need to be re-eligible, but the conversation topic continues.

---

## 5. Output Format

Both tiers use the same `<retrieved_context>` tag format (consistent with existing session_start.py output):

```xml
<retrieved_context>
**[decision|discussions|85%]** Architecture decision: Use dual embedding models...

**[guideline|conventions|92%]** All code changes require unit tests...

</retrieved_context>
```

**Attribution header**: `**[{type}|{collection}|{score_pct}%]**` — compact, machine-parseable, shows content provenance.

**Implementation**: `format_injection_output()` in `injection.py:556-588`. Returns empty string if no results selected.

**Hook output**: Both tiers output JSON with `hookSpecificOutput`:
```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<retrieved_context>...</retrieved_context>"
  }
}
```

---

## 6. Core Module: `src/memory/injection.py`

**File**: `src/memory/injection.py` (~670 lines)

### 6.1 Public API

| Function | Purpose |
|----------|---------|
| `retrieve_bootstrap_context()` | Tier 1: retrieve conventions + decisions + agent context |
| `route_collections()` | Tier 2: route prompt to target collections |
| `compute_adaptive_budget()` | Tier 2: compute token budget from signals |
| `compute_topic_drift()` | Tier 2: cosine distance between query embeddings |
| `select_results_greedy()` | Both: greedy fill with dedup and budget enforcement |
| `format_injection_output()` | Both: format results in `<retrieved_context>` tags |
| `log_injection_event()` | Both: audit log to `.audit/logs/injection-log.jsonl` |
| `init_session_state()` | Tier 1: initialize session state after bootstrap |
| `InjectionSessionState` | Cross-turn state dataclass (load/save/reset) |
| `RouteTarget` | NamedTuple for collection + shared flag |

### 6.2 Dependencies

| Import | Purpose |
|--------|---------|
| `memory.chunking.truncation.count_tokens` | Accurate token counting (tiktoken) |
| `memory.config` | Collection names, MemoryConfig |
| `memory.intent` | IntentType, detect_intent, get_target_collection |
| `memory.triggers` | Keyword detection functions (backward compat) |
| `memory.search.MemorySearch` | Vector search |
| `memory.embeddings.EmbeddingError` | Error handling |
| `memory.qdrant_client.QdrantUnavailable` | Error handling |
| `numpy` | Topic drift computation (cosine similarity) |

---

## 7. Configuration Parameters

### 7.1 Config Fields in `src/memory/config.py`

| Field | Type | Default | Range | Override Level | Description |
|-------|------|---------|-------|------|-------------|
| `injection_enabled` | `bool` | `True` | — | 2 | Global kill switch |
| `bootstrap_token_budget` | `int` | `2500` | [500, 5000] | 2 | Tier 1 bootstrap budget |
| `injection_confidence_threshold` | `float` | `0.6` | [0.0, 1.0] | 2 | Confidence gate for Tier 2 |
| `injection_budget_floor` | `int` | `500` | [100, 2000] | 2 | Tier 2 minimum budget |
| `injection_budget_ceiling` | `int` | `1500` | [500, 5000] | 2 | Tier 2 maximum budget |
| `injection_quality_weight` | `float` | `0.5` | [0.0, 1.0] | 3 | Quality signal weight |
| `injection_density_weight` | `float` | `0.3` | [0.0, 1.0] | 3 | Density signal weight |
| `injection_drift_weight` | `float` | `0.2` | [0.0, 1.0] | 3 | Drift signal weight |

**Override Level 2**: User-overridable via environment variables.
**Override Level 3**: Hidden/advanced, not in `.env.example` uncommented.

### 7.2 Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `INJECTION_ENABLED` | `true` | Global kill switch |
| `BOOTSTRAP_TOKEN_BUDGET` | `2500` | Tier 1 budget |
| `INJECTION_CONFIDENCE_THRESHOLD` | `0.6` | Confidence gate |
| `INJECTION_BUDGET_FLOOR` | `500` | Tier 2 floor |
| `INJECTION_BUDGET_CEILING` | `1500` | Tier 2 ceiling |
| `INJECTION_QUALITY_WEIGHT` | `0.5` | Quality signal weight |
| `INJECTION_DENSITY_WEIGHT` | `0.3` | Density signal weight |
| `INJECTION_DRIFT_WEIGHT` | `0.2` | Drift signal weight |

### 7.3 Validation Rules

- `injection_budget_floor <= injection_budget_ceiling`
- `quality_weight + density_weight + drift_weight == 1.0` (±0.01)

Both enforced by `validate_injection_config()` model validator in `config.py:687-704`.

---

## 8. Audit Logging

**File**: `.audit/logs/injection-log.jsonl`
**Implementation**: `log_injection_event()` in `injection.py:591-651`

```json
{
  "timestamp": "2026-02-22T10:30:00Z",
  "tier": 2,
  "trigger": "UserPromptSubmit",
  "project": "my-project",
  "session_id": "abc123",
  "results_considered": 12,
  "results_selected": 3,
  "tokens_used": 850,
  "budget": 1200,
  "utilization_pct": 70,
  "best_score": 0.8542,
  "skipped_confidence": false,
  "topic_drift": 0.3210,
  "collections_searched": ["discussions", "code-patterns"]
}
```

**Best-effort**: Audit logging never blocks. OSError/PermissionError silently ignored.

---

## 9. Performance

### 9.1 Latency Budget

Tier 2 total latency target: **<500ms** (NFR-P1, NFR-P5)

| Step | Budget | Notes |
|------|--------|-------|
| Embed prompt | ~50ms | Single 768-dim embedding |
| Search (per collection) | ~100ms | `fast_mode=True` (hnsw_ef=64) |
| Format + select | ~50ms | In-memory operations |
| Buffer | ~300ms | Network variance, state I/O |
| **Total** | **<500ms** | |

### 9.2 Graceful Degradation

The Tier 2 hook ALWAYS exits 0 and outputs valid JSON. Failures produce empty `additionalContext`:

- Qdrant unavailable → empty injection, warning logged
- Embedding service down → empty injection, warning logged
- Session state corrupted → fresh state created
- Audit log write fails → silently ignored
- Any uncaught exception → caught at top level, empty injection returned

---

## 10. Prometheus Metrics

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `injection_events_total` | Counter | `tier`, `project`, `trigger`, `outcome` | Injection events (injected/skipped_confidence/skipped_no_results/skipped_dedup) |
| `injection_tokens_total` | Counter | `tier`, `project` | Total tokens injected |
| `injection_budget_computed` | Histogram | `tier` | Computed adaptive budgets |
| `injection_confidence_score` | Histogram | `tier`, `outcome` | Best retrieval scores |
| `injection_duration_seconds` | Histogram | `tier`, `project` | End-to-end injection latency |
| `injection_results_selected` | Histogram | `tier` | Results selected per injection |
| `injection_topic_drift` | Histogram | — | Topic drift values between turns |

Push to Pushgateway via existing `push_hook_metrics_async()` pattern.

---

## 11. Migration from V2.1 (Core Architecture V2)

### 11.1 What Changed

| Aspect | Core Arch V2 (Section 7.2) | Context Injection V2 (this doc) |
|--------|---------------------------|--------------------------------|
| Startup behavior | "Fresh session, no prior context" | Bootstrap injection: conventions + decisions + agent context |
| Injection trigger | resume/compact only | startup + resume/compact + per-turn |
| Per-turn injection | Not specified | Tier 2: confidence-gated, adaptive budget |
| Token budget | Fixed `token_budget: 4000` | Adaptive [500, 1500] per turn + 2500 bootstrap |
| Collection routing | Single collection per search | Multi-collection routing with priority cascade |
| Deduplication | Not specified | Session-state tracking across tiers and turns |
| Keyword triggers | `unified_keyword_trigger.py` | Superseded by `context_injection_tier2.py` (keywords preserved as sub-path) |

### 11.2 Hook Registration Change

`unified_keyword_trigger.py` is replaced by `context_injection_tier2.py` in the UserPromptSubmit hooks list. The old hook is archived at `.claude/hooks/scripts/archived/unified_keyword_trigger.py`.

---

## Document References

| Document | Relationship |
|----------|-------------|
| [Core-Architecture-Principle-V2.md](./Core-Architecture-Principle-V2.md) | Parent architecture (Sections 7.2 and 8 superseded by this doc) |
| [Chunking-Strategy-V2.md](./Chunking-Strategy-V2.md) | Chunking spec (injection uses chunked results) |
| [Security-Pipeline-V1.md](./Security-Pipeline-V1.md) | Scanning runs before storage; injection reads from stored results |
| [Embedding-Architecture-V1.md](./Embedding-Architecture-V1.md) | Embedding model used for query embedding and topic drift |
| SPEC-012 | Implementation specification |
| BP-076 | Progressive staged context injection research |
| BP-089 | Adaptive token budgets research |

---

**Version History**:
- V2.0 (2026-02-22): Initial Source of Truth document for progressive context injection. Supersedes Core Architecture V2 Section 7.2 simple injection model. Describes two-tier architecture (Tier 1 bootstrap + Tier 2 per-turn), confidence gating, adaptive token budgets, collection routing, greedy fill, session state deduplication, and topic drift. Verified against `src/memory/injection.py` and `src/memory/config.py` source code.
