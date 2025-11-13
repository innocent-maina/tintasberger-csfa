import { useToast } from "#imports";

export function useFeedback() {
  const toast = useToast();

  const isEditingFeedback = useState<boolean>(
    "is-editing-feedback",
    () => false
  );

  const feedback = useState("feedback", () => []);

  const feedbackFormState = useState("feedback-formstate", () => ({
    name: "",
    category: "",
    quantity: 0,
    purchase_date: "",
    cost_per_unit: 0,
    condition: "New",
    serial_number: "",
    image: "",
  }));

  const resetFeedbackFormState = () => {
    feedbackFormState.value = {
      name: "",
      category: "",
      quantity: 0,
      purchase_date: "",
      cost_per_unit: 0,
      condition: "New",
      serial_number: "",
      image: "",
    };
  };

  const getAllFeedback = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/feedback");
      feedback.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch feedback.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllFeedback:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch feedback.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleFeedback = async (id: string | number) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/feedback/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch feedback details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSingleFeedback:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch feedback details.",
        color: "red",
      });
      throw error;
    }
  };

  const createFeedback = async (feedbackData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/feedback", {
        method: "POST",
        body: feedbackData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create feedback item.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Feedback item created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createFeedback:", error);
      toast.add({
        title: "Error",
        description: "Failed to create feedback item.",
        color: "red",
      });
      throw error;
    }
  };

  const updateFeedback = async (id: string, feedbackData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/feedback?id=${id}`, {
        method: "PUT",
        body: feedbackData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update feedback item.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Feedback item updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateFeedback:", error);
      toast.add({
        title: "Error",
        description: "Failed to update feedback item.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteFeedback = async (id: string | number) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/feedback?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete feedback item.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Feedback item deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteFeedback:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete feedback item.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    feedback,
    isEditingFeedback,
    feedbackFormState,
    getAllFeedback,
    getSingleFeedback,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    resetFeedbackFormState,
  };
}
