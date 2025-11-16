import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  const salespersonsData = await readBody(event);
  if (!salespersonsData) {
    throw createError({ statusCode: 400, message: "Missing salespersons data" });
  }

  try {
    const { data, error } = await supabase
      .from("salespersons")
      .insert(salespersonsData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating salespersons:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
