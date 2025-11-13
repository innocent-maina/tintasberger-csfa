<script setup>
import { useEmployee } from "@/composables/useEmployee";


const { updateEmployee, createEmployee, employeeFormState, isEditingEmployee } =
  useEmployee();
const emit = defineEmits(["save", "cancel"]);

const handleSubmit = async () => {
  let response;

  if (isEditingEmployee.value) {
    response = await updateEmployee(
      employeeFormState.value.id,
      employeeFormState.value
    );
  } else {
    response = await createEmployee(employeeFormState.value);
  }

  if (response.success) {
    isEditingEmployee.value = false;
  }

  await emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="employeeFormState">
    <UFormGroup class="py-3" label="Name" name="name">
      <UInput v-model="employeeFormState.name" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Role" name="role">
      <UInput v-model="employeeFormState.role" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Phone" name="phone">
      <UInput v-model="employeeFormState.phone" type="tel" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Email" name="email">
      <UInput v-model="employeeFormState.email" type="email" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Hired Date" name="hired_date">
      <UInput v-model="employeeFormState.hired_date" type="date" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Status" name="status">
      <USelect
        v-model="employeeFormState.status"
        :options="['Active', 'Inactive']"
      />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
