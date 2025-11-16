// import { serverSupabaseClient } from "#supabase/server";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  // const supabase = await serverSupabaseClient(event);

  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );


  if (!supabase) {
    throw createError({
      statusCode: 500,
      message: "Failed to initialize Supabase client.",
    });
  }

  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, orders:orders(*), customers:customers(name)")

    if (error) throw createError({ statusCode: 500, message: error.message });

    return { success: true, data };
  } catch (err) {
    console.error("Error fetching invoices:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
