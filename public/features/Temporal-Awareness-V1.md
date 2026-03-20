# Temporal Awareness V1.0

> **DEPRECATION NOTICE (v2.2.2)**: §3 (medium-relevance truncation) contradicts zero-truncation principle and is superseded by AI-Memory-Behavior-Spec-V1.md §4.2.5 (Greedy Selection — no truncation). Other sections remain current.

**Status**: Source of Truth
**Created**: 2026-02-22
**Last Updated**: 2026-02-22
**Owner**: AI Memory Module
**Spec Sources**: SPEC-001, SPEC-013 (PLAN-006)

---

## Purpose

This document defines the **authoritative specification** for the Temporal Awareness subsystem of the AI Memory Module. It covers the two complementary temporal mechanisms: **decay scoring** (how old is this memory?) and **freshness detection** (has the underlying source code changed?). All temporal ranking and staleness implementations MUST conform to this specification.

**Key Distinction**: Decay = temporal relevance (time-based ranking). Freshness = content correctness (source-code-change-based validation). Both are needed — a memory can be temporally relevant (recent) but content-stale (source code changed), or temporally old but content-fresh (stable API).

---

## 1. Decay Scoring

### 1.1 Formula

The fused score combines semantic similarity with exponential temporal decay:

```
final_score = (0.7 × semantic_similarity) + (0.3 × temporal_score)
temporal_score = 0.5 ^ (age_in_days / half_life_days)
```

Where:
- `semantic_similarity`: Cosine similarity from Qdrant vector search (0.0–1.0)
- `age_in_days`: `(now - stored_at) / 86400` (clamped to >= 0)
- `half_life_days`: Content-type-specific decay rate
- `0.7` / `0.3`: Configurable via `DECAY_SEMANTIC_WEIGHT` (default: 0.7)

Source: `decay.py:33-62`

### 1.2 Decay Behavior

| Age | Temporal Score (14d half-life) | Temporal Score (60d half-life) |
|---|---|---|
| 0 days | 1.000 | 1.000 |
| 7 days | 0.707 | 0.921 |
| 14 days | 0.500 | 0.851 |
| 30 days | 0.228 | 0.707 |
| 60 days | 0.052 | 0.500 |
| 90 days | 0.012 | 0.354 |

### 1.3 Half-Life Resolution

Three-level hierarchical resolution (`decay.py:65-101`):

```
1. Type override (most specific): config.get_decay_type_overrides()
2. Collection default: config.decay_half_life_{collection}
3. Global default: 21 days (fallback)
```

### 1.4 Collection Defaults

| Collection | Half-Life (days) | Config Field | Rationale |
|---|---|---|---|
| `code-patterns` | 14 | `decay_half_life_code_patterns` | Code changes frequently |
| `discussions` | 21 | `decay_half_life_discussions` | Decisions age moderately |
| `conventions` | 60 | `decay_half_life_conventions` | Standards change slowly |
| `jira-data` | 30 | `decay_half_life_jira_data` | Work items cycle monthly |

Source: `config.py:382-404`

### 1.5 Type-Level Overrides

Default overrides configured in `DECAY_TYPE_OVERRIDES`:

| Content Type | Half-Life | Rationale |
|---|---|---|
| `github_ci_result` | 7 days | CI results obsolete quickly |
| `agent_task` | 14 days | Agent tasks are ephemeral |
| `github_code_blob` | 14 days | Code changes frequently |
| `github_commit` | 14 days | Commit relevance fades |
| `github_issue` | 30 days | Issues have longer relevance |
| `github_pr` | 30 days | PR context persists |
| `jira_issue` | 30 days | Work item lifecycle |
| `agent_memory` | 30 days | Agent context decays |
| `guideline` | 60 days | Standards change slowly |
| `rule` | 60 days | Rules are stable |
| `agent_handoff` | 180 days | Handoffs are archival |
| `agent_insight` | 180 days | Insights have lasting value |
| `architecture_decision` | 90 days | ADRs are semi-permanent |

Format: `type:days,type:days,...` (comma-separated, validated by `parse_type_overrides`).

Source: `config.py:414-417`

---

## 2. Qdrant Formula Query Implementation

### 2.1 Server-Side Computation

Decay is computed entirely by Qdrant's **Formula Query API** (requires `qdrant-client >= 1.14.0`). Zero additional latency — single round-trip.

Source: `decay.py:23-28`

### 2.2 Query Structure

`build_decay_formula()` constructs a `FormulaQuery` with condition-gated decay branches:

```
FormulaQuery:
  formula: Sum([
    Mult(semantic_weight, $score),          # 0.7 × cosine similarity
    Mult(temporal_weight, Sum([             # 0.3 × temporal component
      Mult(condition_typeA, ExpDecay(hl_A)), # Branch per half-life group
      Mult(condition_typeB, ExpDecay(hl_B)),
      ...
      Mult(catch_all, ExpDecay(default)),   # Collection default
    ]))
  ])
  defaults: { "stored_at": "2020-01-01T00:00:00Z" }  # Missing field fallback
```

Source: `decay.py:117-273`

### 2.3 Condition Gating

- **Type overrides**: `MatchAny` condition groups types sharing the same half-life
- **Catch-all**: `MatchExcept` condition matches types NOT in any override group, applies collection default half-life
- **Absent `type` field**: Gets `temporal_score=0.0` (Qdrant treats missing fields as non-matching for both `MatchAny` and `MatchExcept`). Semantic component still contributes.

### 2.4 Prefetch Pattern

Two-stage query:
1. **Prefetch**: Semantic search with optional filter, `score_threshold`, and `search_params` (HNSW ef tuning). Returns `prefetch_limit` candidates (default: `max(50, limit × 5)`).
2. **Formula re-scoring**: Applies decay formula to prefetch candidates, returns top `limit`.

When `decay_enabled=False`, returns `(None, prefetch)` — caller uses simple `query_points()` without formula.

Source: `search.py:321-349`

### 2.5 Decay Fallback

Points missing `stored_at` field receive the datetime default `"2020-01-01T00:00:00Z"`, resulting in a very low temporal score. The semantic component (70%) still contributes, so they are returned but ranked lower.

Source: `decay.py:270-271`

---

## 3. Search Integration

### 3.1 Decay Toggle in Search

`MemorySearch.search()` checks `config.decay_enabled`:

```python
if self.config.decay_enabled:
    prefetch_limit = max(50, limit * 5)
    formula, prefetch = build_decay_formula(
        query_embedding=query_embedding,
        collection=collection,
        config=self.config,
        extra_filter=query_filter,
        prefetch_limit=prefetch_limit,
        score_threshold=score_threshold,
        search_params=search_params,
    )
    response = self.client.query_points(
        collection_name=collection,
        prefetch=prefetch,
        query=formula,
        limit=limit,
        with_payload=True,
    )
else:
    # Simple query without decay
    response = self.client.query_points(...)
```

Source: `search.py:320-349`

### 3.2 HNSW ef Tuning

| Mode | `hnsw_ef` | Use Case |
|---|---|---|
| `fast_mode=True` | `config.hnsw_ef_fast` (default: 64) | Trigger/hook searches (<100ms) |
| `fast_mode=False` | `config.hnsw_ef_accurate` (default: 128) | User-facing searches (accuracy) |

Source: `config.py:151-163`, `search.py:296-307`

### 3.3 Tiered Result Formatting

Results are categorized by score for context injection:

| Tier | Score Range | Content Display |
|---|---|---|
| High relevance | >= 90% | Full content |
| Medium relevance | 50%–90% (DEC-009) | Truncated to 500 chars |
| Below threshold | < 50% | Excluded |

Source: `search.py:676-742`

---

## 4. Freshness Detection

### 4.1 Concept

Freshness detection validates whether **code-patterns** memories are still accurate by comparing them against ground truth from GitHub code blob data in the `discussions` collection.

```
Decay answers:  "How OLD is this memory?"        → Temporal ranking
Freshness answers: "Has the SOURCE CODE changed?" → Content correctness
```

### 4.2 Freshness Tiers

| Tier | Classification | Condition |
|---|---|---|
| `fresh` | Content likely still accurate | < 3 commits touching file since memory stored |
| `aging` | Content may be outdated | 3–9 commits (threshold: `freshness_commit_threshold_aging`) |
| `stale` | Content likely outdated | 10–24 commits (threshold: `freshness_commit_threshold_stale`) |
| `expired` | Content definitely outdated | >= 25 commits OR blob hash mismatch (threshold: `freshness_commit_threshold_expired`) |
| `unknown` | No ground truth available | File not in GitHub code blob data |

Source: `freshness.py:56-63`, `freshness.py:258-319`

### 4.3 Classification Logic

Priority order in `classify_freshness()`:

```
1. blob_hash_match = False → EXPIRED (direct content mismatch)
2. commit_count >= expired threshold (25) → EXPIRED
3. commit_count >= stale threshold (10) → STALE
4. commit_count >= aging threshold (3) → AGING
5. Otherwise → FRESH
```

Blob hash comparison is always `None` in Tier 1 (code-patterns points don't have `blob_hash`). Classification relies on commit count alone. Phase 3 may add blob_hash propagation.

Source: `freshness.py:258-319`

### 4.4 Ground Truth Map

Built from `discussions` collection by scrolling `github_code_blob` points:

```python
filter: source="github", type="github_code_blob", is_current=True
fields: file_path, blob_hash, last_commit_sha, last_synced
```

Returns `dict[str, GroundTruth]` — one entry per unique file_path (first chunk per file wins, all chunks share same blob_hash).

Source: `freshness.py:116-187`

### 4.5 Commit Count Resolution

`count_commits_for_file()` scrolls `github_commit` points and checks `files_changed` lists:

```python
filter: source="github", type="github_commit", is_current=True
fields: files_changed (list[str]), timestamp
condition: commit timestamp > memory stored_at AND file_path in files_changed
```

O(total_commits) per call — acceptable for Tier 1 on-demand usage. Phase 3 optimizes with pre-built commit map.

Source: `freshness.py:190-255`

### 4.6 Freshness Scan Pipeline

`run_freshness_scan()` orchestrates the full pipeline:

```
1. Build ground truth map from GitHub code blob data
2. Scroll code-patterns with file_path field
3. For each point:
   ├─ No ground truth → classify as UNKNOWN
   └─ Has ground truth:
       ├─ Count commits touching file since stored_at (cached)
       └─ Classify: fresh / aging / stale / expired
4. Update Qdrant payload: freshness_status + freshness_checked_at
5. Log to .audit/logs/freshness-log.jsonl
6. Push Prometheus metrics (fire-and-forget)
7. Return FreshnessReport
```

Commit count is cached per `file_path:stored_at` pair to avoid redundant Qdrant queries.

Source: `freshness.py:322-545`

### 4.7 Payload Updates

Updates grouped by status for batch efficiency:

```python
client.set_payload(
    collection_name="code-patterns",
    payload={"freshness_status": status, "freshness_checked_at": now_iso},
    points=point_ids,  # All points with same status
)
```

Failures are logged but do not abort the scan (fail-open pattern).

Source: `freshness.py:548-584`

### 4.8 Audit Trail

Results logged to `.audit/logs/freshness-log.jsonl` (one JSON line per result):

```json
{
  "timestamp": "2026-02-22T12:00:00Z",
  "point_id": "abc-123",
  "file_path": "src/memory/storage.py",
  "memory_type": "implementation",
  "status": "stale",
  "reason": "Significant activity: hash comparison unavailable, 12 commits (threshold=10)",
  "stored_at": "2026-01-15T08:30:00Z",
  "blob_hash_match": null,
  "commit_count": 12
}
```

Source: `freshness.py:587-636`

---

## 5. Post-Sync Freshness Feedback

### 5.1 Proactive Staleness Flagging

When `GitHubSyncEngine` stores a merged PR, it triggers freshness flagging:

```
_trigger_freshness_for_merged_pr(files_changed):
1. For each file path in merged PR:
   → Scroll code-patterns for memories matching file_path + group_id
   → Set freshness_status = "stale"
   → Set freshness_trigger = "post_sync_pr_merge"
2. Return count of flagged memories
```

This provides near-real-time staleness detection without waiting for the on-demand freshness scan.

Source: `sync.py:624-697`

---

## 6. Configuration

### 6.1 Decay Configuration

| Field | Type | Default | Range | Env Var |
|---|---|---|---|---|
| `decay_enabled` | `bool` | `True` | — | `DECAY_ENABLED` |
| `decay_semantic_weight` | `float` | `0.7` | 0.0–1.0 | `DECAY_SEMANTIC_WEIGHT` |
| `decay_half_life_code_patterns` | `int` | `14` | >= 1 | `DECAY_HALF_LIFE_CODE_PATTERNS` |
| `decay_half_life_discussions` | `int` | `21` | >= 1 | `DECAY_HALF_LIFE_DISCUSSIONS` |
| `decay_half_life_conventions` | `int` | `60` | >= 1 | `DECAY_HALF_LIFE_CONVENTIONS` |
| `decay_half_life_jira_data` | `int` | `30` | >= 1 | `DECAY_HALF_LIFE_JIRA_DATA` |
| `decay_min_score` | `float` | `0.1` | 0.0–1.0 | `DECAY_MIN_SCORE` |
| `decay_type_overrides` | `str` | `"github_ci_result:7,..."` | `type:days,...` | `DECAY_TYPE_OVERRIDES` |

Source: `config.py:370-417`

### 6.2 Freshness Configuration

| Field | Type | Default | Range | Env Var |
|---|---|---|---|---|
| `freshness_enabled` | `bool` | `True` | — | `FRESHNESS_ENABLED` |
| `freshness_commit_threshold_aging` | `int` | `3` | 1–100 | `FRESHNESS_COMMIT_THRESHOLD_AGING` |
| `freshness_commit_threshold_stale` | `int` | `10` | 2–500 | `FRESHNESS_COMMIT_THRESHOLD_STALE` |
| `freshness_commit_threshold_expired` | `int` | `25` | 3–1000 | `FRESHNESS_COMMIT_THRESHOLD_EXPIRED` |

Validated by `validate_freshness_thresholds`: thresholds must be in ascending order (`aging < stale < expired`). Validated regardless of `freshness_enabled` state.

Source: `config.py:558-593`, `config.py:706-724`

---

## 7. Metrics

### 7.1 Decay Metrics

Decay scoring is computed server-side by Qdrant — no separate decay metrics are emitted. Search duration is tracked by the existing `retrieval_duration_seconds` histogram.

### 7.2 Freshness Metrics

Pushed to Pushgateway via `push_freshness_metrics_async()`:
- Fresh/aging/stale/expired/unknown counts
- Scan duration
- Project grouping key

Source: `freshness.py:530-543`

### 7.3 Grafana Dashboard

GitHub sync Grafana dashboard at `docker/grafana/dashboards/github-sync.json`. All queries use `changes()` not `increase()` for push-once counter compatibility (BUG-083/084/085).

---

## 8. Invocation

### 8.1 Decay

Automatic — applied to every search when `decay_enabled=True` (default). No manual invocation needed.

### 8.2 Freshness (Tier 1)

On-demand via `/freshness-report` skill:

```python
from memory.freshness import run_freshness_scan
report = run_freshness_scan(config=config, group_id="owner/repo")
```

Returns `FreshnessReport` with aggregated statistics and per-point results.

### 8.3 Post-Sync Freshness

Automatic — triggered by `GitHubSyncEngine` when a merged PR is stored. No manual invocation.

---

## 9. Cross-References

| Topic | Document |
|---|---|
| GitHub integration | `GitHub-Integration-V1.md` |
| Chunking strategy | `Chunking-Strategy-V2.md` |
| Core architecture | `Core-Architecture-Principle-V2.md` |
| Qdrant collection design | SPEC-003 (PLAN-006) |
| Search module | `search.py` |

---

## Version History

| Version | Date | Changes |
|---|---|---|
| V1.0 | 2026-02-22 | Initial SOT from SPEC-001/SPEC-013. Verified against live source code. |
