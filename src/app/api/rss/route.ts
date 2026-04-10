import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/tags';

export const dynamic = 'force-dynamic';

/**
 * Generates an RSS 2.0 feed containing the 20 most recent assets.
 */
export async function GET() {
    try {
        const posts = getAllPosts().slice(0, 20);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const rssItems = posts.map(post => {
            const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString();
            const postUrl = `${baseUrl}/posts/${post.slug}`;
            
            return `
        <item>
            <title><![CDATA[${post.title}]]></title>
            <link>${postUrl}</link>
            <guid isPermaLink="true">${postUrl}</guid>
            <pubDate>${pubDate}</pubDate>
            <description><![CDATA[${post.snippet}]]></description>
            <category>${post.category}</category>
        </item>`;
        }).join('');

        const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>意安序 - 数字博物馆</title>
    <link>${baseUrl}</link>
    <description>存放思想碎片、深度教程与实用工具的数字领地。</description>
    <language>zh-cn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
    ${rssItems}
</channel>
</rss>`;

        return new NextResponse(rssFeed, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        });
    } catch (error) {
        console.error('RSS feed generation failed:', error);
        return NextResponse.json({ error: 'Failed to generate RSS feed' }, { status: 500 });
    }
}
