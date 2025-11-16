// import { serverSupabaseClient } from "#supabase/server";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  // const supabase = await serverSupabaseClient(event);

  const config = useRuntimeConfig();


  console.log('config', config)

  const supabase = createClient(
    config.supabaseUrl,             // server-only URL
    config.supabaseServiceRoleKey   // server-only service role key
  );

  if (!supabase) {
    throw createError({
      statusCode: 500,
      message: "Failed to initialize Supabase client.",
    });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")

    if (error) throw createError({ statusCode: 500, message: error.message });

    return { success: true, data };
  } catch (err) {
    console.error("Error fetching users:", err);
    return { success: false, message: "Internal Server Error" };
  }
});
