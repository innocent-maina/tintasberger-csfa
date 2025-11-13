import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const body = await readBody(event);

  console.log("Reset Password Body:", body);

  const { token, password } = body;

  console.log("Reset Password Request:", { token, password });

  try {
    if (!token || !password) {
      throw createError({
        statusCode: 400,
        message: "Token and password are required.",
      });
    }

    // Use admin API with token to update password
    const { error } = await supabase.auth.updateUser(token, {
      password: password,
    });

    if (error) {
      console.error("Error updating password:", error);
      throw createError({ statusCode: 500, message: error.message });
    }

    return { success: true, message: "Password updated successfully." };
  } catch (err) {
    console.error("Error changing password:", err);
    return { success: false, message: `Internal Server Error, ${err}` };
  }
});
