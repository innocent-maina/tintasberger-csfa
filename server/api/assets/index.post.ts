import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  const assetsData = await readBody(event);
  if (!assetsData) {
    throw createError({ statusCode: 400, message: "Missing assets data" });
  }

  try {
    const { data, error } = await supabase
      .from("assets")
      .insert(assetsData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating assets:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
