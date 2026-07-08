import { supabaseServer } from "./supabase-server";

export async function countConfirmedRegistrations(slug: string) {
  const { count, error } = await supabaseServer
    .from("registrations")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("workshop_slug", slug)
    .eq("status", "Confirmed");

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function countWaitlist(slug: string) {
  const { count, error } = await supabaseServer
    .from("registrations")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("workshop_slug", slug)
    .eq("status", "Waitlist");

  if (error) {
    throw error;
  }

  return count ?? 0;
}