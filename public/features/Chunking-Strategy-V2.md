# Chunking Strategy V2.2

> **DEPRECATION NOTICE (v2.2.2)**: §2.1 (tree-sitter scope) and §2.6 (LateChunker) clarified in AI-Memory-Behavior-Spec-V1.md §7.4. Other sections remain current.

**Status**: Source of Truth
**Created**: 2026-01-23
**Last Updated**: 2026-02-22
**Owner**: AI Memory Module
**Supersedes**: Chunking-Strategy-V1.md

---

## Purpose

This document defines the **authoritative chunking and content processing strategy** for the AI Memory Module. All storage implementations MUST conform to this specification.

**V2 Changes from V1**: Incorporates 2026 research findings from BP-001 (RAG Chunking Strategies), BP-002 (Conversation Memory for Vector Databases), and RAG-CHUNKING-BEST-PRACTICES-2026.md. Adds explicit anti-patterns, dual-storage requirements, smart truncation spec, and error fix chunking strategy.

**V2.2 Changes from V2.1**: Adds AST-aware code blob chunking section (Section 2.7) documenting how GitHub-synced repository files are chunked via Python `ast` module with context enrichment headers (+70.1% Recall@5). Based on SPEC-007 and BP-065.

---

## 1. Core Principles

### 1.1 Content-Type Aware Processing

Different content types require different strategies. One-size-fits-all approaches cause 15-35% retrieval accuracy loss.

| Content Type | Strategy | Rationale |
|---|---|---|
| **Code** (Python, JS, TS) | AST-based (Tree-sitter) | Preserves syntactic integrity |
| **Prose** (Markdown, docs) | Semantic (topic shifts) | Preserves meaning boundaries |
| **User messages** | Whole message (with smart limit) | Context integrity |
| **Agent responses** | Whole message (with smart limit) | Context integrity |
| **Session summaries** | Late chunking | Cross-section context |
| **Error fixes** | Structured smart truncation | Error + solution must stay together |
| **Guidelines/BPs** | Section-aware semantic | One section = one retrievable unit |

### 1.2 Dual Storage Principle (NEW - 2026 Best Practice)

**EVERY content capture MUST follow dual storage**:

```
Activity Log (audit/debug):
  - Full, unmodified content
  - Written BEFORE any processing
  - Append-only, timestamp-indexed

Vector DB (semantic retrieval):
  - Optimized chunks per content type
  - Embedding-quality sized (256-512 tokens)
  - Rich metadata for filtering
```

**Why**: Production systems (Mem0, MemGPT, LangMem) all use this pattern. Enables debugging without losing retrieval optimization. Source: BP-001, BP-002.

### 1.3 Anti-Patterns (PROHIBITED)

**ALL FORMS OF CONTENT TRUNCATION FOR STORAGE ARE PROHIBITED.**

```python
# PROHIBITED - hard character truncation
content = content[:600] + " [TRUNCATED]"
content = content[:1200] + " [TRUNCATED]"

# PROHIBITED - arbitrary character limits by type
LIMITS = {
    MemoryType.GUIDELINE: 600,     # 150 tokens - DESTROYS guidelines
    MemoryType.SESSION: 1600,      # 400 tokens - DESTROYS summaries
    MemoryType.IMPLEMENTATION: 1200,
}

# PROHIBITED - using smart_end to discard content before storage
content = smart_end(content, 2000)  # Everything after 2000 tokens is LOST
# CORRECT: chunk content >2000 tokens into multiple vectors (all content preserved)
```

**Why prohibited**:
- Cuts content at arbitrary boundaries, destroying semantic integrity
- Guidelines: 23K chars truncated to 600 chars = 97% data loss (proven by BP-001 storage)
- Session summaries: Rich context reduced to 400 tokens = useless
- User messages: Truncating >2000 tokens loses vital context the agent needs
- Research consensus: "Chunking strategy affects RAG accuracy by ~60%" (BP-001)

**The correct approach**: When content exceeds size limits, CHUNK it into multiple vectors. All content is preserved across the chunks. No content is ever discarded from the system.

**NOTE**: The function `_enforce_content_limit()` in `storage.py` has been REMOVED (v2.0.4, committed on `feature/v2.0.4-cleanup`, pending merge to main). It did not exist in any spec and violated this strategy.

### 1.4 Key Metrics (From Research)

| Metric | Value | Source |
|---|---|---|
| Semantic chunking accuracy improvement | **+70%** over fixed-size | BP-014 |
| AST chunking recall improvement | **+9%** over line-based | BP-014 |
| Late chunking accuracy improvement | **+24.47%** | BP-016 |
| Hard truncation accuracy loss | **-15 to -35%** | BP-001 (2026) |
| Sentence-boundary truncation improvement | **+20-40%** precision | BP-001 (2026) |
| Chunk overlap coherence improvement | **+35%** | BP-001 (2026) |
| Optimal chunk size for Jina v2 | **256-512 tokens** | BP-001 (2026) |
| Optimal overlap | **10-20%** | BP-001, BP-016 |

---

## 2. Chunking Configurations

### 2.1 Code Chunking (AST-Based)

**Target Collection**: `code-patterns`

```yaml
code_chunking:
  strategy: ast_tree_sitter
  languages:
    - python: tree-sitter-python
    - javascript: tree-sitter-javascript
    - typescript: tree-sitter-typescript
    - go: tree-sitter-go
    - rust: tree-sitter-rust

  parameters:
    max_chunk_tokens: 512       # Optimal for Jina v2
    max_chars: 500              # Non-whitespace characters (cAST standard)
    overlap_pct: 0.20           # 20% overlap for code
    min_overlap_chars: 50       # Minimum overlap

  chunk_boundaries:
    - function_definition
    - class_definition
    - method_definition
    - module (for small files)

  context_extraction:
    imports: true
    class_header: true
    docstrings: true
```

**Why These Values**:
- **512 tokens / 500 chars**: cAST research standard, optimal for Jina v2 (BP-001, BP-014)
- **20% overlap**: Preserves function signatures, comments (BP-016)
- **cAST framework**: +5.5 point gain on RepoEval benchmark (BP-001)

### 2.2 Prose Chunking (Semantic)

**Target Collections**: `conventions`, `discussions` (for long content)

```yaml
prose_chunking:
  strategy: semantic_topic_shift

  parameters:
    chunk_size_tokens: 512
    overlap_pct: 0.15           # 15% overlap (NVIDIA optimal)
    min_overlap_tokens: 30
    similarity_threshold: 0.7   # Topic shift detection

  section_awareness:
    respect_headers: true       # Don't split across ## headers
    preserve_lists: true
    preserve_code_blocks: true

  metadata_extraction:
    section_header: true
    file_path: true
    chunk_index: true
```

### 2.3 Markdown/Guidelines Chunking (Section-Aware)

**Target Collection**: `conventions` (for best practices, guidelines)

```yaml
markdown_chunking:
  strategy: section_aware_semantic

  parameters:
    chunk_size_tokens: 512
    overlap_pct: 0.15
    min_chunk_tokens: 100
    max_chunk_tokens: 1024      # Allow larger for complete sections

  section_handling:
    h1_sections: document_boundary
    h2_sections: chunk_boundary
    h3_sections: preserve

  special_elements:
    code_blocks: preserve_with_context
    tables: keep_intact
    lists: keep_intact
    blockquotes: keep_intact
```

**CRITICAL**: Guidelines stored as type="guideline" MUST use section-aware chunking, NOT hard truncation. A 23K best practice document should produce ~45 chunks of 512 tokens each, not a single 600-char truncated blob.

### 2.4 Conversation Chunking

**Target Collection**: `discussions`

```yaml
conversation_chunking:
  strategy: whole_or_chunk      # Store whole when small, chunk when large

  user_messages:
    under_2000_tokens: store_whole    # Single vector, no processing needed
    over_2000_tokens: chunk_by_topic  # Topical chunking, 512 tokens, 15% overlap
    content_preserved: 100%           # No content is ever discarded

  agent_responses:
    under_3000_tokens: store_whole    # Single vector, no processing needed
    over_3000_tokens: chunk_by_topic  # Topical chunking, 512 tokens, 15% overlap
    content_preserved: 100%           # No content is ever discarded

  session_summaries:
    chunking: late_chunking     # Use 8192-token context
    max_tokens: 8192            # Jina V2 max context
    fallback: semantic          # If >8192, use semantic chunking
```

**Clarifications**:
- For messages <512 tokens, store whole (no processing needed)
- For messages 512-2000 tokens (user) or 512-3000 tokens (agent), still store whole
- For messages exceeding the threshold, chunk by topic into multiple vectors (all content preserved)
- Each chunk: 512 tokens, 15% overlap, with chunking_metadata linking chunks together
- Source: BP-002 recommends 300-500 tokens per vector point for optimal retrieval
- Source: BP-003 confirms zero-truncation principle across all production memory systems

### 2.5 Error Fix Chunking (NEW in V2)

**Target Collection**: `code-patterns`

```yaml
error_fix_chunking:
  strategy: structured_smart_truncation

  parameters:
    max_tokens: 800             # Total budget for error context
    preserve_always:
      - error_message           # Full error message (never truncate)
      - exit_code               # Always include
      - command                 # Full command that failed

  truncation_rules:
    stack_trace: last_500_tokens  # Keep tail of stack trace
    command_output: first_200_last_200  # Head + tail
    file_references: keep_all   # Always preserve file refs

  metadata:
    has_stack_trace: boolean
    error_type: extracted       # Extract error class name
    primary_file: first_ref     # First file reference
```

**Why**: Error fixes need the error message intact for semantic search. Stack trace tails are more useful than heads. Command output middle is rarely useful. Source: BP-002 Section 5.2.

### 2.6 Late Chunking (Advanced)

**When to Use**: Documents >2000 tokens where cross-section context matters

```yaml
late_chunking:
  strategy: full_document_embedding

  parameters:
    max_document_tokens: 8192   # Jina V2 context limit
    chunk_extraction: mean_pooling

  applicable_to:
    - session_summaries
    - architecture_docs
    - prd_documents
    - long_technical_docs
    - best_practices (>2000 tokens)

  cost_consideration:
    accuracy_improvement: "+24.47%"
    cost_multiplier: "16x"
    recommendation: "Use for high-value documents only"
```

**V2 Note**: Late chunking is now the recommended approach for session summaries (per BP-002). Self-hosted Jina embeddings can use late chunking via the API `late_chunking=True` parameter with Jina v3/v4.

### 2.7 Code Blob Chunking (GitHub Sync) (NEW in V2.2)

**Target Collection**: `discussions` (as `github_code_blob` type)
**Source**: `src/memory/connectors/github/code_sync.py` (SPEC-007)
**Research**: BP-065 (AST-aware code chunking + context enrichment, +70.1% Recall@5)

Code blobs ingested via GitHub sync follow a distinct chunking strategy from hook-captured code patterns. The key differentiator is **context enrichment headers** — a single-line scope header prepended to each chunk that bridges the natural language / code semantic gap.

#### 2.7.1 Language-Based Routing

```
Repository file arrives for chunking
    │
    ├── Python (.py) → AST-aware chunking (ast.parse)
    │                  Function/class-level boundaries
    │
    └── All other languages → Semantic line-based chunking
                               512 tokens, 20% overlap
```

**MVP scope**: Python uses stdlib `ast` module for function/class-level chunking. Non-Python uses line-based semantic chunking. Tree-sitter integration (Section 2.1) is planned for Phase 2 to extend AST-level chunking to JS/TS/Go/Rust.

#### 2.7.2 Python AST Chunking

Uses Python `ast.parse()` to split source files at syntactic boundaries:

```yaml
python_ast_chunking:
  strategy: ast_parse_function_class
  parser: python_stdlib_ast       # NOT tree-sitter (MVP)

  chunk_boundaries:
    - module_level_code           # Imports, constants, top-level statements → 1 chunk
    - function_definition         # Each top-level function → 1 chunk
    - async_function_definition   # Each async function → 1 chunk
    - class_definition            # Each class (with all methods) → 1 chunk

  parameters:
    max_chunk_tokens: 1024        # Chunks >1024 tokens get sub-chunked
    sub_chunk_target: 512         # Sub-chunk target size
    sub_chunk_overlap_pct: 0.20   # 20% overlap for sub-chunks

  context_extraction:
    imports: true                 # Extract import module names
    class_scope: true             # Track parent class for methods
    symbols: true                 # Extract function/class names
```

**Chunking algorithm** (`chunk_python_ast()`):

1. Parse source via `ast.parse(content)`. On `SyntaxError`, fall back to semantic chunking.
2. Collect top-level `ClassDef`, `FunctionDef`, `AsyncFunctionDef` node ranges (line spans).
3. Extract module-level lines (everything not covered by a class/function) → 1 chunk.
4. Each class/function → 1 chunk. Nested methods stay inside their parent class chunk.
5. If any chunk exceeds 1024 estimated tokens (~4096 chars), sub-chunk via line-based splitting with 20% overlap.
6. Prepend context enrichment header to every chunk (Section 2.7.4).
7. Set `chunk_index` and `total_chunks` across all chunks for the file.

#### 2.7.3 Non-Python Semantic Chunking

Languages without AST parsing use line-based semantic chunking:

```yaml
non_python_code_blob_chunking:
  strategy: semantic_line_based

  parameters:
    target_tokens: 512            # ~2048 chars for code
    overlap_pct: 0.20             # 20% overlap
    min_tokens: 50                # Skip trivially small trailing chunks

  small_chunk_handling:
    trailing_chunk_under_min: append_to_previous
```

Import-like lines (first 50 lines) are extracted per language for context headers.

#### 2.7.4 Context Enrichment Headers

Every code blob chunk receives a single-line header prepended to the content. This header is the primary driver of the **+70.1% Recall@5** improvement (BP-065 Section 4.2).

**Format**:

```
# File: src/memory/storage.py | Class: MemoryStorage | Method: store_memory | Imports: qdrant_client, httpx | Language: python
```

**Fields** (all optional except `File` and `Language`):

| Field | When Present | Example |
|-------|-------------|---------|
| `File` | Always | `src/memory/storage.py` |
| `Class` | Chunk is inside a class | `MemoryStorage` |
| `Method` | Chunk is a method within a class | `store_memory` |
| `Symbol` | Chunk is a standalone function (no class) | `detect_intent` |
| `Imports` | Up to 5 import modules detected | `qdrant_client, httpx, logging` |
| `Language` | Always | `python` |

**Why it works**: Embedding models trained on natural language struggle with pure code. The header provides a "bridge" — human-readable scope context that dramatically improves semantic similarity matching when users query in natural language (e.g., "how does memory storage work?" retrieves chunks with `Class: MemoryStorage` header).

#### 2.7.5 Code Blob Metadata Schema

Each stored code blob chunk includes extended metadata:

```json
{
  "source": "github",
  "type": "github_code_blob",
  "file_path": "src/memory/storage.py",
  "language": "python",
  "symbols": ["MemoryStorage", "store_memory", "get_config"],
  "blob_hash": "abc123...",
  "chunk_index": 2,
  "total_chunks": 8,
  "is_current": true,
  "version": 1,
  "last_synced": "2026-02-22T10:00:00Z",
  "authority_tier": 3
}
```

#### 2.7.6 Differences from Hook-Based Code Chunking

| Aspect | Hook-Based (Section 2.1) | Code Blob (Section 2.7) |
|--------|-------------------------|-------------------------|
| **Source** | Claude Code hooks (agent edits) | GitHub sync (repository tree) |
| **Target Collection** | `code-patterns` | `discussions` |
| **Parser (MVP)** | Planned: tree-sitter | Python `ast` module (stdlib) |
| **Context Headers** | Not applied | Prepended to every chunk |
| **Language Coverage** | Conceptual: Python, JS, TS, Go, Rust | Python AST + all others semantic |
| **Versioning** | Single version | `is_current`, `version`, `supersedes` |
| **Dedup Signal** | `content_hash` | `blob_hash` (Git SHA) |

---

## 3. Collection-Specific Configurations

### 3.1 code-patterns Collection

| Content Type | Strategy | Chunk Size | Overlap | Types |
|---|---|---|---|---|
| Python/JS/TS files | AST | 512 tokens | 20% | implementation, refactor |
| Error patterns | Smart truncation | 800 tokens | N/A | error_fix |
| Config files | Whole file | N/A | N/A | file_pattern |
| Small scripts (<512 tokens) | Whole file | N/A | N/A | implementation |

### 3.2 conventions Collection

| Content Type | Strategy | Chunk Size | Overlap | Types |
|---|---|---|---|---|
| Best practices (.md) | Section-aware | 512 tokens | 15% | guideline |
| Rules (.md) | Section-aware | 512 tokens | 15% | rule |
| Port configs | Whole document | N/A | N/A | port |
| Naming conventions | Whole document | N/A | N/A | naming |

### 3.3 discussions Collection

| Content Type | Strategy | Chunk Size | Overlap | Types |
|---|---|---|---|---|
| User messages (<2000 tokens) | Whole message | N/A | N/A | user_message |
| User messages (>2000 tokens) | Topical chunking | 512 tokens | 15% | user_message |
| Agent responses (<3000 tokens) | Whole message | N/A | N/A | agent_response |
| Agent responses (>3000 tokens) | Topical chunking | 512 tokens | 15% | agent_response |
| Decisions | Whole document | N/A | N/A | decision |
| Session summaries | Late chunking | 8192 max | N/A | session |
| Code blobs (Python) | AST function/class (Section 2.7) | ≤1024 tokens | 20% (sub-chunks) | github_code_blob |
| Code blobs (non-Python) | Semantic line-based (Section 2.7) | 512 tokens | 20% | github_code_blob |

---

## 4. Processing Utilities (Chunk Boundary & Extraction Tools)

**NOTE**: These utilities find clean break points (sentence boundaries, section boundaries). They are used BY chunkers to determine WHERE to split content into chunks. They are NOT used to discard content before storage.

**Exception**: Error fix structured extraction uses `first_last` on command output sections, with full output always preserved in the activity log.

### 4.1 `smart_end` — Sentence Boundary Finder

Used internally by chunkers to find clean split points between chunks. When a chunk boundary falls mid-sentence, `smart_end` finds the nearest sentence boundary.

```python
def smart_end(content: str, max_tokens: int) -> str:
    """Find the last complete sentence within a token limit.

    Used by chunkers to find clean chunk boundaries.
    Used by classifier for input preview (classification doesn't store).

    NOT for discarding content — all content after the break point
    goes into the NEXT chunk, not the trash.

    1. If content <= max_tokens, return unchanged
    2. Find the last sentence boundary (. ! ? followed by space/newline)
       within the max_tokens limit
    3. If no sentence boundary found, find last word boundary
    4. Return content up to boundary
    """
```

### 4.2 `first_last` — Head + Tail Extraction (for error output)

Used by error fix structured extraction to keep the most relevant parts of command output (beginning shows the command, end shows the error).

```python
def first_last(content: str, first_tokens: int, last_tokens: int) -> str:
    """Keep first N and last M tokens with separator.

    Used for error fix structured extraction of command output.
    Full output is always preserved in the activity log.
    """
```

---

## 5. Metadata Schema

Every chunk MUST include the following metadata:

```json
{
  "content": "...",
  "content_hash": "sha256:...",
  "group_id": "project-name",
  "type": "implementation|guideline|user_message|...",

  "chunking_metadata": {
    "chunk_type": "ast_code|ast_python|semantic|semantic_code_blob|whole|late|smart_truncated",
    "chunk_index": 0,
    "total_chunks": 5,
    "chunk_size_tokens": 450,
    "overlap_tokens": 68,
    "original_size_tokens": 2300,
    "truncated": false
  },

  "source_metadata": {
    "file_path": "/path/to/file.py",
    "section_header": "## Installation",
    "start_line": 42,
    "end_line": 67,
    "language": "python"
  },

  "embedding_metadata": {
    "embedding_status": "complete|pending|failed",
    "embedding_model": "jina-embeddings-v2-base-en",
    "embedding_dimension": 768
  }
}
```

**V2 Additions**: `original_size_tokens` and `truncated` fields track whether content was reduced.

---

## 6. Implementation Requirements

### 6.1 Storage Paths

There are TWO storage paths that MUST conform to this spec:

| Path | Entry Point | Used By | Must Comply |
|---|---|---|---|
| **Hook scripts** | `*_store_async.py` | Claude Code hooks | YES |
| **SDK/MemoryStorage** | `storage.py` → `store_memory()` | Skills, manual storage, best-practices-researcher | YES |

**CRITICAL**: Both paths must use the SAME chunking logic. As of v2.0.4, both hook scripts and MemoryStorage route through IntelligentChunker with content-type-aware chunking.

### 6.2 Required Components

| Component | Purpose | Location | Status |
|---|---|---|---|
| `IntelligentChunker` | Main chunking orchestrator | `src/memory/chunking/__init__.py` | IMPLEMENTED |
| `ASTChunker` | Tree-sitter code chunking | `src/memory/chunking/ast_chunker.py` | IMPLEMENTED |
| `ProseChunker` | Semantic prose chunking | `src/memory/chunking/prose_chunker.py` | IMPLEMENTED |
| `MarkdownChunker` | Section-aware MD chunking | `src/memory/chunking/markdown.py` | NOT IMPLEMENTED |
| `LateChunker` | Full-doc embedding extraction | `src/memory/chunking/late.py` | NOT IMPLEMENTED |
| Processing Utilities | Chunk boundary & extraction tools | `src/memory/chunking/truncation.py` | IMPLEMENTED (v2.0.4) |

### 6.3 What Must Change (Implementation Gap)

| Issue | Current State | Required State | Priority |
|---|---|---|---|
| `_enforce_content_limit()` | ~~Hard truncation~~ **REMOVED (v2.0.4)** | N/A | ~~CRITICAL~~ DONE |
| `user_prompt_store_async.py` | ~~Single point, smart_end truncation~~ **ProseChunker topical chunking (v2.0.4)** | Whole <2000 tokens; topical chunking >=2000 tokens (N vectors) | ~~HIGH~~ DONE |
| `agent_response_store_async.py` | ~~Single point, smart_end truncation~~ **ProseChunker topical chunking (v2.0.4)** | Whole <3000 tokens; topical chunking >=3000 tokens (N vectors) | ~~HIGH~~ DONE |
| `error_store_async.py` | ~~output[:500] hard truncation~~ **Truncation removed (v2.0.4)** | Structured extraction (full output in activity log) | ~~HIGH~~ DONE |
| `MemoryStorage.store_memory()` | ~~Smart truncation for user/agent only~~ **Routes through IntelligentChunker (v2.0.4)** | Route ALL types through IntelligentChunker (with explicit content_type) | ~~CRITICAL~~ DONE |
| `store_best_practice()` | ~~Passes through store_memory~~ **Routes via IntelligentChunker (v2.0.4)** | Section-aware chunking for guidelines (N vectors) | ~~CRITICAL~~ DONE |
| `MemoryStorage.store_memories_batch()` | Smart truncation for user/agent only | Route ALL types through IntelligentChunker (with explicit content_type) | HIGH |
| Chunking metadata | ~~In store_async.py + user_prompt hook~~ **ALL stored points (v2.0.4)** | ALL stored points | ~~MEDIUM~~ DONE |

---

## 7. Content Size Decision Tree

```
Content arrives for storage
    │
    ├── Is it code? (file extension: .py/.js/.ts etc)
    │   ├── <512 tokens → Store whole (1 vector)
    │   └── >=512 tokens → AST chunk (512 tokens, 20% overlap, N vectors)
    │
    ├── Is it a user message? (type: user_message)
    │   ├── <2000 tokens → Store whole (1 vector)
    │   └── >=2000 tokens → Topical chunking (512 tokens, 15% overlap, N vectors)
    │
    ├── Is it an agent response? (type: agent_response)
    │   ├── <3000 tokens → Store whole (1 vector)
    │   └── >=3000 tokens → Topical chunking (512 tokens, 15% overlap, N vectors)
    │
    ├── Is it a session summary? (type: session)
    │   ├── <8192 tokens → Late chunking (single embedding)
    │   └── >=8192 tokens → Semantic chunking (512 tokens, 15% overlap, N vectors)
    │
    ├── Is it a guideline/best practice? (type: guideline)
    │   ├── <512 tokens → Store whole (1 vector)
    │   └── >=512 tokens → Section-aware chunking (512 tokens, 15% overlap, N vectors)
    │
    ├── Is it an error fix? (type: error_fix)
    │   └── Structured extraction (1 vector, full output in activity log)
    │       ├── error_message: FULL (never reduce)
    │       ├── error_type: Extracted class name
    │       ├── command: FULL
    │       ├── file_refs: All file paths mentioned
    │       └── stack_trace: Last 20-30 lines (where the error is)
    │
    ├── Is it a decision? (type: decision)
    │   └── Store whole (1 vector)
    │
    └── Is it a code blob? (type: github_code_blob, source: github)
        ├── Python file → AST chunking (Section 2.7.2)
        │   ├── Module-level code → 1 chunk (imports, constants, top-level)
        │   ├── Each function/class → 1 chunk
        │   ├── Chunks >1024 tokens → sub-chunk (512 tokens, 20% overlap)
        │   └── Context enrichment header prepended to every chunk
        └── Non-Python file → Semantic line-based (Section 2.7.3)
            ├── 512 tokens, 20% overlap
            ├── Trailing chunks <50 tokens → append to previous
            └── Context enrichment header prepended to every chunk

    INVARIANT: Full content is ALWAYS preserved in the activity log.
    NO CONTENT IS EVER DISCARDED from the system.
    Chunking splits content into multiple vectors — all content is preserved.
```

---

## 8. Best Practices References

This specification is derived from the following researched best practices:

| BP-ID | Topic | Key Contribution |
|---|---|---|
| BP-001 | RAG Chunking Strategies 2026 | Optimal chunk sizes, Jina v2 limits, late chunking, cAST |
| BP-002 | Conversation Memory for Vector DBs 2026 | Turn storage, summaries, dedup, context reconstruction |
| BP-014 | Intelligent Document Chunking | AST-based code chunking, 512-token prose chunks |
| BP-015 | RAG Collection Management | Collection routing, chunk metadata |
| BP-016 | Advanced Chunking Optimization | Tree-sitter performance, overlap optimization |
| BP-017 | Advanced Collection Management | Deduplication, cross-collection handling |
| BP-022 | Memory Context Injection | Token budgets, context formatting |
| BP-003 | Memory Pipeline Ordering 2026 | Classify-before-chunk, 8-stage pipeline, queue architecture |
| BP-065 | AST-Aware Code Chunking 2026 | Context enrichment headers, +70.1% Recall@5, Python AST parsing |
| BP-066 | Cross-Collection Freshness Validation | Batch lookup patterns, blob hash comparison |
| BP-068 | Automated Update Detection | Change detection strategies for code sync |

---

## 9. Migration Path from V1

### Done (v2.0.4)
1. Removed `_enforce_content_limit()` from `storage.py` (Phase 1) ✅
2. Created processing utilities in `src/memory/chunking/truncation.py` — `smart_end` + `first_last` (Phase 2) ✅
3. `user_prompt_store_async.py`: ProseChunker topical chunking for messages >=2000 tokens (Phase 3) ✅
4. `agent_response_store_async.py`: ProseChunker topical chunking for responses >=3000 tokens (Phase 3) ✅
5. `error_store_async.py`: Removed `[:2000]` hard truncation fallback (Phase 3) ✅
6. `IntelligentChunker.chunk()`: Accepts explicit `content_type: ContentType | None` parameter (Phase 4) ✅
7. `MemoryStorage.store_memory()`: Routes ALL types through IntelligentChunker with MemoryType → ContentType mapping (Phase 4) ✅
8. `store_best_practice()`: Routes through IntelligentChunker via store_memory (Phase 4) ✅
9. Chunking metadata (`chunking_metadata` dict) added to ALL stored points — hooks and SDK (Phase 5) ✅
10. 12 trigger NameError fixes across 5 scripts ✅
11. `MAX_CONTENT_LENGTH` increased from 10,000 to 100,000 ✅
12. Grafana dashboard hook dropdown updated ✅

### v2.0.5 (Next Target)
1. Session summary late chunking (LateChunker implementation)
2. Chunk deduplication (0.92 cosine similarity check before storage)

### v2.1
1. Implement `MarkdownChunker` for section-aware guideline chunking
2. Implement `LateChunker` for session summaries
3. Add `original_size_tokens` tracking to all storage paths
4. Restructure pipeline: classify-before-store (BP-003)
5. Error fix solution capture: update stored error_fix when resolved (TECH-DEBT-153)

### v2.0.6 (Current Target)
1. Code blob AST-aware chunking for Python (Section 2.7, SPEC-007) ← **NEW in V2.2**
2. Context enrichment headers for code blob chunks (Section 2.7.4) ← **NEW in V2.2**
3. Non-Python semantic code blob chunking (Section 2.7.3) ← **NEW in V2.2**

### v2.2 (Future)
1. Late chunking via Jina API for documents >2000 tokens
2. Adaptive Focus Memory (importance-based fidelity levels)
3. Incremental re-chunking on file edit
4. Tree-sitter integration for JS/TS/Go/Rust AST-level code blob chunking

---

## Document References

| Document | Relationship |
|---|---|
| [Core-Architecture-Principle-V2.md](./Core-Architecture-Principle-V2.md) | Parent architecture |
| [Chunking-Strategy-V1.md](./Chunking-Strategy-V1.md) | Previous version (superseded) |
| [Memory-System-Components-V1.md](./Memory-System-Components-V1.md) | Component specifications |
| [MEMORY-SYSTEM-REDESIGN-v2.md](./MEMORY-SYSTEM-REDESIGN-v2.md) | Full system design |
| [GitHub-Integration-V1.md](./GitHub-Integration-V1.md) | GitHub sync architecture (code blob source) |

### Research Deliverables

| File | Content |
|---|---|
| `oversight/knowledge/best-practices/BP-001-rag-chunking-strategies-2026.md` | RAG chunking 2026 research (23K chars) |
| `oversight/knowledge/best-practices/BP-002-conversation-memory-vector-databases-2026.md` | Conversation memory research (1076 lines) |
| `docs/RAG-CHUNKING-BEST-PRACTICES-2026.md` | Truncation anti-patterns, dual-storage patterns |
| `docs/conversation-memory-best-practices.md` | Production architectures, implementation checklist |

---

**Version History**:
- V2.2 (2026-02-22): Added AST-aware code blob chunking section (Section 2.7) documenting GitHub sync file chunking. Python files chunked via `ast.parse()` at function/class boundaries; non-Python uses semantic line-based chunking at 512 tokens with 20% overlap. Context enrichment headers (+70.1% Recall@5 per BP-065) prepended to every chunk. Updated discussions collection table, decision tree, and migration path. Based on SPEC-007 (CodeBlobSync) and verified against `src/memory/connectors/github/code_sync.py`.
- V2.1 (2026-02-07): Fixed Section 7 decision tree — replaced truncation with topical chunking for user messages (>=2000 tokens) and agent responses (>=3000 tokens). Reframed Section 4 as processing utilities (not storage strategies). Updated error fix to structured extraction model. Fixed Section 2.4 YAML to remove contradictory truncation references. Strengthened anti-pattern language to prohibit all forms of content truncation for storage. Updated migration path to reflect v2.0.4 completed work. Added BP-003 reference. Based on PM #15 architecture review with best practices research.
- V2.0 (2026-02-06): Major update incorporating 2026 research. Added anti-patterns section, dual-storage principle, smart truncation spec, error fix strategy, content size decision tree, implementation gap analysis. Explicitly prohibits `_enforce_content_limit()`. Based on BP-001, BP-002, and 50+ research sources.
- V1.0 (2026-01-23): Initial source of truth document
