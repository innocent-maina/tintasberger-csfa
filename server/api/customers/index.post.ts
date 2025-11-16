import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  const customerData = await readBody(event);
  if (!customerData) {
    throw createError({ statusCode: 400, message: "Missing customer data" });
  }

  try {
    const { data, error } = await supabase
      .from("customers")
      .insert(customerData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating customer:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
