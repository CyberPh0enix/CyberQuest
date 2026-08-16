import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!res.ok) throw new Error("Failed to fetch from YouTube");
    
    const html = await res.text();
    const tracks = [];
    
    // Highly robust JSON extraction: safely parsing the embedded YouTube state
    const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
    if (!match) throw new Error("Could not find ytInitialData in payload");
    
    const data = JSON.parse(match[1]);
    
    // Traverse the deep YouTube JSON structure safely
    const items = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
    
    for (const item of items) {
      if (tracks.length >= 15) break;
      if (item.videoRenderer) {
        const v = item.videoRenderer;
        
        // Remove tracking artifacts from thumbnail URLs to prevent weird 403s later
        const artUrl = v.thumbnail?.thumbnails?.[0]?.url?.split('?')[0] || '';
        
        tracks.push({
          id: v.videoId,
          title: v.title?.runs?.[0]?.text || "Unknown Title",
          artist: v.ownerText?.runs?.[0]?.text || "YouTube",
          albumArt: artUrl,
          url: v.videoId,
          sourceType: "youtube"
        });
      }
    }

    return NextResponse.json({ results: tracks });
  } catch (error: any) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: "Failed to extract music data" }, { status: 500 });
  }
}
