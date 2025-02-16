// utils/similarity.ts

type EmbeddingsData = {
    [key: string]: number[]
}

function cosineSimilarity(a: number[], b: number[]): number {
    console.log('Debug vectors:', {
        vectorA: {
            value: a,
            type: typeof a,
            isArray: Array.isArray(a),
            constructor: a?.constructor?.name
        },
        vectorB: {
            value: b,
            type: typeof b,
            isArray: Array.isArray(b),
            constructor: b?.constructor?.name
        }
    });
    
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
        
        console.log('Fetching embeddings.json...');
        const response2 = await fetch('/embeddings.json');
        if (!response2.ok) {
            throw new Error(`Failed to load embeddings: ${response2.status} ${response2.statusText}`);
        }
        const embeddingsData = await response2.json();
        console.log('Loaded embeddings data:', {
            numEmbeddings: Object.keys(embeddingsData).length,
            firstKey: Object.keys(embeddingsData)[0],
            hasG1567: 'g1567' in embeddingsData,
            sampleEmbedding: embeddingsData[Object.keys(embeddingsData)[0]]?.slice(0, 3)
        });
        
        // Check if g1567 exists in embeddings
        if ('g1567' in embeddingsData) {
            console.log('g1567 embedding found:', {
                embedding: embeddingsData['g1567']?.slice(0, 5),
                length: embeddingsData['g1567']?.length
            });
        } else {
            console.log('g1567 not found in embeddings data');
        }

        const similarities = Object.entries(embeddingsData).map(([grantId, embedding]) => {
            const similarity = cosineSimilarity(queryEmbedding, embedding as number[]);
            if (grantId === 'g1567') {
                console.log('g1567 similarity score:', similarity);
            }
            return { grantId, similarity };
        });

        // Log top 10 results
        const topResults = similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 10);
        console.log('Top 10 results:', topResults);
        
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