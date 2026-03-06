const FEEDS = {
  top:       'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
  education: 'https://www.thehindu.com/education/feeder/default.rss',
  tech:      'https://timesofindia.indiatimes.com/rssfeeds/66949542.cms',
  business:  'https://timesofindia.indiatimes.com/rssfeeds/1898055.cms',
  sports:    'https://www.ndtv.com/cricket/rss',
  science:   'https://www.thehindu.com/sci-tech/science/feeder/default.rss',
};

export default {
  async fetch(request) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    const cat = new URL(request.url).searchParams.get('cat') || 'top';
    const feedUrl = FEEDS[cat] || FEEDS.top;

    try {
      const res = await fetch(feedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!res.ok) throw new Error('Feed error ' + res.status);
      const xml = await res.text();

      const feedTitle = (xml.match(/<channel>[\s\S]*?<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/) || [])[1] || '';
      const items = [];

      for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
        const b = m[1];
        const g = (tag) => {
          const r = b.match(new RegExp('<' + tag + '[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/' + tag + '>', 'i'));
          return (r?.[1] || '').replace(/<[^>]*>/g, '').trim();
        };
        items.push({
          title:       g('title'),
          description: g('description').replace(/&lt;[^&]*&gt;/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\u0000-\u001F/g,'').substring(0, 200),
          link:        g('link') || g('guid'),
          pubDate:     g('pubDate'),
          source_name: feedTitle.replace(/,.*$/,'').trim(),
          image_url:   (b.match(/url="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/) || [])[1] || null,
        });
        if (items.length >= 12) break;
      }

      return new Response(JSON.stringify({ status: 'ok', category: cat, items }), {
        headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' }
      });

    } catch (err) {
      return new Response(JSON.stringify({ status: 'error', message: err.message }), {
        status: 500, headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }
  }
};
