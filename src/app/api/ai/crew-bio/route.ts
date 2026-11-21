import { NextResponse } from "next/server";

const BIO_TEMPLATES = [
  (name: string, role: string, exp: string, spec: string) =>
    `With over ${exp} of celebrated experience across Kenya's premier venues, ${name} brings exceptional poise, infectious charisma, and clockwork precision to every event as our ${role}. Specializing in ${spec || "crowd engagement, agenda coordination, and stage management"}, ${name} ensures every moment flows with dignity, joyous celebration, and unforgettable 'Pomp and Colour'.`,

  (name: string, role: string, exp: string, spec: string) =>
    `Known for high-voltage energy, cultural reverence, and flawless event execution, ${name} is a cornerstone of The Modest MC Entertainment serving as ${role}. Bringing ${exp} of hands-on expertise in ${spec || "bilingual protocol, audience connection, and seamless transitions"}, ${name} effortlessly bridges executives, elders, and celebratory crowds so hosts can relax and savor their milestone day.`,

  (name: string, role: string, exp: string, spec: string) =>
    `A dedicated industry professional with ${exp} commanding event stages and technical consoles from Karen to Naivasha. As our ${role}, ${name} masterfully handles ${spec || "event protocol, audio dynamics, and crowd facilitation"}, transforming wedding ceremonies, corporate dinners, and cultural celebrations into extraordinary, stress-free experiences.`,

  (name: string, role: string, exp: string, spec: string) =>
    `Combining executive poise with genuine Kenyan warmth, ${name} brings ${exp} of trusted excellence to The Modest MC team as our ${role}. Highly skilled in ${spec || "client coordination, live stage direction, and celebration dynamics"}, ${name} guarantees total punctuality, meticulous attention to detail, and a vibrant atmosphere that leaves every guest raving.`,
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, experienceYears, specialties } = body;

    const cleanName = (name || "").trim() || "Our Team Member";
    const cleanRole = (role || "").trim() || "Event Specialist";
    const cleanExp = (experienceYears || "").trim() || "5+ Years";
    const cleanSpec = (specialties || "").trim();

    // Check if an AI API Key (Gemini or OpenAI) is configured in environment
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const prompt = `Write a professional, warm, client-facing 2-sentence biography for a member of 'The Modest MC Entertainment' (a premier Kenyan event hosting, MC, and PA sound rental company based in Ruiru).
Member Name: ${cleanName}
Role: ${cleanRole}
Experience: ${cleanExp}
Specialties: ${cleanSpec || "Event protocol, crowd engagement, sound coordination"}

Guidelines:
- Grounded in authentic Kenyan event culture (weddings, ruracios, corporate galas).
- Dignified, exciting, and professional.
- Do NOT include private contact info.
- Max 65 words.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          const generated =
            gData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (generated) {
            return NextResponse.json({
              success: true,
              bio: generated.replace(/^["']|["']$/g, ""),
              source: "gemini",
            });
          }
        }
      } catch (gErr) {
        console.warn("Gemini API call failed, using intelligent template:", gErr);
      }
    }

    // High-quality dynamic template generation
    const randomIndex = Math.floor(Math.random() * BIO_TEMPLATES.length);
    const generatedBio = BIO_TEMPLATES[randomIndex](
      cleanName,
      cleanRole,
      cleanExp,
      cleanSpec
    );

    return NextResponse.json({
      success: true,
      bio: generatedBio,
      source: "intelligent-engine",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate bio" },
      { status: 500 }
    );
  }
}
