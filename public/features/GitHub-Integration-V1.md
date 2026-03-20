# GitHub Integration V1.0

> **DEPRECATION NOTICE (v2.2.2)**: Collection targeting superseded by AI-Memory-Behavior-Spec-V1.md §2.1. GitHub is freshness oracle only, not injection source. Retained for historical context.

**Status**: Source of Truth
**Created**: 2026-02-22
**Last Updated**: 2026-02-22
**Owner**: AI Memory Module
**Spec Sources**: SPEC-004, SPEC-005, SPEC-006, SPEC-007, SPEC-008 (PLAN-006)

---

## Purpose

This document defines the **authoritative specification** for the GitHub Integration subsystem of the AI Memory Module. It covers the complete pipeline from GitHub REST API ingestion through content composition, deduplication, AST-aware code chunking, and Docker-based infrastructure. All GitHub-related implementations MUST conform to this specification.

**Scope**: GitHub client architecture, schema extensions, sync engine, code blob chunking, content-hash deduplication, payload indexes, and container infrastructure.

---

## 1. Architecture Overview

### 1.1 Design Decision (AD-1)

All GitHub data is stored in the **existing `discussions` collection** with namespace isolation via `source="github"` and `is_tenant=true` indexing. No separate collection is created. This minimizes infrastructure overhead while enabling efficient filtered queries through Qdrant's tenant optimization.

### 1.2 Data Flow

```
GitHub REST API v3
        |
        v
  GitHubClient (httpx.AsyncClient)
  [Rate limiting + ETag caching + Pagination]
        |
        v
  GitHubSyncEngine / CodeBlobSync
  [Per-type sync methods + Composer transforms]
        |
        v
  Content Hash (SHA-256) → Dedup Pre-Check
        |
        ├─ Unchanged → Update last_synced only (skip embedding)
        └─ Changed/New → Security Scan → store_memory() pipeline
                                |
                                v
                    Qdrant discussions collection
                    [source="github", is_current=True]
```

### 1.3 Module Structure

```
src/memory/connectors/github/
├── __init__.py       # Package exports
├── client.py         # GitHubClient: API transport layer
├── sync.py           # GitHubSyncEngine: orchestration
├── code_sync.py      # CodeBlobSync: AST-aware code ingestion
├── schema.py         # Indexes, authority map, content hash
└── composer.py       # 7 composer functions for content composition
```

Source: `ai-memory/src/memory/connectors/github/__init__.py:1-41`

---

## 2. GitHub Client (`client.py`)

### 2.1 Transport Layer

The `GitHubClient` class wraps `httpx.AsyncClient` with Bearer token authentication, connection pooling, and GitHub API v3 headers.

| Parameter | Value | Source |
|---|---|---|
| Auth scheme | `Bearer {token}` | `client.py:126` |
| Accept header | `application/vnd.github+json` | `client.py:127` |
| API version | `2022-11-28` | `client.py:128` |
| User-Agent | `ai-memory-github-sync/1.0` | `client.py:129` |
| Connect timeout | 5.0s | `client.py:77` |
| Read timeout | 30.0s | `client.py:78` |
| Write timeout | 5.0s | `client.py:79` |
| Pool timeout | 5.0s | `client.py:80` |

### 2.2 Adaptive Rate Limiting (BP-062)

Two-tier rate limiting with 20% safety margin:

| Limit | Capacity | Effective (80%) | Tracking |
|---|---|---|---|
| **Primary** | 5,000 req/hr (PAT) | 4,000 req/hr | `X-RateLimit-Remaining` header |
| **Secondary** | 900 pts/min | 720 pts/min | Cumulative point cost per 60s window |

**Behavior**:
- Primary: Waits when remaining < 10% of safety margin (~100 requests). Capped at 60s wait. (`client.py:460-474`)
- Secondary: Waits for window reset when approaching limit. Window resets every 60s. (`client.py:437-456`)
- Minimum inter-request delay: 100ms (`client.py:74`)
- GH-BUG-001: Secondary points only charged on first attempt (no double-decrement on retry). (`client.py:631-632`)

### 2.3 ETag Caching

Conditional requests via `If-None-Match` / `If-Modified-Since` headers. 304 Not Modified responses do NOT count against rate limits.

| Parameter | Value | Source |
|---|---|---|
| Cache key | SHA-256(URL + sorted params), truncated to 16 chars | `client.py:535` |
| Max cache size | 1,000 entries | `client.py:91` |
| Eviction | LRU — evict oldest 25% when full | `client.py:575-580` |
| Header preference | `If-Modified-Since` preferred over ETag | `client.py:547` |

When a 304 response arrives but cache is empty (stale cache miss), the client clears stale headers and retries up to `MAX_RETRIES` times. (`client.py:798-808`)

### 2.4 Retry and Error Handling

| Error | Retryable | Behavior |
|---|---|---|
| 5xx server error | Yes | Exponential backoff with jitter: `min(60, 2^attempt) + random(0,1)` |
| 429 rate limit | Yes | Respects `Retry-After` header |
| 403 rate limit (remaining=0) | Yes | Waits until `X-RateLimit-Reset`, capped at 60s |
| 403 other (forbidden) | No | Raises `GitHubClientError` |
| 401 / 404 / 422 | No | Raises `GitHubClientError` |
| Timeout | Yes | Exponential backoff: `min(60, 2^attempt)` |
| Max retries | 3 | `client.py:83` |

GH-SEC-006: Pagination URLs are validated against `base_url` to prevent SSRF via crafted Link headers. (`client.py:910-916`)

### 2.5 Pagination

Link header pagination with `per_page=100`:
- Parses `Link` header for `rel="next"` URL
- Stops at max 100 pages (safety limit)
- Parameters embedded in Link URL after first page

Source: `client.py:821-888`

### 2.6 Batch ID Generation (BP-074)

Format: `github_{YYYYMMDD_HHMMSS}_{uuid8}`

Used by sync engine to group all points in a single sync run, enabling batch identification and potential rollback.

Source: `client.py:921-936`

### 2.7 API Endpoints

| Method | Endpoint | Point Cost |
|---|---|---|
| `test_connection()` | `GET /user` | 1 |
| `list_issues()` | `GET /repos/{repo}/issues` | 1 |
| `get_issue_comments()` | `GET /repos/{repo}/issues/{n}/comments` | 1 |
| `list_pull_requests()` | `GET /repos/{repo}/pulls` | 1 |
| `get_pr_reviews()` | `GET /repos/{repo}/pulls/{n}/reviews` | 1 |
| `get_pr_files()` | `GET /repos/{repo}/pulls/{n}/files` | 1 |
| `list_commits()` | `GET /repos/{repo}/commits` | 1 |
| `get_commit()` | `GET /repos/{repo}/commits/{sha}` | 1 |
| `list_workflow_runs()` | `GET /repos/{repo}/actions/runs` | 2 |
| `get_repo_content()` | `GET /repos/{repo}/contents/{path}` | 1 |
| `get_tree()` | `GET /repos/{repo}/git/trees/{sha}` | 1 |
| `get_blob()` | `GET /repos/{repo}/git/blobs/{sha}` | 1 |

---

## 3. Schema Extensions (`schema.py`)

### 3.1 MemoryType Enum Values

Nine GitHub-specific types added to `MemoryType` enum in `models.py:76-84`:

| Enum | Value | Description |
|---|---|---|
| `GITHUB_ISSUE` | `github_issue` | Issue title + body |
| `GITHUB_ISSUE_COMMENT` | `github_issue_comment` | Issue comment body |
| `GITHUB_PR` | `github_pr` | PR title + description |
| `GITHUB_PR_DIFF` | `github_pr_diff` | PR diff summary (per-file) |
| `GITHUB_PR_REVIEW` | `github_pr_review` | PR review comment |
| `GITHUB_COMMIT` | `github_commit` | Commit message + stats |
| `GITHUB_CODE_BLOB` | `github_code_blob` | File content (AST-chunked) |
| `GITHUB_CI_RESULT` | `github_ci_result` | CI workflow result |
| `GITHUB_RELEASE` | `github_release` | Release notes |

### 3.2 Payload Indexes

Ten indexes created on the `discussions` collection via `create_github_indexes()`:

| Field | Type | Tenant | Purpose |
|---|---|---|---|
| `source` | keyword | **Yes** (`is_tenant=true`) | Namespace isolation ("github") |
| `github_id` | integer | No | Issue/PR number lookup |
| `file_path` | keyword | No | Code blob file path |
| `sha` | keyword | No | Git commit/blob SHA |
| `state` | keyword | No | Issue/PR state filter |
| `last_synced` | datetime | No | Staleness detection |
| `content_hash` | keyword | No | Dedup pre-check |
| `is_current` | bool | No | Version filtering |
| `source_authority` | float | No | Authority-weighted ranking |
| `update_batch_id` | keyword | No | Batch grouping |

Index creation is idempotent — safe to call repeatedly. Includes one-retry on timeout. (`schema.py:91-145`)

### 3.3 Source Authority Map

Authority scores on a 0.0–1.0 float scale:

| Type | Score | Rationale |
|---|---|---|
| `github_pr_diff` | 1.0 | Machine-generated diff extraction |
| `github_code_blob` | 1.0 | Automated code extraction |
| `github_ci_result` | 1.0 | Machine-generated CI output |
| `github_issue` | 0.4 | Human-written description |
| `github_issue_comment` | 0.4 | Human-written comment |
| `github_pr` | 0.4 | Human-written PR description |
| `github_pr_review` | 0.4 | Human-written review |
| `github_commit` | 0.4 | Human-written commit message |
| `github_release` | 0.4 | Human-written release notes |

Source: `schema.py:40-50`

### 3.4 Content Hash Deduplication

SHA-256 hash computed on the **composed document** (post-composer output), not raw API response. Changing composer logic intentionally triggers re-embedding.

```python
hashlib.sha256(content.encode("utf-8")).hexdigest()  # 64-char hex string
```

Source: `schema.py:56-69`

---

## 4. Sync Engine (`sync.py`)

### 4.1 Orchestration

`GitHubSyncEngine` orchestrates full sync cycles with priority order:

```
PRs (+ reviews + diffs) → Issues (+ comments) → Commits → CI Results
```

PRs are synced first because they contain the richest intent context (description + review discussion + diff).

### 4.2 Sync Modes

| Mode | Behavior |
|---|---|
| `incremental` (default) | Only items updated since last sync (`since` parameter from state) |
| `full` | Re-sync all items, ignoring stored timestamps |

### 4.3 Per-Type Sync Methods

| Method | Types Stored | Sub-resources |
|---|---|---|
| `_sync_pull_requests()` | GITHUB_PR | + GITHUB_PR_REVIEW + GITHUB_PR_DIFF (per changed file) |
| `_sync_issues()` | GITHUB_ISSUE | + GITHUB_ISSUE_COMMENT |
| `_sync_commits()` | GITHUB_COMMIT | Fetches full commit detail for diff stats |
| `_sync_ci_results()` | GITHUB_CI_RESULT | Only `completed` workflow runs |
| `_sync_releases()` | GITHUB_RELEASE | Published release tags and notes |

Issues API returns PRs too — filtered by checking `pull_request` key. (`sync.py:253`)

### 4.4 Dedup/Versioning Protocol

Implemented in `_store_github_memory()` (`sync.py:701-898`):

```
1. Compute content_hash on composed document
2. Query Qdrant: source=github, type=X, github_id=N, is_current=True
3. Hash match?
   ├─ Yes → Update last_synced only → return False (skip)
   └─ No  → Security scan → Mark old is_current=False → store_memory() → return True
4. New item (no existing)?
   → Security scan → store_memory() with version=1 → return True
```

GH-REV-001: Security scan runs BEFORE marking old version as superseded, preventing data loss if scan blocks content. (`sync.py:800-813`)

GH-SEC-007: Content hash is recomputed after security masking to ensure the stored hash matches the actual stored content. (`sync.py:816-817`)

### 4.5 Composer Functions (`composer.py`)

Seven functions transform API responses into embeddable text:

| Function | Output Format |
|---|---|
| `compose_issue()` | `Issue #N: Title\n{body}\nLabels: ... \| State: ...` |
| `compose_issue_comment()` | `Comment on Issue #N by {author}:\n{body}` |
| `compose_pr()` | `PR #N: Title\n{body}\nState: ... \| Branch: ... \| Files: ...` |
| `compose_pr_diff()` | `Diff for PR #N: {file}\nChange: {status} (+A -D)\n{patch[:2000]}` |
| `compose_pr_review()` | `Review on PR #N by {reviewer} ({state}):\n{body}` |
| `compose_commit()` | `Commit {sha8}: {message}\nStats: ...\nFiles: ...\nAuthor: ...` |
| `compose_ci_result()` | `CI {workflow}: {conclusion}\nBranch: ... \| Commit: ...` |

PR diffs are truncated at 2,000 characters for reasonable chunk size. File lists are capped at 15-20 entries.

### 4.6 State Persistence

Sync state persisted in `.audit/state/github_sync_state.json`:
- Per-type `last_synced` timestamp and `last_count`
- Atomic write via `.tmp` rename pattern (Jira pattern)
- Source: `sync.py:900-947`

### 4.7 Post-Sync Freshness Feedback Loop

When a merged PR is stored, the engine triggers `_trigger_freshness_for_merged_pr()` which:
1. Scrolls `code-patterns` collection for memories matching changed file paths
2. Updates `freshness_status` to `"stale"` with `freshness_trigger: "post_sync_pr_merge"`
3. Provides proactive staleness detection without waiting for on-demand freshness scan

Source: `sync.py:624-697`

### 4.8 Metrics

Pushgateway metrics via `prometheus_client`:
- Counter: `github_sync_items_total` (labels: type, status)
- Gauge: `github_sync_duration_seconds`
- Grouping key: `{"instance": owner/repo}`
- Uses `changes()` not `increase()` in Grafana (BUG-083/084/085)

Source: `sync.py:951-1001`

---

## 5. Code Blob Sync (`code_sync.py`)

### 5.1 AST-Aware Chunking

`CodeBlobSync` ingests repository source files into the `discussions` collection as `github_code_blob` type. Python files use AST-aware chunking; all others use semantic (line-based) chunking.

**Performance**: AST-aware chunking delivers **+70.1% Recall@5** over fixed-size chunking (BP-065).

### 5.2 Chunking Strategies

| Language | Strategy | Source |
|---|---|---|
| Python | `chunk_python_ast()` — one chunk per top-level class/function + module-level code | `code_sync.py:258-351` |
| Non-Python | `_chunk_semantic()` — line-based, 512 tokens target, 20% overlap | `code_sync.py:449-526` |

**Python AST Chunking**:
1. Parse source with `ast.parse()`
2. Extract top-level nodes (ClassDef, FunctionDef, AsyncFunctionDef) including decorators
3. Module-level code (imports, constants) → separate chunk
4. Chunks >1,024 token estimate → sub-chunked at ~512 tokens with 20% overlap
5. Context enrichment header prepended to EVERY chunk (including sub-chunks)
6. On `SyntaxError`, falls back to semantic chunking

### 5.3 Context Enrichment Header

Prepended to every chunk. Format:

```
# File: src/memory/storage.py | Symbol: MemoryStorage | Imports: qdrant_client, httpx | Language: python
```

Fields: `File`, `Symbol` (or `Class` + `Method`), `Imports` (up to 5), `Language`.

This header bridges the natural-language/code semantic gap, enabling the +70.1% Recall@5 improvement. Source: `code_sync.py:570-608`

### 5.4 Language Detection

Extension-based detection via `LANGUAGE_MAP` (37 entries covering 30+ languages). Special case: `Dockerfile` (no extension) detected by filename.

Source: `code_sync.py:66-168`

### 5.5 Binary File Filtering

`BINARY_EXTENSIONS` set (46 extensions): images, archives, executables, fonts, media, databases, lock files.

Source: `code_sync.py:108-152`

### 5.6 Incremental Sync Flow

```
1. Fetch file tree (GET /git/trees/{branch}?recursive=1)
2. Filter: binary → size → exclude patterns → unknown language
3. Build stored blob lookup map (BP-066: batch scroll, O(1) lookups)
4. For each eligible file:
   ├─ blob SHA matches stored → update last_synced only (skip)
   └─ changed/new → fetch blob → security scan → chunk → store
5. Detect deleted files: stored paths not in current tree → mark is_current=False
```

### 5.7 Resilience (BUG-112)

| Protection | Default | Config Field |
|---|---|---|
| Total timeout | 1800s (30min) | `github_sync_total_timeout` |
| Per-file timeout | 60s | `github_sync_per_file_timeout` |
| Circuit breaker threshold | 5 consecutive failures | `github_sync_circuit_breaker_threshold` |
| Circuit breaker reset | 60s | `github_sync_circuit_breaker_reset` |
| Progress logging | Every 10 files | Hardcoded |

Source: `code_sync.py:669-831`

### 5.8 File Filtering Rules

1. Skip binary files (by extension)
2. Skip files > `github_code_blob_max_size` (default: 100KB)
3. Skip excluded patterns: `node_modules,*.min.js,.git,__pycache__,*.pyc,build,dist,*.egg-info`
4. Skip unknown languages (extension not in LANGUAGE_MAP)

Source: `code_sync.py:846-884`

### 5.9 Code Sync Metrics

Pushgateway metrics:
- Counter: `github_code_sync_files_total` (labels: status — synced/skipped/deleted/error)
- Counter: `github_code_sync_chunks_total`
- Gauge: `github_code_sync_duration_seconds`
- Grouping key: `{"instance": owner/repo}`

---

## 6. Docker Infrastructure

### 6.1 Container Configuration

| Parameter | Value | Source |
|---|---|---|
| Base image | `python:3.12.8-slim` | `github-sync/Dockerfile:1` |
| Container name | `${AI_MEMORY_CONTAINER_PREFIX}-github-sync` | `docker-compose.yml:349` |
| Profile | `github` | `docker-compose.yml:350` |
| User | Non-root `ghsync` (UID 1001) | `Dockerfile:28-29` |
| Runtime user | `${UID:-1000}:${GID:-1000}` | `docker-compose.yml:394` |
| Memory limit | 512MB | `docker-compose.yml:406` |
| CPU limit | 0.5 | `docker-compose.yml:407` |
| Memory reservation | 256MB | `docker-compose.yml:409` |

### 6.2 Security Hardening

```yaml
security_opt:
  - no-new-privileges:true
cap_drop:
  - ALL
read_only: true
tmpfs:
  - /tmp:rw,noexec,nosuid,size=50m
```

Source: `docker-compose.yml:396-402`

### 6.3 Health Check

```python
# File-based health check: /tmp/sync.health must exist and be modified < 1 hour ago
from pathlib import Path; import time
p = Path('/tmp/sync.health')
exit(0 if p.exists() and (time.time() - p.stat().st_mtime) < 3600 else 1)
```

- Interval: 60s, Timeout: 10s, Retries: 3, Start period: 120s
- Source: `docker-compose.yml:417-421`

### 6.4 Dependencies

```yaml
depends_on:
  qdrant:
    condition: service_healthy
  embedding:
    condition: service_healthy
```

### 6.5 State Volume

```yaml
volumes:
  - ${AI_MEMORY_INSTALL_DIR:-${HOME}/.ai-memory}/github-state:/app/.audit/state
```

Persists sync state across container restarts. Engine writes to `Path.cwd() / ".audit" / "state"` = `/app/.audit/state/`.

### 6.6 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `GITHUB_SYNC_ENABLED` | `false` | Master enable switch |
| `GITHUB_TOKEN` | — | GitHub PAT (required when enabled) |
| `GITHUB_REPO` | — | `owner/repo` format (required when enabled) |
| `GITHUB_SYNC_INTERVAL` | `1800` | Polling interval in seconds (30 min) |
| `GITHUB_BRANCH` | `main` | Branch for code blob sync |
| `GITHUB_CODE_BLOB_ENABLED` | `true` | Enable code blob sync |
| `GITHUB_CODE_BLOB_MAX_SIZE` | `102400` | Max file size in bytes (100KB) |
| `GITHUB_CODE_BLOB_EXCLUDE` | `node_modules,...` | Comma-separated exclude patterns |
| `GITHUB_SYNC_TOTAL_TIMEOUT` | `1800` | Total code blob sync timeout |
| `GITHUB_SYNC_INSTALL_TIMEOUT` | `600` | Install-mode timeout (10 min) |
| `GITHUB_SYNC_PER_FILE_TIMEOUT` | `60` | Per-file timeout |
| `GITHUB_SYNC_CIRCUIT_BREAKER_THRESHOLD` | `5` | Consecutive failures before open |
| `GITHUB_SYNC_CIRCUIT_BREAKER_RESET` | `60` | Seconds before half-open |

Source: `docker-compose.yml:352-381`, `config.py:294-363`

---

## 7. Search Integration

### 7.1 Namespace Filtering

When `source="github"` is passed to `MemorySearch.search()`:
1. Adds `source="github"` filter condition
2. Automatically adds `is_current=True` filter (BP-074) to exclude superseded points
3. Backward compatible — non-GitHub searches are unaffected

Source: `search.py:268-278`

### 7.2 Cascading Search

GitHub results participate in cascading search. The `discussions` collection is searched when intent detection routes there, with `source` filter passed through to `cascading_search()`.

Source: `search.py:544-674`

---

## 8. Configuration (`config.py`)

### 8.1 GitHub Fields (Tier 1: Conditional Required)

| Field | Type | Default | Validation |
|---|---|---|---|
| `github_sync_enabled` | `bool` | `False` | — |
| `github_token` | `SecretStr` | `""` | Required when enabled |
| `github_repo` | `str` | `""` | Must contain `/` when enabled |

### 8.2 GitHub Fields (Tier 2: Defaults)

| Field | Type | Default | Range |
|---|---|---|---|
| `github_sync_interval` | `int` | `1800` | 60–86400 |
| `github_branch` | `str` | `"main"` | — |
| `github_code_blob_enabled` | `bool` | `True` | — |
| `github_code_blob_max_size` | `int` | `102400` | 1024–1048576 |
| `github_code_blob_exclude` | `str` | `"node_modules,..."` | — |

### 8.3 Resilience Fields (BUG-112)

| Field | Type | Default | Range |
|---|---|---|---|
| `github_sync_total_timeout` | `int` | `1800` | 60–7200 |
| `github_sync_install_timeout` | `int` | `600` | 60–3600 |
| `github_sync_per_file_timeout` | `int` | `60` | 10–300 |
| `github_sync_circuit_breaker_threshold` | `int` | `5` | 2–20 |
| `github_sync_circuit_breaker_reset` | `int` | `60` | 10–300 |

Model validator `validate_github_config` ensures `github_token` and `github_repo` are set when `github_sync_enabled=True`, and that `github_repo` contains `/`. Source: `config.py:676-685`

---

## 9. Cross-References

| Topic | Document |
|---|---|
| Temporal decay scoring | `Temporal-Awareness-V1.md` |
| Chunking strategy | `Chunking-Strategy-V2.md` |
| Core architecture | `Core-Architecture-Principle-V2.md` |
| Security scanning | SPEC-009 (PLAN-006) |
| Freshness detection | `Temporal-Awareness-V1.md` Section 4 |

---

## Version History

| Version | Date | Changes |
|---|---|---|
| V1.0 | 2026-02-22 | Initial SOT from SPEC-004/005/006/007/008. Verified against live source code. |
