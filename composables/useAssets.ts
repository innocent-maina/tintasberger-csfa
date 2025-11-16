import { useToast } from "#imports";

export function useAssets() {
  const toast = useToast();

  const isEditingAssets = useState<boolean>("is-editing-assets", () => false);
  const assets = useState<any[]>("assets", () => []);

  const assetsFormState = useState("assets-formstate", () => ({
    id: null,
    asset_code: "",
    name: "",
    category: "",
    purchase_date: "",
    purchase_value: 0,
    status: "active",
    assigned_salesperson_id: null,
    metadata: {
      notes: "",
    },
  }));

  const resetAssetsFormState = () => {
    assetsFormState.value = {
      id: null,
      asset_code: "",
      name: "",
      category: "",
      purchase_date: "",
      purchase_value: 0,
      status: "active",
      assigned_salesperson_id: null,
      metadata: {
        notes: "",
      },
    };
  };

  // ------------------------------------------------------------
  // GET ALL ASSETS
  // ------------------------------------------------------------
  const getAllAssets = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/assets");

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch assets.",
          color: "red",
        });
        return [];
      }

      assets.value = response.data;
      return response.data;
    } catch (error) {
      console.error("Error in getAllAssets:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch assets.",
        color: "red",
      });
      throw error;
    }
  };

  // ------------------------------------------------------------
  // GET SINGLE ASSET
  // ------------------------------------------------------------
  const getSingleAssets = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>("/api/assets/single", {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch asset details.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getSingleAssets:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch asset details.",
        color: "red",
      });
      throw error;
    }
  };

  // ------------------------------------------------------------
  // CREATE
  // ------------------------------------------------------------
  const createAssets = async (assetsData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/assets", {
        method: "POST",
        body: assetsData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create asset.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Asset created successfully!",
        color: "green",
      });

      return response.data;
    } catch (error) {
      console.error("Error in createAssets:", error);
      toast.add({
        title: "Error",
        description: "Failed to create asset.",
        color: "red",
      });
      throw error;
    }
  };

  // ------------------------------------------------------------
  // UPDATE
  // ------------------------------------------------------------
  const updateAssets = async (id: string, assetsData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/assets?id=${id}`, {
        method: "PUT",
        body: assetsData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update asset.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Asset updated successfully!",
        color: "green",
      });

      return response.data;
    } catch (error) {
      console.error("Error in updateAssets:", error);
      toast.add({
        title: "Error",
        description: "Failed to update asset.",
        color: "red",
      });
      throw error;
    }
  };

  // ------------------------------------------------------------
  // DELETE
  // ------------------------------------------------------------
  const deleteAssets = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/assets?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete asset.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Asset deleted successfully!",
        color: "green",
      });

      return response.data;
    } catch (error) {
      console.error("Error in deleteAssets:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete asset.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    assets,
    isEditingAssets,
    assetsFormState,
    getAllAssets,
    getSingleAssets,
    createAssets,
    updateAssets,
    deleteAssets,
    resetAssetsFormState,
  };
}
