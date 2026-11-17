import { neon } from "@neondatabase/serverless";

// Global in-memory storage fallback when DATABASE_URL is not yet connected
interface InMemBooking {
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

interface InMemGallery {
  id: number;
  title: string;
  category: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  location: string;
  description?: string;
  created_at: string;
}

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
    created_at: new Date().toISOString(),
  },
];

let tablesInitialized = false;

async function initTables(sql: any) {
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
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
  const sql = neon(connectionString);
  initTables(sql).catch(() => {});
  return sql;
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

// ================= GALLERY API HELPERS ================= //

export async function getGalleryItems() {
  const sql = getDb();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM gallery_items ORDER BY id DESC;`;
      return rows || [];
    } catch (err) {
      console.error("Neon DB Gallery Select Error:", err);
    }
  }
  return inMemGallery;
}

export async function deleteGalleryItem(id: number) {
  const sql = getDb();
  if (sql) {
    try {
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

export async function addGalleryItem(item: {
  title: string;
  category: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  location?: string;
  description?: string;
}) {
  const sql = getDb();
  if (sql) {
    try {
      const rows = await sql`
        INSERT INTO gallery_items (
          title, category, media_type, media_url, thumbnail_url, location, description
        ) VALUES (
          ${item.title}, ${item.category}, ${item.mediaType}, ${item.mediaUrl},
          ${item.thumbnailUrl || ""}, ${item.location || ""}, ${item.description || ""}
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
    created_at: new Date().toISOString(),
  };
  inMemGallery.unshift(newItem);
  return newItem;
}
