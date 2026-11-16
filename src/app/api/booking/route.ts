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

// Helper to format Kenyan and international phone numbers for WhatsApp Cloud API (e.g., 2547XXXXXXXX)
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
    const adminPhone = process.env.ADMIN_WHATSAPP_PHONE || "254729226453";

    const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    let whatsappSentToClient = false;
    let whatsappSentToAdmin = false;
    let apiError: string | null = null;

    // Dispatch via Meta WhatsApp Cloud API if credentials exist
    if (whatsappToken && whatsappPhoneNumberId) {
      const metaUrl = `https://graph.facebook.com/v20.0/${whatsappPhoneNumberId}/messages`;

      // 1. Message to Client
      const clientMessageBody =
        `✨ *The Modest MC Entertainment - Reservation Received*\n` +
        `_Bringing Pomp & Colour to Every Event!_\n\n` +
        `Hello *${name}*,\n` +
        `Thank you for contacting us! We have received your event details:\n\n` +
        `📋 *Event:* ${eventType}\n` +
        `📅 *Date:* ${eventDate || "To be confirmed"}\n` +
        `📍 *Location:* ${eventLocation || "Not specified"}\n` +
        `👥 *Guests:* ${guestCount}\n` +
        `🎙️ *Services:* ${services}\n\n` +
        `Our lead coordinator will call you shortly to align on your event schedule and confirm date reservation.\n\n` +
        `📞 *Hotline:* +254 729 226 453 | +254 745 558 377\n` +
        `📍 *Base:* Gwa Kairo, Ruiru\n` +
        `📺 *YouTube:* https://youtube.com/@modestmckenya`;

      try {
        const clientRes = await fetch(metaUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${whatsappToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: clientPhone,
            type: "text",
            text: {
              preview_url: false,
              body: clientMessageBody,
            },
          }),
        });

        if (clientRes.ok) {
          whatsappSentToClient = true;
        } else {
          const errData = await clientRes.json();
          console.warn("WhatsApp Cloud API (Client Message) response:", errData);
          apiError = JSON.stringify(errData);
        }
      } catch (err: any) {
        console.error("Error sending WhatsApp to client:", err);
      }

      // 2. Alert to The Modest MC Team Admin
      const adminMessageBody =
        `🚨 *NEW EVENT BOOKING - THE MODEST MC*\n` +
        `------------------------------------\n` +
        `👤 *Client:* ${name}\n` +
        `📞 *Phone:* ${phone} (${clientPhone})\n` +
        `📧 *Email:* ${email || "None"}\n` +
        `🎉 *Event:* ${eventType}\n` +
        `📅 *Date:* ${eventDate}\n` +
        `📍 *Venue:* ${eventLocation}\n` +
        `👥 *Guests:* ${guestCount}\n` +
        `🎙️ *Services:* ${services}\n` +
        `📝 *Notes:* ${notes || "None"}\n` +
        `------------------------------------\n` +
        `Submitted via themodestmc.vercel.app`;

      try {
        const adminRes = await fetch(metaUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${whatsappToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: adminPhone,
            type: "text",
            text: {
              preview_url: false,
              body: adminMessageBody,
            },
          }),
        });

        if (adminRes.ok) {
          whatsappSentToAdmin = true;
        }
      } catch (err: any) {
        console.error("Error sending WhatsApp to admin:", err);
      }
    } else {
      console.log(
        "WhatsApp Cloud API keys (WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID) not configured yet. Logging submission."
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking received successfully",
      whatsappSentToClient,
      whatsappSentToAdmin,
      configured: Boolean(whatsappToken && whatsappPhoneNumberId),
      apiError,
    });
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { error: "Failed to process booking submission" },
      { status: 500 }
    );
  }
}
