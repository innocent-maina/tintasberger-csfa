import { useToast } from "#imports";

export function useSupplier() {
  const toast = useToast();

  const router = useRouter();

  const suppliers = useState("suppliers", () => []);

  const isEditingSupplier = useState<boolean>(
    "is-editing-supplier",
    () => false
  );

  const supplierFormState = useState("supplier-formstate", () => ({
    name: "",
    phone_number: "",
    email: "",
    address: "",
    logo: "",
    website: "",
    category: "",
    products_supplied: [],
    notes: [],
    contact_people: [
      {
        name: "",
        phone: "",
        email: "",
      },
    ],
  }));

  const resetSupplierFormState = () => {
    supplierFormState.value = {
      name: "",
      phone_number: "",
      email: "",
      logo: "",
      website: "",
      address: "",
      category: "",
      products_supplied: [],
      notes: [],
      contact_people: [
        {
          name: "",
          phone: "",
          email: "",
        },
      ],
    };
  };

  const getAllSuppliers = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/suppliers");
      suppliers.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch suppliers.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllSuppliers:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch suppliers.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleSupplier = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/suppliers/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch suppliers details.",
          color: "red",
        });
        return null;
      }

      supplierFormState.value = response?.data;

      return response;
    } catch (error) {
      console.error("Error in getSingleSupplier:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch suppliers details.",
        color: "red",
      });
      throw error;
    }
  };

  const createSupplier = async (supplierData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/suppliers", {
        method: "POST",
        body: supplierData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create supplier.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Supplier created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createSupplier:", error);
      toast.add({
        title: "Error",
        description: "Failed to create supplier.",
        color: "red",
      });
      throw error;
    }
  };

  const updateSupplier = async () => {
    try {
      const response = await $fetch<IApiResponse>(
        `/api/suppliers?id=${supplierFormState.value.id}`,
        {
          method: "PUT",
          body: supplierFormState.value,
        }
      );

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update supplier.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Supplier updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateSupplier:", error);
      toast.add({
        title: "Error",
        description: "Failed to update supplier.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/suppliers?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete supplier.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Supplier deleted successfully!",
        color: "green",
      });

      router.push("/suppliers");

      return response;
    } catch (error) {
      console.error("Error in deleteSupplier:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete supplier.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    suppliers,
    supplierFormState,
    isEditingSupplier,
    getAllSuppliers,
    createSupplier,
    updateSupplier,
    getSingleSupplier,
    deleteSupplier,
    resetSupplierFormState,
  };
}
