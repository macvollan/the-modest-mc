import { NextResponse } from "next/server";
import {
  getGalleryItems,
  addGalleryItem,
  deleteGalleryItem,
  getGalleryItemById,
} from "@/lib/db";

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
    const {
      title,
      category,
      mediaType,
      mediaUrl,
      thumbnailUrl,
      location,
      description,
      uploadedBy,
    } = body;

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
      uploaded_by: uploadedBy || "Admin",
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
    let roleParam = searchParams.get("role");

    if (!idParam) {
      try {
        const body = await req.json();
        if (body?.id !== undefined) {
          idParam = String(body.id);
        }
        if (body?.role) {
          roleParam = body.role;
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

    // If request comes from crew, enforce 30-minute deletion rule
    if (roleParam === "crew") {
      const existing = await getGalleryItemById(id);
      if (existing && existing.created_at) {
        const itemTime = new Date(existing.created_at).getTime();
        const diffMinutes = (Date.now() - itemTime) / (1000 * 60);
        if (diffMinutes > 30) {
          return NextResponse.json(
            {
              error:
                "Deletion window expired. Crew members can only delete uploads within 30 minutes. Please request Admin Macvollan to delete.",
            },
            { status: 403 }
          );
        }
      }
    }

    await deleteGalleryItem(id);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
