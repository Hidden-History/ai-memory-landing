# Core Architecture Principle V3.0

> **DEPRECATION NOTICE (v2.2.2)**: §7.2 (injection) and §15 (confidence) superseded by AI-Memory-Behavior-Spec-V1.md §4/§7. Other sections remain current.

**Source of Truth**: This document summarizes key architectural decisions. Full details in [MEMORY-SYSTEM-REDESIGN-v2.md](./MEMORY-SYSTEM-REDESIGN-v2.md). V2.0.6 subsystem specifications are referenced from Sections 11–17.

---

## 1. Foundational Principle

The V2.0 system operates on **"Right Information at Right Time"** - instead of injecting random memories at session start, it uses signal-triggered retrieval when specific events occur.

> Reference: MEMORY-SYSTEM-REDESIGN-v2.md Section 1.1

---

## 2. Collection Organization (3 Core + 2 Conditional)

```
code-patterns  (HOW things are built)
  ├── implementation   - How features were built
  ├── error_fix        - Errors and their fixes
  ├── refactor         - Refactoring patterns
  └── file_pattern     - File-specific patterns

conventions    (WHAT rules to follow)
  ├── rule             - Hard rules (MUST do)
  ├── guideline        - Soft guidelines (SHOULD do) ← BEST PRACTICES STORED HERE
  ├── port             - Port configurations
  ├── naming           - Naming conventions
  └── structure        - File/folder conventions

discussions    (WHY things were decided)
  ├── decision         - Architectural decisions (DEC-xxx)
  ├── session          - Session summaries
  ├── blocker          - Blockers (BLK-xxx)
  ├── preference       - User preferences
  ├── context          - Important conversation context (PLANNED - v2.1)
  ├── user_message     - Individual user prompts
  ├── agent_response   - Individual agent responses
  └── [github namespace] (v2.0.6, source="github", AD-1)
        ├── github_issue         - Issue title + body
        ├── github_issue_comment - Issue comment body
        ├── github_pr            - PR title + description
        ├── github_pr_diff       - PR diff summary (chunked)
        ├── github_pr_review     - PR review comment
        ├── github_commit        - Commit message + stats
        ├── github_code_blob     - File content (AST-chunked)
        ├── github_ci_result     - CI workflow result
        └── github_release       - Release notes

jira-data      (EXTERNAL work items — conditional, v2.0.5+)
  ├── JIRA_ISSUE       - Jira issues (summary, description, metadata)
  └── JIRA_COMMENT     - Jira issue comments
```

**Why 3 core?** Maps to three fundamental question types: HOW? WHAT? WHY?

**Why GitHub data in discussions (AD-1)**: GitHub data maps to WHY — it explains what code DID do. Stored with `source="github"` namespace isolation and `is_tenant=true` indexing. Same embedding model (Jina v2 768-dim), enabling cross-type queries (conversations + GitHub + Jira) as single filtered searches.

**Why jira-data is separate**: External data from Jira Cloud has different lifecycle (sync-based, not hook-captured), different metadata (jira_project, jira_issue_key, jira_status), and is conditionally enabled. It does NOT participate in the standard hook capture pipeline.

**Content-hash deduplication (v2.0.6)**: All storage paths compute `SHA-256(content)` before embedding. If `content_hash` matches an existing point with same `type` and `github_id`, embedding is skipped and only `last_synced` is updated. Changed content supersedes old points (`is_current=False`).

> Reference: MEMORY-SYSTEM-REDESIGN-v2.md Sections 4, 5, 6

### 2.1 Jira Data Collection (v2.0.5+)

The `jira-data` collection is **conditional** — only created when `jira_sync_enabled=True` in config.

**Sync Architecture**:
```
Jira Cloud REST API v3
    │
    ├─ 1. CONNECT    JiraClient: httpx AsyncClient, Basic Auth, GET /search/jql
    ├─ 2. FETCH      Token-based pagination (issues), offset-based (comments)
    ├─ 3. COMPOSE    Issue + comments → structured document
    ├─ 4. CHUNK      IntelligentChunker (ContentType.PROSE, 512 tokens, 15% overlap)
    ├─ 5. EMBED      Jina v2 embeddings (768-dim)
    ├─ 6. DEDUP      Content-hash deduplication (same as core collections)
    └─ 7. STORE      Qdrant jira-data collection with Jira-specific metadata
```

**Jira-Specific Metadata** (in addition to standard fields):
| Field | Type | Purpose |
|-------|------|---------|
| `jira_project` | Keyword | Project key (e.g., "PROJ") |
| `jira_issue_key` | Keyword | Issue key (e.g., "PROJ-123") |
| `jira_issue_type` | Keyword | Bug, Story, Task, Epic |
| `jira_status` | Keyword | To Do, In Progress, Done |
| `jira_priority` | Keyword | Highest, High, Medium, Low, Lowest |
| `jira_reporter` | Keyword | Reporter display name |
| `jira_updated` | Datetime | Last Jira update timestamp |

**Sync Modes**:
- **Full sync**: All issues and comments from scratch
- **Incremental sync**: Only issues updated since `last_synced` timestamp
- **State persistence**: `jira_sync_state.json` per project

**Design Constraints**:
- `COLLECTION_NAMES` in config.py deliberately excludes jira-data to avoid breaking existing iteration logic
- Monitoring code checks for jira-data collection existence before iterating
- `group_id` is set to the Jira instance hostname for tenant isolation
- `source_hook="jira_sync"` in validation.py whitelist

> Reference: PLAN-004 (Jira Integration), BUG-069 through BUG-076

### 2.2 Qdrant Collection Configuration

**HNSW Parameters** (all collections):
| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `m` | 16 | Balanced recall/memory (range: 8-64) |
| `ef_construct` | 100 | Index build quality (range: 100-512) |
| `full_scan_threshold` | 10000 | Bypass HNSW for small vector counts |
| `on_disk` | true | Store HNSW index on disk |

**Storage Configuration**:
| Component | Setting | Purpose |
|-----------|---------|---------|
| Vectors | `on_disk=True` | Memory efficiency for large collections |
| Quantization | Scalar (int8) | 4x compression, ~99% accuracy |
| Quantization params | `quantile=0.99, always_ram=True` | Exclude outliers, fast search |

**Required Payload Indexes** (create IMMEDIATELY after collection creation):

| Field | Index Type | Options | Collections | Purpose |
|-------|------------|---------|-------------|---------|
| `group_id` | Keyword | `is_tenant=True` | ALL | **CRITICAL** - Tenant isolation, data co-location |
| `type` | Keyword | - | ALL | Memory type filtering |
| `timestamp` | Datetime | - | ALL | Recency queries |
| `content_hash` | Keyword | - | ALL | Deduplication |
| `file_path` | Keyword | - | code-patterns, discussions | File-specific pattern lookup |
| `source` | Keyword | `is_tenant=True` | discussions | **v2.0.6** - GitHub namespace isolation (AD-1) |
| `is_current` | Boolean | - | discussions | **v2.0.6** - Version queries, filter superseded points |
| `authority_tier` | Integer | - | discussions | **v2.0.6** - Conflict resolution (1=human, 3=automated) |
| `freshness_status` | Keyword | - | code-patterns | **v2.0.6** - Source-code-change-based staleness (fresh/aging/stale/expired/unknown) |

**Index Timing Rule**: Create indexes immediately after collection creation. Creating later blocks updates during indexing.

> Reference: BP-038 (Qdrant Best Practices 2026), BP-037 (Multi-Tenancy Patterns)

---

## 3. Hook Classification

Hooks are classified by their function: **CAPTURE** (store to memory) or **RETRIEVAL** (retrieve from memory).

### 3.1 CAPTURE Hooks (Store to Database)

| Hook Script | Trigger | Collection | Type | Purpose |
|-------------|---------|------------|------|---------|
| `user_prompt_capture.py` | UserPromptSubmit | discussions | `user_message` | Store user messages |
| `agent_response_capture.py` | Stop | discussions | `agent_response` | Store agent responses |
| `post_tool_capture.py` | PostToolUse (Edit\|Write) | code-patterns | `implementation` | Capture code patterns |
| `error_pattern_capture.py` | PostToolUse (Bash) | code-patterns | `error_fix` | Store error patterns |
| `pre_compact_save.py` | PreCompact | discussions | `session` | Save session summary |

### 3.2 RETRIEVAL Hooks (Query Database)

| Hook Script | Trigger | Collection | Type Filter | Purpose |
|-------------|---------|------------|-------------|---------|
| `error_detection.py` | PostToolUse (Bash) | code-patterns | `error_fix` | Retrieve similar fixes |
| `new_file_trigger.py` | PreToolUse (Write) | conventions | `naming`, `structure` | Retrieve naming conventions |
| `first_edit_trigger.py` | PreToolUse (Edit) | code-patterns | `file_pattern` | Retrieve file patterns |
| `context_injection_tier2.py` | UserPromptSubmit | discussions, conventions | `decision`, `guideline`, `session` | Two-tier progressive context injection with confidence gating and adaptive budgets (replaces `unified_keyword_trigger.py`, archived v2.0.6) |
| `session_start.py` | SessionStart (resume\|compact) | discussions, conventions | `session`, `guideline`, `decision` | **v2.2.0**: Session restore only (resume/compact). Startup bootstrap moved to `/aim-parzival-bootstrap` skill. See [Context-Injection-V2](./Context-Injection-V2.md) |

### 3.3 ON-DEMAND Scripts (Not Auto-Triggered)

| Script | Purpose | Invoked By |
|--------|---------|------------|
| `best_practices_retrieval.py` | Deep best practices search | Review agents (as subagent) |
| `manual_save_memory.py` | Manual memory storage | `/save-memory` skill |

> Reference: MEMORY-SYSTEM-REDESIGN-v2.md Sections 9, 10

### 3.4 Memory Processing Pipeline

All content follows this pipeline from capture to searchable storage:

```
Content arrives (hook event or sync engine)
    │
    ├─ 1. CAPTURE    Hook receives event / sync engine fetches data
    ├─ 2. LOG         Full content → activity log (audit/debug, never modified)
    ├─ 3. DETECT      Content type detection (prose, code, config, etc.)
    ├─ 4. SCAN        SecurityScanner: 3-layer PII/secrets scan (v2.0.6)
    │     ├── PASS → continue pipeline
    │     ├── MASK → PII replaced with placeholders, continue
    │     └── BLOCK → secrets detected, content discarded
    ├─ 5. CHUNK       IntelligentChunker routes by content type
    │     ├── Hook provides type (user_message, agent_response, etc.)
    │     ├── Chunker selects strategy based on type + content size
    │     └── Produces 1-N chunks with chunking_metadata
    ├─ 6. EMBED       Generate embedding for each chunk (dual model routing, v2.0.6)
    ├─ 7. STORE       All chunks → Qdrant (with full metadata)
    ├─ 8. ENQUEUE     Queue chunk point_ids for LLM classification
    └─ 9. CLASSIFY    Worker: rule filter → LLM → refines type on stored chunks
```

**Pipeline Invariants**:
- Full content is ALWAYS logged (activity log is never modified)
- Clean content is preserved in vector DB; BLOCKED content is logged but not stored (v2.0.6 security)
- Chunking strategy is determined by content type (see Chunking-Strategy-V2.md Section 7)
- Classification refines type AFTER storage (does not block capture)
- Hooks must store immediately because hook input (stdin) is ephemeral
- Embedding model is selected by content type: prose model for natural language, code model for source code (v2.0.6)

**Why store-first**: Hook subprocess receives content via stdin from Claude Code. If the process dies or content is not stored, it is permanently lost. The activity log and Qdrant storage must happen immediately. Classification runs asynchronously via the queue worker without blocking capture.

**Future**: Restructure pipeline so classification happens before chunking/storage (BP-003). Requires durable queue as content buffer so hooks can enqueue without storing directly.

> Reference: Chunking-Strategy-V2.md Section 7 (Content Size Decision Tree)
> Reference: BP-003 (Memory Pipeline Ordering 2026)
> Reference: LLM-Memory-Classification-V1.md (Classification system)
> Reference: [Security-Pipeline-V1.md](./Security-Pipeline-V1.md) (Security scanning details)

### 3.5 Config Framework (v2.0.6)

All v2.0.6 settings extend the existing `MemoryConfig` Pydantic BaseSettings class in `src/memory/config.py`. No new config module. Three-tier pattern:

| Tier | User Experience | Example |
|------|----------------|---------|
| **Tier 1: Required** | Must set when feature enabled | `GITHUB_TOKEN` (conditional on `GITHUB_SYNC_ENABLED`) |
| **Tier 2: Defaults** | Works out of the box, user CAN override | `DECAY_HALF_LIFE_DISCUSSIONS=21` |
| **Tier 3: Hidden** | Advanced users only, not in `.env.example` | `DECAY_TYPE_OVERRIDES` |

**Prefix groups**: `DECAY_*`, `GITHUB_*`, `AUDIT_*`, `INJECTION_*`, `FRESHNESS_*`, `PARZIVAL_*`, `AUTO_UPDATE_*`

> Reference: [SPEC-002 Config Framework](../plans/PLAN-006/specs/SPEC-002-config-framework.md)

### 3.6 Audit Directory (v2.0.6)

Two-tier hybrid audit trail (AD-2): `.audit/` (gitignored, ephemeral) + `oversight/` (committed, durable).

```
.audit/                    (gitignored, chmod 700)
├── logs/                  JSONL event logs (injection, sync, sanitization)
├── sessions/              Raw session transcripts
├── state/                 Sync cursors, pending reviews, migration state
├── snapshots/             Qdrant collection backup references
└── temp/                  Debug data (auto-cleaned after 24h)
```

Path resolved from config: `Path(cwd) / config.audit_dir` (default: `.audit`).

> Reference: [SPEC-003 Audit Directory](../plans/PLAN-006/specs/SPEC-003-audit-directory.md)

### 3.7 Langfuse Observability Integration

> **Authoritative Spec**: `oversight/specs/LANGFUSE-INTEGRATION-SPEC.md`
> ALL Langfuse code MUST comply with the integration spec. This section provides a summary only.

**SDK Version**: Langfuse Python SDK V3 (OTel-based, `langfuse>=3.0,<4.0`). V2 SDK methods are FORBIDDEN.

**Dual Integration Architecture**:
- **Path A (Trace Buffer)**: Hook scripts → `emit_trace_event()` → JSON on disk → `trace_flush_worker` → OTel spans → Langfuse
- **Path B (Direct SDK)**: Services → `get_client()` / `@observe()` / `propagate_attributes()` → Langfuse

**TRACE_CONTENT_MAX**: All trace events emitted via `emit_trace_event()` MUST include content up to `TRACE_CONTENT_MAX` (10000 characters). This constant MUST be consistent across all instrumented files.

**PROHIBITED**:
- V2 SDK methods: `Langfuse()` constructor, `start_span()`, `start_generation()`, `langfuse_context`
- Hardcoded character limits below `TRACE_CONTENT_MAX` in any span (e.g., `[:300]`)
- Inconsistent `TRACE_CONTENT_MAX` values across files
- Omitting `session_id` from trace events
- Omitting `flush()` calls in short-lived processes
- Guessing at Langfuse API without consulting the spec or Langfuse docs

**OTel Attribute Names** (verified in Langfuse SDK source):
- Session ID: `session.id` (NOT `langfuse.trace.session_id`)
- User ID: `user.id` (NOT `langfuse.trace.user_id`)
- All others: `langfuse.observation.*` and `langfuse.trace.*` prefixes

> Reference: `LANGFUSE-INTEGRATION-SPEC.md`, BUG-204, BUG-180, Zero-Truncation Principle (Section 3.4)

---

## 4. Automatic Triggers

The system defines **6 automatic triggers** (4 in original spec + 2 enhancements):

### Trigger 1: Error Detection
- **Hook**: PostToolUse (Bash)
- **Signal**: Error text, "Exception:", "Traceback", exit code != 0
- **CAPTURE**: `error_pattern_capture.py` → stores to code-patterns
- **RETRIEVE**: `error_detection.py` → queries code-patterns WHERE type="error_fix"
- **Purpose**: Learn from and prevent repeating errors

> Reference: MEMORY-SYSTEM-REDESIGN-v2.md Section 9.1 (TRIGGER 1)

### Trigger 2: New File Creation
- **Hook**: PreToolUse (Write)
- **Signal**: Write tool creating file that doesn't exist
- **Action**: Query conventions WHERE type IN (naming, structure)
- **Purpose**: Apply conventions at creation time

> Reference: MEMORY-SYSTEM-REDESIGN-v2.md Section 9.1 (TRIGGER 2)

### Trigger 3: First Edit to File
- **Hook**: PreToolUse (Edit)
- **Signal**: First edit to a file in current session
- **Action**: Query code-patterns WHERE file_path matches
- **Purpose**: Load patterns before modifying file

> Reference: MEMORY-SYSTEM-REDESIGN-v2.md Section 9.1 (TRIGGER 3)

### Trigger 4: Decision Keywords
- **Hook**: UserPromptSubmit
- **Signal**: "why did we", "what was decided", "remember when"
- **Action**: Query discussions WHERE type="decision"
- **Purpose**: Retrieve past decisions when user explicitly asks

> Reference: MEMORY-SYSTEM-REDESIGN-v2.md Section 9.1 (TRIGGER 4)

### Trigger 5: Best Practices Keywords (Enhancement)
- **Hook**: UserPromptSubmit
- **Signal**: "best practice", "convention", "how should I", "coding standard"
- **Action**: Query conventions WHERE type="guideline"
- **Purpose**: Retrieve relevant best practices when user asks

> Note: Enhancement beyond original V2.0 spec. Implemented in `context_injection_tier2.py` (replaces `unified_keyword_trigger.py`, archived v2.0.6)

### Trigger 6: Session History Keywords (Enhancement)
- **Hook**: UserPromptSubmit
- **Signal**: "what have we done", "project status", "where were we", "what's next"
- **Action**: Query discussions WHERE type="session"
- **Purpose**: Retrieve session summaries for project continuity

> Note: Enhancement beyond original V2.0 spec. Implemented in `context_injection_tier2.py` (replaces `unified_keyword_trigger.py`, archived v2.0.6)

### 4.1 Keyword Pattern Reference

Source of truth: `src/memory/triggers.py` → `TRIGGER_CONFIG`

#### Decision Keywords (20 patterns)
Triggers search of `discussions` collection for `type="decision"`:

| Category | Patterns |
|----------|----------|
| Decision recall | `why did we`, `why do we`, `what was decided`, `what did we decide` |
| Memory recall | `remember when`, `remember the decision`, `remember what`, `remember how`, `do you remember`, `recall when`, `recall the`, `recall how` |
| Session references | `last session`, `previous session`, `earlier we`, `before we`, `previously`, `last time we`, `what did we do`, `where did we leave off` |

#### Session History Keywords (16 patterns)
Triggers search of `discussions` collection for `type="session"`:

| Category | Patterns |
|----------|----------|
| Project status | `what have we done`, `what did we work on`, `project status`, `where were we`, `what's the status` |
| Continuation | `continue from`, `pick up where`, `continue where` |
| Remaining work | `what's left to do`, `remaining work`, `what's next for`, `what's next on`, `what's next in the`, `next steps`, `todo`, `tasks remaining` |

#### Best Practices Keywords (27 patterns)
Triggers search of `conventions` collection (all types):

| Category | Patterns |
|----------|----------|
| Standards | `best practice`, `best practices`, `coding standard`, `coding standards`, `convention`, `conventions for` |
| Patterns | `what's the pattern`, `what is the pattern`, `naming convention`, `style guide` |
| Guidance | `how should i`, `how do i`, `what's the right way`, `what is the right way` |
| Research | `research the pattern`, `research best practice`, `look up`, `find out about`, `what do the docs say` |
| Recommendations | `should i use`, `what's recommended`, `what is recommended`, `recommended approach`, `preferred approach`, `preferred way`, `industry standard`, `common pattern` |

> **Design Principle**: Keywords are case-insensitive. Patterns are specific enough to avoid false positives (e.g., "research the pattern" instead of just "research").

---

## 5. Best Practices Architecture

### 5.1 Source of Truth: Qdrant Database

**CRITICAL**: The Qdrant `conventions` collection is the **source of truth** for best practices, NOT the `.md` files.

```
Source of Truth: Qdrant conventions (type="guideline")  ←  BP-001, BP-002, BP-023, etc.
                              ▲
  oversight/knowledge/best-practices/*.md  (VERIFICATION FILES — human review, NOT authoritative)
```

### 5.2 Best Practices Researcher Workflow (5 Phases)

The Best Practices Researcher is a **skill** that auto-triggers on keywords like "best practices", "convention", "how should I".

```
Phase 1: CHECK DATABASE
    │
    ├── Query: conventions collection WHERE type="guideline"
    ├── Semantic search for topic
    ├── If found with good score (>0.7) and <6 months old → USE IT, skip to Phase 5
    └── If not found or stale → Continue to Phase 2

Phase 2: WEB RESEARCH
    │
    ├── Search official documentation (2024-2026 sources)
    ├── Validate against project constraints
    └── Synthesize findings

Phase 3: SAVE TO FILE (Verification)
    │
    ├── Generate next BP-ID (BP-028, BP-029, etc.)
    ├── Create oversight/knowledge/best-practices/BP-XXX-[topic].md
    ├── Human review possible
    └── This is TEMPORARY verification step

Phase 4: ADD TO DATABASE (Source of Truth)
    │
    ├── Store to conventions collection
    ├── type="guideline"
    ├── tags include topic keywords
    └── Database is now authoritative

Phase 5: SKILL EVALUATION (V2.6)
    │
    ├── Evaluate findings against skill-worthiness criteria
    ├── Decision rule: (Process-oriented AND Reusable) OR Stack Pain Point
    ├── If skill-worthy: Recommend to user with reasoning
    ├── If user confirms: Invoke Skill Creator agent
    └── Documentation Override: If 3+ fresh BP files exist, recommend "documentation sufficient"
```

### 5.3 Skill-Worthiness Criteria

| Criterion | Question | Weight |
|-----------|----------|--------|
| **Process-oriented** | Has 3+ distinct steps? | Required* |
| **Reusable** | Applies to common/recurring tasks? | Required* |
| **Complex** | Non-trivial to remember correctly? | Nice-to-have |
| **Consistency-critical** | Should be done the same way each time? | Nice-to-have |
| **Stack Pain Point** | Agents failed before OR many config options? | Alternate trigger |

*Required unless Stack Pain Point applies

**Stack Pain Point Examples**: Prometheus metrics (4 types, naming rules, cardinality), Grafana panels (20+ viz types), Playwright selectors (8+ locator methods).

**Documentation Override**: If 3+ fresh BP files exist (< 6 months), recommend "documentation sufficient" unless user explicitly requests skill creation.

### 5.4 Two-Component Architecture

| Component | Type | Location | Phases |
|-----------|------|----------|--------|
| Best Practices Researcher | Skill (auto-triggers) | `.claude/skills/best-practices-researcher/` | 1-4: Research, 5: Evaluate → invoke Skill Creator |
| Skill Creator | Agent (explicit) | `.claude/agents/skill-creator.md` | Creates SKILL.md files following BP-044 |

**Bidirectional**: BP Researcher can invoke Skill Creator, and vice versa.

### 5.5 Skills Created from Best Practices

| Skill | Source | Stack Pain Point |
|-------|--------|------------------|
| `prometheus-metrics` | BP-045 | 4 metric types, naming rules, cardinality |
| `grafana-panel-design` | BP-041, BP-030, BP-001 | 20+ viz types, agents pick wrong ones |
| `playwright-selectors` | BP-046 | 8+ locator methods, selector brittleness |

> Reference: Skill definitions at `.claude/skills/[skill-name]/SKILL.md`
> Reference: Skill evaluation criteria at `.claude/skills/best-practices-researcher/SKILL-EVALUATION.md`

### 5.6 Hooks Support (Unchanged)

- `context_injection_tier2.py` — Two-tier progressive injection on user prompts: confidence-gated retrieval with adaptive budgets for decisions, best practices, and session history (replaces `unified_keyword_trigger.py`, archived v2.0.6).
- `best_practices_retrieval.py` — On-demand deep search for review agents with more context.

---

## 6. SDK vs Hooks Architecture (DEC-031)

**CRITICAL**: SDK Wrappers and Hooks are orthogonal components. Neither can replace the other.

### 6.1 Architecture Distinction

| Component | Purpose | Execution Context | What It Captures |
|-----------|---------|-------------------|------------------|
| **Hooks** | Claude Code lifecycle event interception | Claude Code sessions (you working) | Everything Claude does |
| **SDK Wrappers** | Programmatic agent invocation | Python scripts (automation) | Only what SDK invokes |

### 6.2 When Each Is Used

- **Daytime (you working)**: YOU ←→ Claude Code → HOOKS capture everything automatically. SDK not involved.
- **Nighttime (automation)**: ORCHESTRATOR (Python) → SDK invokes agents programmatically. HOOKS not involved.

### 6.3 Why Hooks Cannot Be Deprecated

Per Section 3.1, these CAPTURE hooks are **REQUIRED**:

| Hook | Trigger | Why Required |
|------|---------|--------------|
| `user_prompt_capture.py` | UserPromptSubmit | Only way to capture user messages in Claude Code |
| `agent_response_capture.py` | Stop | Only way to capture agent responses in Claude Code |
| `post_tool_capture.py` | PostToolUse | Only way to capture code patterns from Edit/Write |
| `error_pattern_capture.py` | PostToolUse | Only way to capture error patterns from Bash |

**SDK cannot see these events** - it only sees what it invokes programmatically.

### 6.4 SDK Wrapper Purpose

SDK wrappers (`src/memory/`) enable:
- **Orchestrator automation**: Parzival calling agents overnight
- **Programmatic agent invocation**: Scripts running agents
- **Background processing**: Rate limiting, retry, batching

SDK wrappers are **complementary to hooks**, not replacements.

### 6.5 Hybrid Future (Both Active)

HOOKS (always active) + SDK (when orchestrator runs) → both write to QDRANT DATABASE (unified memory from both sources).

> Reference: DEC-031, Phase-5-SDK-vs-Hooks-Analysis.md

---

## 7. Conversation Memory System

**Purpose**: Capture turn-by-turn conversation to restore context after compaction.

### 7.1 Storage Components

| Component | Hook | Type | Collection |
|-----------|------|------|------------|
| User messages | UserPromptSubmit | `user_message` | discussions |
| Agent responses | Stop | `agent_response` | discussions |
| Session summary | PreCompact | `session` | discussions |

### 7.2 Injection Component (V2.1 Rich Summary Architecture)

**SessionStart Hook** (session_start.py) - On `resume` OR `compact` matcher:

**V2.1 Architecture**: Pre-compact stores rich summaries containing full conversation context.
Session start simply retrieves the summary - no need to query individual messages.

**Pre-Compact stores** (`type="session"`):
- `first_user_prompt`: First user prompt (task requirements/goals)
- `last_user_prompts`: Last 3-5 user prompts (recent context before compact)
- `last_agent_responses`: Last 2 agent responses (recent work/explanations)
- `content`: Structured summary (tools, files, key moments)

**Session Start retrieves**:
- Queries `discussions` WHERE `type="session"` AND `group_id=project`
- Sorts by timestamp (most recent first)
- Injects rich summary with embedded conversation context
- Total budget: ~4000 tokens (configurable via config.token_budget, per BP-039 Section 3)

**Why both resume AND compact?**
- `resume`: Restores context when resuming a session (even weeks later)
- `compact`: Restores context after context window compaction

**Why NOT startup/clear?**
- `startup`: **v2.2.0**: Removed from hook matcher. Cross-session bootstrap moved to `/aim-parzival-bootstrap` skill (agent-activated, not ambient). Sessions start clean.
- `clear`: User explicitly wants to start fresh

### 7.3 Multi-Terminal Isolation

Each `session_id` gets ONLY its own conversation history. No cross-terminal context pollution.

**MANDATORY TENANT FILTER RULE**:

ALL Qdrant queries MUST include `group_id` filter. **No exceptions.**

```python
# CORRECT - Always filter by tenant
results = client.search(
    collection_name="code-patterns",
    query_vector=embedding,
    query_filter=Filter(must=[
        FieldCondition(key="group_id", match=MatchValue(value=project_id))
    ]),
    limit=10,
)

# WRONG - Never query without tenant filter
results = client.search(collection_name="code-patterns", query_vector=embedding, limit=10)
```

Queries without tenant filter will:
1. Return cross-project data (data leak risk)
2. Search entire index (performance degradation)
3. Bypass `is_tenant` storage optimization

> Reference: MEMORY-SYSTEM-REDESIGN-v2.md Sections 10.1 - 10.8
> Reference: BP-038 Anti-Patterns

---

## 8. What V2.0 Does NOT Include

Per MEMORY-SYSTEM-REDESIGN-v2.md Section 9.3 (with V2.1 updates):

| NOT Automatic | Reason |
|---------------|--------|
| Every Edit/Write | Adds latency, often unnecessary |
| Session start (startup/clear) | `startup`: **v2.2.0**: Bootstrap moved to `/aim-parzival-bootstrap` skill. `clear`: User wants fresh start. |
| Every question | Most questions don't need memory |
| Read operations | Reading file provides context already |

**V2.1 Update**: Session start on `resume` and `compact` triggers context injection.
**V2.2.0 Update**: `startup` trigger removed from SessionStart hook. Cross-session bootstrap moved to `/aim-parzival-bootstrap` skill (agent-activated). See Section 15 / [Parzival-Pipeline-V2](./Parzival-Pipeline-V2.md).

**Principle**: Automatic triggers only when signal-to-noise ratio is high.

---

## 9. Performance Requirements

| Operation | Target | Reference |
|-----------|--------|-----------|
| Hook overhead | <500ms | NFR-P1 |
| Embedding generation (batch) | <2s | NFR-P2 |
| SessionStart context injection | <3s | NFR-P3 |
| Deduplication check | <100ms | NFR-P4 |
| Retrieval query response | <500ms | NFR-P5 |
| Real-time embedding | <500ms | NFR-P6 |

**NFR Clarifications**:
- **NFR-P2**: Applies to batch/background embedding operations (e.g., post-capture processing)
- **NFR-P6**: Applies to real-time retrieval path where embedding must complete before response

**Fork Pattern**: CAPTURE hooks use `subprocess.Popen` with `start_new_session=True` to return immediately (<50ms) while storage completes in background.

> Reference: MEMORY-SYSTEM-REDESIGN-v2.md Section 13

### 9.1 Scaling Strategy (Tiered Multi-Tenancy)

For projects that grow beyond typical size, Qdrant 1.16+ supports tiered multi-tenancy:

| Vector Count | Strategy | Action |
|--------------|----------|--------|
| <20,000 | Shared storage | Default payload-based partitioning |
| 20,000+ | Dedicated shard | Promote to custom shard for performance |
| 100,000+ | Dedicated collection | Consider collection-per-project |

**Promotion Trigger**:
```python
# Monitor via Qdrant metrics
vector_count = client.count(
    collection_name="code-patterns",
    count_filter=Filter(must=[
        FieldCondition(key="group_id", match=MatchValue(value=project_id))
    ]),
).count

if vector_count > 20000:
    # Alert: Consider promoting to dedicated shard
    log.warning(f"Project {project_id} at {vector_count} vectors - consider shard promotion")
```

**Shard Promotion** (when ready):
```python
# Create dedicated shard for large tenant
client.create_shard_key(
    collection_name="code-patterns",
    shard_key=f"project-{project_id}",
)

# Query with shard key selector
results = client.search(
    collection_name="code-patterns",
    query_vector=embedding,
    shard_key_selector={"shard_keys": [f"project-{project_id}"]},
    limit=10,
)
```

> Reference: BP-038 Section 6.3 (Tiered Multi-Tenancy)

---

## 10. Document References

### 10.1 Source of Truth Documents

| Document | Purpose |
|----------|---------|
| [Chunking-Strategy-V2.md](./Chunking-Strategy-V2.md) | **Authoritative chunking configurations** - AST, semantic, markdown, late chunking, smart truncation, anti-patterns |
| [Memory-System-Components-V1.md](./Memory-System-Components-V1.md) | **All required components** - Access, Processing, Storage layers |
| [Temporal-Awareness-V1.md](./Temporal-Awareness-V1.md) | **v2.0.6** Decay scoring + freshness detection |
| [GitHub-Integration-V1.md](./GitHub-Integration-V1.md) | **v2.0.6** GitHub client, sync engine, AST code chunking |
| [Security-Pipeline-V1.md](./Security-Pipeline-V1.md) | **v2.0.6** 3-layer scanning, graduated trust, SOPS encryption |
| [Embedding-Architecture-V1.md](./Embedding-Architecture-V1.md) | **v2.0.6** Dual embedding model routing (prose + code) |
| [Context-Injection-V2.md](./Context-Injection-V2.md) | **v2.0.6** Two-tier progressive context injection |
| [Intent-Skills-V1.md](./Intent-Skills-V1.md) | **v2.0.6** Intent-based routing, skills architecture |
| [Parzival-Pipeline-V1.md](./Parzival-Pipeline-V1.md) | **v2.0.6** Parzival session agent integration |

### 10.2 MEMORY-SYSTEM-REDESIGN-v2.md Sections

| Topic | Location |
|-------|----------|
| Collection definitions | Sections 4, 5, 6 |
| Type system | Section 7 |
| Search & intent detection | Section 8 |
| Automatic triggers | Section 9 |
| Conversation memory | Section 10 |
| User interface (skills) | Section 11 |
| Migration plan | Section 12 |
| Success metrics | Section 13 |
| Implementation phases | Section 15 |

### 10.3 Best Practices Applied

| BP-ID | Topic | Applied To |
|-------|-------|------------|
| BP-002 | Qdrant Best Practices | Collection design, multi-tenancy |
| BP-014 | Intelligent Chunking | Chunking-Strategy-V1.md |
| BP-015 | Collection Management | Intent detection, routing |
| BP-016 | Advanced Chunking | Tree-sitter, overlap optimization |
| BP-017 | Advanced Management | Deduplication, monitoring |
| BP-022 | Context Injection | SessionStart hook, token budgets |
| BP-026 | Hook Reliability | Graceful degradation patterns |
| BP-037 | Multi-Tenancy Patterns | group_id isolation, is_tenant config, mandatory filter |
| BP-038 | Qdrant Best Practices 2026 | HNSW config, payload indexing, quantization, scaling |

---

## 11. Temporal Awareness (v2.0.6)

Decay scoring fuses semantic similarity with exponential temporal decay. Freshness detection validates whether underlying source code has changed since a memory was stored.

- **Decay formula**: `final_score = (0.7 × similarity) + (0.3 × 0.5^(age/half_life))`
- **Half-life resolution**: type override → collection default → global 21 days
- **Collection defaults**: code-patterns 14d, discussions 21d, conventions 60d, jira-data 30d
- **Freshness**: Git-based file change detection marks code-pattern memories as stale when source files are modified

**Key distinction**: Decay = temporal relevance (time-based ranking). Freshness = content correctness (source-code-change validation). Both needed — a memory can be recent but stale, or old but fresh.

> **Full specification**: [Temporal-Awareness-V1.md](./Temporal-Awareness-V1.md)

---

## 12. GitHub Integration (v2.0.6)

GitHub data is ingested via REST API v3 and stored in the `discussions` collection with `source="github"` namespace isolation (AD-1). 9 document types: issues, issue comments, PRs, PR diffs, PR reviews, commits, code blobs, CI results, releases.

- **GitHubClient**: httpx AsyncClient with rate limiting, ETag caching, pagination
- **GitHubSyncEngine**: Per-type sync with 7 composer functions for content composition
- **CodeBlobSync**: AST-aware code chunking using Python stdlib ast (Python-first; non-Python → semantic chunking)
- **Deduplication**: SHA-256 content hash pre-check; unchanged content skips re-embedding
- **Versioning**: `is_current`/`supersedes` fields for point version tracking (BP-074)
- **Authority tier**: `authority_tier` field for conflict resolution when multiple sources describe the same entity (1=human, 2=agent, 3=automated, 4=historical). Higher-authority content outranks lower in dedup/merge decisions. See SPEC-005.

Module: `src/memory/connectors/github/` (client.py, sync.py, code_sync.py, schema.py, composer.py)

> **Full specification**: [GitHub-Integration-V1.md](./GitHub-Integration-V1.md)

---

## 13. Security Pipeline (v2.0.6)

All content entering the system passes through a 3-layer security scanner between capture and chunking (pipeline steps 3–4). Content is PASSED, MASKED (PII replaced), or BLOCKED (secrets discarded).

```
Layer 1: Regex Pattern Matching (~1ms)     — PII patterns + known secret formats
Layer 2: detect-secrets Entropy (~10ms)    — High-entropy string detection
Layer 3: SpaCy NER (~50-100ms)             — Named entity recognition for PII
```

- **Graduated trust**: source-type-aware scanning strictness (strict/relaxed/off per `source_type`). See [Security-Pipeline-V1](./Security-Pipeline-V1.md)
- **Secrets at rest**: Tiered encryption — SOPS+age (preferred) / keyring / .env fallback
- **Pipeline diagram**: See Section 3.4 (steps 3–4: DETECT → SCAN)

> **Full specification**: [Security-Pipeline-V1.md](./Security-Pipeline-V1.md)

---

## 14. Embedding Architecture (v2.0.6)

Dual Jina v2 embedding models routed by content type. Both produce 768-dim vectors — no collection schema changes required.

| Property | Prose Model | Code Model |
|----------|-------------|------------|
| **Name** | jina-embeddings-v2-base-en | jina-embeddings-v2-base-code |
| **Parameters** | 137M | 161M |
| **Use case** | Natural language, docs, conversations | Source code, code patterns |
| **Improvement** | Baseline | +10-30% on code retrieval (BP-065) |

Routing logic in `storage.py:_get_embedding_model()`: code-patterns and github_code_blob → code model; everything else → prose model.

> **Full specification**: [Embedding-Architecture-V1.md](./Embedding-Architecture-V1.md)

---

## 15. Progressive Context Injection (v2.0.6, updated v2.2.0)

Two-tier injection model replacing the simple session restore from Section 7.2.

- **Tier 1 — Bootstrap**: **v2.2.0**: Cross-session bootstrap moved from SessionStart hook (`startup` trigger) to **agent-activated skill** (`/aim-parzival-bootstrap`). Sessions start clean — no ambient injection. Bootstrap loads only when user activates Parzival.
  - **Non-Parzival path**: REMOVED in v2.2.0. Non-Parzival sessions have no startup bootstrap (ambient injection was noise — conventions/decisions competing with user intent).
  - **Parzival path (v2.2.0)**: Layered priority bootstrap via `/aim-parzival-bootstrap` skill using **deterministic + semantic hybrid** retrieval. See Section 17 and [Parzival-Pipeline-V2.md](./Parzival-Pipeline-V2.md) Section 5.
- **Tier 2 — Adaptive** (every UserPromptSubmit): 500-1500 tokens per turn with confidence gating (>= 0.6), collection routing, adaptive budget, and greedy fill with dedup.
- **Session restore** (resume/compact):
  - **Non-Parzival**: Unchanged — rich summaries from pre-compact (Section 7.2).
  - **Parzival (v2.0.9+)**: Deterministic-only retrieval — session summaries (3) + decisions (5) via `get_recent()`. No conventions or code-patterns injected. **v2.2.0**: Constraint re-injection added — global constraints from `_ai-memory/pov/constraints/` appended to compact output to prevent behavioral drift.

**v2.0.9 Key Change — Deterministic Retrieval**: `MemorySearch.get_recent()` uses Qdrant `scroll()` with `order_by={"key": "timestamp", "direction": "desc"}` for "most recent N" queries. No embedding needed — eliminates noise from query string / semantic similarity mismatches. Used alongside `search()` for relevance-ranked queries.

**v2.2.0 Key Change — Agent-Activated Bootstrap**: The `startup` trigger is removed from the SessionStart hook matcher. Cross-session memory is loaded via `/aim-parzival-bootstrap` skill when Parzival is activated by the user. Constraint re-injection via `/aim-parzival-constraints` skill on activation and post-compact. See [Parzival-Pipeline-V2.md](./Parzival-Pipeline-V2.md).

> **Full specification**: [Context-Injection-V2.md](./Context-Injection-V2.md)
> **Parzival-specific**: [Parzival-Pipeline-V2.md](./Parzival-Pipeline-V2.md) Sections 5, 6

---

## 16. Intent & Skills (v2.0.6)

Intent-based routing classifies user queries into semantic categories (HOW → code-patterns, WHAT → conventions, WHY → discussions) for targeted retrieval. Priority: WHY > WHAT > HOW > UNKNOWN.

**New skills in v2.0.6**: Memory settings display, memory status dashboard, Jira search, manual save, best practices researcher (auto-trigger on keywords).

**Detection source**: `src/memory/intent.py` — keyword-based classification with collection routing.

> **Full specification**: [Intent-Skills-V1.md](./Intent-Skills-V1.md)

---

## 17. Parzival Session Pipeline (v2.0.6, updated v2.2.0)

Parzival is an optional first-class session agent inside ai-memory. **v2.2.0**: Cross-session bootstrap moves from SessionStart hook to **agent-activated skill** (`/aim-parzival-bootstrap`). Sessions start clean. Parzival v2 uses Progressive Context Building (PCB) — a step-file architecture with 22 workflows and 122 step files.

- **Session start (v2.2.0)**: Agent-activated via `/aim-parzival-bootstrap` skill. Layered priority bootstrap — 4 layers in fixed order:
  - L1 [DETERMINISTIC]: Last handoff (1) via `get_recent()` — always present, zero noise
  - L2 [DETERMINISTIC]: Recent decisions (5) via `get_recent()` — latest by timestamp
  - L3 [SEMANTIC]: Recent insights (3) via `search()` with decay — relevance-ranked
  - L4 [SEMANTIC]: GitHub enrichment (10) via `search()` — activity since last session
  - **Conventions removed** from Parzival path (was primary noise source)
- **Constraint loading (v2.2.0)**: `/aim-parzival-constraints` skill loads behavioral constraints from `_ai-memory/pov/constraints/`. Invoked on activation AND re-injected post-compact.
- **Post-compact (v2.0.9+)**: Deterministic-only — session summaries (3) + decisions (5) via `get_recent()`. **v2.2.0**: Constraint re-injection added to prevent behavioral drift.
- **Mid-session**: `/parzival-save-insight` stores agent insights (`type=agent_insight`) to discussions collection
- **Closeout (v2.2.0)**: Step-file governed. Dual-write handoff to files (primary, step-03) AND Qdrant via `/parzival-save-handoff` (secondary, step-04). Task state via `/parzival-save-insight`.
- **Cross-session**: Handoff documents + Qdrant queries enable PM knowledge to persist across sessions
- **Non-Parzival path**: Sessions start clean with no bootstrap. Resume/compact provides conversation restore only.

> **Full specification**: [Parzival-Pipeline-V2.md](./Parzival-Pipeline-V2.md)

---

## 18. Triple Fusion Hybrid Search (v2.2.1)

### Architecture
Three complementary search modalities combined via Qdrant's native Reciprocal Rank Fusion (RRF):

| Layer | Model | Vector Type | What It Catches |
|-------|-------|-------------|-----------------|
| Dense | Jina v2 EN/Code (768d) | Default unnamed | Semantic meaning, paraphrases |
| Sparse | Qdrant/bm25 (FastEmbed) | Named "bm25" | Exact keywords, identifiers, IDF-weighted terms |
| Late Interaction | ColBERT v2 (opt-in) | Named "colbert" | Token-level alignment for reranking |

### 4-Path Search Composition
1. **PATH 1** (best quality): `[dense→decay, sparse] → RRF` — temporal decay applied to dense prefetch before RRF fusion with BM25 sparse
2. **PATH 2** (hybrid only): `[dense, sparse] → RRF` — no decay scoring
3. **PATH 3** (decay only): Dense with decay formula reranking — fallback when hybrid fails or disabled
4. **PATH 4** (plain dense): Simple cosine similarity — ultimate fallback

### Critical Design Decision (DEC-062)
RRF fusion scores are reciprocal rank values (~0.01-0.05), NOT cosine similarity (0-1). The decay formula MUST be applied BEFORE RRF fusion (to the dense prefetch results), never after. Applying decay to RRF output would zero out semantics.

### Configuration
- `HYBRID_SEARCH_ENABLED=true` (default) — enables PATH 1/2
- `COLBERT_RERANKING_ENABLED=false` (default) — ColBERT is opt-in
- `INJECTION_SCORE_GAP_THRESHOLD=0.7` — configurable score gap for injection filtering

### Storage
All 7 storage paths generate BM25 sparse vectors alongside dense vectors:
- MemoryStorage.store_memory() + store_memories_batch()
- 5 hook scripts: user_prompt, agent_response, pre_compact, manual_save, error_store

### Migration
`scripts/migrate_v221_hybrid_vectors.py` — batch-generates BM25 sparse vectors for existing points. Resumable with progress tracking.

---

**Document Version**: 3.5
**Last Updated**: 2026-03-08
**Changes**:
- V3.5: **v2.2.1 Triple Fusion Hybrid Search**. Added Section 18: Triple Fusion Hybrid Search architecture — dense + BM25 sparse + ColBERT late interaction via RRF fusion, 4-path search composition, DEC-062 (decay before RRF), configuration, 7 storage paths with BM25, migration script.
- V3.4: **v2.2.0 Agent-Activated Bootstrap**. Updated Section 3.2: `session_start.py` matcher changed from `startup|resume|compact` to `resume|compact`. Updated Section 7.2: `startup` trigger removed, cross-session bootstrap moved to `/aim-parzival-bootstrap` skill. Updated Section 8: removed startup bootstrap reference. Updated Section 15: Tier 1 bootstrap is now agent-activated (non-Parzival path removed), constraint re-injection added to compact path. Updated Section 17: Parzival pipeline V2.0 with PCB architecture, step-file governed closeout, constraint loading. References updated to Parzival-Pipeline-V2.md. PLAN-011.
- V3.3: **Langfuse Integration Spec**. Rewrote Section 3.7 to reference `LANGFUSE-INTEGRATION-SPEC.md` as authoritative spec. Enforces V3 SDK only (V2 FORBIDDEN). Documents dual integration architecture (Path A: trace buffer, Path B: direct SDK), OTel attribute names, session_id propagation, flush/shutdown lifecycle, and anti-patterns. Created by Parzival PM #145 after 13 Langfuse regressions.
- V3.2: **Langfuse Trace Visibility Requirement**. Added Section 3.7 (Langfuse Trace Content Visibility): `TRACE_CONTENT_MAX=10000` requirement for all `emit_trace_event()` calls, prohibition of hardcoded character limits, consistency requirement across all files. Documents BUG-204 regression and fix (PM #141).
- V3.1: **v2.0.9 Parzival Injection Fix**. Updated Section 15 (Progressive Context Injection): added deterministic+semantic hybrid retrieval for Parzival bootstrap and compact paths, `get_recent()` method using Qdrant `scroll()` with `order_by`. Updated Section 17 (Parzival Session Pipeline): replaced flat-pool description with layered priority architecture (4 layers, conventions removed from Parzival path, non-Parzival unchanged). Cross-references to Parzival-Pipeline-V1.1.
- V3.0: Major update for v2.0.6. Added Sections 11–17 (Temporal Awareness, GitHub Integration, Security Pipeline, Embedding Architecture, Progressive Context Injection, Intent & Skills, Parzival Pipeline). Updated Section 2: added GitHub namespace types (9 new MemoryTypes), content-hash dedup, 4 new payload indexes (source, is_current, authority_tier, freshness_status). Updated Section 3.4: pipeline expanded from 7 to 9 steps (added DETECT + SCAN before CHUNK, dual embedding routing). Added Sections 3.5 (Config Framework) and 3.6 (Audit Directory). Updated Section 3.2: session_start.py now handles startup|resume|compact. Updated Section 8: startup now gets Tier 1 bootstrap injection.
- V2.10: Added Jira Data Collection (Section 2.1), sync pipeline, Jira-specific metadata.
- V2.9: Added Section 3.4 Memory Processing Pipeline (7-step pipeline, store-first architecture).
- V2.4–V2.8: Trigger refinements, payload indexes (BP-038), scaling strategy, rich summaries, skill architecture.
