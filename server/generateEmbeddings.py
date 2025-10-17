# server/generateEmbeddings.py
import json
from sentence_transformers import SentenceTransformer
import numpy as np

# Load schema.json
with open("schema.json", "r", encoding="utf-8") as f:
    schema = json.load(f)

# Load embedding model (free and open)
print("🧠 Loading local embedding model (all-MiniLM-L6-v2)...")
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Prepare descriptions
descriptions = [t["description"] for t in schema]

# Encode descriptions
print("🔧 Computing embeddings for schema descriptions...")
embeddings = model.encode(descriptions, normalize_embeddings=True)

# Combine results
schema_embeddings = []
for i, table in enumerate(schema):
    schema_embeddings.append({
        "table": table["table"],
        "description": table["description"],
        "embedding": embeddings[i].tolist()
    })

# Save embeddings to JSON
with open("schema_embeddings.json", "w", encoding="utf-8") as f:
    json.dump(schema_embeddings, f, indent=2)

print("✅ Schema embeddings saved to schema_embeddings.json")
