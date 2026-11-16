import { NextResponse } from "next/server";
import { getGalleryItems, addGalleryItem } from "@/lib/db";

export async function GET() {
  try {
    const items = await getGalleryItems();
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, mediaType, mediaUrl, thumbnailUrl, location, description } = body;

    if (!title || !category || !mediaUrl) {
      return NextResponse.json(
        { error: "Title, category, and mediaUrl are required" },
        { status: 400 }
      );
    }

    const newItem = await addGalleryItem({
      title,
      category,
      mediaType: mediaType || "photo",
      mediaUrl,
      thumbnailUrl,
      location,
      description,
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
