import { NextResponse } from "next/server";
import { saveBooking, getBookings, updateBookingStatus } from "@/lib/db";

interface BookingRequest {
  name: string;
  phone: string;
  email?: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  guestCount: string;
  services: string;
  notes?: string;
}

function formatWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) {
    return "254" + digits.slice(1);
  }
  if (digits.startsWith("254")) {
    return digits;
  }
  return digits;
}

const ADMIN_PHONES = ["254745558377", "254729226453"];

async function sendWhatsApp(metaUrl: string, token: string, to: string, text: string) {
  try {
    const res = await fetch(metaUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: {
          preview_url: false,
          body: text,
        },
      }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

// GET: Fetch all bookings for the Admin Dashboard
export async function GET(req: Request) {
  try {
    const bookings = await getBookings();
    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update booking status (e.g. pending -> confirmed -> completed)
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "id and status required" }, { status: 400 });
    }
    await updateBookingStatus(Number(id), status);
    return NextResponse.json({ success: true, id, status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Save booking to DB and dispatch WhatsApp notifications
export async function POST(req: Request) {
  try {
    const data: BookingRequest = await req.json();

    const {
      name,
      phone,
      email,
      eventType,
      eventDate,
      eventLocation,
      guestCount,
      services,
      notes,
    } = data;

    if (!name || !phone || !eventType) {
      return NextResponse.json(
        { error: "Name, phone, and event type are required" },
        { status: 400 }
      );
    }

    // 1. Persist booking to Database (Neon / In-memory fallback)
    const savedRecord = await saveBooking({
      name,
      phone,
      email,
      eventType,
      eventDate,
      eventLocation,
      guestCount,
      services,
      notes,
    });

    const clientPhone = formatWhatsAppNumber(phone);
    const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    let clientMessageStatus = { sent: false, details: null as any };
    const adminStatuses: Record<string, boolean> = {};

    // 2. Dispatch WhatsApp Notifications if configured
    if (whatsappToken && whatsappPhoneNumberId) {
      const metaUrl = `https://graph.facebook.com/v20.0/${whatsappPhoneNumberId}/messages`;

      // Confirmation to Client
      const clientMessageBody =
        `✨ *The Modest MC Entertainment - Reservation Received*\n` +
        `_Bringing Pomp & Colour to Every Event!_\n\n` +
        `Hello *${name}*,\n` +
        `Thank you for contacting us! We have received your event reservation inquiry:\n\n` +
        `📋 *Event:* ${eventType}\n` +
        `📅 *Date:* ${eventDate || "To be confirmed"}\n` +
        `📍 *Location:* ${eventLocation || "Not specified"}\n` +
        `👥 *Guests:* ${guestCount}\n` +
        `🎙️ *Services:* ${services}\n\n` +
        `Our lead coordinator will call you shortly on this number to align on your event schedule and confirm date reservation.\n\n` +
        `📞 *Hotline:* +254 729 226 453 | +254 745 558 377\n` +
        `📍 *Base:* Gwa Kairo, Ruiru\n` +
        `📺 *YouTube:* https://youtube.com/@modestmckenya`;

      const clientSend = await sendWhatsApp(
        metaUrl,
        whatsappToken,
        clientPhone,
        clientMessageBody
      );
      clientMessageStatus = { sent: clientSend.ok, details: clientSend.data || clientSend.error };

      // Alert to Both Admin Numbers
      const adminMessageBody =
        `🚨 *NEW EVENT BOOKING RECEIVED - THE MODEST MC*\n` +
        `-----------------------------------------\n` +
        `👤 *Client Name:* ${name}\n` +
        `📞 *Client Phone:* ${phone} (${clientPhone})\n` +
        `📧 *Client Email:* ${email || "None"}\n` +
        `🎉 *Event:* ${eventType}\n` +
        `📅 *Date:* ${eventDate || "TBD"}\n` +
        `📍 *Location:* ${eventLocation}\n` +
        `👥 *Guests:* ${guestCount}\n` +
        `🎙️ *Services:* ${services}\n` +
        `📝 *Notes:* ${notes || "None"}\n` +
        `-----------------------------------------\n` +
        `_Submitted live via themodestmc.vercel.app_`;

      await Promise.all(
        ADMIN_PHONES.map(async (adminNum) => {
          const res = await sendWhatsApp(
            metaUrl,
            whatsappToken,
            adminNum,
            adminMessageBody
          );
          adminStatuses[adminNum] = res.ok;
          if (!res.ok) {
            console.warn(`Could not deliver to admin ${adminNum}:`, res.data || res.error);
          }
        })
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking received and saved to database",
      bookingId: savedRecord?.id,
      sentToClient: clientMessageStatus.sent,
      clientPhone,
      adminStatuses,
      configured: Boolean(whatsappToken && whatsappPhoneNumberId),
    });
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { error: "Failed to process booking submission" },
      { status: 500 }
    );
  }
}
