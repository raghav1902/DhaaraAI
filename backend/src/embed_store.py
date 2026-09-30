"""
embed_store.py
==============
Module responsible for generating dense vector embeddings using a local
HuggingFace model (all-MiniLM-L6-v2) and persisting them into ChromaDB.

For College Project / Viva Reference:
-------------------------------------
1. Why all-MiniLM-L6-v2?
   - Architecture: 6-layer MiniLM Transformer with 384-dimensional output embeddings.
   - 100% Free & Local: Runs on standard CPU with zero API costs, zero internet
     dependency after the initial model download, and no rate limits.
   - High Efficiency: Model size is only ~80MB with fast inference (~10ms per chunk),
     making it ideal for real-time document search on consumer laptops.
2. Why ChromaDB?
   - Open-source, embedded vector database designed specifically for AI/LLM apps.
   - Zero Server Overhead: Unlike Pinecone, Milvus, or Weaviate, ChromaDB does not
     require running a separate server process, Docker container, or cloud subscription.
   - Local Persistence: Chunks, embeddings, and metadata are saved locally on disk
     in the `chroma_db/` directory using SQLite and Parquet files.
3. Cosine Similarity Search:
   - Queries and document chunks are converted into 384-dimensional vectors.
   - Similarity is computed using the cosine of the angle between query and document vectors:
     Cosine Similarity = (A · B) / (||A|| * ||B||)
   - Closer to 1.0 indicates high semantic relevance, allowing retrieval of relevant
     legal provisions even when the user's wording differs from the statutory text.
"""

import os
import json
import threading
from pathlib import Path
from typing import List, Dict, Any, Optional
import chromadb
from chromadb.config import Settings
# Prefer ChromaDB's built-in ONNX runtime to avoid SciPy Application Control DLL blocks
HAS_SENTENCE_TRANSFORMERS = False
import chromadb.utils.embedding_functions as ef
import numpy as np

# Default persistent database folder and collection name
DEFAULT_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "chroma_db")
COLLECTION_NAME = "dhaara_legal_kb"
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


class LocalEmbeddingModel:
    """
    Wrapper providing a uniform .encode(texts) interface using either
    SentenceTransformer or ChromaDB's ONNX all-MiniLM-L6-v2 model.
    """
    def __init__(self, model_name: str = MODEL_NAME):
        self.model_name = model_name
        self._st = None
        self._ef = None

        if HAS_SENTENCE_TRANSFORMERS:
            try:
                self._st = SentenceTransformer(self.model_name)
            except Exception as e:
                print(f"[embed_store] SentenceTransformer unavailable ({e}), using ONNX all-MiniLM-L6-v2...")
                self._ef = ef.DefaultEmbeddingFunction()
        else:
            self._ef = ef.DefaultEmbeddingFunction()

    def encode(self, texts: List[str], show_progress_bar: bool = False, convert_to_numpy: bool = True):
        if self._st is not None:
            return self._st.encode(texts, show_progress_bar=show_progress_bar, convert_to_numpy=convert_to_numpy)
        res = self._ef(list(texts))
        return np.array(res)


class LegalEmbedStore:
    """
    Manages local vector embeddings and persistent ChromaDB storage for DhaaraAI.
    """

    def __init__(self, db_path: str = DEFAULT_DB_PATH, model_name: str = MODEL_NAME):
        """
        Initializes the persistent ChromaDB client and loads the local embedding model.
        """
        self.db_path = db_path
        self.model_name = model_name

        # Thread-safety: RLock allows the same thread to re-acquire (e.g. seed then query)
        # while blocking concurrent writes from other threads.
        self._lock = threading.RLock()

        # Ensure db directory exists
        Path(self.db_path).mkdir(parents=True, exist_ok=True)

        print(f"[embed_store] Connecting to persistent ChromaDB at: '{self.db_path}'...")
        self.client = chromadb.PersistentClient(path=self.db_path)

        print(f"[embed_store] Loading embedding model '{self.model_name}' on local device...")
        self.model = LocalEmbeddingModel(self.model_name)
        print("[embed_store] Embedding model loaded successfully (384-dim dense vectors).")

        # Get or create the legal knowledge base collection with cosine similarity
        self.collection = self.client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )
        print(f"[embed_store] Collection '{COLLECTION_NAME}' ready. Current count: {self.collection.count()} chunks.")

    def add_chunks(self, chunks: List[Dict[str, Any]], batch_size: int = 64) -> int:
        """
        Generates embeddings for chunk texts and stores them in ChromaDB with metadata.
        Thread-safe: acquires write lock to prevent concurrent indexing corruption.
        """
        if not chunks:
            print("[embed_store] No chunks provided for indexing.")
            return 0

        total_chunks = len(chunks)
        print(f"[embed_store] Indexing {total_chunks} chunks into collection '{COLLECTION_NAME}'...")

        upserted_count = 0
        with self._lock:  # exclusive write lock
            for i in range(0, total_chunks, batch_size):
                batch = chunks[i : i + batch_size]

                ids = [c["chunk_id"] for c in batch]
                texts = [c["text"] for c in batch]
                metadatas = [
                    {
                        "source": str(c.get("source", "unknown")),
                        "page": int(c.get("page", 1)),
                        "section": str(c.get("section", "General")),
                        "section_title": str(c.get("section_title", "")),
                        "token_count": int(c.get("token_count", 0)),
                    }
                    for c in batch
                ]

                # Compute dense embeddings locally on CPU
                embeddings = self.model.encode(texts, show_progress_bar=False, convert_to_numpy=True).tolist()

                # Upsert into ChromaDB (inserts new or updates existing chunk_ids)
                self.collection.upsert(
                    ids=ids,
                    documents=texts,
                    embeddings=embeddings,
                    metadatas=metadatas
                )
                upserted_count += len(batch)
                print(f"[embed_store] Processed {upserted_count}/{total_chunks} chunks...")

        print(f"[embed_store] Indexing complete! Total collection count: {self.collection.count()} chunks.")
        return upserted_count

    def index_statutes_json(self, json_path: str) -> int:
        """
        Indexes raw statutory definitions from a structured JSON file.
        """
        p = Path(json_path)
        if not p.exists():
            print(f"[embed_store] Statutes JSON not found at: {json_path}")
            return 0

        with open(p, "r", encoding="utf-8") as f:
            statutes = json.load(f)

        chunks = []
        for idx, item in enumerate(statutes, 1):
            sec_clean = item.get("section", f"Statute_{idx}").replace(" ", "_")
            chunks.append({
                "chunk_id": f"statute_{sec_clean}_{idx}",
                "text": item.get("text", ""),
                "source": item.get("source", "Indian Statutes"),
                "page": item.get("page", 1),
                "section": item.get("section", "General"),
                "section_title": item.get("section_title", ""),
                "token_count": len(item.get("text", "").split())
            })

        print(f"[embed_store] Loaded {len(chunks)} statutory chunks from {p.name}.")
        return self.add_chunks(chunks)

    def seed_defaults_if_empty(self, data_dir: Optional[str] = None):
        """
        Seeds ChromaDB automatically with verified statutory data if the collection is empty.
        """
        if self.collection.count() == 0:
            root = Path(__file__).parent.parent
            statutes_file = root / "data" / "comprehensive_statutes.json"
            if statutes_file.exists():
                print(f"[embed_store] Collection is empty. Auto-seeding from {statutes_file.name}...")
                self.index_statutes_json(str(statutes_file))

    def index_from_json(self, json_path: str = "processed/chunks.json") -> int:
        """
        Helper method to load chunks from a JSON file and index them.
        Path-traversal protected: only allows paths within the backend root.
        """
        p = Path(json_path).resolve()
        root = Path(self.db_path).parent.resolve()   # backend root

        # Ensure the resolved path stays within the backend directory
        if not str(p).startswith(str(root)):
            raise PermissionError(
                f"[embed_store] Path traversal denied: '{json_path}' is outside the backend root."
            )

        if not p.exists():
            raise FileNotFoundError(f"Chunks file not found at: {json_path}")

        with open(p, "r", encoding="utf-8") as f:
            chunks = json.load(f)

        return self.add_chunks(chunks)

    def query(
        self,
        query_text: str,
        top_k: int = 5,
        section_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Encodes user query into an embedding, performs cosine similarity search in ChromaDB,
        and returns top_k ranked chunks with metadata and similarity scores.

        Parameters:
            query_text (str): The user's question or search query.
            top_k (int): Number of most relevant chunks to retrieve (default: 5).
            section_filter (str, optional): Filter results by specific section (e.g., "Section 420").

        Returns:
            List[Dict[str, Any]]: List of retrieved chunks with metadata and similarity scores:
                [
                    {
                        "chunk_id": str,
                        "text": str,
                        "section": str,
                        "section_title": str,
                        "source": str,
                        "page": int,
                        "similarity_score": float (0.0 to 1.0)
                    },
                    ...
                ]
        """
        if not query_text.strip():
            return []

        # Guard top_k independently of any API-level validation
        top_k = max(1, min(int(top_k or 5), 50))

        # Encode question using the same embedding model
        query_embedding = self.model.encode([query_text], convert_to_numpy=True).tolist()

        # Build where clause if section filter is requested
        where_clause = None
        if section_filter:
            where_clause = {"section": section_filter}

        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=top_k,
            where=where_clause,
            include=["documents", "metadatas", "distances"]
        )

        retrieved_chunks = []
        if results and results.get("documents") and results["documents"][0]:
            docs = results["documents"][0]
            metas = results["metadatas"][0]
            dists = results["distances"][0]
            ids = results["ids"][0]

            for doc, meta, dist, cid in zip(docs, metas, dists, ids):
                # ChromaDB returns cosine distance (distance = 1 - cosine_similarity).
                # Convert cosine distance to similarity score in range [0.0, 1.0]
                similarity = max(0.0, min(1.0, 1.0 - dist))

                retrieved_chunks.append({
                    "chunk_id": cid,
                    "text": doc,
                    "section": meta.get("section", "General"),
                    "section_title": meta.get("section_title", ""),
                    "source": meta.get("source", "unknown"),
                    "page": meta.get("page", 1),
                    "similarity_score": round(similarity, 4)
                })

        return retrieved_chunks

    def get_stats(self) -> Dict[str, Any]:
        """
        Returns statistics about the current ChromaDB collection.
        """
        count = self.collection.count()
        sources = set()

        if count > 0:
            # Sample metadata to find unique source filenames
            sample = self.collection.get(include=["metadatas"])
            for m in sample.get("metadatas", []):
                if m and "source" in m:
                    sources.add(m["source"])

        return {
            "total_chunks": count,
            "unique_sources": sorted(list(sources)),
            "collection_name": COLLECTION_NAME,
            "model_name": self.model_name,
            "db_path": self.db_path
        }

    def reset_collection(self):
        """
        Deletes and recreates the collection for a clean re-indexing.
        Thread-safe: acquires exclusive write lock — no concurrent query/write allowed.
        """
        with self._lock:
            print(f"[embed_store] Resetting collection '{COLLECTION_NAME}'...")
            self.client.delete_collection(name=COLLECTION_NAME)
            self.collection = self.client.get_or_create_collection(
                name=COLLECTION_NAME,
                metadata={"hnsw:space": "cosine"}
            )
            print("[embed_store] Collection reset successfully.")



if __name__ == "__main__":
    # Self-test when executed directly
    store = LegalEmbedStore()
    stats = store.get_stats()
    print("\nChromaDB Knowledge Base Stats:")
    print(json.dumps(stats, indent=2))
