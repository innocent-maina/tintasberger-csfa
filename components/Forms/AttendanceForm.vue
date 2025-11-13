<script setup lang="ts">
import { useAttendance } from "@/composables/useAttendance";


const {
  updateAttendance,
  createAttendance,
  attendanceFormState,
  isEditingAttendance,
} = useAttendance();

const emit = defineEmits(["save", "cancel"]);

const handleSubmit = async () => {
  let response;

  if (isEditingAttendance.value) {
    response = await updateAttendance(
      attendanceFormState.value.id,
      attendanceFormState.value
    );
  } else {
    response = await createAttendance(attendanceFormState.value);
  }

  if (response.success) {
    isEditingAttendance.value = false;
  }

  await emit("cancel");
};

const { getAllEmployees } = useEmployee();

const employees = ref<{ id: number; name: string }[]>([]); // or whatever your  structure is

onMounted(async () => {
  const response = await getAllEmployees();

  employees.value = response.map((c: any) => ({
    label: c.name || `Employee #${c.id}`, // adjust this depending on your  fields
    value: c.id,
  }));
});

// Computed s that syncs selected  ID to full option and vice versa
const selectedEmployee = computed({
  get() {
    return (
      employees.value.find(
        (option) => option.value === attendanceFormState.value.employee_id
      ) ?? null
    );
  },
  set(newOption) {
    attendanceFormState.value.employee_id = newOption?.value ?? null;
  },
});
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="attendanceFormState">
    <UFormGroup class="py-3" label="Date" name="date">
      <UInput v-model="attendanceFormState.date" type="date" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Check-In" name="check_in">
      <UInput v-model="attendanceFormState.check_in" type="time" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Check-Out" name="check_out">
      <UInput v-model="attendanceFormState.check_out" type="time" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Notes" name="notes">
      <UTextarea v-model="attendanceFormState.notes" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Employee" name="employee_id">
      <USelectMenu
        v-model="selectedEmployee"
        :options="employees"
        placeholder="Select employee"
      />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
