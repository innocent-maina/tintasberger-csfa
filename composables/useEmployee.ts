import { useToast } from "#imports";

export function useEmployee() {
  const toast = useToast();

  const isEditingEmployee = useState<boolean>(
    "is-editing-employee",
    () => false
  );

  const employees = useState("employees", () => []);

  const employeeFormState = useState("employee-formstate", () => ({
    name: "",
    role: "",
    phone: "",
    email: "",
    hired_date: "",
    status: "Active",
  }));

  const resetEmployeeFormState = () => {
    employeeFormState.value = {
      name: "",
      role: "",
      phone: "",
      email: "",
      hired_date: "",
      status: "Active",
    };
  };

  const getAllEmployees = async () => {
    try {
      const response = await $fetch<IApiResponse>("/api/employees");
      employees.value = response.data;

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch employees.",
          color: "red",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllEmployees:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch employees.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleEmployee = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/employees/single`, {
        query: { id },
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch employee details.",
          color: "red",
        });
        return null;
      }

      employeeFormState.value = response?.data;

      return response;
    } catch (error) {
      console.error("Error in getSingleEmployee:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch employee details.",
        color: "red",
      });
      throw error;
    }
  };

  const getSingleEmployeePage = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(
        `/api/employees/employee_page`,
        {
          query: { id },
        }
      );

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to fetch employee details.",
          color: "red",
        });
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error in getSingleEmployee:", error);
      toast.add({
        title: "Error",
        description: "Failed to fetch employee details.",
        color: "red",
      });
      throw error;
    }
  };

  const createEmployee = async (employeeData: any) => {
    try {
      const response = await $fetch<IApiResponse>("/api/employees", {
        method: "POST",
        body: employeeData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to create employee.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Employee created successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createEmployee:", error);
      toast.add({
        title: "Error",
        description: "Failed to create employee.",
        color: "red",
      });
      throw error;
    }
  };

  const updateEmployee = async (id: string, employeeData: any) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/employees?id=${id}`, {
        method: "PUT",
        body: employeeData,
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to update employee.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Employee updated successfully!",
        color: "green",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateEmployee:", error);
      toast.add({
        title: "Error",
        description: "Failed to update employee.",
        color: "red",
      });
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const response = await $fetch<IApiResponse>(`/api/employees?id=${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        toast.add({
          title: "Error",
          description: response.message || "Failed to delete employee.",
          color: "red",
        });
        return null;
      }

      toast.add({
        title: "Success",
        description: "Employee deleted successfully!",
        color: "green",
      });
      return response;
    } catch (error) {
      console.error("Error in deleteEmployee:", error);
      toast.add({
        title: "Error",
        description: "Failed to delete employee.",
        color: "red",
      });
      throw error;
    }
  };

  return {
    employees,
    isEditingEmployee,
    employeeFormState,
    getAllEmployees,
    getSingleEmployee,
    getSingleEmployeePage,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    resetEmployeeFormState,
  };
}
