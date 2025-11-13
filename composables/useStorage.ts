import { useRuntimeConfig } from "#imports";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "#imports";

export function useStorage() {
  const toast = useToast();
  const config = useRuntimeConfig();

  // Get the Supabase URL and ANON key from the public runtime config
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseAnonKey = config.public.supabaseServiceRoleKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or ANON key is missing from runtime config");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  // const bucketName = "warehouse";

  const storageFiles = ref<any>([]);

  const getAllFiles = async (bucketName: string) => {
    try {
      const { data, error } = await supabase.storage.from(bucketName).list();
      if (error) throw error;

      storageFiles.value = data.map((file) => ({
        name: file.name,
        url: `${supabaseUrl}/storage/v1/object/public/${bucketName}/`,
        metadata: file.metadata,
        updated_at: file.updated_at,
      }));

      return storageFiles.value;
    } catch (error) {
      console.error("Error in getAllFiles:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch storage files.",
        color: "red",
      });
    }
  };

    const uploadImage = async (file: File, bucketName: string) => {
    try {
      const filePath = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
      toast.add({
        title: "Success",
        description: "File uploaded successfully!",
        color: "green",
      });

      return { name: filePath, url: fileUrl };
    } catch (error) {
      console.error("Error in uploadImage:", error);
      toast.add({
        title: "Error",
        description: "Failed to upload file.",
        color: "red",
      });
      return null;
    }
  };

  const uploadInvoice = async (file: File, orderNumber: string): Promise<{ name: string; url: string } | null> => {
  try {
    const filePath = `${orderNumber}/invoices/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('orders')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type || "application/pdf",
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage.from('orders').getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) throw new Error("Failed to get public URL");

    toast.add({
      title: "Success",
      description: "File uploaded successfully!",
      color: "green",
    });

    return { name: filePath, url: publicUrlData.publicUrl };
  } catch (error) {
    console.error("Error in uploadInvoice:", error);
    toast.add({
      title: "Error",
      description: "Failed to upload file.",
      color: "red",
    });
    return null;
  }
};


  const deleteFile = async (fileName: string, bucketName: string) => {
    try {
      const { error } = await supabase.storage.from(bucketName).remove([fileName]);
      if (error) throw error;

      toast.add({
        title: "Success",
        description: "File deleted successfully!",
        color: "green",
      });
      await getAllFiles(bucketName);
    } catch (error) {
      console.error("Error in deleteFile:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete file.",
        color: "red",
      });
    }
  };

  return {
    storageFiles,
    uploadImage,
    uploadInvoice,
    getAllFiles,
    deleteFile,
  };
}
