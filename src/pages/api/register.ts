export const prerender = false;

import { supabaseServer } from "../../lib/supabase-server";
import { resend } from "../../lib/resend";
import { getWorkshop } from "../../lib/workshops";
import { countConfirmedRegistrations } from "../../lib/registrations";

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();

    const fullName = body.fullName?.trim();
    const email = body.email?.trim();
    const token = body["cf-turnstile-response"];

    const workshop = await getWorkshop(body.workshopSlug);

    const seatLimit = workshop.max_seats;

    let statusRegistrant: string;

    const confirmed = await countConfirmedRegistrations(body.workshopSlug);

    if (!workshop.registration_open) {
      return new Response(
        JSON.stringify({
          error: "Registrations are closed."
        }),
        { status: 403 }
      );
    }
    
    if (confirmed >= seatLimit) {
      statusRegistrant = "Waitlist";
    } else {
      statusRegistrant = "Confirmed";
    }

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
        full_name: fullName,
        email: email,
        phone: body.phone,
        country: body.country,
        notes: body.notes,
        status: statusRegistrant
      });

    // if (statusRegistrant === "Confirmed") {
    //   await resend.emails.send({
    //     from: "Photography Workshops <onboarding@resend.dev>",
    //     // to: email,
    //     to:"arkana2003@gmail.com",
    //     subject: "Workshop Registration- Confirmed",
    //     html: `
    //       <h2>Registration received!</h2>

    //       <p>Hi ${fullName},</p>

    //       <p>Thank you for registering for the ${body.workshopTitle} workshop.</p>

    //       <p>This is supposed to go to ${email}</p>

    //       <p>We'll contact you shortly.</p>
    //     `,
    //   });
    // } else if (statusRegistrant === "Waitlist") {
    //   await resend.emails.send({
    //     from: "Photography Workshops <onboarding@resend.dev>",
    //     // to: email,
    //     to:"arkana2003@gmail.com",
    //     subject: "Workshop Registration - Waitlist",
    //     html: `
    //       <h2>You've been added to the waitlist!</h2>

    //       <p>Hi ${fullName},</p>

    //       <p>Thank you for registering for the ${body.workshopTitle} workshop.</p>

    //       <p>This is supposed to go to ${email}</p>

    //       <p>We'll contact you as soon as a spot opens up.</p>
    //     `,
    //   });      
    // }

    

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