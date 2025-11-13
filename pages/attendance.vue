<script setup>
useSeoMeta({
  title: "Attendance",
  ogTitle: "Attendance",
  description: "Track employee attendance and work shifts.",
  ogDescription: "View real-time attendance data and shift records.",
});

const {
  attendance,
  getAllAttendance,
  getSingleAttendance,
  deleteAttendance,
  attendanceFormState,
  isEditingAttendance,
  resetAttendanceFormState,
} = useAttendance();

const isDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedAttendanceId = ref(null);

await getAllAttendance();

const columns = ref([
  { key: "id", label: "ID" },
  { key: "employees.name", label: "Employee" },
  { key: "employees.id", label: "Employee ID" },
  { key: "date", label: "Date" },
  { key: "check_in", label: "Check-In" },
  { key: "check_out", label: "Check-Out" },
  { key: "notes", label: "Notes" },
]);

const openEditDrawer = async (id) => {
  isEditingAttendance.value = true;
  selectedAttendanceId.value = id;
  isDrawerOpen.value = true;

  const { data } = await getSingleAttendance(id);
  if (data) {
    attendanceFormState.value = { ...data };
  }
};

const refreshAttendance = async () => {
  isDrawerOpen.value = false;
  await getAllAttendance();
};

const confirmDelete = (id) => {
  selectedAttendanceId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedAttendanceId.value) {
    await deleteAttendance(selectedAttendanceId.value);
    await getAllAttendance();
  }
  isDeleteModalOpen.value = false;
};

const createNewAttendance = async () => {
  isDrawerOpen.value = true;
  isEditingAttendance.value = false;
  await resetAttendanceFormState();
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Attendance Records</h1>
      <UButton color="primary" @click="createNewAttendance()">
        New Attendance
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="attendance">
        <template #actions="{ row }">
          <div class="space-x-2">
            <UButton
              icon="mdi:pencil"
              size="xs"
              @click="openEditDrawer(row.id)"
            />
            <UButton
              icon="mdi:trash-can"
              color="red"
              size="xs"
              @click="confirmDelete(row.id)"
            />
          </div>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer
      v-model="isDrawerOpen"
      :title="isEditingAttendance ? 'Edit Attendance' : 'New Attendance'"
    >
      <FormsAttendanceForm @cancel="refreshAttendance" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this attendance record?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
