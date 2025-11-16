import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  const invoiceData = await readBody(event);
  if (!invoiceData) {
    throw createError({ statusCode: 400, message: "Missing invoice data" });
  }

  try {
    const { data, error } = await supabase
      .from("invoices")
      .insert(invoiceData)
      .select()
      .single();

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating invoice:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
