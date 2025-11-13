import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  if (!supabase) {
    throw createError({
      statusCode: 500,
      message: "Failed to initialize Supabase client.",
    });
  }

  try {
    // Fetch counts from the tables
    const { count: employeesCount, error: employeesError } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true });

    const { count: suppliersCount, error: suppliersError } = await supabase
      .from("suppliers")
      .select("*", { count: "exact", head: true });

    const { count: inventoryCount, error: inventoryError } = await supabase
      .from("inventory")
      .select("*", { count: "exact", head: true });

    const { count: pendingOrdersCount, error: pendingOrdersError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending");

    const { count: inProgressOrdersCount, error: inProgressOrdersError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "In Progress");

    // Check for errors
    if (
      employeesError || suppliersError || inventoryError ||
      pendingOrdersError || inProgressOrdersError
    ) {
      throw createError({
        statusCode: 500,
        message: "Error fetching counts.",
      });
    }

    // Return the counts
    return {
      success: true,
      data: {
        employees: employeesCount,
        suppliers: suppliersCount,
        inventory: inventoryCount,
        orders: {
          pending: pendingOrdersCount,
          inProgress: inProgressOrdersCount
        }
      },
    };
  } catch (err) {
    console.error("Error fetching counts:", err);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
});
