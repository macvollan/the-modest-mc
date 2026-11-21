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
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
  return match ? match[3] : null;
}

function extractGoogleDriveFileId(url: string): string | null {
  const m1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m1) return m1[1];
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2 && !url.includes("/folders/")) return m2[1];
  return null;
}

function extractGoogleDriveFolderId(url: string): string | null {
  const m = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  return null;
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

function normalizeUrl(input: string): string {
  let trimmed = input.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
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

    // Split input by newlines or commas, handle spaces
    const lines = rawInput
      .split(/[\r\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 3);

    const potentialUrls = lines.map(normalizeUrl);

    const extracted: ExtractedMedia[] = [];
    const seenUrls = new Set<string>();

    for (const urlStr of potentialUrls) {
      if (seenUrls.has(urlStr)) continue;

      // 1. YouTube Video, Shorts or Live
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

      // 2. Vimeo Video
      const vimeoId = getVimeoId(urlStr);
      if (vimeoId) {
        seenUrls.add(urlStr);
        let preview = "/logo.jpg";
        try {
          const vRes = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(urlStr)}`, {
            signal: AbortSignal.timeout(3000),
          });
          if (vRes.ok) {
            const vData = await vRes.json();
            if (vData.thumbnail_url) preview = vData.thumbnail_url;
          }
        } catch {}
        extracted.push({
          id: `vimeo-${vimeoId}`,
          url: urlStr,
          previewUrl: preview,
          type: "video",
          title: `Vimeo Highlight (${vimeoId})`,
        });
        continue;
      }

      // 3. TikTok Video
      if (urlStr.includes("tiktok.com")) {
        seenUrls.add(urlStr);
        let preview = "/logo.jpg";
        let title = "TikTok Celebration Reel";
        try {
          const ttRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(urlStr)}`, {
            signal: AbortSignal.timeout(3000),
          });
          if (ttRes.ok) {
            const ttData = await ttRes.json();
            if (ttData.thumbnail_url) preview = ttData.thumbnail_url;
            if (ttData.title) title = ttData.title;
          }
        } catch {}
        extracted.push({
          id: `tt-${Math.random().toString(36).slice(2, 9)}`,
          url: urlStr,
          previewUrl: preview,
          type: "tiktok",
          title,
        });
        continue;
      }

      // 4. Google Drive single file link (file/d/ID, open?id=ID, uc?id=ID)
      const gdriveFileId = extractGoogleDriveFileId(urlStr);
      if (gdriveFileId) {
        seenUrls.add(urlStr);
        // Thumbnail endpoint from Google doesn't require Google sign-in for public view links
        const thumbUrl = `https://drive.google.com/thumbnail?id=${gdriveFileId}&sz=w1600`;
        const directDownloadUrl = `https://drive.google.com/uc?export=view&id=${gdriveFileId}`;
        extracted.push({
          id: `gdrive-${gdriveFileId}`,
          url: thumbUrl,
          previewUrl: thumbUrl,
          type: "photo",
          title: `Drive Photo (${gdriveFileId.slice(0, 6)})`,
        });
        continue;
      }

      // 5. Google Drive Folder link (drive.google.com/drive/folders/ID)
      const gdriveFolderId = extractGoogleDriveFolderId(urlStr);
      if (gdriveFolderId) {
        try {
          const folderRes = await fetch(urlStr, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
            signal: AbortSignal.timeout(6000),
          });
          if (folderRes.ok) {
            const folderHtml = await folderRes.text();
            // Google Drive public folder HTML includes file IDs
            const fileIdMatches = folderHtml.matchAll(/\/file\/d\/([a-zA-Z0-9_-]{20,})/g);
            let folderCount = 0;
            for (const fm of fileIdMatches) {
              const fId = fm[1];
              if (!seenUrls.has(fId)) {
                seenUrls.add(fId);
                const thumb = `https://drive.google.com/thumbnail?id=${fId}&sz=w1600`;
                extracted.push({
                  id: `gdrive-folder-${fId}`,
                  url: thumb,
                  previewUrl: thumb,
                  type: "photo",
                  title: `Drive Photo (${folderCount + 1})`,
                });
                folderCount++;
                if (folderCount >= 40) break;
              }
            }
          }
        } catch {}

        if (extracted.length > 0) continue;
      }

      // 6. Dropbox link (convert dl=0 to raw=1 for direct access)
      if (urlStr.includes("dropbox.com")) {
        seenUrls.add(urlStr);
        let rawDropbox = urlStr.replace("?dl=0", "?raw=1").replace("&dl=0", "&raw=1");
        if (!rawDropbox.includes("raw=1")) {
          rawDropbox += rawDropbox.includes("?") ? "&raw=1" : "?raw=1";
        }
        const isVid = /\.(mp4|mov|webm|m4v)(\?|$)/i.test(urlStr);
        extracted.push({
          id: `dropbox-${Math.random().toString(36).slice(2, 9)}`,
          url: rawDropbox,
          previewUrl: isVid ? "/logo.jpg" : rawDropbox,
          type: isVid ? "video" : "photo",
          title: cleanTitleFromUrl(urlStr) || "Dropbox Media",
        });
        continue;
      }

      // 7. Direct video files
      if (/\.(mp4|mov|webm|m4v|ogg)(\?|$)/i.test(urlStr) || /cloudinary\.com\/.*\/video\/upload/i.test(urlStr)) {
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

      // 8. Direct image files
      if (
        /\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(urlStr) ||
        /images\.unsplash\.com/i.test(urlStr) ||
        /cloudinary\.com\/.*\/image\/upload/i.test(urlStr)
      ) {
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

      // 9. Generic webpage - crawl HTML for photos & videos
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

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

          // Direct image content-type
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

          // Direct video content-type
          if (contentType.includes("video/")) {
            seenUrls.add(urlStr);
            extracted.push({
              id: `direct-vid-${Math.random().toString(36).slice(2, 9)}`,
              url: urlStr,
              previewUrl: "/logo.jpg",
              type: "video",
              title: cleanTitleFromUrl(urlStr),
            });
            continue;
          }

          const html = await resp.text();
          const baseUrl = new URL(urlStr);

          // Meta tags: handles both property="..." content="..." AND content="..." property="..."
          const metaTagRegex = /<meta\s+([^>]+)>/gi;
          let metaMatch;
          while ((metaMatch = metaTagRegex.exec(html)) !== null) {
            const attrs = metaMatch[1];
            const propMatch = attrs.match(/(?:property|name)=["']([^"']+)["']/i);
            const contentMatch = attrs.match(/content=["']([^"']+)["']/i);
            if (propMatch && contentMatch) {
              const prop = propMatch[1].toLowerCase();
              const content = contentMatch[1].trim();
              if (
                ["og:image", "og:image:secure_url", "og:image:url", "twitter:image", "twitter:image:src"].includes(
                  prop
                )
              ) {
                try {
                  const resolved = new URL(content, baseUrl).toString();
                  if (!seenUrls.has(resolved) && !resolved.endsWith(".svg")) {
                    seenUrls.add(resolved);
                    extracted.push({
                      id: `og-img-${extracted.length + 1}`,
                      url: resolved,
                      previewUrl: resolved,
                      type: "photo",
                      title: cleanTitleFromUrl(resolved),
                    });
                  }
                } catch {}
              } else if (["og:video", "og:video:secure_url", "og:video:url"].includes(prop)) {
                try {
                  const resolved = new URL(content, baseUrl).toString();
                  if (!seenUrls.has(resolved)) {
                    seenUrls.add(resolved);
                    extracted.push({
                      id: `og-vid-${extracted.length + 1}`,
                      url: resolved,
                      previewUrl: "/logo.jpg",
                      type: "video",
                      title: cleanTitleFromUrl(resolved),
                    });
                  }
                } catch {}
              }
            }
          }

          // Img tags
          const imgTagRegex = /<img\s+([^>]+)>/gi;
          let imgMatch;
          while ((imgMatch = imgTagRegex.exec(html)) !== null) {
            const attrs = imgMatch[1];
            const srcMatch = attrs.match(/(?:src|data-src|data-original|data-lazy-src)=["']([^"']+)["']/i);
            if (srcMatch) {
              const rawSrc = srcMatch[1].trim();
              if (
                rawSrc.startsWith("data:") ||
                rawSrc.includes(".svg") ||
                rawSrc.includes("avatar") ||
                rawSrc.includes("icon") ||
                rawSrc.includes("pixel") ||
                rawSrc.includes("tracking")
              ) {
                continue;
              }
              try {
                const resolved = new URL(rawSrc, baseUrl).toString();
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
          }

          // Embedded YouTube iframes
          const iframeTagRegex = /<iframe\s+[^>]*?src=["']([^"']+)["'][^>]*>/gi;
          let ifrMatch;
          while ((ifrMatch = iframeTagRegex.exec(html)) !== null) {
            const src = ifrMatch[1];
            const ytEmbedId = getYouTubeId(src);
            if (ytEmbedId && !seenUrls.has(`yt-${ytEmbedId}`)) {
              seenUrls.add(`yt-${ytEmbedId}`);
              extracted.push({
                id: `yt-embed-${ytEmbedId}`,
                url: `https://www.youtube.com/watch?v=${ytEmbedId}`,
                previewUrl: `https://img.youtube.com/vi/${ytEmbedId}/hqdefault.jpg`,
                type: "youtube",
                title: `YouTube Highlight (${ytEmbedId})`,
              });
            }
          }
        }
      } catch (err) {
        console.warn(`Could not crawl URL ${urlStr}:`, err);
      }
    }

    // 10. Fallback: If no media items were discovered by scraping, but a valid URL was provided,
    // NEVER fail with an error! Return the URL itself as an importable candidate so the user is never blocked!
    if (extracted.length === 0 && potentialUrls.length > 0) {
      for (const fallbackUrl of potentialUrls) {
        const isVideo =
          /\.(mp4|mov|webm|m4v|ogg)(\?|$)/i.test(fallbackUrl) ||
          fallbackUrl.includes("video") ||
          fallbackUrl.includes("reel") ||
          fallbackUrl.includes("watch") ||
          fallbackUrl.includes("tiktok") ||
          fallbackUrl.includes("youtube") ||
          fallbackUrl.includes("youtu.be");
        extracted.push({
          id: `direct-candidate-${Math.random().toString(36).slice(2, 9)}`,
          url: fallbackUrl,
          previewUrl: isVideo ? "/logo.jpg" : fallbackUrl,
          type: isVideo ? "video" : "photo",
          title: cleanTitleFromUrl(fallbackUrl) || "Linked Media",
        });
      }
    }

    // Return BOTH media and items keys so both old and new frontend callers work seamlessly!
    return NextResponse.json({
      success: true,
      found: extracted.length,
      media: extracted.slice(0, 50),
      items: extracted.slice(0, 50),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
