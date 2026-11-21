import { NextResponse } from "next/server";

interface ExtractedMedia {
  id: string;
  url: string;
  previewUrl: string;
  type: "photo" | "video" | "youtube" | "tiktok";
  title: string;
}

function getYouTubeId(url: string): string | null {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function cleanTitleFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split("/").pop() || "";
    const clean = decodeURIComponent(filename)
      .replace(/\.[a-zA-Z0-9]+$/, "")
      .replace(/[-_]+/g, " ")
      .trim();
    if (clean.length > 2 && !/^[0-9a-f]{8,}$/i.test(clean)) {
      return clean.charAt(0).toUpperCase() + clean.slice(1);
    }
  } catch {}
  return "Event Highlight";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawInput: string = body.url || body.urls || "";

    if (!rawInput || typeof rawInput !== "string") {
      return NextResponse.json(
        { error: "A valid URL or list of URLs is required" },
        { status: 400 }
      );
    }

    // Split input by newlines, spaces, or commas
    const potentialUrls = rawInput
      .split(/[\r\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.startsWith("http://") || u.startsWith("https://"));

    const extracted: ExtractedMedia[] = [];
    const seenUrls = new Set<string>();

    for (const urlStr of potentialUrls) {
      if (seenUrls.has(urlStr)) continue;

      // 1. YouTube Video or Shorts
      const ytId = getYouTubeId(urlStr);
      if (ytId) {
        seenUrls.add(urlStr);
        extracted.push({
          id: `yt-${ytId}`,
          url: urlStr,
          previewUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
          type: "youtube",
          title: `YouTube Reel (${ytId})`,
        });
        continue;
      }

      // 2. TikTok Video
      if (urlStr.includes("tiktok.com")) {
        seenUrls.add(urlStr);
        extracted.push({
          id: `tt-${encodeURIComponent(urlStr).slice(-12)}`,
          url: urlStr,
          previewUrl: "/logo.jpg",
          type: "tiktok",
          title: "TikTok Celebration Reel",
        });
        continue;
      }

      // 3. Google Drive file link conversion (e.g. file/d/ID/view -> uc?id=ID)
      const gdriveMatch = urlStr.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (gdriveMatch) {
        const fileId = gdriveMatch[1];
        const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        seenUrls.add(urlStr);
        extracted.push({
          id: `gdrive-${fileId}`,
          url: directUrl,
          previewUrl: directUrl,
          type: "photo",
          title: `Drive Media (${fileId.slice(0, 6)})`,
        });
        continue;
      }

      // 4. Direct video files
      if (/\.(mp4|mov|webm|m4v|ogg)(\?|$)/i.test(urlStr)) {
        seenUrls.add(urlStr);
        extracted.push({
          id: `vid-${Math.random().toString(36).slice(2, 9)}`,
          url: urlStr,
          previewUrl: urlStr.includes("cloudinary.com")
            ? urlStr.replace(/\.(mp4|mov|webm|m4v)(\?.*)?$/i, ".jpg")
            : "/logo.jpg",
          type: "video",
          title: cleanTitleFromUrl(urlStr),
        });
        continue;
      }

      // 5. Direct image files
      if (/\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(urlStr)) {
        seenUrls.add(urlStr);
        extracted.push({
          id: `img-${Math.random().toString(36).slice(2, 9)}`,
          url: urlStr,
          previewUrl: urlStr,
          type: "photo",
          title: cleanTitleFromUrl(urlStr),
        });
        continue;
      }

      // 6. Generic webpage - crawl HTML for photos & videos
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const resp = await fetch(urlStr, {
          signal: controller.signal,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8",
          },
        });
        clearTimeout(timeoutId);

        if (resp.ok) {
          const contentType = resp.headers.get("content-type") || "";
          if (contentType.includes("image/")) {
            seenUrls.add(urlStr);
            extracted.push({
              id: `direct-img-${Math.random().toString(36).slice(2, 9)}`,
              url: urlStr,
              previewUrl: urlStr,
              type: "photo",
              title: cleanTitleFromUrl(urlStr),
            });
            continue;
          }

          const html = await resp.text();
          const baseUrl = new URL(urlStr);

          // Meta OpenGraph / Twitter tags
          const ogMatches = html.matchAll(
            /<meta\s+[^>]*property=["'](og:image|og:video|twitter:image)["'][^>]*content=["']([^"']+)["']/gi
          );
          for (const m of ogMatches) {
            const raw = m[2];
            try {
              const resolved = new URL(raw, baseUrl).toString();
              if (!seenUrls.has(resolved)) {
                seenUrls.add(resolved);
                const isVid = m[1] === "og:video" || /\.(mp4|mov|webm)(\?|$)/i.test(resolved);
                extracted.push({
                  id: `meta-${extracted.length + 1}`,
                  url: resolved,
                  previewUrl: resolved,
                  type: isVid ? "video" : "photo",
                  title: isVid ? "Web Video Highlight" : "Web Photo Highlight",
                });
              }
            } catch {}
          }

          // Img tags
          const imgMatches = html.matchAll(
            /<img\s+[^>]*?(?:src|data-src|data-original)=["']([^"']+)["'][^>]*>/gi
          );
          for (const m of imgMatches) {
            const raw = m[1];
            if (raw.startsWith("data:") || raw.includes("svg") || raw.includes("icon") || raw.includes("logo") || raw.includes("avatar")) continue;
            try {
              const resolved = new URL(raw, baseUrl).toString();
              if (
                !seenUrls.has(resolved) &&
                /\.(jpg|jpeg|png|webp|avif)/i.test(resolved)
              ) {
                seenUrls.add(resolved);
                extracted.push({
                  id: `img-${extracted.length + 1}`,
                  url: resolved,
                  previewUrl: resolved,
                  type: "photo",
                  title: cleanTitleFromUrl(resolved),
                });
              }
            } catch {}
          }

          // Video / source tags
          const videoMatches = html.matchAll(
            /<(?:video|source)\s+[^>]*?src=["']([^"']+)["'][^>]*>/gi
          );
          for (const m of videoMatches) {
            const raw = m[1];
            try {
              const resolved = new URL(raw, baseUrl).toString();
              if (!seenUrls.has(resolved)) {
                seenUrls.add(resolved);
                extracted.push({
                  id: `vid-${extracted.length + 1}`,
                  url: resolved,
                  previewUrl: "/logo.jpg",
                  type: "video",
                  title: cleanTitleFromUrl(resolved),
                });
              }
            } catch {}
          }
        }
      } catch (err) {
        console.warn(`Could not crawl URL ${urlStr}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      found: extracted.length,
      items: extracted.slice(0, 50), // Cap at 50 to keep UI lightning fast
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
