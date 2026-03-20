# AI Memory Behavior Specification V1.0

**Status**: AUTHORITATIVE — Single source of truth for all AI Memory behavior
**Version**: 1.0 (v2.2.2 target)
**Created**: 2026-03-10 (PLAN-015, STEP-06)
**Supersedes**: Context-Injection-V2.md (injection behavior), GitHub-Integration-V1.md (collection routing), portions of Core-Architecture-Principle-V2.md (injection/retrieval sections)

---

## 1. System Overview

### 1.1 Purpose
AI Memory provides persistent semantic memory for Claude Code sessions. It captures conversation, code patterns, and project knowledge into a vector database, then retrieves relevant context on each interaction to improve agent effectiveness.

### 1.2 Foundational Principles
1. **Zero-Truncation**: Content is CHUNKED into multiple vectors, NEVER truncated for storage.
2. **Clean Sessions**: Sessions start with NO ambient injection. Context is earned by relevance.
3. **Agent-Activated Bootstrap**: Cross-session memory is triggered by agent skills, not hooks.
4. **Graceful Degradation**: All hooks exit 0 on failure. Never block Claude.
5. **Observable Pipeline**: Every operation produces Langfuse traces when enabled.
6. **Freshness-Verified Injection**: Content injected to agents MUST be current and correct. The GitHub collection serves as the source of truth — what is merged is tested and considered correct. Stale patterns MUST NOT be injected.

### 1.3 Architecture Summary
- **Vector DB**: Qdrant (5 collections, 768-dim Jina v2 embeddings)
- **Hooks**: Claude Code hook scripts (Python) on 6 event types
- **Search**: Triple Fusion Hybrid (dense + BM25 sparse + optional ColBERT via RRF)
- **Observability**: Langfuse V3 SDK (trace buffer Path A for hooks, Path B for services)

---

## 2. Collections & Data Model

### 2.1 Collections

| Collection | Semantic Role | Embedding Model | Content Types |
|-----------|--------------|-----------------|---------------|
| `code-patterns` | HOW things are built | jina-v2-base-code | implementation, error_pattern, refactor, file_pattern |
| `conventions` | WHAT rules to follow | jina-v2-base-en | rule, guideline, naming, structure, port |
| `discussions` | WHY things were decided | jina-v2-base-en | decision, session, user_message, agent_response, agent_insight, agent_handoff, agent_memory, blocker, preference, context |
| `github` | **Source of truth** — merged code is tested and correct | jina-v2-base-code | github_pr, github_issue, github_commit, github_code_blob, github_ci_result, github_review, github_release, github_diff |
| `jira-data` | External work items (user/Parzival search only) | jina-v2-base-en | jira_issue, jira_comment |

#### Collection Roles in Detail

**`github` — Source of Truth & Freshness Verification**:
The GitHub collection represents the ground truth for project code. What is merged is tested and considered correct. Its primary roles are:
1. **Freshness validation**: Cross-reference code-patterns against current GitHub state to detect stale patterns
2. **Injection verification**: Before injecting a code pattern, verify it still reflects the current codebase
3. **User search**: Searchable via `/aim-github-search` skill for PRs, issues, commits, code
4. **Parzival enrichment**: L4 bootstrap layer provides recent GitHub activity context

**`jira-data` — User Interaction Only (Current Scope)**:
Jira data is used for manual search by users and Parzival when needed. It does NOT participate in automatic injection. Future versions may expand this scope.

### 2.2 Universal Payload Fields

Every point in every collection MUST have:

```
group_id: str              # Project tenant (is_tenant=True index)
type: str                  # Content type (from types above)
content: str               # Full text content
content_hash: str          # SHA-256 hash for dedup
session_id: str            # Claude session ID
timestamp: str             # ISO 8601 creation time
created_at: str            # ISO 8601 (alias for queries)
stored_at: str             # ISO 8601 (for decay scoring)
agent_id: str              # Agent identity (default: "default")
decay_score: float         # Initial: 1.0
freshness_status: str      # "fresh" | "aging" | "stale" | "expired" | "unverified"
source_authority: float    # 0.0-1.0 (user_message: 0.4, agent: 0.6, convention: 0.8)
is_current: bool           # True until superseded
access_count: int          # Incremented on retrieval (default: 0)
```

### 2.3 Agent Identity

Agents are identified via the `agent_id` payload field with `is_tenant=True` index on the `discussions` collection. Every agent with a persistent `agent_id` has cross-session memory.

#### 2.3.1 Agent Types

| Agent Type | agent_id | Persistence | Memory Scope |
|-----------|----------|-------------|--------------|
| Parzival | `"parzival"` | Cross-session | L1-L4 layered bootstrap ("aha moment") |
| Single-instance (PM, Architect) | `"pm"`, `"architect"` | Cross-session | Agent-scoped compact restore |
| Parallel dev (domain-named) | `"dev-{name}"` | Cross-session | Agent-scoped compact restore |
| Parallel dev (numbered) | `"dev-{N}"` | Cross-session | Agent-scoped compact restore |
| Parallel review (domain-named) | `"review-{name}"` | Cross-session | Agent-scoped compact restore |
| Parallel review (numbered) | `"review-{N}"` | Cross-session | Agent-scoped compact restore |
| Quick dev (parallel) | `"quickdev-{name}"` | Cross-session | Agent-scoped compact restore |
| Story dev (parallel) | `"story-dev-{name}"` | Cross-session | Agent-scoped compact restore |
| Default (no agent) | `"default"` | Session-only | Tier 2 per-turn only, no cross-session |

#### 2.3.2 Naming Conventions

Two naming strategies, mixable within a team:

**Domain-named** (recommended for specialized agents):
- `dev-auth`, `dev-api`, `dev-frontend`, `review-auth`, `review-api`
- Same agent always works on same domain/files
- Cross-session memory accumulates domain-specific expertise
- Best for teams with consistent file/area assignments

**Numbered** (for generic parallel work):
- `dev-1`, `dev-2`, `dev-3`, `review-1`, `review-2`
- Agents are interchangeable
- Cross-session memory is per-instance but not domain-scoped
- Best for sprint-style parallel task execution

**Examples**:
```
Team dispatch creates:
  dev-auth   (AI_MEMORY_AGENT_ID=dev-auth)   → always works on auth
  dev-api    (AI_MEMORY_AGENT_ID=dev-api)    → always works on API
  review-1   (AI_MEMORY_AGENT_ID=review-1)   → generic reviewer
  review-2   (AI_MEMORY_AGENT_ID=review-2)   → generic reviewer

Session 2: dev-auth activates → compact restore filters agent_id="dev-auth"
  → Gets its OWN past summaries, decisions, patterns
  → Remembers auth-specific context from previous sessions
```

#### 2.3.3 Identity Detection

Framework-agnostic via environment variables (priority order):
1. `PARZIVAL_AGENT_ID` (if Parzival)
2. `AI_MEMORY_AGENT_ID` (if set by team dispatch or any framework)
3. `BMAD_AGENT_NAME` (if BMAD installed, single-instance agents)
4. Fallback: `"default"` (no cross-session memory)

**Team dispatch responsibility**: When creating agent teams (via `/pov:parzival-team`), the dispatch sets `AI_MEMORY_AGENT_ID` per agent instance. The memory system does not assign names — it uses whatever `agent_id` is provided.

#### 2.3.4 Cross-Session Memory by Agent Type

All agents with a persistent `agent_id` (anything other than `"default"`) get cross-session memory via **agent-scoped compact restore**:

| Agent | Bootstrap Mechanism | What They Get |
|-------|-------------------|---------------|
| Parzival | Full L1-L4 bootstrap skill (§4.4) | Handoff + decisions + insights + GitHub activity |
| All named agents | Agent-scoped compact restore (§4.1) | Last 2 summaries + 3 decisions filtered by own `agent_id` |
| Default | Unfiltered compact restore (§4.1) | Last 2 summaries + 3 decisions (no agent_id filter — may include other sessions) |

**Infrastructure**: The `discussions` collection already has `agent_id` with `is_tenant=True` index. All hooks already write `agent_id` to payload. Cross-session memory requires only adding the `agent_id` filter to compact restore queries — no schema changes needed.

---

## 3. Capture Pipeline

### 3.1 Pipeline Steps

Every capture follows this 9-step pipeline:

```
1_CAPTURE → 2_LOG → 3_DETECT → 4_SCAN → 5_CHUNK → 6_EMBED → 7_STORE → 8_ENQUEUE → 9_CLASSIFY
```

### 3.2 Capture Hooks

#### C1: User Message Capture
- **Hook**: `user_prompt_capture.py` → `user_prompt_store_async.py`
- **Event**: `UserPromptSubmit`
- **Collection**: `discussions`
- **Type**: `user_message`
- **Quality Gate**: Skip if <4 words or in: `{"ok", "yes", "no", "done", "sure", "thanks", "got it", "nothing to add", "looks good", "lgtm"}`
- **Chunking**: ProseChunker (512 tokens, 15% overlap) if >2000 tokens. Whole if ≤2000.
- **Dedup**: UUID5(session_id:content_hash) deterministic + scroll filter
- **Performance**: Fork to background, <50ms hook return
- **Max content**: 100,000 chars (~25,000 tokens) — safety guard per BP-068 verification gate. Prevents pathological payloads (entire codebases pasted). Tunable via Langfuse observation.

#### C2: Agent Response Capture
- **Hook**: `agent_response_capture.py` → `agent_response_store_async.py`
- **Event**: `Stop`
- **Collection**: `discussions`
- **Type**: `agent_response`
- **Chunking**: ProseChunker (512 tokens, 15% overlap) if >3000 tokens. Whole if ≤3000.
- **Performance**: Fork to background, <500ms hook return
- **Max content**: 100,000 chars (~25,000 tokens) — same safety guard as C1. Content beyond this is pathological and would produce poor-quality embeddings.

#### C3: Code Pattern Capture
- **Hook**: `post_tool_capture.py` → `store_async.py`
- **Event**: `PostToolUse` (Edit, Write, NotebookEdit)
- **Collection**: `code-patterns`
- **Type**: `implementation`
- **Chunking**: IntelligentChunker (512 tokens, **20% overlap for code**)
- **Filter**: Skip markdown, txt, json, generated dirs, insignificant changes
- **Performance**: Fork to background, <500ms hook return

#### C4: Error Pattern Capture
- **Hook**: `error_pattern_capture.py` → `error_store_async.py`
- **Event**: `PostToolUse` (Bash)
- **Collection**: `code-patterns`
- **Type**: `error_pattern`
- **Detection**: Structural patterns first (Traceback, Error/Exception/Fatal), then exit code. Directory listings and conversational text filtered.
- **Chunking**: Structured truncation (800 tokens max, preserves command + error structure)
- **New fields** (v2.2.2): `subtype` ("error"), `error_group_id` (hash of command_prefix + exception_type + session_id), `resolution_status` ("unresolved")

#### C4b: Error Fix Capture (NEW in v2.2.2)

Closed-loop error correction: when an agent fixes an error, the fix is captured and linked to the original error. Future agents hitting similar errors receive the paired fix as injected context.

- **Collection**: `code-patterns`
- **Type**: `error_pattern`
- **Subtype**: `"fix"`
- **error_group_id**: Same as the original error (linked pair)
- **resolution_status**: `"resolved"`

**Fix Detection Triggers** (any of these within the same session):
- Successful `Edit` to the same file that had the error (code fix)
- Successful `Bash` command that resolves the issue (config/env fix)
- Successful `Write` creating a missing file referenced in the error

**Resolution Confidence Scoring**:

| Condition | Confidence | Rationale |
|-----------|-----------|-----------|
| Same file + within 3 turns of error | **0.9** | Strong causal link |
| Same file + within 10 turns | **0.7** | Likely related |
| Different file + within 3 turns | **0.5** | Possible indirect fix |
| Different file + 4-10 turns | **0.4** | Interpolation between 3-turn and >10-turn thresholds |
| Beyond 10 turns | **0.3** | Weak correlation |

**Non-file errors**: The `error_group_id` uses `command_prefix + exception_type`, not file path. This covers build failures (`pip install → ModuleNotFoundError`), Docker errors, dependency issues, and environment setup — not just file edits.

**Session state tracking**: Active errors tracked in `InjectionSessionState` or separate error state. Each error records: `error_group_id`, `file_path` (if applicable), `turn_number`, `exception_type`.

**Freshness integration**: Error-fix pairs in code-patterns are subject to freshness verification (§4.5). If the file has changed significantly (STALE), the fix may no longer apply and is blocked from injection.

**Verification**: Use Langfuse + code review to verify fix injection effectiveness over time. Metric: "error resolved without retry after fix injection" vs "error persisted despite fix injection." Tune resolution_confidence thresholds based on observed data.

#### C5: Pre-Compact Session Save
- **Hook**: `pre_compact_save.py`
- **Event**: `PreCompact` (manual or auto)
- **Collection**: `discussions`
- **Type**: `session`
- **Content**: Rich summary: first prompt, last 3-5 prompts, last 2 responses, tools used, files modified
- **Chunking** (v2.2.2, per BP-028):
  - Summaries ≤8192 tokens: **Chunked embedding** via independent chunk embedding (one embedding per chunk offset)
  - Summaries >8192 tokens: ProseChunker fallback (512 tokens, 15% overlap)
  - Note: True late chunking (single transformer pass with per-chunk mean pooling) deferred to v2.3.0. See TD-274.
- **Importance**: `"high"` if auto-compact, `"normal"` if manual
- **Performance**: BLOCKING, <10s timeout

#### C6: GitHub Sync
- **Service**: `github-sync` container
- **Collection**: `github`
- **Types**: 9 content types (pr, issue, commit, code_blob, ci_result, review, release, diff, discussion)
- **Freshness**: `is_current=True` until superseded by newer sync

#### C7: Jira Sync
- **Service**: Manual/scheduled via skill
- **Collection**: `jira-data`
- **Types**: jira_issue, jira_comment

### 3.3 Security Scanning (All Captures)

3-layer scanning applied to every capture:
1. **Layer 1 (Regex)**: Email, phone, IP, SSN, URLs. Always enabled. ~1ms.
2. **Layer 2 (detect-secrets)**: High-entropy secrets. Enabled in `strict` mode. ~10ms.
3. **Layer 3 (SpaCy NER)**: Named entities. Enabled if `security_scanning_ner_enabled=True`. ~50-100ms.

Actions: `PASSED` → store. `MASKED` → store masked. `BLOCKED` → skip.

### 3.4 Hybrid Vectors

When `hybrid_search_enabled=True`, all captures generate:
- Dense vector (768-dim, Jina v2)
- BM25 sparse vector (for keyword matching)

---

## 4. Retrieval & Injection

### 4.1 Session Lifecycle (session_start.py)

| Trigger | Action | Injection |
|---------|--------|-----------|
| `resume` | No-op | **NOTHING** (DEC-054). Sessions start clean. |
| `clear` | Delete session state | **NOTHING** |
| `compact` (named agent) | Restore context | Up to **2 session summaries + 3 decisions** filtered by `agent_id` (v2.2.2) |
| `compact` (default/unnamed) | Restore context | Up to **2 session summaries + 3 decisions** unfiltered (v2.2.2) |
| `compact` (Parzival) | Restore rich context | 3 session summaries + 5 decisions (agent_id=parzival) → constraint re-injection |

#### Named Agent Compact Rules (dev-auth, pm, architect, etc.)

Named agents (any `agent_id` other than `"default"`) get **agent-scoped** compact restore:
- `get_recent(type="session", agent_id=this_agent, limit=2)` → only their OWN summaries
- `get_recent(type="decision", agent_id=this_agent, limit=3)` → only their OWN decisions
- Cross-session contamination eliminated — `dev-auth` never gets `dev-api` summaries

| Compact # in Session | Summaries Injected | Rationale |
|---------------------|-------------------|-----------|
| 1st compact | **1 summary** | Only the summary just created by `pre_compact_save` exists for this agent |
| 2nd+ compact | **Max 2 summaries** | Cap prevents noise from very old sessions |

#### Default Agent Compact Rules (no agent_id)

Default agents (`agent_id="default"`) cannot be distinguished from each other:
- `get_recent(type="session", limit=2)` → unfiltered, may include other sessions' summaries
- `get_recent(type="decision", limit=3)` → unfiltered, but decisions are project-scoped so cross-session is acceptable
- Max 2 summaries limits contamination risk

**Recommendation**: Assign named `agent_id` via `AI_MEMORY_AGENT_ID` whenever possible. Default agents get degraded cross-session memory.

#### Parzival Compact Flow

1. `pre_compact_save` creates session summary (BLOCKING)
2. Compact fires
3. `session_start(compact)` restores: 3 session summaries + 5 decisions (filtered by `agent_id="parzival"`)
4. **Constraint re-injection**: `/aim-parzival-constraints` fires immediately post-compact. This is **vital** — without constraints, Parzival loses behavioral guardrails in the compacted context.

**Constraint timing**: Constraints MUST load after compact, before any user interaction. The `session_start.py` hook triggers constraint re-injection as the final step of compact restore for Parzival.

#### Compact Restore Parameters

- Total budget: `token_budget` (default: 4000)
- Phase 1 (summaries): 60% of budget
- Phase 2 (decisions): 40% of budget
- Per-summary truncation: 2000 chars max (display-level, not storage — zero-truncation applies to storage only)
- Per-memory truncation: 500 chars max (display-level)
- Retrieval method: `get_recent()` (deterministic, most recent first — no decay applied)
- Output wrapper: `<retrieved_context>...</retrieved_context>`

#### Session State on Compact

`InjectionSessionState.reset_after_compact()`:

| State Field | Action | Rationale |
|-------------|--------|-----------|
| `injected_point_ids` | **CLEAR** | New context — previously injected content may be relevant again |
| `last_query_embedding` | **PRESERVE** | Topic continuity — user continues same work |
| `topic_drift` | **PRESERVE** | Prevents topic whiplash in adaptive budget |
| `turn_count` | **KEEP incrementing** | Reflects total session activity for observability |
| `total_tokens_injected` | **KEEP incrementing** | Running total for session-level monitoring |
| `error_state` (v2.2.2) | **PRESERVE** | Agent likely still working on same problem. Active errors must survive compact for fix detection linkage (§C4b). |

### 4.2 Per-Turn Injection (context_injection_tier2.py)

**Trigger**: `UserPromptSubmit` — every user message except slash commands.

#### 4.2.1 Collection Routing

Priority order via `route_collections()`:
1. **Keyword triggers** → specific collection (decision→discussions, best-practices→conventions, session-history→discussions)
2. **File path detected** → code-patterns (with github freshness verification)
3. **Intent detection** → HOW→code-patterns, WHAT→conventions, WHY→discussions
4. **Unknown** → cascade core 3 collections (code-patterns, conventions, discussions)

**NOT in Tier 2 routing** (by design):
- `github` — used for freshness verification of code-patterns, Parzival L4 enrichment, and user search. NOT a direct injection source.
- `jira-data` — user/Parzival manual search only. No automatic injection.

#### 4.2.2 Type Filtering (PLAN-010)

| Collection | Include | Exclude |
|-----------|---------|---------|
| discussions | decision, guideline, session, agent_insight, agent_handoff, agent_memory | user_message, error_pattern |
| code-patterns | implementation, refactor, file_pattern | error_pattern (includes subtype="error" and subtype="fix" — both excluded from Tier 2, served by R2 instead) |
| conventions | all types | none |

**Collections NOT in Tier 2** (see §2.1 for roles):
- `github` — freshness verification layer, not injection source
- `jira-data` — user search only

#### 4.2.3 Confidence Gating (4-tier)

| Condition | Action | Budget |
|-----------|--------|--------|
| `best_score < 0.45` | **HARD SKIP** — never inject | 0 |
| `best_score < collection_threshold - 0.05` | **SOFT SKIP** — no injection | 0 |
| `best_score < collection_threshold` | **SOFT GATE** — reduced budget | `max(50, budget // 2)` |
| `best_score >= collection_threshold` | **FULL** — full adaptive budget | Computed budget |

**Per-Collection Confidence Thresholds** (v2.2.2):

| Collection | Threshold | Rationale |
|-----------|-----------|-----------|
| conventions | 0.65 | High precision required |
| discussions | 0.60 | Medium variability |
| code-patterns | 0.55 | Lower due to code similarity noise |

#### 4.2.4 Adaptive Budget

Formula: `budget = floor + int((ceiling - floor) * combined_signal)`

| Signal | Weight | Source |
|--------|--------|--------|
| Quality (best_score) | 0.5 | Clamped [0.0, 1.0] |
| Density (proportion >= threshold) | 0.3 | Results above collection threshold |
| Topic drift | 0.2 | Cosine distance from previous query |

- Floor: 500 tokens
- Ceiling: 1500 tokens
- First-turn drift: 0.5 (neutral — correct behavior)

#### 4.2.5 Greedy Selection

`select_results_greedy(results, budget, excluded_ids, score_gap_threshold)`:
1. **Apply freshness penalty** (code-patterns only): multiply score by freshness penalty factor (see §4.5.3). STALE/EXPIRED → score 0.0.
2. Sort by score descending
3. Skip if score = 0.0 (freshness-blocked)
4. Skip if point ID in `injected_point_ids` (session dedup)
5. Skip if content-hash matches prior (SHA256[:16])
6. Skip if `score < best_score * 0.7` (score gap filter, 30% tolerance)
7. Add result if fits in remaining budget (no truncation)
8. Stop when budget exhausted

Deterministic results (score=1.0) excluded from gap calculation.

#### 4.2.6 Search Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| max_retrievals | **10** (v2.2.2, was 5) | Broader recall; greedy fill limits injection |
| fast_mode | True (hnsw_ef=64) | Speed for per-turn hook |
| hybrid_search | If enabled | Dense + BM25 via RRF |

#### 4.2.7 Session State

Persisted to `/tmp/ai-memory-{safe_id}-injection-state.json`:
- `turn_count`: Incremented each turn
- `injected_point_ids`: Dedup across turns
- `last_query_embedding`: For topic drift computation
- `topic_drift`: Current drift value
- `total_tokens_injected`: Running total
- Reset on compact: clear IDs, keep embeddings/drift

#### 4.2.8 Output Format

```
<retrieved_context>
**[type|collection|score%]** content
**[type|collection|score%]** content
...
</retrieved_context>
```

### 4.3 Tool-Event Injection

#### R2: Error Detection & Fix Injection
- **Event**: `PostToolUse` (Bash), exit code != 0 or error patterns
- **Collection**: `code-patterns`
- **Types**: `["error_pattern"]` (covers both errors and fixes — distinguished by `subtype`)
- **Limit**: 3 errors per phase (Phase 1 returns up to 3 errors; Phase 2 follows up to 1 linked fix per error = 6 results max)
- **Threshold**: 0.5 (lower than Tier 2 — wide net for errors)
- **Output**: Stdout display with `🔧 SIMILAR ERROR FIXES FOUND` header

**Two-Phase Fix Retrieval** (v2.2.2):
1. **Phase 1 (semantic match)**: Search code-patterns for similar errors (`subtype="error"`, limit=3)
2. **Phase 2 (link follow)**: For each matched error, follow `error_group_id` to retrieve the paired fix (`subtype="fix"`, limit=1 per error, highest `resolution_confidence`)
3. **Inject both**: Display error context (what happened) AND fix context (what solved it)
4. **Priority**: Fixes with `resolution_confidence >= 0.7` shown first
5. **Freshness check**: Skip fix if its `freshness_status` is STALE or EXPIRED (§4.5.3)

#### R3: New File Conventions
- **Event**: `PreToolUse` (Write), file doesn't exist
- **Collection**: `conventions`
- **Types**: `["naming", "structure"]`
- **Limit**: 2
- **Threshold**: 0.7 (similarity_threshold)
- **Output**: Stdout display with `📝 FILE CREATION CONVENTIONS` header. 400 chars max per result.

#### R4: First Edit Patterns
- **Event**: `PreToolUse` (Edit), first edit to file in session
- **Collection**: `code-patterns`
- **Type**: `file_pattern`
- **Limit**: 3
- **Threshold**: 0.7
- **Output**: Stdout display with `✏️ FILE PATTERNS` header. 400 chars max per result.

#### R-BP: Best Practices Retrieval
- **Event**: `PreToolUse` (Edit/Write)
- **Auto-activation conditions** (v2.2.2):
  - Error detection fired on same file in current session (error → retrieve best practices)
  - 3+ edits to same file in session (struggling pattern)
  - Review agent role OR `AI_MEMORY_BEST_PRACTICES_EXPLICIT=true`
- **Collection**: `conventions`
- **Limit**: 3
- **Threshold**: 0.6 (confidence gated — only fire if relevant practices exist)
- **Output**: Stdout display with `🎯 RELEVANT BEST PRACTICES` header

### 4.4 Parzival Bootstrap & Constraints

#### The "Aha Moment" — Bootstrap on Activation

When Parzival activates (via `/pov:parzival` or `/pov:parzival-start`), the bootstrap provides cross-session context — a summary of past discussions, decisions, and insights. This is the "aha moment": Parzival presents what happened in previous sessions.

**Activation sequence**:
1. Load constraints (`/aim-parzival-constraints`)
2. Load oversight docs (project-status.md, phase context)
3. Trigger bootstrap (`/aim-parzival-bootstrap`) — retrieves past session discussions and decisions
4. Parzival presents: "Last session we discussed X, decided Y, and insight Z was captured"

**Bootstrap is NOT triggered on session start** — sessions start clean (DEC-054). The "aha moment" happens when Parzival is explicitly activated.

#### Bootstrap Layers (`/aim-parzival-bootstrap`)
- **Budget**: `bootstrap_token_budget` (2500)
- **L1**: Last handoff (deterministic, limit=1, agent_id=parzival)
- **L2**: Recent decisions (deterministic, limit=5)
- **L3**: Recent insights (semantic, limit=3, agent_id=parzival)
- **L4**: GitHub enrichment (semantic, since last_session_date, limit=10)
- **Selection**: Greedy fill in priority order

#### Constraints (`/aim-parzival-constraints`)
- **Source**: `_ai-memory/pov/constraints/` directory
- **Loads**: `global/constraints.md` + phase-specific constraints
- **Timing**:
  - On activation: loaded as part of Parzival startup sequence
  - Post-compact: **VITAL** — re-injected immediately after compact to restore behavioral guardrails. Without this, Parzival loses constraints in compacted context.
  - NOT on session start (no ambient injection)

### 4.5 Freshness Verification

**Principle**: Content injected to agents MUST be current and correct. The GitHub collection serves as the ground truth (Principle 6). Stale patterns are blocked from injection entirely.

#### 4.5.1 Freshness Oracle Architecture

The `github` collection is the **freshness oracle** for `code-patterns`. What is merged is tested and considered correct.

```
  github (oracle)                    code-patterns (dependent)
  +------------------+               +------------------+
  | github_code_blob |  validates →  | implementation   |
  | (is_current=True)|               | error_pattern    |
  | blob_hash        |               | file_pattern     |
  | last_commit_sha  |               | refactor         |
  | file_path        |               | (freshness_status|
  +------------------+               |  written here)   |
                                     +------------------+
```

**Validation method**: Commit-count delta — count commits touching a file since the pattern was stored.

#### 4.5.2 Freshness Classification (5-Tier)

| Commits Since Stored | Status | Meaning |
|----------------------|--------|---------|
| 0-2 | **FRESH** | Content matches current codebase |
| 3-9 | **AGING** | Some activity, likely still accurate |
| 10-24 | **STALE** | Significant churn — content likely outdated |
| 25+ | **EXPIRED** | High churn — content definitely outdated |
| No ground truth | **UNKNOWN** | GitHub sync incomplete or file not tracked |

Initial status at capture: `"unverified"` (updated by freshness scan).

Thresholds are configurable via `freshness_commit_threshold_aging` (3), `freshness_commit_threshold_stale` (10), `freshness_commit_threshold_expired` (25). Validation enforces `aging < stale < expired`.

#### 4.5.3 Freshness Score Penalty (Injection Gate)

Applied to code-patterns results **after search, before greedy selection**:

| Status | Penalty Factor | Effect on Injection |
|--------|---------------|---------------------|
| FRESH | 1.0 | Full score — inject normally |
| AGING | 0.9 | Slight reduction — still injects if relevant |
| STALE | **0.0** | **Blocked** — never injected |
| EXPIRED | **0.0** | **Blocked** — never injected |
| UNVERIFIED | 1.0 | No penalty — assume fresh until scanned |
| UNKNOWN | 0.8 | Mild penalty — no ground truth data available |

**Implementation**: In `context_injection_tier2.py`, after search returns code-patterns results, multiply each result's score by the freshness penalty factor. STALE and EXPIRED results get score 0.0, which means they are excluded by any confidence threshold.

**Pre-retrieval belt-and-suspenders**: `search.py` also adds a Qdrant filter to **exclude** `freshness_status="expired"` from code-patterns queries at the query level.

#### 4.5.4 Freshness Scan Triggers

| Trigger | Type | Scope | When |
|---------|------|-------|------|
| Post-merge PR | Automatic | Code-patterns matching `files_changed` | Immediately on PR merge detection |
| Post GitHub sync | Automatic | All code-patterns | After each sync cycle completes |
| `/aim-freshness-report` | Manual | All code-patterns (or project-scoped) | User/Parzival invocation |
| `/aim-refresh` | Manual | All code-patterns (or project-scoped) | User/Parzival invocation |

**Post-sync scan**: After the GitHub sync container completes a sync cycle, it runs `run_freshness_scan()` automatically. This ensures `freshness_status` reflects the latest ground truth from the most recent commit data.

#### 4.5.5 Freshness Audit Trail

Every scan appends to `.audit/logs/freshness-log.jsonl`:
- `point_id`, `file_path`, `status`, `reason`, `commit_count`, `stored_at`, `checked_at`

#### 4.5.6 Freshness Interaction with Decay

Freshness and decay are **complementary but independent signals**:
- **Decay** (temporal): Reduces score based on age. A 30-day-old pattern gets lower score than a 1-day-old pattern.
- **Freshness** (activity): Blocks injection based on file churn. A 1-day-old pattern for a file with 10 commits is STALE.

A pattern can be temporally recent but freshness-STALE (file changed rapidly). Freshness blocking takes precedence — even high-decay-score patterns are blocked if STALE or EXPIRED.

---

## 5. Search Engine

### 5.1 Search Modes

| Mode | Conditions | Process |
|------|-----------|---------|
| hybrid_rrf_decay | hybrid_search + decay enabled | Dense → decay → RRF with sparse |
| hybrid_rrf | hybrid_search only | Dense + sparse → RRF fusion |
| decay | decay only | Dense → decay formula |
| dense | fallback | Plain dense search |

### 5.2 Decay Formula

```
final_score = 0.7 * semantic_similarity + 0.3 * temporal_score
temporal_score = 0.5 ^ (age_days / half_life_days)
```

**Decay applied BEFORE RRF fusion** (DEC-062).

### 5.3 Half-Life Configuration

| Scope | Half-Life | Applies To |
|-------|-----------|------------|
| code-patterns (collection) | 14 days | Default for all code-patterns types |
| discussions (collection) | 21 days | Default for all discussions types |
| conventions (collection) | 60 days | Default for all conventions types |
| jira-data (collection) | 30 days | Default for all jira types |
| github (collection) | 14 days | Default for all github types |
| github_ci_result (type override) | **7 days** | CI results decay fast |
| architecture_decision (type override) | **90 days** | Decisions persist |

**Remembrance Protection** (v2.2.2): When `access_count >= 3`, set `temporal_score = 1.0` (no decay). Increment `access_count` on every `search()` retrieval. NOT incremented by `get_recent()` (deterministic, no decay applied — remembrance protection is irrelevant for non-decay paths). Deduplicate within a turn: if same point returned by multiple search() calls in one turn, increment once.

### 5.4 Score Gap Filter

Threshold: 0.7 (30% tolerance from best score).
Skip result if `score < best_score * 0.7`.
Deterministic results (score=1.0) excluded from calculation.

### 5.5 Embedding Model Routing

| Condition | Model |
|-----------|-------|
| collection = code-patterns | jina-v2-base-code |
| content_type = github_code_blob | jina-v2-base-code |
| type includes "github_code_blob" | jina-v2-base-code |
| Everything else | jina-v2-base-en |

---

## 6. Feature Integration Map

### 6.1 Data Flow

```
CAPTURE                    PROCESSING               RETRIEVAL
─────────────────────     ─────────────────────     ─────────────────────
C1: User Message ───────→ Security → Chunk → Embed → R8: Tier 2 (discussions whitelist)
C2: Agent Response ─────→ Security → Chunk → Embed → R8: Tier 2 (discussions whitelist)
C3: Code Patterns ──────→ Security → Chunk → Embed → R4: First Edit, R8: Tier 2
C4: Error Patterns ─────→ Security → Embed ────────→ R2: Error Detection
C4b: Error Fixes ──────→ Security → Embed ────────→ R2: Error Detection (via error_group_id)
C5: Session Summary ────→ Security → Embed ────────→ R1: Compact Restore
C6: GitHub Sync ────────→ Security → Chunk → Embed → Freshness Oracle (§4.5), Parzival L4, User Search
C7: Jira Sync ─────────→ Security → Chunk → Embed → User/Parzival Manual Search Only
```

### 6.2 Feature Interaction Rules

1. **Error → Best Practices**: When error_detection fires, best_practices_retrieval auto-activates on next Edit/Write to the same file.
2. **Error → Fix Linkage**: Successful Bash/Edit/Write after error creates linked fix (same `error_group_id`). Resolution confidence scored by temporal proximity + file overlap.
3. **Error → Fix Injection**: R2 error detection uses two-phase retrieval: semantic match error → follow `error_group_id` → inject paired fix. Agent gets error context AND proven solution.
4. **Capture → Injection Dedup**: `injected_point_ids` prevents re-injecting previously shown context.
5. **Compact → State Reset**: `InjectionSessionState.reset_after_compact()` clears point IDs, preserves drift.
6. **Decay → All Search**: Decay applied to all `search()` calls. NOT applied to `get_recent()` (deterministic).
7. **Freshness → Injection Blocking**: STALE and EXPIRED code-patterns are blocked from injection via score penalty (§4.5.3). Pre-retrieval filter also excludes EXPIRED at query level.
8. **Freshness Oracle → code-patterns**: GitHub sync triggers freshness scan. Ground truth from `github_code_blob` classifies code-patterns as FRESH/AGING/STALE/EXPIRED.
9. **GitHub is_current → Search Filter**: `search()` adds `is_current=True` filter for github source.
10. **Quality Gate → No Storage**: Low-value messages filtered before pipeline starts.

### 6.3 Timing Dependencies

```
SessionStart → (compact only) get_recent() summaries + decisions → inject
UserPromptSubmit → user_prompt_capture (fork) → context_injection_tier2 (run)
PreToolUse(Write) → new_file_trigger → (if error on file) best_practices_retrieval
PreToolUse(Edit) → first_edit_trigger → (if error on file) best_practices_retrieval
PostToolUse(Bash) → error_detection (retrieve + fix injection) → error_pattern_capture (store, fork) → fix_detection (if resolves prior error → capture fix, fork)
PostToolUse(Edit/Write) → post_tool_capture (store, fork) → fix_detection (if resolves prior error → capture fix, fork)
PreCompact → pre_compact_save (blocking) → compact fires → session_start(compact)
Stop → agent_response_capture (fork)
```

---

## 7. Configuration Reference

### 7.1 Injection Parameters

| Parameter | Default | Range | Env Var | Description |
|-----------|---------|-------|---------|-------------|
| injection_enabled | True | bool | INJECTION_ENABLED | Master toggle |
| injection_confidence_threshold | 0.6 | 0.0-1.0 | INJECTION_CONFIDENCE_THRESHOLD | Global fallback (per-collection preferred) |
| injection_budget_floor | 500 | 100-2000 | INJECTION_BUDGET_FLOOR | Min Tier 2 budget |
| injection_budget_ceiling | 1500 | 500-5000 | INJECTION_BUDGET_CEILING | Max Tier 2 budget |
| injection_quality_weight | 0.5 | 0.0-1.0 | INJECTION_QUALITY_WEIGHT | Quality signal weight |
| injection_density_weight | 0.3 | 0.0-1.0 | INJECTION_DENSITY_WEIGHT | Density signal weight |
| injection_drift_weight | 0.2 | 0.0-1.0 | INJECTION_DRIFT_WEIGHT | Drift signal weight |
| injection_score_gap_threshold | 0.7 | 0.5-0.95 | INJECTION_SCORE_GAP_THRESHOLD | Score gap filter |
| bootstrap_token_budget | 2500 | 500-5000 | BOOTSTRAP_TOKEN_BUDGET | Parzival bootstrap budget |
| token_budget | 4000 | 100-100000 | TOKEN_BUDGET | Compact restore budget |
| max_retrievals | **10** | 1-50 | MAX_RETRIEVALS | Retrieval candidates (v2.2.2: was 5) |
| injection_hard_floor | **0.45** | 0.0-1.0 | INJECTION_HARD_FLOOR | Hard skip — never inject below (v2.2.2: new) |
| injection_threshold_conventions | **0.65** | 0.0-1.0 | INJECTION_THRESHOLD_CONVENTIONS | Per-collection threshold (v2.2.2: new) |
| injection_threshold_code_patterns | **0.55** | 0.0-1.0 | INJECTION_THRESHOLD_CODE_PATTERNS | Per-collection threshold (v2.2.2: new) |
| injection_threshold_discussions | **0.60** | 0.0-1.0 | INJECTION_THRESHOLD_DISCUSSIONS | Per-collection threshold (v2.2.2: new) |

### 7.2 Search Parameters

| Parameter | Default | Range | Env Var | Description |
|-----------|---------|-------|---------|-------------|
| similarity_threshold | 0.7 | 0.0-1.0 | SIMILARITY_THRESHOLD | Trigger hook threshold |
| hnsw_ef_fast | 64 | 16-512 | HNSW_EF_FAST | Fast mode (triggers, tier2) |
| hnsw_ef_accurate | 128 | 16-512 | HNSW_EF_ACCURATE | Accurate mode (user search) |
| hybrid_search_enabled | False | bool | HYBRID_SEARCH_ENABLED | Enable BM25 sparse |
| colbert_reranking_enabled | False | bool | COLBERT_RERANKING_ENABLED | Enable ColBERT reranking |

### 7.3 Decay Parameters

| Parameter | Default | Range | Env Var | Description |
|-----------|---------|-------|---------|-------------|
| decay_enabled | True | bool | DECAY_ENABLED | Master toggle |
| decay_semantic_weight | 0.7 | 0.0-1.0 | DECAY_SEMANTIC_WEIGHT | Semantic vs temporal |
| decay_half_life_code_patterns | 14 | ≥1 days | DECAY_HALF_LIFE_CODE_PATTERNS | |
| decay_half_life_discussions | 21 | ≥1 days | DECAY_HALF_LIFE_DISCUSSIONS | |
| decay_half_life_conventions | 60 | ≥1 days | DECAY_HALF_LIFE_CONVENTIONS | |
| decay_half_life_jira_data | 30 | ≥1 days | DECAY_HALF_LIFE_JIRA_DATA | |
| decay_half_life_github | 14 | ≥1 days | DECAY_HALF_LIFE_GITHUB | |
| decay_type_overrides | github_ci_result:7,architecture_decision:90 | type:days,... | DECAY_TYPE_OVERRIDES | Per-type override |

### 7.4 Chunking Parameters

| Parameter | Value | Applies To |
|-----------|-------|------------|
| Prose chunk size | 512 tokens | User messages, agent responses, guidelines |
| Prose overlap | 15% | Prose content |
| Code chunk size | 512 tokens | Code patterns, implementations |
| Code overlap | **20%** (v2.2.2: was 15%) | Code content |
| Code min chunk | **50 tokens** (v2.2.2: new) | Skip trivial code |
| Code max chunk | **1024 tokens** (v2.2.2: was 512) | Large functions split at logical boundaries |
| User message threshold | 2000 tokens | Chunk if exceeds |
| Agent response threshold | 3000 tokens | Chunk if exceeds |
| Session summary (≤8192 tokens) | **Chunked embedding** (independent chunk embedding, v2.2.2, per BP-028) | Session summaries |
| Session summary (>8192 tokens) | ProseChunker fallback (512 tokens, 15% overlap) | Oversized summaries |
| Error structured truncation | 800 tokens | Error patterns |
| Max content guard | 100,000 chars (~25,000 tokens) | All captures — safety cap per BP-068 verification gate |
| CHARS_PER_TOKEN | 4 | Estimation constant |

### 7.5 Freshness Parameters

| Parameter | Default | Range | Env Var | Description |
|-----------|---------|-------|---------|-------------|
| freshness_enabled | True | bool | FRESHNESS_ENABLED | Master toggle for freshness scanning |
| freshness_commit_threshold_aging | 3 | 1-100 | FRESHNESS_COMMIT_THRESHOLD_AGING | Commits → AGING classification |
| freshness_commit_threshold_stale | 10 | 2-500 | FRESHNESS_COMMIT_THRESHOLD_STALE | Commits → STALE classification |
| freshness_commit_threshold_expired | 25 | 3-1000 | FRESHNESS_COMMIT_THRESHOLD_EXPIRED | Commits → EXPIRED classification |
| freshness_penalty_fresh | 1.0 | 0.0-1.0 | FRESHNESS_PENALTY_FRESH | Score multiplier for FRESH |
| freshness_penalty_aging | 0.9 | 0.0-1.0 | FRESHNESS_PENALTY_AGING | Score multiplier for AGING |
| freshness_penalty_stale | 0.0 | 0.0-1.0 | FRESHNESS_PENALTY_STALE | Score multiplier for STALE (blocked) |
| freshness_penalty_expired | 0.0 | 0.0-1.0 | FRESHNESS_PENALTY_EXPIRED | Score multiplier for EXPIRED (blocked) |
| freshness_penalty_unverified | 1.0 | 0.0-1.0 | FRESHNESS_PENALTY_UNVERIFIED | Score multiplier for UNVERIFIED |
| freshness_penalty_unknown | 0.8 | 0.0-1.0 | FRESHNESS_PENALTY_UNKNOWN | Score multiplier for UNKNOWN |

Validation: `aging < stale < expired` (always enforced).

### 7.6 Security Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| security_scanning_enabled | True | Master toggle |
| security_scanning_ner_enabled | True | Layer 3 (SpaCy) |
| security_block_on_secrets | True | Block vs mask |
| security_scan_github_mode | "relaxed" | relaxed/strict/off |
| security_scan_session_mode | "relaxed" | relaxed/strict/off |

### 7.7 Agent Token Budgets

| Agent | Budget | Context |
|-------|--------|---------|
| architect, solo-dev, quick-flow-solo-dev | 1500 | High-context roles |
| analyst, pm, developer, dev, code-review, code-reviewer | 1200 | Standard dev roles |
| ux-designer, qa, tea | 1000 | Focused roles |
| scrum-master, sm, tech-writer | 800 | Low-context roles |
| default | 1000 | Fallback |

---

## 8. Observability Contract

### 8.1 Capture Traces (Langfuse)

Every capture should produce these spans:

| Step | Span Name | Expected Duration | Metadata |
|------|-----------|-------------------|----------|
| 0 | `0_dedup` | <5ms | `matched_id`, `is_duplicate` |
| 1 | `1_capture` | <50ms | `hook_type`, `content_length` |
| 2 | `2_log` | <5ms | `session_id`, `turn_number` |
| 3 | `3_detect` | <5ms | `detected_type` |
| 4 | `4_scan` | <100ms | `scan_action`, `findings_count` |
| 5 | `5_chunk` | <50ms | `chunk_count`, `chunk_strategy` |
| 6 | `6_embed` | <500ms | `model`, `embedding_status` |
| 7 | `7_store` | <100ms | `point_id`, `collection` |
| 8 | `8_enqueue` | <5ms | `classification_status` |

### 8.2 Retrieval Traces (Langfuse)

| Hook | Trace Name | Key Metadata |
|------|-----------|-------------|
| session_start | `session_bootstrap` | trigger, result_count, tokens_injected, agent_id |
| tier2 | `context_retrieval` | collections_searched, results_considered, results_selected, tokens_used, budget, best_score, topic_drift, gating_mode |
| error_detection | `error_retrieval` | collection, result_count, best_score |
| new_file_trigger | `convention_retrieval` | collection, result_count, file_type |
| first_edit_trigger | `pattern_retrieval` | collection, result_count |
| best_practices | `best_practices_retrieval` | collection, result_count, best_score |
| search (any) | `remembrance_protection` | point_id, access_count, temporal_score_override (logged when access_count reaches 3) |

### 8.3 Error-Fix Traces

| Event | Trace Name | Key Metadata |
|-------|-----------|-------------|
| Error captured | `error_capture` | error_group_id, exception_type, file_path, command_prefix |
| Fix captured | `error_fix_capture` | error_group_id, resolution_confidence, turns_since_error, file_overlap |
| Fix injected | `error_fix_injection` | error_group_id, fix_point_id, resolution_confidence, freshness_status |
| Fix effectiveness | `error_fix_effectiveness` | error_group_id, resolved_without_retry (bool), next_bash_exit_code |

**Prometheus Metrics**:
- `ai_memory_error_fix_captures_total` (Counter — fixes captured)
- `ai_memory_error_fix_injections_total` (Counter — fixes injected to agents)
- `ai_memory_error_fix_effectiveness_total` (Counter, label: resolved/unresolved — did the agent succeed after injection)

### 8.4 Freshness Traces

| Event | Trace Name | Key Metadata |
|-------|-----------|-------------|
| Scan start | `freshness_scan_start` | total_points, collection, project — Emitted before scan begins; pairs with freshness_scan for duration measurement. |
| Post-sync scan | `freshness_scan` | total_checked, fresh_count, aging_count, stale_count, expired_count, unknown_count, duration_seconds |
| Post-merge flag | `freshness_pr_trigger` | files_changed, patterns_flagged |
| Injection penalty | `freshness_penalty_applied` | point_id, freshness_status, original_score, penalized_score |

**Prometheus Metrics**:
- `ai_memory_freshness_total` (Counter, per-tier)
- `ai_memory_freshness_scan_duration_seconds` (Histogram)
- `ai_memory_freshness_status` (Gauge, per-tier current counts)
- `ai_memory_freshness_blocked_injections_total` (Counter — STALE/EXPIRED blocked from injection)

### 8.5 Healthy Trace Indicators

| Metric | Healthy | Warning | Problem |
|--------|---------|---------|---------|
| Tier 2 gating_mode | "full" (60%+) | "soft" (30-60%) | "skip" (>50%) |
| Tier 2 best_score | >0.6 | 0.45-0.6 | <0.45 |
| Tier 2 tokens_used | 200-1500 | <100 or >1500 | 0 (no injection) |
| Tier 2 results_selected | 1-5 | 0 | N/A |
| Capture dedup rate | <20% | 20-50% | >50% (too many dupes) |
| Error detection rate | <10% of Bash calls | 10-30% | >30% (noisy) |
| Compact restore | 2-5 items | 0-1 items | No items |
| Error fix resolution rate | >50% resolved after injection | 30-50% | <30% (fixes not helping) |
| Error fix capture rate | >60% of errors get paired fix | 30-60% | <30% (fixes not being detected) |
| Fix freshness (non-stale) | >90% of injected fixes are FRESH | 70-90% | <70% (stale fixes injected) |

---

## 9. Quality Criteria

### 9.1 Injection Quality (Observable via Langfuse)

| Criterion | Target | How to Measure |
|-----------|--------|----------------|
| Relevant injections per session | >70% of injections rated useful | Langfuse: gating_mode = "full" |
| Skip rate (no injection) | <30% of turns | Langfuse: gating_mode = "skip" count |
| Average best_score | >0.60 | Langfuse: mean of best_score |
| Token utilization | 50-100% of budget used | Langfuse: tokens_used / budget |
| Dedup effectiveness | <5% re-injected content | Langfuse: injected_point_ids overlap rate |

### 9.2 Capture Quality

| Criterion | Target | How to Measure |
|-----------|--------|----------------|
| Quality gate filter rate | 5-15% of messages filtered | Langfuse: quality_gate_skip count |
| Error false positive rate | <5% of Bash calls | Langfuse: error captures vs Bash total |
| Duplicate skip rate | <20% per session | Langfuse: 0_dedup is_duplicate rate |
| Embedding success rate | >99% | Langfuse: embedding_status = "complete" |

### 9.3 Freshness Quality

| Criterion | Target | How to Measure |
|-----------|--------|----------------|
| Collection freshness score | >85% FRESH | `(fresh_count / total_count) * 100` |
| Mean staleness | <8 commits | `avg(commits_since_stored)` across all code-patterns |
| Orphan rate | <10% | `(unknown_count / total_count) * 100` |
| Blocked injection rate | <15% of code-patterns results | Langfuse: `freshness_blocked_injections_total` vs total code-patterns retrieved |
| Scan recency | <2 hours | Time since last successful freshness scan |

### 9.4 Cross-Session Memory (Parzival)

| Criterion | Target | How to Measure |
|-----------|--------|----------------|
| Bootstrap layers populated | 3-4 layers with content | Langfuse: L1-L4 result counts |
| Handoff continuity | Last session context available | L1 handoff present |
| Decision recall | Recent decisions surfaced | L2 decisions count > 0 |

---

## Appendix A: Superseded Specifications

This Behavior Spec supersedes the following sections of existing specs:

| Spec | Sections Superseded | Reason |
|------|-------------------|--------|
| Context-Injection-V2.md | All (bootstrap, injection, gating) | Described v2.0-v2.1 behavior. v2.2.x changed to agent-activated. |
| GitHub-Integration-V1.md | Collection targeting (§2) | Still references AD-1 (discussions). GitHub collection approved PLAN-010. |
| Core-Architecture-V2.md | §7.2 (injection), §15 (confidence) | Parameters and behavior updated for v2.2.2 |
| Temporal-Awareness-V1.md | §3 (medium-relevance truncation) | Contradicts zero-truncation principle. Not implemented. |
| Chunking-Strategy-V2.md | §2.1 (tree-sitter scope), §2.6 (LateChunker) | Features not yet implemented. Scope clarified. |

Specs NOT superseded (still authoritative for their domains):
- Security-Pipeline-V1.md (security scanning)
- Parzival-Pipeline-V2.md (Parzival agent behavior)
- LANGFUSE-INTEGRATION-SPEC.md (Langfuse V3 SDK)
- Embedding-Architecture-V1.md (embedding model routing — except sparse vectors section)

---

*End of AI Memory Behavior Specification V1.0*
