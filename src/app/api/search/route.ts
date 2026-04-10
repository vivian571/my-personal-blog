import { NextResponse } from 'next/server';
import { generateSearchIndex } from '@/lib/search';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const index = generateSearchIndex();
        return NextResponse.json(index);
    } catch (error) {
        console.error('Search index generation failed:', error);
        return NextResponse.json({ error: 'Failed to generate search index' }, { status: 500 });
    }
}
