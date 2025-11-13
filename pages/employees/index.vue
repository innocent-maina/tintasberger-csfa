<script setup>
useSeoMeta({
  title: "Employees",
  ogTitle: "Employees",
  description: "Manage employee details and work status.",
  ogDescription: "Easily update and monitor your employees' activities.",
});

const router = useRouter();

const {
  employees,
  getAllEmployees,
  getSingleEmployee,
  employeeFormState,
  isEditingEmployee,
  resetEmployeeFormState,
} = useEmployee();

const isDrawerOpen = ref(false);

const selectedEmployeeId = ref(null);

const response = await getAllEmployees();

const columns = ref([
  { key: "image_url", label: "Profile" },
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "hired_date", label: "Hired Date" },
]);

const openEditDrawer = async (id) => {
  isEditingEmployee.value = true;
  selectedEmployeeId.value = id;
  isDrawerOpen.value = true;

  // Fetch the employee data and update the form state
  const { data } = await getSingleEmployee(id);
  if (data) {
    employeeFormState.value = { ...data };
  }
};

const refreshEmployees = async () => {
  isDrawerOpen.value = false;
  await getAllEmployees();
};

const createNewEmployee = async () => {
  isDrawerOpen.value = true;
  isEditingEmployee.value = false;
  await resetEmployeeFormState();
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Employees</h1>
      <UButton color="primary" @click="createNewEmployee()">
        Add Employee
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="employees">
        <template #actions="{ row }">
          <div class="space-x-2">
            <UButton
              icon="mdi:eye"
              size="xs"
              @click="router.push(`/employees/${row.id}`)"
            />
            <UButton
              icon="mdi:trash-can"
              color="red"
              size="xs"
              @click="router.push(`/employees/${row.id}#delete-employee`)"
            />
          </div>
        </template>

        <template #status="{ row }">
          <UBadge
            v-if="row.status === 'Active' || row.status === 'active'"
            color="green"
          >
            {{ row.status }}
          </UBadge>

          <UBadge
            v-else-if="row.status === 'Inactive' || row.status === 'inactive'"
            color="red"
          >
            {{ row.status }}
          </UBadge>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer
      v-model="isDrawerOpen"
      :title="isEditingEmployee ? 'Edit Employee' : 'New Employee'"
    >
      <FormsEmployeeForm @cancel="refreshEmployees" />
    </SharedDrawer>
  </div>
</template>
