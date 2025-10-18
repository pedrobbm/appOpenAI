import sys
import json
import numpy as np
from sentence_transformers import SentenceTransformer

if len(sys.argv) < 2:
    print("[]")  # empty list fallback
    sys.exit(0)

query = sys.argv[1]

# Load the same model as before
model = SentenceTransformer("all-MiniLM-L6-v2")

# Encode the prompt
embedding = model.encode([query], normalize_embeddings=True)[0]

# Print *only* JSON to stdout
sys.stdout.write(json.dumps(embedding.tolist()))
