import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const attendanceData = await readBody(event);
  if (!attendanceData) {
    throw createError({ statusCode: 400, message: "Missing attendance data" });
  }

  try {
    const { data, error } = await supabase
      .from("attendance")
      .insert(attendanceData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating attendance:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
