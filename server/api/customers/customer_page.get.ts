import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const { id } = getQuery(event);
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing customer ID" });
  }

  try {
    // 1. Fetch Customer
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (customerError) {
      throw createError({ statusCode: 500, message: customerError.message });
    }

    // 2. Fetch Orders for the Customer
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", id);

    if (ordersError) {
      throw createError({ statusCode: 500, message: ordersError.message });
    }

    // 3. Fetch Invoices for the Customer
    const { data: invoices, error: invoicesError } = await supabase
      .from("invoices")
      .select("*")
      .eq("customer_id", id);

    if (invoicesError) {
      throw createError({ statusCode: 500, message: invoicesError.message });
    }

    // Combine the data
    return {
      success: true,
      data: {
        customer,
        orders,
        invoices,
      },
    };
  } catch (err) {
    console.error(`Error fetching data for customer ID ${id}:`, err);
    return { success: false, message: "Internal Server Error" };
  }
});
