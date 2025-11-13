import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const { id, orderNumber } = getQuery(event);
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing order ID" });
  }

  if (!orderNumber) {
    throw createError({ statusCode: 400, message: "Missing orderNumber" });
  }

  try {
    // 1️⃣ Get the order_number for the order

    // 2️⃣ Define subfolders to search in
    const subFolders = ["invoices", "progress-images", "order"];

    // 3️⃣ Fetch files from all subfolders
    const allFilePaths = [];

    for (const folder of subFolders) {
      const { data: files, error: listError } = await supabase.storage
        .from("orders")
        .list(`${orderNumber}/${folder}`, {
          limit: 1000,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (listError) {
        console.warn(
          `Could not list files for ${orderNumber}/${folder}:`,
          listError.message
        );
        continue; // skip this folder but continue with others
      }

      console.log("allFilePaths", allFilePaths);

      const filePaths =
        files?.map((file) => `${orderNumber}/${folder}/${file.name}`) || [];
      allFilePaths.push(...filePaths);
    }

    console.log("allFilePaths", allFilePaths);

    // 4️⃣ Delete all files in a single remove() call
    if (allFilePaths.length > 0) {
      const { error: deleteFilesError } = await supabase.storage
        .from("orders")
        .remove(allFilePaths);

      if (deleteFilesError) {
        console.warn(
          `Failed to delete files for order ${orderNumber}:`,
          deleteFilesError.message
        );
      }
    }

    // 5️⃣ Delete the order from the database
    const { error: deleteOrderError } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (deleteOrderError) {
      throw createError({ statusCode: 500, message: deleteOrderError.message });
    }

    return {
      success: true,
      message: `Order ${orderNumber} and its files have been deleted.`,
      allFilePaths,
    };
  } catch (error: any) {
    const isForeignKeyError =
      typeof error.message === "string" &&
      error.message.includes("violates foreign key constraint");

    return {
      success: false,
      message: isForeignKeyError
        ? "Cannot delete this order because it has related invoices. Please delete the invoices first."
        : "An unexpected error occurred while deleting the order.",
      details: error.message,
    };
  }
});
