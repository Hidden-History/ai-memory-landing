# LANGFUSE-INTEGRATION-SPEC.md

**Version**: 1.2
**Status**: AUTHORITATIVE — All Langfuse code MUST comply
**Created**: 2026-03-03 (PM #145)
**Updated**: 2026-03-08 (PLAN-014, PM #170)
**Author**: Parzival (verified against Langfuse docs MCP 2026-03-03)
**Langfuse SDK**: Python v3 (OTel-based, `langfuse>=3.0,<4.0`)
**Source**: https://langfuse.com/docs/observability/sdk/instrumentation

---

## 1. Purpose

This spec is the **single source of truth** for all Langfuse integration in the AI Memory Module. Every script, hook, service, and agent modification that touches Langfuse code MUST follow this spec exactly.

**Why this exists**: Langfuse integration has been broken 13+ times across 10 sessions because agents default to V2 SDK patterns. The Langfuse Python SDK V3 (released May 2025) is OTel-based and NOT fully backward compatible with V2. Agents do not know V3 exists unless explicitly told.

---

## 2. CRITICAL: V3 SDK Only — V2 Is FORBIDDEN

### 2.1 V3 Imports (REQUIRED)

```python
# CORRECT — V3 imports
from langfuse import get_client, observe, propagate_attributes
```

### 2.2 V2 Imports (FORBIDDEN)

```python
# WRONG — V2 imports — DO NOT USE
from langfuse.decorators import langfuse_context       # WRONG: removed in V3
from langfuse.decorators import observe                # WRONG: moved to langfuse
```

> **Note (Updated PLAN-014, DEC-068)**: `from langfuse import Langfuse` is NOT forbidden — the
> `Langfuse()` constructor is valid V3 (returns a singleton). See §2.3 for usage guidance.
> `get_client()` remains the preferred import. Only the V2 _usage patterns_ (e.g.,
> `Langfuse(public_key=..., secret_key=..., host=...)`) are discouraged.

### 2.3 Client Initialization

```python
# PREFERRED — V3 singleton (reads env vars automatically)
from langfuse import get_client
langfuse = get_client()

# VALID but not preferred — V3 singleton via constructor (no explicit credentials)
from langfuse import Langfuse
langfuse = Langfuse()                           # OK: returns singleton, reads env vars
langfuse = Langfuse(project_name="my-project")  # OK: sets project context on singleton

# DISCOURAGED — bypasses env config, breaks singleton pattern
from langfuse import Langfuse
client = Langfuse(public_key="...", secret_key="...", host="...")  # DISCOURAGED
```

**Clarification (Updated PLAN-014, DEC-068)**: The `Langfuse()` constructor IS valid V3 SDK.
When called without explicit credentials, it returns a singleton that reads env vars — functionally
equivalent to `get_client()`. However, `get_client()` remains the **PREFERRED** method in this
project for consistency and clarity. `Langfuse(host=..., public_key=..., secret_key=...)` with
explicit credentials is **DISCOURAGED** because it bypasses env-based configuration and can
create multiple client instances. All existing code uses `get_client()` (migrated PM #145,
`dc1335e`) and new code SHOULD continue using `get_client()` unless there is a specific reason
to use the constructor form.

### 2.4 Creating Observations

```python
# CORRECT — V3 context manager (auto-closes, sets OTel context)
from langfuse import get_client
langfuse = get_client()

with langfuse.start_as_current_observation(
    as_type="span",           # "span" or "generation"
    name="my-operation",      # REQUIRED in V3
    input={"query": "..."},
) as span:
    # ... do work ...
    span.update(output={"result": "..."})

# CORRECT — V3 convenience wrappers (Added PLAN-014, PM #170)
# start_as_current_span() — shorthand for start_as_current_observation(as_type="span")
with langfuse.start_as_current_span(name="my-span") as span:
    # Equivalent to: start_as_current_observation(as_type="span", name="my-span")
    span.update(output={"result": "..."})

# start_as_current_generation() — shorthand for start_as_current_observation(as_type="generation")
# Use for model calls with token usage tracking
with langfuse.start_as_current_generation(
    name="llm-call",
    input={"prompt": "..."},
    model="claude-3-sonnet",
) as generation:
    # Equivalent to: start_as_current_observation(as_type="generation", name="llm-call", ...)
    generation.update(
        output="model response",
        usage_details={"input_tokens": 100, "output_tokens": 50},
    )

# CORRECT — V3 manual observation (for parallel/background work)
span = langfuse.start_observation(name="side-task", as_type="span")
span.update(input="data")
span.end()  # MUST call .end() manually

# WRONG — V2 methods — DO NOT USE
client.trace()                          # WRONG: removed in V3
client.span()                           # WRONG: removed in V3
client.generation()                     # WRONG: removed in V3
client.start_span(name="...")           # WRONG: V2 SDK method
client.start_generation(name="...")     # WRONG: V2 SDK method
```

> **Convenience Methods Summary (Added PLAN-014, PM #170)**:
> | Method | Equivalent To |
> |--------|---------------|
> | `start_as_current_span(name="...")` | `start_as_current_observation(as_type="span", name="...")` |
> | `start_as_current_generation(name="...")` | `start_as_current_observation(as_type="generation", name="...")` |
>
> Both convenience methods accept the same keyword arguments as `start_as_current_observation()`
> (e.g., `input`, `output`, `metadata`, `model`, `trace_context`). They simply pre-fill `as_type`.
> Existing code using `start_as_current_observation()` does NOT need to be migrated — both forms
> are equally valid.

### 2.5 Setting Session ID and User ID

```python
# CORRECT — V3: use propagate_attributes()
from langfuse import get_client, propagate_attributes
langfuse = get_client()

with langfuse.start_as_current_observation(as_type="span", name="pipeline"):
    with propagate_attributes(
        session_id="session_abc",
        user_id="user_123",
        metadata={"source": "hook"},
        trace_name="my-pipeline",
    ):
        # All nested observations inherit session_id, user_id, metadata
        with langfuse.start_as_current_observation(as_type="generation", name="llm-call"):
            pass

# CORRECT — V3: update trace directly on an observation
span.update_trace(
    session_id="session_abc",
    name="claude_code_session",
    metadata={"project_id": "my-project"},
    tags=["session_trace", "tier1"],
)

# ALSO CORRECT — V3: update current trace without a reference
langfuse.update_current_trace(user_id="user_123", session_id="session_abc")

# WRONG — V2 patterns — DO NOT USE
langfuse_context.update_current_trace(user_id="...")  # WRONG: V2
```

#### 2.5.1 propagate_attributes() — Detailed Reference (Added PLAN-014, PM #170)

`propagate_attributes()` is the V3 mechanism for propagating trace context (session ID, user ID,
metadata, tags) across observation hierarchies. It is a context manager that sets OTel context
attributes inherited by all observations created within its scope.

```python
from langfuse import propagate_attributes

# Full signature with all supported parameters
with propagate_attributes(
    session_id="session_abc",       # Links all nested observations to this session
    user_id="user_123",             # Associates all nested observations with this user
    trace_name="my-pipeline",       # Sets the trace name for root observations
    metadata={"source": "hook"},    # Merged into metadata of nested observations
    tags=["production", "v2"],      # Added to trace tags
):
    # Everything created in this block inherits the above attributes
    pass
```

**Key behaviors**:
- `propagate_attributes()` is **nestable** — inner calls override outer values for the same key
- It works across function boundaries — any observation created in the call stack within the
  context manager inherits the propagated attributes
- It is the **recommended way** for Docker services (Path B) to set `session_id` and `user_id`
  because it avoids having to pass IDs to every `start_as_current_observation()` call
- In hooks (Path A), session/user IDs are passed via `emit_trace_event()` parameters instead

**Common usage patterns in this project**:
- **Stop hook**: `propagate_attributes(session_id=session_id, user_id="claude_code_user")` — see §7.1
- **GitHub sync**: `propagate_attributes(session_id="github_sync", user_id="system")` — see §7.3
- **Any Path B service**: Wrap the main work loop in `propagate_attributes()` to ensure all
  observations within that service cycle are correctly linked

### 2.6 Updating Observations

```python
# CORRECT — V3: .update() on observation object
span.update(
    input={"query": "..."},
    output={"answer": "..."},
    metadata={"step": 1},
)

# CORRECT — V3: update current span without reference
langfuse.update_current_span(metadata={"step1_complete": True})

# CORRECT — V3: update current generation
langfuse.update_current_generation(
    output="response text",
    usage_details={"input_tokens": 100, "output_tokens": 50},
)
```

### 2.7 Trace IDs

```python
# CORRECT — V3: deterministic trace ID from seed
from langfuse import get_client
langfuse = get_client()
trace_id = langfuse.create_trace_id(seed="external-request-123")

# CORRECT — V3: get current trace/observation IDs
trace_id = langfuse.get_current_trace_id()
obs_id = langfuse.get_current_observation_id()

# V3 trace ID format: 32-character lowercase hex (W3C standard)
# Example: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4"
```

### 2.8 Lifecycle (flush/shutdown)

```python
# CORRECT — V3: flush in short-lived processes (hooks, scripts, workers)
langfuse = get_client()
# ... create observations ...
langfuse.flush()  # Blocks until all buffered data is sent

# CORRECT — V3: shutdown in long-lived processes (daemons, services)
langfuse.shutdown()  # Flushes + stops background threads

# RULE: Every process that creates Langfuse observations MUST call
# flush() before exit (short-lived) or shutdown() on SIGTERM (long-lived).
# The SDK registers an atexit hook, but it's NOT reliable in all environments.
```

### 2.9 Evaluation Class (Added PLAN-014, PM #170)

The `Evaluation` class is used for returning structured evaluation results from Langfuse
experiment evaluators. This is documented here for future use by the evaluator engine (TD-263).

```python
from langfuse import Evaluation

# Return from an evaluator function to score experiment runs
def my_evaluator(output, expected_output, **kwargs) -> Evaluation:
    """Evaluator function for Langfuse experiments.

    Args:
        output: The actual output from the experiment run
        expected_output: The expected/reference output from the dataset item
        **kwargs: Additional context (input, metadata, etc.)

    Returns:
        Evaluation with score name, numeric value, and optional comment
    """
    score = 1.0 if output == expected_output else 0.0
    return Evaluation(
        name="exact_match",       # Score name (appears in Langfuse UI)
        value=score,              # Numeric score (0.0 to 1.0 recommended)
        comment="Exact string match evaluation",  # Optional explanation
    )
```

**Key points**:
- `Evaluation` is a dataclass with fields: `name` (str), `value` (float), `comment` (str, optional)
- Evaluator functions are passed to `langfuse.experiments.run()` via the `evaluators` parameter
- Multiple evaluators can be used per experiment (each returns its own `Evaluation`)
- This is for **future use** — the evaluator engine (TD-263) will implement experiment-based
  quality scoring for memory retrieval and injection accuracy

---

## 3. Architecture: Dual Integration Approach

The AI Memory Module uses TWO valid Langfuse integration paths. Both are correct
for their use case. Never mix them in the same component.

### 3.1 Path A: Trace Buffer (Hook Scripts)

```
Hook Script → emit_trace_event() → JSON file on disk
    ↓
trace_flush_worker (daemon) → reads JSON → creates OTel spans → Langfuse
```

**Used by**: All 17 hook scripts in `.claude/hooks/scripts/`
**Why**: Hooks must complete in <50ms (capture) or <500ms (post-tool). Direct SDK
calls add 50-200ms latency. Fire-and-forget disk writes add ~5-10ms.

**Rules for Path A**:
- Import `from memory.trace_buffer import emit_trace_event`
- Graceful fallback: `emit_trace_event = None` on ImportError
- Always wrap in `try/except: pass` — NEVER crash a hook for tracing
- Use `TRACE_CONTENT_MAX = 10000` for all input/output truncation
- Pass `session_id` explicitly (from hook input or `CLAUDE_SESSION_ID` env var)
- Pass `trace_id` explicitly (generated in capture hook, propagated via env var)

### 3.2 Path B: Direct SDK (Services, Stop Hook)

```
Service Code → get_client() → Langfuse SDK → OTel → Langfuse
```

**Used by**: `langfuse_stop_hook.py`, `github/sync.py`, `github/code_sync.py`
**Why**: Long-running services can afford SDK latency and benefit from automatic
context propagation, `@observe()` decorator, and `propagate_attributes()`.

**Rules for Path B**:
- Use `from langfuse import get_client, observe, propagate_attributes`
- ALWAYS call `flush()` after completing a unit of work
- ALWAYS call `shutdown()` on graceful termination
- Use `propagate_attributes(session_id=..., user_id=...)` for session linking
- Use `@observe()` decorator for automatic span creation
- For async code: prefer `start_observation()` + `.end()` over context managers
  (known V3 bug: context propagation can break in async `@observe`)

### 3.3 Path Selection Rules

| Component Type | Path | Reason |
|---------------|------|--------|
| Capture hooks (UserPrompt, AgentResponse, Error, PostTool) | A | <50ms/<500ms SLA |
| Store hooks (*_store_async.py) | A | Background process, no SDK available |
| Context injection (Tier 2) | A | <50ms SLA |
| Stop hook (langfuse_stop_hook.py) | B | Runs at session end, no SLA |
| GitHub sync (sync.py, code_sync.py) | B | Long-running Docker service |
| Jira sync (jira/sync.py) | A | Uses emit_trace_event already |
| Classification worker | A | Uses emit_trace_event for 9_classify |
| Trace flush worker | Neither | IS the flush mechanism itself |
| Best practices retrieval | A | <50ms SLA |
| Session start | A | <50ms SLA |
| Decay engine (decay.py) | A | Uses emit_trace_event for decay traces |
| Freshness engine (freshness.py) | A | Uses emit_trace_event for freshness traces |
| Search module (search.py) | A | Uses emit_trace_event for search query traces |
| Context injection (injection.py) | A | Uses emit_trace_event for injection traces |
| Classifier providers (claude/openai/ollama/openrouter.py) | A (upstream) | Data capture via langfuse_generation wrapper |
| Metrics push (metrics_push.py) | Neither | Prometheus only, no Langfuse calls |

---

## 4. Trace Buffer API Reference (Path A)

### 4.1 emit_trace_event() Signature

```python
from memory.trace_buffer import emit_trace_event

emit_trace_event(
    event_type: str,           # Span name: "1_capture", "2_log", "5_chunk", "7_store", "9_classify"
    data: dict,                # {input, output, metadata, model?, usage?}
    trace_id: str | None,      # Pipeline trace ID (shared across all spans in pipeline)
    span_id: str | None,       # This span's unique ID (auto-generated if None)
    parent_span_id: str | None | _UNSET,  # Parent span ID for nesting
    session_id: str | None,    # Claude session ID (REQUIRED for Langfuse session linking)
    project_id: str | None,    # AI Memory project ID
    start_time: datetime | None,  # Span start (capture BEFORE work)
    end_time: datetime | None,    # Span end (capture AFTER work)
    as_type: str | None,       # "generation" for LLM calls, None for spans
) -> bool
```

### 4.2 Required Data Fields

```python
data = {
    "input": content[:TRACE_CONTENT_MAX],     # REQUIRED: what went in
    "output": result[:TRACE_CONTENT_MAX],     # REQUIRED: what came out
    "metadata": {                              # REQUIRED: context
        "hook_type": "user_prompt",
        "source": "stdin",
        "content_length": len(content),
    },
    # For generation type only:
    "model": "llama3.2:3b",                   # Model name
    "usage": {"input": 100, "output": 50},    # Token counts
}
```

### 4.3 TRACE_CONTENT_MAX Constant

```python
TRACE_CONTENT_MAX = 10000  # Max chars for Langfuse input/output fields
```

**Rules**:
- MUST be defined as a module-level constant in every file that emits traces
- MUST be exactly `10000` — no other value
- MUST be applied to ALL input/output strings before passing to emit_trace_event
- NEVER use hardcoded numbers like `[:300]`, `[:500]`, `[:2000]` for trace content
- The value `10000` is large enough for meaningful visibility, small enough to avoid
  Langfuse/ClickHouse payload bloat

---

## 5. OTel Attribute Reference (trace_flush_worker.py)

The trace flush worker creates raw OTel spans. These attribute names are what
Langfuse's OTel SpanProcessor recognizes. NEVER change these names.

### 5.1 Observation-Level Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `langfuse.observation.input` | string (JSON) | Observation input |
| `langfuse.observation.output` | string (JSON) | Observation output |
| `langfuse.observation.metadata` | string (JSON) | Observation metadata |
| `langfuse.observation.type` | string | "generation" for LLM calls |
| `langfuse.observation.model.name` | string | Model name (generations only) |
| `langfuse.observation.usage_details` | string (JSON) | Token usage (generations only) |

### 5.2 Trace-Level Attributes (Root Spans Only)

| Attribute | Type | Description |
|-----------|------|-------------|
| `langfuse.trace.name` | string | Trace name in Langfuse UI |
| `langfuse.trace.input` | string (JSON) | Trace-level input |
| `langfuse.trace.output` | string (JSON) | Trace-level output |
| `langfuse.trace.metadata` | string (JSON) | Trace-level metadata |
| `session.id` | string | Session ID (**NOT** `langfuse.trace.session_id`) |
| `user.id` | string | User ID (**NOT** `langfuse.trace.user_id`) |

**CRITICAL**: `session.id` and `user.id` use SHORT names, not the `langfuse.trace.*` prefix.
This was learned in PM #126 (BUG-180) and verified in Langfuse SDK source:
`langfuse/_client/attributes.py` → `LangfuseOtelSpanAttributes`.

### 5.3 Root Span Detection

A span is treated as "root" (and gets trace-level attributes) when:
- `event_type == "1_capture"` (first pipeline step), OR
- `parent_span_id is None` (no parent)

---

## 6. Session ID Propagation

Session linking is critical for correlating hook pipeline traces with session-level
traces in the Langfuse UI.

### 6.1 Propagation Chain

```
Claude Code session
    │
    ├─ settings.json: "CLAUDE_SESSION_ID" env var
    │
    ├─ Capture hook (e.g., user_prompt_capture.py)
    │   ├─ Reads: hook_input["session_id"]
    │   ├─ Sets: os.environ["CLAUDE_SESSION_ID"] = session_id  (for library calls)
    │   ├─ Passes: emit_trace_event(..., session_id=session_id)
    │   └─ Propagates to subprocess:
    │       subprocess_env["CLAUDE_SESSION_ID"] = session_id
    │       subprocess_env["LANGFUSE_TRACE_ID"] = trace_id
    │
    ├─ Store hook (e.g., store_async.py, user_prompt_store_async.py)
    │   ├─ Reads: os.environ.get("LANGFUSE_TRACE_ID")
    │   ├─ Reads: os.environ.get("CLAUDE_SESSION_ID")  (fallback for session_id)
    │   └─ Passes: emit_trace_event(..., session_id=session_id)
    │
    └─ Stop hook (langfuse_stop_hook.py)
        ├─ Reads: stdin_payload["session_id"]
        ├─ Creates session-level trace with session_id
        └─ Calls: root_span.update_trace(session_id=session_id)
```

### 6.2 Rules

1. **Capture hooks**: Set `os.environ["CLAUDE_SESSION_ID"]` early in `main()`
2. **Subprocess spawning**: ALWAYS copy session_id to subprocess env
3. **Store hooks**: Read session_id from env var as fallback
4. **emit_trace_event()**: ALWAYS pass `session_id` explicitly — never rely on env alone
5. **Services** (github-sync, jira-sync): Use a static session_id (e.g., `"github_sync"`, `"jira_sync"`)

---

## 7. Component-Specific Requirements

### 7.1 langfuse_stop_hook.py (Tier 1 Session Traces)

**Current status**: MIGRATED to V3 (PM #145, commit `dc1335e`). Uses `get_client()`, `start_as_current_observation()`, `propagate_attributes()`. Verified V3-compliant PM #146 (`77e9f97`).

**V3 implementation pattern**:

```python
from langfuse import get_client, propagate_attributes

langfuse = get_client()

# Create root observation for the session
with langfuse.start_as_current_observation(
    as_type="span",
    name="claude_code_session",
    input=first_user_text[:LANGFUSE_PAYLOAD_MAX_CHARS],
    output=last_assistant_text[:LANGFUSE_PAYLOAD_MAX_CHARS],
    trace_context={"trace_id": deterministic_trace_id},  # For dedup
) as root_span:
    # Set session and trace attributes
    with propagate_attributes(
        session_id=session_id,
        user_id="claude_code_user",
    ):
        root_span.update_trace(
            name="claude_code_session",
            metadata={**trace_metadata, "turn_count": len(turns)},
            tags=["session_trace", "tier1"],
        )

        # Create child spans for each turn
        for i, turn in enumerate(turns, 1):
            with langfuse.start_as_current_observation(
                as_type="span",
                name=f"turn_{i}",
                input=turn_input[:LANGFUSE_PAYLOAD_MAX_CHARS],
            ) as turn_span:
                turn_span.update(
                    output=turn_output[:LANGFUSE_PAYLOAD_MAX_CHARS],
                    metadata=token_meta,
                )

# MUST flush before exit
langfuse.flush()
```

**Key requirements**:
- Deterministic trace ID via `langfuse.create_trace_id(seed=f"langfuse-session:{session_id}")`
- Session ID via `propagate_attributes(session_id=...)`
- User ID via `propagate_attributes(user_id="claude_code_user")`
- `LANGFUSE_PAYLOAD_MAX_CHARS = 10000` (same as `TRACE_CONTENT_MAX`)
- `flush()` with SIGALRM timeout guard
- Dual-format transcript parser (V2.x + legacy)

### 7.2 langfuse_config.py (Client Factory)

**Current status**: MIGRATED to V3 (PM #145, commit `dc1335e`). Uses `get_client()` singleton. No `Langfuse()` constructor.

**V3 implementation pattern**:

```python
"""Langfuse client configuration — V3 SDK.

SPEC: LANGFUSE-INTEGRATION-SPEC.md Section 7.2
LANGFUSE SDK: V3 ONLY. Do NOT use Langfuse() constructor.
"""

import logging
import os

logger = logging.getLogger(__name__)


def get_langfuse_client():
    """Get Langfuse client singleton via V3 get_client().

    Returns None if Langfuse is disabled or not configured.
    Reads credentials from environment variables:
      LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY, LANGFUSE_BASE_URL
    """
    enabled = os.environ.get("LANGFUSE_ENABLED", "false").lower() == "true"
    os.environ["LANGFUSE_TRACING_ENABLED"] = "true" if enabled else "false"
    if not enabled:
        return None

    public_key = os.environ.get("LANGFUSE_PUBLIC_KEY", "")
    secret_key = os.environ.get("LANGFUSE_SECRET_KEY", "")
    if not public_key or not secret_key:
        logger.warning("Langfuse enabled but API keys not configured")
        return None

    try:
        from langfuse import get_client
        client = get_client()
        return client
    except ImportError:
        logger.warning("langfuse package not installed")
        return None
    except Exception as e:
        logger.error("Failed to get Langfuse client: %s", e)
        return None
```

**Note**: `get_client()` is a singleton — calling it multiple times returns the same instance.
It reads `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_BASE_URL` from env vars.

### 7.3 GitHub Sync (sync.py, code_sync.py)

**Current status**: Uses `@observe()` decorator (correct) but no `propagate_attributes()`.

**Requirements**:
- Keep `@observe()` decorator on sync methods (auto-creates spans)
- Add `propagate_attributes(session_id="github_sync", user_id="system")` wrapper
- Add `get_client().flush()` after each sync cycle completes
- Add `get_client().shutdown()` on graceful termination
- Fallback no-op `observe` decorator is correct — keep it

**V3 pattern for sync methods**:

```python
from langfuse import get_client, observe, propagate_attributes

@observe(name="github-full-sync")
async def full_sync(self):
    langfuse = get_client()
    with propagate_attributes(
        session_id="github_sync",
        user_id="system",
        metadata={"sync_type": "full"},
    ):
        # ... sync logic ...
        pass

    langfuse.flush()  # Ensure traces are sent
```

### 7.4 Jira Sync (jira/sync.py)

**Current status**: Uses `emit_trace_event()` (Path A) but missing `session_id`.

**Fix**: Add `session_id="jira_sync"` to ALL `emit_trace_event()` calls.

```python
emit_trace_event(
    event_type="jira_sync",
    data={...},
    session_id="jira_sync",       # ADD THIS
    start_time=trace_start_time,
)
```

### 7.5 Classification Worker

**Current status**: CORRECT. Uses `emit_trace_event()` with `as_type="generation"`,
passes `session_id` and `trace_id` from `ClassificationTask`.

**No changes needed.** Keep current implementation.

### 7.6 Trace Flush Worker (trace_flush_worker.py)

**Current status**: OTel path is CORRECT. SDK fallback uses V2 methods.

**Rules**:
- OTel path (`_process_event_otel`): DO NOT MODIFY — works correctly at OTel level
- SDK fallback (`_process_event_sdk`): LOW priority migration to V3 methods
- The OTel path bypasses the Langfuse SDK entirely — it creates raw OTel spans that
  Langfuse's SpanProcessor intercepts. This is valid and more performant.
- `langfuse.flush()` is called after processing — CORRECT
- `langfuse.shutdown()` is called on exit — CORRECT

### 7.7 Hook Scripts (All 17)

**Current status**: CORRECT. All use `emit_trace_event()` consistently.

**Rules for ALL hook scripts**:

```python
# REQUIRED: At module level
TRACE_CONTENT_MAX = 10000  # Max chars for Langfuse input/output fields

# REQUIRED: Import pattern (graceful fallback)
try:
    from memory.trace_buffer import emit_trace_event
except ImportError:
    emit_trace_event = None

# REQUIRED: Usage pattern (never crash for tracing)
if emit_trace_event:
    try:
        emit_trace_event(
            event_type="1_capture",
            data={
                "input": content[:TRACE_CONTENT_MAX],
                "output": result[:TRACE_CONTENT_MAX],
                "metadata": {...},
            },
            trace_id=trace_id,
            session_id=session_id,      # ALWAYS pass explicitly
            project_id=project_id,
            start_time=capture_start,
            end_time=datetime.now(tz=timezone.utc),
        )
    except Exception:
        pass  # NEVER crash a hook for tracing
```

---

## 8. Configuration Reference

### 8.1 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LANGFUSE_ENABLED` | `false` | Master kill-switch for ALL Langfuse tracing |
| `LANGFUSE_TRACE_HOOKS` | `true` | Enable/disable hook pipeline tracing (Path A) |
| `LANGFUSE_TRACE_SESSIONS` | `true` | Enable/disable session traces (stop hook, Path B) |
| `LANGFUSE_PUBLIC_KEY` | — | Langfuse project public key |
| `LANGFUSE_SECRET_KEY` | — | Langfuse project secret key |
| `LANGFUSE_BASE_URL` | `http://localhost:23100` | Langfuse web UI URL |
| `LANGFUSE_FLUSH_INTERVAL` | `5` | Trace flush worker poll interval (seconds) |
| `LANGFUSE_TRACE_BUFFER_MAX_MB` | `100` | Max disk buffer size before eviction |
| `LANGFUSE_FLUSH_TIMEOUT_SECONDS` | `15` | Stop hook flush timeout |
| `CLAUDE_SESSION_ID` | — | Claude Code session ID (set by settings.json) |
| `LANGFUSE_TRACE_ID` | — | Pipeline trace ID (set by capture hooks) |
| `LANGFUSE_ROOT_SPAN_ID` | — | Root span ID for parent linking |
| `LANGFUSE_TRACING_ENABLED` | — | SDK-level tracing (set by langfuse_config.py) |

### 8.2 Docker Compose

- `docker-compose.langfuse.yml`: All Langfuse infrastructure (web, worker, postgres, clickhouse, redis, minio, trace-flush-worker)
- Profile: `langfuse` (opt-in, not started by default)
- Network: `ai-memory_default` (shared with main stack)
- Trace flush worker: mounts `~/.ai-memory/trace_buffer` volume

### 8.3 ClickHouse

- Config: `docker/langfuse/clickhouse-config.xml`
- Memory cap: 16 GiB (`max_server_memory_usage: 17179869184`)
- TTL: 90 days (traces, observations, scores)
- `ttl_only_drop_parts: 1` (efficient TTL enforcement)

---

## 9. Anti-Patterns — What Agents MUST NOT Do

### 9.1 NEVER Use V2 SDK Methods

```python
# ALL OF THESE ARE WRONG — V2 SDK — DO NOT USE:
client = Langfuse(public_key=..., secret_key=..., host=...)  # DISCOURAGED: bypasses env config (see §2.3, DEC-068)
client.trace(name="...", session_id="...")
client.span(name="...", trace_id="...")
client.generation(name="...", model="...")
client.start_span(name="...", trace_id="...")
client.start_generation(name="...", trace_id="...")
langfuse_context.update_current_trace(...)
langfuse_context.update_current_observation(...)
```

> **Note (Updated PLAN-014, DEC-068)**: `Langfuse()` with no arguments or with `project_name`
> is valid V3 (returns singleton). The line above with explicit credentials is DISCOURAGED,
> not forbidden. See §2.3 for the full clarification.

### 9.2 NEVER Hardcode Content Limits Below TRACE_CONTENT_MAX

```python
# WRONG — hardcoded limits
content[:300]    # WRONG
content[:500]    # WRONG
content[:2000]   # WRONG

# CORRECT — use the constant
content[:TRACE_CONTENT_MAX]  # CORRECT (10000)
```

### 9.3 NEVER Skip session_id

```python
# WRONG — missing session_id
emit_trace_event(event_type="1_capture", data={...}, trace_id=trace_id)

# CORRECT — always pass session_id
emit_trace_event(event_type="1_capture", data={...}, trace_id=trace_id, session_id=session_id)
```

### 9.4 NEVER Skip flush() in Short-Lived Processes

```python
# WRONG — data loss risk
langfuse = get_client()
with langfuse.start_as_current_observation(...):
    pass
# Process exits — buffered data may be lost!

# CORRECT — flush before exit
langfuse = get_client()
with langfuse.start_as_current_observation(...):
    pass
langfuse.flush()  # Ensures all data reaches Langfuse
```

### 9.5 NEVER Crash a Hook for Tracing

```python
# WRONG — unhandled exception crashes hook
emit_trace_event(event_type="1_capture", data={...})  # May raise!

# CORRECT — always wrap in try/except
try:
    emit_trace_event(event_type="1_capture", data={...})
except Exception:
    pass  # Tracing failure must NEVER block Claude Code
```

### 9.6 NEVER Use session.id with langfuse.trace Prefix in OTel

```python
# WRONG — Langfuse won't recognize these
otel_span.set_attribute("langfuse.trace.session_id", session_id)  # WRONG
otel_span.set_attribute("langfuse.trace.user_id", user_id)        # WRONG

# CORRECT — short names per Langfuse SDK source
otel_span.set_attribute("session.id", session_id)  # CORRECT
otel_span.set_attribute("user.id", user_id)         # CORRECT
```

### 9.7 NEVER Guess at Langfuse API

If you don't know the correct V3 API for something:
1. Check THIS spec first
2. Check the Langfuse docs MCP (`searchLangfuseDocs` or `getLangfuseDocsPage`)
3. If neither has the answer, ASK — don't guess

The #1 cause of Langfuse bugs has been agents guessing at the API instead of verifying.

---

## 10. Script Header Comments

Every file that touches Langfuse MUST include a header comment pointing to this spec.
This prevents agents from using V2 patterns.

### 10.1 For Hook Scripts (Path A)

```python
# LANGFUSE: Uses trace buffer (Path A). See LANGFUSE-INTEGRATION-SPEC.md §3.1, §4, §7.7
# SDK VERSION: V3 ONLY. Do NOT use Langfuse() constructor, start_span(), or start_generation().
# CONSTANT: TRACE_CONTENT_MAX = 10000 (no other value permitted)
```

### 10.2 For Direct SDK Files (Path B)

```python
# LANGFUSE: Uses direct SDK (Path B). See LANGFUSE-INTEGRATION-SPEC.md §3.2, §7.x
# SDK VERSION: V3 ONLY. Use get_client(), start_as_current_observation(), propagate_attributes().
# Do NOT use Langfuse(host=..., public_key=...) with explicit creds, start_span(), start_generation(), or langfuse_context.
```

### 10.3 For Infrastructure Files

```python
# LANGFUSE: Infrastructure config. See LANGFUSE-INTEGRATION-SPEC.md §8
# Changes to Langfuse env vars or Docker config MUST be verified against the spec.
```

---

## 11. Testing Requirements

### 11.1 Unit Tests

Any change to Langfuse integration code MUST pass:
- `tests/test_langfuse_stop_hook.py` — session trace creation
- `tests/test_trace_buffer.py` — emit_trace_event behavior
- `tests/test_trace_flush_worker.py` — OTel span creation + attribute names
- `tests/test_langfuse_config.py` — client factory

### 11.2 Integration Verification

After deployment, verify in the Langfuse UI:
1. Session traces appear with correct `session_id`
2. Hook pipeline traces appear with parent-child nesting
3. Classification generations show model name + token usage
4. No orphaned spans (all spans linked to a trace)
5. GitHub sync operations appear as traces
6. Jira sync operations appear as traces

---

## 12. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-03 | Parzival | Initial spec. Verified against Langfuse docs MCP. |
| 1.1 | 2026-03-03 | Parzival | PM #147: Updated §2.3 (constructor ban), §3.3 (+6 components), §7.1/§7.2 (migrated status). |
| 1.2 | 2026-03-08 | PLAN-014 | PM #170: TD-266a (§2.4 convenience methods), TD-266b (§2.2/§2.3 DEC-068 constructor clarification), TD-266c (§2.5.1 propagate_attributes detail), TD-266d (§2.9 Evaluation class). Updated §9.1, §10.2. |

---

## 13. References

- Langfuse Python SDK v3 Instrumentation: https://langfuse.com/docs/observability/sdk/instrumentation
- Langfuse Sessions: https://langfuse.com/docs/observability/features/sessions
- Langfuse V2→V3 Migration: https://langfuse.com/docs/observability/sdk/upgrade-path
- Core Architecture V2 §3.7: `oversight/specs/Core-Architecture-Principle-V2.md`
- Past Langfuse Issues: BUG-151-157, BUG-177, BUG-179-180, BUG-197-199, BUG-204, RSK-010
