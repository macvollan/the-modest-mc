import { NextResponse } from "next/server";
import { getGalleryItems, addGalleryItem, deleteGalleryItem } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    let items = await getGalleryItems();

    if (category) {
      items = items.filter(
        (item: any) =>
          (item.category || "").toLowerCase() === category.toLowerCase()
      );
    }

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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let idParam = searchParams.get("id");

    if (!idParam) {
      try {
        const body = await req.json();
        if (body?.id !== undefined) {
          idParam = String(body.id);
        }
      } catch {
        // No JSON body provided
      }
    }

    const id = Number(idParam);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Valid gallery item id is required" },
        { status: 400 }
      );
    }

    await deleteGalleryItem(id);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
