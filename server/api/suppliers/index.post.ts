import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const suppliersData = await readBody(event);
  if (!suppliersData) {
    throw createError({ statusCode: 400, message: "Missing suppliers data" });
  }

  try {
    const { data, error } = await supabase
      .from("suppliers")
      .insert(suppliersData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating suppliers:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
