import json
import os
import numpy as np
import copy
from openai import OpenAI

# ["Undergraduate", "MastersStudent", "Coterm", "PhD", "Postdoc", "Faculty", "VSO", "Other"]

def search(query_embedding):
    
    data = os.path.join(os.path.dirname(__file__),'..', 'database.json')
    embeddings = os.path.join(os.path.dirname(__file__),'..', 'embeddings.json')
    cosine_similarities = []

    for id, embedding in embeddings.items():
        cosine_similarities.append([id, np.dot(embedding, query_embedding) / (np.linalg.norm(embedding) * np.linalg.norm(query_embedding))])
    
    cosine_similarities.sort(key=lambda x: x[1], reverse=True)    
    
    # Remove all results where cosine similarity < 0
    top_results = [item for item in cosine_similarities if item[1] >= 0]

    results = []
    data_copy = copy.deepcopy(data)
    for id, _ in top_results:
        entry = data_copy[id]
        results.append(entry)

    return results

def main():
    
    data_path = 'database.json'
    query = "AI healthcare existential research"
    
    with open(data_path, 'r') as file:
        data = json.load(file)

    client = OpenAI()
    query = query.replace("\n", " ")
    model="text-embedding-3-small"
    query_embedding = client.embeddings.create(input = [query], model = model).data[0].embedding
    search(data, query_embedding)
    

if __name__ == '__main__':
    main()