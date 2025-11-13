import { useToast } from "#imports";

export function useAttendance() {
  const toast = useToast();

  const isEditingAttendance = useState<boolean>(
    "is-editing-attendance",
    () => false
  );

  const attendance = useState("attendance", () => []);

  const attendanceFormState = useState("attendance-formstate", () => ({
    date: "",
    check_in: "",
    check_out: "",
    notes: "",
    employee_id: "",
  }));

  const resetAttendanceFormState = () => {
    attendanceFormState.value = {
      date: "",
      check_in: "",
      check_out: "",
      notes: "",
      employee_id: "",
    };
  };

  const getAllAttendance = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/attendance");
      attendance.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch attendance.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllAttendance:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch attendance.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleAttendance = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/attendance/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description:
            response.message || "Failed to fetch attendance details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSingleAttendance:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch attendance details.",
        color: "red",
      });
      throw error;
    }
  };

  const createAttendance = async (attendanceData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/attendance", {
        method: "POST",
        body: attendanceData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create attendance.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Attendance recorded successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createAttendance:", error);
      toast.add({
        title: "Error",
        description: "Failed to create attendance.",
        color: "red",
      });
      throw error;
    }
  };

  const updateAttendance = async (id: string, attendanceData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/attendance?id=${id}`, {
        method: "PUT",
        body: attendanceData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update attendance.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Attendance updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateAttendance:", error);
      toast.add({
        title: "Error",
        description: "Failed to update attendance.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteAttendance = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/attendance?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete attendance.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Attendance deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteAttendance:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete attendance.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    attendance,
    isEditingAttendance,
    attendanceFormState,
    getAllAttendance,
    getSingleAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    resetAttendanceFormState,
  };
}
