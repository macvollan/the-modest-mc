import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

// Global in-memory storage fallback when DATABASE_URL is not yet connected
export interface InMemBooking {
  id: number;
  name: string;
  phone: string;
  email?: string;
  event_type: string;
  event_date: string;
  event_location: string;
  guest_count: string;
  services: string;
  notes?: string;
  status: string;
  created_at: string;
}

export interface InMemGallery {
  id: number;
  title: string;
  category: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  location: string;
  description?: string;
  uploaded_by?: string;
  created_at: string;
}

export interface InMemCrew {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo_url: string;
  specialties: string;
  experience_years: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

// ---------------- LOCAL / SERVERLESS DISK BACKUP HELPERS ---------------- //
function getBackupFilePath() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return "/tmp/modest_crew_backup.json";
  }
  return path.join(process.cwd(), ".data", "modest_crew_backup.json");
}

function loadCrewBackup(): InMemCrew[] | null {
  try {
    const p = getBackupFilePath();
    if (fs.existsSync(p)) {
      const data = JSON.parse(fs.readFileSync(p, "utf-8"));
      if (Array.isArray(data)) return data;
    }
  } catch {}
  return null;
}

function saveCrewBackup(data: InMemCrew[]) {
  try {
    const p = getBackupFilePath();
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

const DEFAULT_CREW_SEED: InMemCrew[] = [
  {
    id: 1,
    name: "The Modest MC (Macvollan)",
    role: "Founder & Headlining Master of Ceremonies",
    bio: "Over 8 years gracing prestigious weddings, traditional ruracio ceremonies, and executive corporate dinners across Kenya. Renowned for regal stage poise, bilingual English-Swahili fluency, and an electric crowd connection that keeps audiences celebrating from entrance to the last dance.",
    photo_url: "/logo.jpg",
    specialties: "Bilingual MC, Ruracio Protocols, VIP & Executive Galas, High-Energy Entrances",
    experience_years: "8+ Years",
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "DJ Steve (The Beat Maestro)",
    role: "Resident DJ & Chief Sound Engineer",
    bio: "Certified acoustic engineer and seasoned celebration DJ. Specializes in digital sound equalization, line-array tower calibration, wireless feedback elimination, and multi-genre Kenyan & international celebration playlists.",
    photo_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
    specialties: "Line-Array Calibration, Live Digital Mixing, Wedding Playlists, Zero-Feedback Audio",
    experience_years: "7+ Years",
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Faith Wanjiku",
    role: "Head of Event Protocol & Planning",
    bio: "The meticulous coordinator behind our smooth event timelines. Manages high-table protocol, vendor coordination (catering, decor, photography), and bride-groom schedule synchronization so our clients enjoy their big day stress-free.",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    specialties: "Program Flow, VIP Protocol, Vendor Synchronization, Crisis Management",
    experience_years: "6+ Years",
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Brian Oduor",
    role: "Senior Team Building Facilitator & Energizer",
    bio: "Passionate corporate animator and outdoor team coach. Has led team synergy programs for top Kenyan corporate teams, financial institutions, and NGOs with memorable group dynamics and communication games.",
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    specialties: "Corporate Games, Morale Boosting, Outdoor Team Challenges, Leadership Debrief",
    experience_years: "5+ Years",
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

let inMemBookings: InMemBooking[] = [];
let inMemGallery: InMemGallery[] = [
  {
    id: 1,
    title: "Grand Wedding Reception",
    category: "Weddings",
    media_type: "photo",
    media_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    location: "Karen, Nairobi",
    description: "Electrifying bride & groom entrance, seamless program, and royal energy.",
    uploaded_by: "Admin",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Corporate Team Building Games",
    category: "Team Building",
    media_type: "photo",
    media_url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
    location: "Naivasha Resort",
    description: "Engaging corporate challenges, obstacle courses, and morale-boosting energizers.",
    uploaded_by: "Admin",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Vibrant Ruracio Ceremony",
    category: "Weddings",
    media_type: "photo",
    media_url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    location: "Kiambu",
    description: "Respectful cultural negotiations, bilingual hosting, and vibrant music.",
    uploaded_by: "Admin",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Milestone 40th Birthday Gala",
    category: "Birthdays",
    media_type: "photo",
    media_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    location: "Lavington",
    description: "Cake cutting moments, roast-and-toast session, and crowd-moving party music.",
    uploaded_by: "Admin",
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Line-Array Audio & Sound Engineering",
    category: "Sound & Setup",
    media_type: "photo",
    media_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    location: "Nairobi",
    description: "High-definition sound dispersion, acoustic calibration, and wireless clarity.",
    uploaded_by: "Admin",
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Outdoor Corporate End-Year Gala",
    category: "Corporate",
    media_type: "photo",
    media_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    location: "Ruiru",
    description: "Award presentations, executive speeches, and evening celebration dance floor.",
    uploaded_by: "Admin",
    created_at: new Date().toISOString(),
  },
];

let inMemCrew: InMemCrew[] = loadCrewBackup() || [...DEFAULT_CREW_SEED];

let tablesInitialized = false;

async function ensureTables(sql: any) {
  if (tablesInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        event_type TEXT NOT NULL,
        event_date TEXT,
        event_location TEXT,
        guest_count TEXT,
        services TEXT,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        media_type TEXT NOT NULL,
        media_url TEXT NOT NULL,
        thumbnail_url TEXT,
        location TEXT,
        description TEXT,
        uploaded_by TEXT DEFAULT 'Admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await sql`
        ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS uploaded_by TEXT DEFAULT 'Admin';
      `;
    } catch {}

    await sql`
      CREATE TABLE IF NOT EXISTS crew_members (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        bio TEXT DEFAULT '',
        photo_url TEXT DEFAULT '/logo.jpg',
        specialties TEXT DEFAULT '',
        experience_years TEXT DEFAULT '5+ Years',
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Seed default crew if table is empty
    try {
      const existing = await sql`SELECT id FROM crew_members LIMIT 1;`;
      if (!existing || existing.length === 0) {
        for (const c of DEFAULT_CREW_SEED) {
          await sql`
            INSERT INTO crew_members (
              name, role, bio, photo_url, specialties, experience_years, display_order, is_active
            ) VALUES (
              ${c.name}, ${c.role}, ${c.bio}, ${c.photo_url},
              ${c.specialties}, ${c.experience_years}, ${c.display_order}, ${c.is_active}
            );
          `;
        }
      }
    } catch {}

    tablesInitialized = true;
  } catch (err) {
    console.warn("Could not auto-create database tables:", err);
  }
}

export function getDb() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.STORAGE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  return neon(connectionString);
}

// ================= BOOKINGS API HELPERS ================= //

export async function saveBooking(booking: {
  name: string;
  phone: string;
  email?: string;
  eventType: string;
  eventDate?: string;
  eventLocation?: string;
  guestCount?: string;
  services?: string;
  notes?: string;
}) {
  const sql = getDb();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`
        INSERT INTO bookings (
          name, phone, email, event_type, event_date, event_location, guest_count, services, notes, status
        ) VALUES (
          ${booking.name}, ${booking.phone}, ${booking.email || ""}, ${booking.eventType},
          ${booking.eventDate || ""}, ${booking.eventLocation || ""}, ${booking.guestCount || ""},
          ${booking.services || ""}, ${booking.notes || ""}, 'pending'
        ) RETURNING *;
      `;
      return rows[0];
    } catch (err) {
      console.error("Neon DB Insert Error:", err);
    }
  }

  // Fallback in-memory
  const newBooking: InMemBooking = {
    id: inMemBookings.length + 1,
    name: booking.name,
    phone: booking.phone,
    email: booking.email,
    event_type: booking.eventType,
    event_date: booking.eventDate || "",
    event_location: booking.eventLocation || "",
    guest_count: booking.guestCount || "",
    services: booking.services || "",
    notes: booking.notes || "",
    status: "pending",
    created_at: new Date().toISOString(),
  };
  inMemBookings.unshift(newBooking);
  return newBooking;
}

export async function getBookings() {
  const sql = getDb();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`SELECT * FROM bookings ORDER BY id DESC;`;
      return rows;
    } catch (err) {
      console.error("Neon DB Select Error:", err);
    }
  }
  return inMemBookings;
}

export async function updateBookingStatus(id: number, status: string) {
  const sql = getDb();
  if (sql) {
    try {
      await ensureTables(sql);
      await sql`UPDATE bookings SET status = ${status} WHERE id = ${id};`;
      return true;
    } catch (err) {
      console.error("Neon DB Update Error:", err);
    }
  }

  const b = inMemBookings.find((item) => item.id === id);
  if (b) b.status = status;
  return true;
}

export async function deleteBooking(id: number) {
  const sql = getDb();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`DELETE FROM bookings WHERE id = ${id} RETURNING *;`;
      return rows[0] || { id };
    } catch (err) {
      console.error("Neon DB Booking Delete Error:", err);
      throw err;
    }
  }

  const index = inMemBookings.findIndex((b) => b.id === id);
  if (index !== -1) {
    const [removed] = inMemBookings.splice(index, 1);
    return removed;
  }
  return null;
}

// ================= GALLERY API HELPERS ================= //

export async function getGalleryItems() {
  const sql = getDb();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`SELECT * FROM gallery_items ORDER BY id DESC;`;
      return rows || [];
    } catch (err) {
      console.error("Neon DB Gallery Select Error:", err);
    }
  }
  return inMemGallery;
}

export async function addGalleryItem(item: {
  title: string;
  category: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  location?: string;
  description?: string;
  uploaded_by?: string;
}) {
  const sql = getDb();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`
        INSERT INTO gallery_items (
          title, category, media_type, media_url, thumbnail_url, location, description, uploaded_by
        ) VALUES (
          ${item.title}, ${item.category}, ${item.mediaType}, ${item.mediaUrl},
          ${item.thumbnailUrl || ""}, ${item.location || ""}, ${item.description || ""},
          ${item.uploaded_by || "Admin"}
        ) RETURNING *;
      `;
      return rows[0];
    } catch (err) {
      console.error("Neon DB Gallery Insert Error:", err);
    }
  }

  const newItem: InMemGallery = {
    id: inMemGallery.length + 1,
    title: item.title,
    category: item.category,
    media_type: item.mediaType,
    media_url: item.mediaUrl,
    thumbnail_url: item.thumbnailUrl,
    location: item.location || "",
    description: item.description || "",
    uploaded_by: item.uploaded_by || "Admin",
    created_at: new Date().toISOString(),
  };
  inMemGallery.unshift(newItem);
  return newItem;
}

export async function getGalleryItemById(id: number) {
  const sql = getDb();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`SELECT * FROM gallery_items WHERE id = ${id} LIMIT 1;`;
      return rows[0] || null;
    } catch (err) {
      console.error("Neon DB Gallery Select by ID Error:", err);
    }
  }
  return inMemGallery.find((item) => item.id === id) || null;
}

export async function deleteGalleryItem(id: number) {
  const sql = getDb();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`DELETE FROM gallery_items WHERE id = ${id} RETURNING *;`;
      return rows[0] || { id };
    } catch (err) {
      console.error("Neon DB Gallery Delete Error:", err);
      throw err;
    }
  }

  const index = inMemGallery.findIndex((item) => item.id === id);
  if (index !== -1) {
    const [removed] = inMemGallery.splice(index, 1);
    return removed;
  }
  return null;
}

// ================= CREW MEMBERS API HELPERS ================= //

export async function getCrewMembers(onlyActive = true) {
  const sql = getDb();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = onlyActive
        ? await sql`
            SELECT * FROM crew_members 
            WHERE is_active = TRUE 
            ORDER BY display_order ASC, id ASC;
          `
        : await sql`
            SELECT * FROM crew_members 
            ORDER BY display_order ASC, id ASC;
          `;
      if (rows && Array.isArray(rows)) {
        return rows;
      }
    } catch (err) {
      console.error("Neon DB Crew Select Error:", err);
    }
  }

  const backup = loadCrewBackup() || inMemCrew;
  const filtered = onlyActive ? backup.filter((c) => c.is_active) : backup;
  return [...filtered].sort((a, b) => a.display_order - b.display_order);
}

export async function addCrewMember(crew: {
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  specialties?: string;
  experienceYears?: string;
  displayOrder?: number;
  isActive?: boolean;
}) {
  const cleanName = (crew.name || "").trim();
  const cleanRole = (crew.role || "").trim();
  const cleanBio = (crew.bio || "").trim();
  const cleanPhoto = (crew.photoUrl || "").trim() || "/logo.jpg";
  const cleanSpec = (crew.specialties || "").trim();
  const cleanExp = (crew.experienceYears || "").trim() || "5+ Years";
  const cleanOrder = Number(crew.displayOrder) || 1;
  const cleanActive = crew.isActive !== undefined ? Boolean(crew.isActive) : true;

  const sql = getDb();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`
        INSERT INTO crew_members (
          name, role, bio, photo_url, specialties, experience_years, display_order, is_active
        ) VALUES (
          ${cleanName}, ${cleanRole}, ${cleanBio}, ${cleanPhoto},
          ${cleanSpec}, ${cleanExp}, ${cleanOrder}, ${cleanActive}
        ) RETURNING *;
      `;
      if (rows && rows[0]) {
        return rows[0];
      }
    } catch (err) {
      console.error("Neon DB Crew Insert Error:", err);
    }
  }

  const backup = loadCrewBackup() || inMemCrew;
  const maxId = backup.length > 0 ? Math.max(...backup.map((c) => c.id)) : 0;
  const newCrew: InMemCrew = {
    id: maxId + 1,
    name: cleanName,
    role: cleanRole,
    bio: cleanBio,
    photo_url: cleanPhoto,
    specialties: cleanSpec,
    experience_years: cleanExp,
    display_order: cleanOrder,
    is_active: cleanActive,
    created_at: new Date().toISOString(),
  };
  backup.push(newCrew);
  inMemCrew = backup;
  saveCrewBackup(inMemCrew);
  return newCrew;
}

export async function updateCrewMember(
  id: number,
  crew: {
    name?: string;
    role?: string;
    bio?: string;
    photoUrl?: string;
    specialties?: string;
    experienceYears?: string;
    displayOrder?: number;
    isActive?: boolean;
  }
) {
  const sql = getDb();
  if (sql) {
    try {
      await ensureTables(sql);
      const existing = await sql`SELECT * FROM crew_members WHERE id = ${id} LIMIT 1;`;
      if (existing && existing[0]) {
        const cur = existing[0];
        const name = crew.name !== undefined ? crew.name.trim() : cur.name;
        const role = crew.role !== undefined ? crew.role.trim() : cur.role;
        const bio = crew.bio !== undefined ? crew.bio.trim() : (cur.bio || "");
        const photoUrl = crew.photoUrl !== undefined ? crew.photoUrl.trim() : (cur.photo_url || "/logo.jpg");
        const specialties = crew.specialties !== undefined ? crew.specialties.trim() : (cur.specialties || "");
        const experienceYears = crew.experienceYears !== undefined ? crew.experienceYears.trim() : (cur.experience_years || "");
        const displayOrder = crew.displayOrder !== undefined ? Number(crew.displayOrder) : (cur.display_order ?? 1);
        const isActive = crew.isActive !== undefined ? Boolean(crew.isActive) : (cur.is_active ?? true);

        const rows = await sql`
          UPDATE crew_members
          SET
            name = ${name},
            role = ${role},
            bio = ${bio},
            photo_url = ${photoUrl},
            specialties = ${specialties},
            experience_years = ${experienceYears},
            display_order = ${displayOrder},
            is_active = ${isActive}
          WHERE id = ${id}
          RETURNING *;
        `;
        if (rows && rows[0]) return rows[0];
      }
    } catch (err) {
      console.error("Neon DB Crew Update Error:", err);
    }
  }

  const backup = loadCrewBackup() || inMemCrew;
  const member = backup.find((c) => c.id === id);
  if (member) {
    if (crew.name !== undefined) member.name = crew.name;
    if (crew.role !== undefined) member.role = crew.role;
    if (crew.bio !== undefined) member.bio = crew.bio;
    if (crew.photoUrl !== undefined) member.photo_url = crew.photoUrl;
    if (crew.specialties !== undefined) member.specialties = crew.specialties;
    if (crew.experienceYears !== undefined) member.experience_years = crew.experienceYears;
    if (crew.displayOrder !== undefined) member.display_order = Number(crew.displayOrder);
    if (crew.isActive !== undefined) member.is_active = Boolean(crew.isActive);
    inMemCrew = backup;
    saveCrewBackup(inMemCrew);
    return member;
  }
  return null;
}

export async function deleteCrewMember(id: number) {
  const sql = getDb();
  if (sql) {
    try {
      await ensureTables(sql);
      const rows = await sql`DELETE FROM crew_members WHERE id = ${id} RETURNING *;`;
      // Also remove from in-memory backup
      inMemCrew = inMemCrew.filter((c) => c.id !== id);
      const backup = loadCrewBackup();
      if (backup) {
        saveCrewBackup(backup.filter((c) => c.id !== id));
      }
      return rows[0] || { id };
    } catch (err) {
      console.error("Neon DB Crew Delete Error:", err);
    }
  }

  const backup = loadCrewBackup() || inMemCrew;
  const index = backup.findIndex((c) => c.id === id);
  if (index !== -1) {
    const [removed] = backup.splice(index, 1);
    inMemCrew = backup;
    saveCrewBackup(inMemCrew);
    return removed;
  }
  return { id };
}
