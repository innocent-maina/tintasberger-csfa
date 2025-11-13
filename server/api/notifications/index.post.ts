import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const notificationsData = await readBody(event);
  if (!notificationsData) {
    throw createError({ statusCode: 400, message: "Missing notifications data" });
  }

  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notificationsData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating notifications:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
