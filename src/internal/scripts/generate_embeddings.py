import json
import os
from openai import OpenAI

def generate_embeddings(data_path, embeddings_path):
    client = OpenAI()  # This will use OPENAI_API_KEY from environment
    model = "text-embedding-3-small"
    
    with open(data_path, 'r') as file:
        data = json.load(file)
    
    try:
        with open(embeddings_path, 'r') as file:
            embeddings = json.load(file)
    except FileNotFoundError:
        embeddings = {}
    
    for key, value in data.items():
        if 'description' not in value or value['description'] is None:
            print(f"Warning: Missing description for entry {key}")
            continue
            
        description = value['description'].replace("\n", " ")
        try:
            embedding = client.embeddings.create(input=[description], model=model).data[0].embedding
            embeddings[key] = embedding
            print(f"Generated embedding for {key}")
        except Exception as e:
            print(f"Error generating embedding for {key}: {e}")
    
    with open(embeddings_path, 'w') as file:
        json.dump(embeddings, file, indent=4)

if __name__ == '__main__':
    data_path = os.path.join('..', '..', '..', 'database.json')
    embeddings_path = os.path.join('..', '..', '..', 'public', 'embeddings.json')
    generate_embeddings(data_path, embeddings_path)
