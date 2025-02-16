// utils/similarity.ts

type EmbeddingsData = {
    [key: string]: number[]
}

function cosineSimilarity(a: number[], b: number[]): number {
    console.log('Vector A length:', a?.length, 'First few values:', a?.slice(0, 3));
    console.log('Vector B length:', b?.length, 'First few values:', b?.slice(0, 3));
    
    if (!Array.isArray(a) || !Array.isArray(b)) {
        console.error('Invalid vectors - not arrays:', { a: typeof a, b: typeof b });
        return 0;
    }
    
    if (a.length !== b.length) {
        console.error('Vector length mismatch:', { aLength: a.length, bLength: b.length });
        return 0;
    }

    if (a.length === 0 || b.length === 0) {
        console.error('Empty vectors');
        return 0;
    }

    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    
    return dotProduct / (magnitudeA * magnitudeB);
}

export async function getSimilarGrants(searchQuery: string, numResults: number = 10) {
    try {
        console.log('Starting similarity search for:', searchQuery);
        
        const response = await fetch('/api/embed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: searchQuery }),
        });
        
        const { embedding: queryEmbedding } = await response.json();
        console.log('Got query embedding of length:', queryEmbedding?.length);
        
        const embeddings = await import('@/internal/embeddings.json');
        const embeddingsData = embeddings.default as EmbeddingsData;
        console.log('Sample embedding from file:', {
            firstKey: Object.keys(embeddingsData)[0],
            sampleEmbedding: embeddingsData[Object.keys(embeddingsData)[0]].slice(0, 3)
        });
        
        const similarities = Object.entries(embeddingsData).map(([grantId, embedding]) => {
            console.log(`Processing grant ${grantId}:`, {
                embeddingType: typeof embedding,
                isArray: Array.isArray(embedding),
                length: (embedding as any)?.length
            });
            
            return {
                grantId,
                similarity: cosineSimilarity(queryEmbedding, embedding as number[])
            };
        });
        
        console.log('Calculated similarities for', similarities.length, 'grants');
        
        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, numResults)
            .map(result => result.grantId);
    } catch (error) {
        console.error('Error in similarity search:', error);
        return [];
    }
}