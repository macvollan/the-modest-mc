import { NextResponse } from "next/server";
import {
  getCrewMembers,
  addCrewMember,
  updateCrewMember,
  deleteCrewMember,
} from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";
    const crew = await getCrewMembers(!showAll);
    return NextResponse.json({ success: true, crew });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      role,
      bio,
      photoUrl,
      specialties,
      experienceYears,
      displayOrder,
      isActive,
    } = body;

    if (!name || !role || !photoUrl) {
      return NextResponse.json(
        { error: "Name, role, and photoUrl are required" },
        { status: 400 }
      );
    }

    const newMember = await addCrewMember({
      name,
      role,
      bio,
      photoUrl,
      specialties,
      experienceYears,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return NextResponse.json({ success: true, member: newMember });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Crew member ID is required" },
        { status: 400 }
      );
    }

    const updated = await updateCrewMember(Number(id), updates);
    return NextResponse.json({ success: true, member: updated });
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
        // No body
      }
    }

    const id = Number(idParam);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Valid crew member id is required" },
        { status: 400 }
      );
    }

    await deleteCrewMember(id);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
