import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const inventoryData = await readBody(event);
  if (!inventoryData) {
    throw createError({ statusCode: 400, message: "Missing inventory data" });
  }

  try {
    const { data, error } = await supabase
      .from("inventory")
      .insert(inventoryData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating inventory:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
