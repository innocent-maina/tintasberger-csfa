import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  const employeeData = await readBody(event);
  if (!employeeData) {
    throw createError({ statusCode: 400, message: "Missing employee data" });
  }

  try {
    const { data, error } = await supabase
      .from("employees")
      .insert(employeeData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating employee:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
