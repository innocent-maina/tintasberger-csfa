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
    const { data, error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }
    return { success: true, data };
  } catch (error) {
    if (error) {
      const isForeignKeyError = error.message.includes(
        "violates foreign key constraint"
      );

      return {
        success: false,
        message: isForeignKeyError
          ? "Cannot delete this customer because they have existing orders."
          : "An unexpected error occurred while deleting the customer.",
        details: error.message,
      };
    }

    console.log(`Error deleting customer with id ${id}:`, error);
    return { success: false, message: `Internal Server Error, ${error}` };
  }
});
