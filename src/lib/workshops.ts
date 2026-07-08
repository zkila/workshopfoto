import { supabaseServer } from "./supabase-server";

export async function getWorkshop(slug: string) {
  const { data, error } = await supabaseServer
  .from("workshops")
  .select("title, max_seats, registration_open")
  .eq("slug", slug)
  .single();

  if (error || !data) {
    throw new Error(`Workshop "${slug}" not found.`);
  }

  return data;
}

export async function getAllWorkshops() {
  const { data, error } = await supabaseServer
    .from("workshops")
    .select("slug, title, max_seats, registration_open");

    return data;
}