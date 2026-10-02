"""
sync_data.py
============
Synchronizes and trains all legal intelligence datasets (concordance, acts, statutes, case law)
into the persistent ChromaDB vector store.
"""

import sys
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT_DIR / "src"))

from train_existing_data import run_training_pipeline

if __name__ == "__main__":
    run_training_pipeline()
