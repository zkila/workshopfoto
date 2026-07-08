import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SECRET_KEY
);