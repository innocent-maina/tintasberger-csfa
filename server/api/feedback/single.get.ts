import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  const { id } = getQuery(event);
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing feedback ID" });
  }

  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }
    return { success: true, data };
  } catch (err) {
    console.error(`Error fetching feedback with id ${id}:`, err);
    return { success: false, message: "Internal Server Error" };
  }
});
