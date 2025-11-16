import { createClient } from "@supabase/supabase-js";
import { defineEventHandler, getCookie, createError } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  const { id } = getQuery(event);

  if (!id) {
    throw createError({ statusCode: 400, message: "Missing user ID" });
  }

  try {
    const { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    return { success: true, user: profile };
  } catch (err) {
    console.error("Error fetching profile:", err);
    return { success: false, message: "Failed to fetch user profile" };
  }
});
