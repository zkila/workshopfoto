export const prerender = false;

import { supabaseServer } from "../../lib/supabase-server";

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();

    const fullName = body.fullName?.trim();
    const email = body.email?.trim();
    if (!fullName) {
    return Response.json(     
        { error: "Full name is required." },     
        { status: 400 }   );
    }
    if (!email) {
    return Response.json(     
        { error: "Email is required." },     
        { status: 400 }   );
    }   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
    return Response.json(
        { error: "Invalid email." },
        { status: 400 }
    );
}

    const { error } = await supabaseServer
      .from("registrations")
      .insert({
        workshop_slug: body.workshopSlug,
        workshop_title: body.workshopTitle,
        full_name: fullName,
        email: email,
        phone: body.phone,
        country: body.country,
        notes: body.notes,
      });

    if (error) {
      console.error(error);

      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}