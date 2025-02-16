// app/api/embed/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
    try {
        const { text } = await request.json();
        console.log('Search query received:', text);
        
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });

        // console.log('OpenAI response:', {
        //     embeddingLength: response.data[0].embedding.length,
        //     firstFewValues: response.data[0].embedding.slice(0, 3)
        // });

        return NextResponse.json({ embedding: response.data[0].embedding });
    } catch (error) {
        console.error('Embedding generation error:', error);
        return NextResponse.json(
            { message: 'Error generating embedding' },
            { status: 500 }
        );
    }
}