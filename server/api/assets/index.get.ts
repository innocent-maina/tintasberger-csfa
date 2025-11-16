import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  try {
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    console.error("Error fetching assets:", err);
    return { success: false, message: "Internal Server Error", err };
  }
});
