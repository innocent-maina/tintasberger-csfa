import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  const { id } = getQuery(event);
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing employee ID" });
  }

  const updateData = await readBody(event);
  if (!updateData) {
    throw createError({ statusCode: 400, message: "Missing update data" });
  }

  try {
    const { data, error } = await supabase
      .from("employees")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating employee with id ${id}:`, error.message);
      return { success: false, data: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.error(`Error updating employee with id ${id}:`, err);
    return { success: false, data: "Internal Server Error" };
  }
});
