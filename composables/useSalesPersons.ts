import { useToast } from "#imports";

export function useSalespersons() {
  const toast = useToast();

  const isEditingSalesperson = useState<boolean>(
    "is-editing-salesperson",
    () => false
  );

  const salespersons = useState<any[]>("salespersons", () => []);

  const salespersonFormState = useState("salesperson-formstate", () => ({
    id: null,
    full_name: "",
    email: "",
    phone: "",
    territory: "",
    notes: "",
  }));

  const resetSalespersonFormState = () => {
    salespersonFormState.value = {
      id: null,
      full_name: "",
      email: "",
      phone: "",
      territory: "",
      notes: "",
    };
  };

  // ------------------------------------------------------------
  // GET ALL SALESPERSONS
  // ------------------------------------------------------------
  const getAllSalespersons = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/salespersons");

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch salespersons.",
          color: "red",
        });
        return [];
      }

      salespersons.value = response.data;
      return response.data;
    } catch (error) {
      console.error("Error in getAllSalespersons:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch salespersons.",
        color: "red",
      });
      throw error;
    }
  };

  // ------------------------------------------------------------
  // GET SINGLE SALESPERSON
  // ------------------------------------------------------------
  const getSingleSalesperson = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>("/api/salespersons/single", {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch salesperson details.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getSingleSalesperson:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch salesperson details.",
        color: "red",
      });
      throw error;
    }
  };

  // ------------------------------------------------------------
  // CREATE SALESPERSON
  // ------------------------------------------------------------
  const createSalesperson = async (data: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/salespersons", {
        method: "POST",
        body: data,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create salesperson.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Salesperson created successfully!",
        color: "green",
      });

      return response.data;
    } catch (error) {
      console.error("Error in createSalesperson:", error);
      toast.add({
        title: "Error",
        description: "Failed to create salesperson.",
        color: "red",
      });
      throw error;
    }
  };

  // ------------------------------------------------------------
  // UPDATE SALESPERSON
  // ------------------------------------------------------------
  const updateSalesperson = async (id: string, data: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/salespersons?id=${id}`, {
        method: "PUT",
        body: data,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update salesperson.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Salesperson updated successfully!",
        color: "green",
      });

      return response.data;
    } catch (error) {
      console.error("Error in updateSalesperson:", error);
      toast.add({
        title: "Error",
        description: "Failed to update salesperson.",
        color: "red",
      });
      throw error;
    }
  };

  // ------------------------------------------------------------
  // DELETE SALESPERSON
  // ------------------------------------------------------------
  const deleteSalesperson = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/salespersons?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete salesperson.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Salesperson deleted successfully!",
        color: "green",
      });

      return response.data;
    } catch (error) {
      console.error("Error in deleteSalesperson:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete salesperson.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    salespersons,
    isEditingSalesperson,
    salespersonFormState,
    getAllSalespersons,
    getSingleSalesperson,
    createSalesperson,
    updateSalesperson,
    deleteSalesperson,
    resetSalespersonFormState,
  };
}
