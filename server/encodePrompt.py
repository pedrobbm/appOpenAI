# server/encode_prompt.py
import sys
import json
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("google/embeddinggemma-300m")

query = " ".join(sys.argv[1:])  # join all CLI args as a single prompt
embedding = model.encode(query, normalize_embeddings=True).tolist()

print(json.dumps(embedding))
