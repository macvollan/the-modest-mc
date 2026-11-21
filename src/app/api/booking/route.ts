import { NextResponse } from "next/server";
import { saveBooking, getBookings, updateBookingStatus, deleteBooking } from "@/lib/db";

interface BookingRequest {
  name: string;
  countryCode?: string;
  phone: string;
  email?: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  guestCount: string;
  services: string;
  notes?: string;
}

function formatWhatsAppNumber(phone: string, countryCode?: string): string {
  const cleanCode = (countryCode || "").replace(/[^0-9]/g, "");
  let digits = phone.replace(/[^0-9]/g, "");

  if (cleanCode) {
    if (digits.startsWith(cleanCode) && digits.length > 9) {
      return digits;
    }
    if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }
    return `${cleanCode}${digits}`;
  }

  if (digits.startsWith("0") && digits.length === 10) {
    return "254" + digits.slice(1);
  }
  if (digits.length === 9 && (digits.startsWith("7") || digits.startsWith("1"))) {
    return "254" + digits;
  }
  return digits;
}

const ADMIN_PHONES = ["254745558377", "254729226453"];
const ADMIN_BOOKING_TEMPLATE = "new_booking_alert1";

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
    return { ok: res.ok, status: res.status, data };
  } catch (err: any) {
    return { ok: false, status: 500, error: err.message };
  }
}

async function sendWhatsAppTemplate(
  metaUrl: string,
  token: string,
  to: string,
  templateName: string,
  params: string[]
) {
  // Meta template params forbid empty strings, newlines, tabs, or >4 consecutive spaces
  const cleanParams = params.map((p) => {
    const sanitized = (p || "Not specified")
      .replace(/[\r\n\t]+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
    return sanitized.length > 0 ? sanitized.slice(0, 200) : "Not specified";
  });

  let lastResult: any = { ok: false, status: 400, error: "Template send failed" };

  for (const langCode of ["en_US", "en"]) {
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
          type: "template",
          template: {
            name: templateName,
            language: { code: langCode },
            components: [
              {
                type: "body",
                parameters: cleanParams.map((text) => ({ type: "text", text })),
              },
            ],
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        return { ok: true, status: res.status, language: langCode, mode: "template", data };
      }
      lastResult = { ok: false, status: res.status, language: langCode, mode: "template", data };
      // Only retry with alternate language code if translation mismatch (132001)
      if (data?.error?.code !== 132001) {
        return lastResult;
      }
    } catch (err: any) {
      lastResult = { ok: false, status: 500, language: langCode, mode: "template", error: err.message };
      return lastResult;
    }
  }

  return lastResult;
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

// DELETE: Remove booking record (Admin only)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let idParam = searchParams.get("id");

    if (!idParam) {
      try {
        const body = await req.json();
        if (body?.id) idParam = String(body.id);
      } catch {}
    }

    const id = Number(idParam);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Valid booking id required" }, { status: 400 });
    }

    await deleteBooking(id);
    return NextResponse.json({ success: true, deletedId: id });
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
      countryCode,
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

    const clientPhone = formatWhatsAppNumber(phone, countryCode);
    const formattedDisplayPhone = clientPhone ? `+${clientPhone}` : phone;

    // 1. Persist booking to Database (Neon / In-memory fallback)
    const savedRecord = await saveBooking({
      name,
      phone: formattedDisplayPhone,
      email,
      eventType,
      eventDate,
      eventLocation,
      guestCount,
      services,
      notes,
    });

    // Always use verified Permanent System User Token (prevents expired Vercel env tokens from breaking delivery)
    const PERMANENT_SYSTEM_TOKEN =
      "EAAvQa1tuSugBTBrT2ikioHHvch28dG60yIlKxXv4fM4ouQqoH5IIHMLjqE3Wdcog6kCBCtZCU0tPnUom4D5SKZAA8LA42sfANdLcWQ8qPN3mit4MsmpUighCR9s4JHddYP3IdK8uzSr3muuv6ZCqbp66yWZCZBhG7X0YQHaLCMMz3a9PuhaeSb5MGNeHrTQZDZD";
    const envToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const whatsappToken =
      envToken && envToken.startsWith("EAAvQa1tuSugBTBr")
        ? envToken
        : PERMANENT_SYSTEM_TOKEN;
    const whatsappPhoneNumberId =
      process.env.WHATSAPP_PHONE_NUMBER_ID || "1540671059125629";

    let clientMessageStatus = { sent: false, details: null as any };
    const adminStatuses: Record<string, boolean> = {};
    const adminDetails: Record<string, any> = {};

    // 2. Dispatch WhatsApp Notifications
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
        `Our lead coordinator will call you shortly on *${formattedDisplayPhone}* to align on your event schedule and confirm your reservation.\n\n` +
        `📞 *Hotline:* +254 729 226 453 | +254 745 558 377\n` +
        `📧 *Email:* info@themodestmcevents.co.ke\n` +
        `📍 *Base:* Gwa Kairo, Ruiru (Open Sun–Fri, Closed on Sabbath)\n` +
        `🌐 *Website:* https://themodestmcevents.co.ke`;

      // Alert to Both Admin Numbers
      const adminMessageBody =
        `🚨 *NEW EVENT BOOKING RECEIVED - THE MODEST MC*\n` +
        `-----------------------------------------\n` +
        `👤 *Client Name:* ${name}\n` +
        `📞 *Client Phone:* ${formattedDisplayPhone}\n` +
        `💬 *Direct WhatsApp:* https://wa.me/${clientPhone}\n` +
        `📧 *Client Email:* ${email || "None"}\n` +
        `🎉 *Event:* ${eventType}\n` +
        `📅 *Date:* ${eventDate || "TBD"}\n` +
        `📍 *Location:* ${eventLocation}\n` +
        `👥 *Guests:* ${guestCount}\n` +
        `🎙️ *Services:* ${services}\n` +
        `📝 *Notes:* ${notes || "None"}\n` +
        `-----------------------------------------\n` +
        `_Submitted live via https://themodestmcevents.co.ke_`;

      const templateParams = [
        name,
        formattedDisplayPhone,
        guestCount ? `${eventType} (${guestCount} guests)` : eventType,
        eventDate || "To be confirmed",
        eventLocation || "Not specified",
        notes ? `${services} | Notes: ${notes}` : services || "General Event Inquiry",
      ];

      // Dispatch to client + both admin numbers in parallel
      // Admins use 24/7 Utility Template (new_booking_alert1) with automatic fallback to text while in review
      const [clientSend] = await Promise.all([
        sendWhatsApp(metaUrl, whatsappToken, clientPhone, clientMessageBody),
        ...ADMIN_PHONES.map(async (adminNum) => {
          const templateRes = await sendWhatsAppTemplate(
            metaUrl,
            whatsappToken,
            adminNum,
            ADMIN_BOOKING_TEMPLATE,
            templateParams
          );

          if (templateRes.ok) {
            adminStatuses[adminNum] = true;
            adminDetails[adminNum] = {
              mode: "template",
              template: ADMIN_BOOKING_TEMPLATE,
              language: templateRes.language,
              data: templateRes.data,
            };
          } else {
            const textRes = await sendWhatsApp(
              metaUrl,
              whatsappToken,
              adminNum,
              adminMessageBody
            );
            adminStatuses[adminNum] = textRes.ok;
            adminDetails[adminNum] = {
              mode: "text_fallback",
              templateError: templateRes.data || templateRes.error,
              data: textRes.data || textRes.error,
            };
            if (!textRes.ok) {
              console.warn(`Could not deliver to admin ${adminNum}:`, textRes.data || textRes.error);
            }
          }
        }),
      ]);

      clientMessageStatus = {
        sent: clientSend.ok,
        details: clientSend.data || clientSend.error,
      };
    }

    return NextResponse.json({
      success: true,
      message: "Booking received and saved to database",
      bookingId: savedRecord?.id,
      sentToClient: clientMessageStatus.sent,
      clientPhone,
      adminStatuses,
      adminDetails,
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
