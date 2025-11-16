import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  const body = await readBody(event);
  const { email } = body;

  if (!email) {
    throw createError({ statusCode: 400, message: "Email is required." });
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NUXT_PUBLIC_APP_URL}reset-password`,
  });

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return { success: true, message: "Password reset email sent." };
});
