import { NextResponse } from "next/server";

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

// Format Kenyan & international numbers for WhatsApp Cloud API (e.g. 07XXXXXXXX -> 2547XXXXXXXX)
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

// Official Modest MC Admin Alert Numbers
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

    const clientPhone = formatWhatsAppNumber(phone);
    const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    let clientMessageStatus = { sent: false, details: null as any };
    const adminStatuses: Record<string, boolean> = {};

    if (whatsappToken && whatsappPhoneNumberId) {
      const metaUrl = `https://graph.facebook.com/v20.0/${whatsappPhoneNumberId}/messages`;

      // 1. Direct Confirmation Message to the Client
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

      // 2. Alert Sent to BOTH Admin Numbers (0745558377 & 0729226453)
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
    } else {
      console.log("WhatsApp Cloud API keys missing in environment.");
    }

    return NextResponse.json({
      success: true,
      message: "Booking received and processed",
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
