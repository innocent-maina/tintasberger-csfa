import { useToast } from "#imports";

export function useInvoice() {
  const toast = useToast();

  const router = useRouter();

  const { orderFormState } = useOrder();

  const isEditingInvoice = useState<boolean>("is-editing-invoice", () => false);

  const showInvoicePreview = useState<boolean>("show-preview", () => false);

  const invoices = useState("invoices", () => [] as IInvoice[]);

  type DocumentTableRow = {
    serviceId: string;
    serviceName: string;
    quantity: number;
    totalPrice: number;
  };

  const createInvoiceFormState = useState("create-invoice-formstate", () => ({
    invoice_number: "",
    issue_date: "",
    total_amount: 0,
    customer_id: "",
    order_id: "",
    invoice_url: "",
    status: "Generated",
  }));

  const invoiceFormState = useState("invoice-formstate", () => ({
    customer_id: "",
    order_id: "",
    preparedBy: "",
    general: {
      documentName: "", // <- You missed this in your state
      documentDate: new Date().toISOString().substring(0, 10),
      documentValidUntil: "",
      documentNumber: "",
      documentType: "",
    },
    documentTableData: [] as DocumentTableRow[],
    invoiceNumber: "",
    invoiceTotal: 0,
  }));

  const resetInvoiceFormState = () => {
    invoiceFormState.value = {
      customer_id: "",
      order_id: "",
      preparedBy: "",
      general: {
        documentName: "", // <- You missed this in your state
        documentDate: new Date().toISOString().substring(0, 10),
        documentValidUntil: "",
        documentNumber: "",
        documentType: "",
      },
      invoiceNumber: "",
      documentTableData: [] as DocumentTableRow[],
      invoiceTotal: 0,
    };
  };

  const getAllInvoices = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/invoices");
      invoices.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch invoices.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllInvoices:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch invoices.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleInvoice = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/invoices/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch invoice details.",
          color: "red",
        });
        return null;
      }

      createInvoiceFormState.value = response.data;

      return response;
    } catch (error) {
      console.error("Error in getSingleInvoice:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch invoice details.",
        color: "red",
      });
      throw error;
    }
  };

  const createInvoice = async () => {
    try {
      createInvoiceFormState.value.invoice_number =
        invoiceFormState.value.invoiceNumber;
      createInvoiceFormState.value.issue_date =
        invoiceFormState.value.general.documentDate;
      createInvoiceFormState.value.total_amount =
        invoiceFormState.value.invoiceTotal;
      createInvoiceFormState.value.customer_id =
        orderFormState.value.customer.id;
      createInvoiceFormState.value.order_id = orderFormState.value.id;

      const response = await $fetch<IApiResponse>("/api/invoices", {
        method: "POST",
        body: createInvoiceFormState.value,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create invoice.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Invoice created successfully!",
        color: "green",
      });

      router.push("/invoices");
      return response.data;
    } catch (error) {
      console.error("Error in createInvoice:", error);
      toast.add({
        title: "Error",
        description: "Failed to create invoice.",
        color: "red",
      });
      throw error;
    }
  };

  const updateInvoice = async (id: string, invoiceData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/invoices?id=${id}`, {
        method: "PUT",
        body: invoiceData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update invoice.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Invoice updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateInvoice:", error);
      toast.add({
        title: "Error",
        description: "Failed to update invoice.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/invoices?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete invoice.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Invoice deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteInvoice:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete invoice.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    invoices,
    isEditingInvoice,
    invoiceFormState,
    showInvoicePreview,
    createInvoiceFormState,
    getAllInvoices,
    getSingleInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    resetInvoiceFormState,
  };
}
