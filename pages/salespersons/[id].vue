<script setup lang="ts">
useSeoMeta({
  title: "Single Employee",
  ogTitle: "Single Employee",
  description: "View and update your personal profile.",
  ogDescription: "Manage your account details and preferences.",
});

const route = useRoute();

const isEditing = ref<boolean>(false);

const employeeId = ref(route.params.id?.toString());

const {
  employeeFormState,
  getSingleEmployeePage,
  deleteEmployee,
  getAllEmployees,
} = useEmployee();

const { attendance } = useAttendance();

const response = await getSingleEmployeePage(employeeId.value);

employeeFormState.value = response?.data?.employee;

attendance.value = response?.data?.attendance;

const isDeleteModalOpen = ref(false);

const handleDelete = async () => {
  if (employeeId.value) {
    await deleteEmployee(employeeId.value);
    await getAllEmployees(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};

// const calendarEvents = computed(() => {
//   return attendance.value.map((entry) => ({
//     date: entry.date, // The date the attendance record is for
//     title: `Check-in: ${entry.check_in} | Check-out: ${entry.check_out}`, // Title can include check-in and check-out times
//     description: entry.notes, // Notes about the day (optional)
//     color: entry.check_in < '09:00' ? 'green' : 'red', // Conditional color: Green for on-time, Red for late
//   }));
// });
</script>
<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold">
          {{ employeeFormState.name }}
        </h1>
        <p class="text-sm text-gray-500">
          Employee ID : {{ employeeFormState.id }}
        </p>
      </div>
      <UButton color="primary" @click="isEditing = !isEditing"
        >{{ isEditing ? "Disable Editing" : "Enable Editing" }}
      </UButton>
    </div>

    <!-- Employee Details -->
    <section class="rounded-2xl border border-gray-400 shadow-sm p-6 mb-8">
      <h3 class="text-lg font-semibold mb-4">Employee Details</h3>

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div class="flex-shrink-0">
          <img
            :src="employeeFormState.image_url"
            alt="Employee Image"
            class="rounded-full w-40 h-40 object-cover border border-gray-300 shadow-sm"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 w-full">
          <div>
            <label for="employee-name" class="text-sm text-gray-600 mb-1 block"
              >Name</label
            >
            <UInput
              size="lg"
              id="employee-name"
              v-model="employeeFormState.name"
              :disabled="!isEditing"
            />
          </div>

          <div>
            <label for="employee-email" class="text-sm text-gray-600 mb-1 block"
              >Email</label
            >
            <UInput
              size="lg"
              id="employee-email"
              v-model="employeeFormState.email"
              type="email"
              :disabled="!isEditing"
            />
          </div>

          <div>
            <label for="employee-phone" class="text-sm text-gray-600 mb-1 block"
              >Phone</label
            >
            <UInput
              size="lg"
              id="employee-phone"
              v-model="employeeFormState.phone"
              :disabled="!isEditing"
            />
          </div>

          <div>
            <label
              for="employee-status"
              class="text-sm text-gray-600 mb-1 block"
              >Status</label
            >
            <USelectMenu
              v-model="employeeFormState.status"
              :options="['Active', 'Inactive']"
              placeholder="Select a category"
            />
          </div>

          <div>
            <label
              for="employee-address"
              class="text-sm text-gray-600 mb-1 block"
              >Role</label
            >
            <UInput
              size="lg"
              id="employee-address"
              v-model="employeeFormState.role"
              :disabled="!isEditing"
            />
          </div>

          <div>
            <label
              for="employee-address"
              class="text-sm text-gray-600 mb-1 block"
              >Date Hired</label
            >
            <UInput
              size="lg"
              id="employee-address"
              type="date"
              v-model="employeeFormState.hired_date"
              :disabled="!isEditing"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Attendance Records -->
    <section class="rounded-2xl border border-gray-400 shadow-sm p-6 mb-8">
      <h3 class="text-lg font-semibold mb-4">Attendance Overview</h3>

      <div v-if="attendance?.length">
        <!-- <ChartsAttendanceBarChart :attendance="attendance" /> -->
        <ChartsBar :attendance="attendance" />

      </div>

      <p v-else class="text-gray-500 text-sm italic">
        No attendance records found.
      </p>
    </section>

    <section
      id="delete-employee"
      class="rounded-2xl border border-red-400 shadow-sm p-6 mb-8"
    >
      <h3 class="text-lg font-semibold mb-4">Danger Zone</h3>

      <div class="flex justify-between items-center mb-6">
        <div>
          <h4 class="text-lg font-semibold">Delete this Employee</h4>
          <p class="text-sm text-gray-500">
            This action is irreversible.
            <br />
            It will remove all attendance and related fields about the employee
          </p>
        </div>
        <UButton color="red" @click="isDeleteModalOpen = true"
          >Delete Employee
        </UButton>
      </div>
    </section>

    <div v-if="isEditing" class="flex justify-end space-x-2">
      <UButton @click="isEditing = false" color="gray">Cancel</UButton>
      <UButton color="primary">Save</UButton>
    </div>
  </div>

  <SharedModal
    :show="isDeleteModalOpen"
    message="Are you sure you want to delete this employee?"
    @confirm="handleDelete"
    @close="isDeleteModalOpen = false"
  />
</template>
