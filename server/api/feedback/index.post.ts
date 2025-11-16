import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  const feedbackData = await readBody(event);
  if (!feedbackData) {
    throw createError({ statusCode: 400, message: "Missing feedback data" });
  }

  try {
    const { data, error } = await supabase
      .from("feedback")
      .insert(feedbackData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating feedback:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
