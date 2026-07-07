export const prerender = false;

import { supabaseServer } from "../../lib/supabase-server";
import { resend } from "../../lib/resend";

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();

    const fullName = body.fullName?.trim();
    const email = body.email?.trim();
    const token = body["cf-turnstile-response"];
    

    if (!token) {
      return Response.json(
        { error: "Turnstile token missing." },
        { status: 400 }
      );
    }

    if (!fullName) {
      return Response.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return Response.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Invalid email." },
        { status: 400 }
      );
    }

    const ip =
      request.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        .trim() ?? "";

    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: import.meta.env.TURNSTILE_SECRET_KEY,
          response: token.toString(),
          remoteip: ip,
        }),
      }
    );

    const verifyResult = await verifyResponse.json();

    if (!verifyResult.success) {
      console.error("Turnstile verification failed:", verifyResult);

      return Response.json(
        { error: "Turnstile verification failed." },
        { status: 403 }
      );
    }

    const { error } = await supabaseServer
      .from("registrations")
      .insert({
        workshop_slug: body.workshopSlug,
        workshop_title: body.workshopTitle,
        full_name: fullName,
        email,
        phone: body.phone,
        country: body.country,
        notes: body.notes,
      });



    await resend.emails.send({
      from: "Photography Workshops <onboarding@resend.dev>",
      // to: email,
      to:"arkana2003@gmail.com",
      subject: "Workshop Registration",
      html: `
        <h2>Registration received!</h2>

        <p>Hi ${fullName},</p>

        <p>Thank you for registering.</p>

        <p>We'll contact you shortly.</p>
      `,
    });

    if (error) {
      console.error("Supabase error:", error);

      return Response.json(
        { error: "Failed to save registration." },
        { status: 500 }
      );
    }

    return Response.json({ success: true });

  } catch (err) {
    console.error("Registration endpoint error:", err);

    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}