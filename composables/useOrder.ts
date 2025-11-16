import { useToast } from "#imports";

export function useOrder() {
  const toast = useToast();

  const isEditingOrder = useState<boolean>("is-editing-order", () => false);

  const orders = useState("order-formstate", () => [] as IOrder[]);

  const orderFormState = useState("order-formstate", () => ({
    customer: {
      name: "",
      email: "",
      phone: "",
      address: "",
      image_url:
        "https://mkugraegzytkyygrnnhp.supabase.co/storage/v1/object/public/general//profile_default.png",
    },
    status: "Pending",
    product_attributes: {
      color: "",
      width: "",
      height: "",
      wood_type: "",
      description: "",
      length: "",
      product_type: "",
      use_custom_dimensions: false,
    },
    notes: "",
    product_image_samples: [],
    production_progress_images: [],
    customer_id: 0,
    delivery: {
      address: "",
      date: "",
    },
    required_deposit_amount: 0,
    total_cost: 0,
    is_viable: false,
    deposit_payment: {
      paid: false,
      amount_paid: 0,
      payment_date: "",
      payment_time: "",
      payment_method: "",
      payment_reference: "",
    },
    order_number: "",
  }));

  const resetOrderFormState = () => {
    orderFormState.value = {
      status: "Pending",
      customer: {
        name: "",
        email: "",
        phone: "",
        address: "",
        image_url:
          "https://mkugraegzytkyygrnnhp.supabase.co/storage/v1/object/public/general//profile_default.png",
      },
      product_attributes: {
        color: "",
        width: "",
        height: "",
        use_custom_dimensions: false,
        wood_type: "",
        description: "",
        length: "",
        product_type: "",
      },
      notes: "",
      product_image_samples: [],
      production_progress_images: [],
      customer_id: 0,
      required_deposit_amount: 0,
      total_cost: 0,
      delivery: {
        address: "",
        date: "",
      },
      is_viable: false,
      deposit_payment: {
        paid: false,
        amount_paid: 0,
        payment_date: "",
        payment_time: "",
        payment_method: "",
        payment_reference: "",
      },
      order_number: "",
    };
  };

  const getAllOrders = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/orders");
      orders.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch orders.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllOrders:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch orders.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleOrder = async (id: number | string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/orders/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch order details.",
          color: "red",
        });
        return null;
      }

      orderFormState.value = response?.data;

      return response;
    } catch (error) {
      console.error("Error in getSingleOrder:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch order details.",
        color: "red",
      });
      throw error;
    }
  };

  const getOrderByOrderNumber = async (id: number | string) => {
    try {
      const response = await $fetch<IApiResponse>(
        `/api/orders/single-order-number`,
        {
          query: { id },
        }
      );

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch order details.",
          color: "red",
        });
        return null;
      }

      orderFormState.value = response?.data;

      toast.add({
        title: "Success",
        description: "Invoice Preview fetched successfully!",
        color: "green",
      });

      return response;
    } catch (error) {
      console.error("Error in getSingleOrder:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch order details.",
        color: "red",
      });
      throw error;
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/orders", {
        method: "POST",
        body: orderData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create order.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Order created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createOrder:", error);
      toast.add({
        title: "Error",
        description: "Failed to create order.",
        color: "red",
      });
      throw error;
    }
  };

  const updateOrder = async () => {
    try {
      // from the orderFormState, remove the customers property if it exists
      if (orderFormState.value.customer) {
        delete orderFormState.value?.customer;
      }

      const response = await $fetch<IApiResponse>(
        `/api/orders?id=${orderFormState.value.id}`,
        {
          method: "PUT",
          body: orderFormState.value,
        }
      );

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update order.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Order updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateOrder:", error);
      toast.add({
        title: "Error",
        description: "Failed to update order.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteOrder = async (id: number, orderNumber: number) => {
    try {
      const response = await $fetch<IApiResponse>(
        `/api/orders?id=${id}&orderNumber=${orderNumber}`,
        {
          method: "DELETE",
        }
      );
      // const response = await $fetch<IApiResponse>(`/api/storage/wahome`);

      console.log("response", response);

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete order.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Order deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteOrder:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete order.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    orders,
    isEditingOrder,
    orderFormState,
    getAllOrders,
    getSingleOrder,
    getOrderByOrderNumber,
    createOrder,
    updateOrder,
    deleteOrder,
    resetOrderFormState,
  };
}
