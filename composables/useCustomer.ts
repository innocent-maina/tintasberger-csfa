import { useToast } from "#imports";

export function useCustomer() {
  const toast = useToast();

  const isEditingCustomer = useState<boolean>(
    "is-editing-customer",
    () => false
  );

  const customers = useState("customers", () => ({} as ICustomer));

  const router = useRouter();

  const customerFormState = useState("customer-formstate", () => ({
    name: "",
    address: "",
    phone: "",
    email: "",
  }));

  const resetCustomerFormState = () => {
    customerFormState.value = {
      name: "",
      address: "",
      phone: "",
      email: "",
    };
  };

  const getAllCustomers = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/customers");
      customers.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch customers.",
          color: "red",
        });
        return null;
      }

      customers.value = response.data;

      return response.data;
    } catch (error) {
      console.error("Error in getAllCustomers:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch customers.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleCustomer = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/customers/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch customer details.",
          color: "red",
        });
        return null;
      }

      customerFormState.value = response?.data;

      return response;
    } catch (error) {
      console.error("Error in getSingleCustomer:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch customer details.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleCustomerPage = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(
        `/api/customers/customer_page`,
        {
          query: { id },
        }
      );

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch customer details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSingleCustomer:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch customer details.",
        color: "red",
      });
      throw error;
    }
  };

  const createCustomer = async (customerData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/customers", {
        method: "POST",
        body: customerData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create customer.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Customer created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createCustomer:", error);
      toast.add({
        title: "Error",
        description: "Failed to create customer.",
        color: "red",
      });
      throw error;
    }
  };

  const updateCustomer = async (id: string, customerData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/customers?id=${id}`, {
        method: "PUT",
        body: customerData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update customer.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Customer updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateCustomer:", error);
      toast.add({
        title: "Error",
        description: "Failed to update customer.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/customers?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        console.log("Error deleting customer:", response);
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete customer.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Customer deleted successfully!",
        color: "green",
      });

      router.push("/customers");

      return response;
    } catch (error) {
      console.error("Error in deleteCustomer:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete customer.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    customers,
    isEditingCustomer,
    customerFormState,
    getAllCustomers,
    getSingleCustomer,
    getSingleCustomerPage,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    resetCustomerFormState,
  };
}
