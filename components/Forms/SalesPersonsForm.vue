<script setup lang="ts">
const {
  createSalesperson,
  updateSalesperson,
  salespersonFormState,
  getAllSalespersons,
  isEditingSalesperson,
} = useSalespersons();

const emit = defineEmits(["save", "cancel"]);

// Save handler
const handleSubmit = async () => {
  let response;

  if (isEditingSalesperson.value) {
    response = await updateSalesperson(salespersonFormState.value.id, salespersonFormState.value);
  } else {
    response = await createSalesperson(salespersonFormState.value);
  }

  if (response) {
    isEditingSalesperson.value = false;
    emit("cancel");
  }
};

// Optional: load all salespersons (e.g., for dropdowns or validation)
onMounted(async () => {
  await getAllSalespersons();
});
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="salespersonFormState">
    <UFormGroup label="Full Name" name="full_name" class="py-3">
      <UInput v-model="salespersonFormState.full_name" placeholder="John Doe" />
    </UFormGroup>

    <UFormGroup label="Email" name="email" class="py-3">
      <UInput type="email" v-model="salespersonFormState.email" placeholder="john@example.com" />
    </UFormGroup>

    <UFormGroup label="Phone" name="phone" class="py-3">
      <UInput type="tel" v-model="salespersonFormState.phone" placeholder="+1 234 567 890" />
    </UFormGroup>

    <UFormGroup label="Territory" name="territory" class="py-3">
      <UInput v-model="salespersonFormState.territory" placeholder="Region or City" />
    </UFormGroup>

    <UFormGroup label="Notes" name="notes" class="py-3">
      <UTextarea v-model="salespersonFormState.notes" placeholder="Optional notes" />
    </UFormGroup>

    <div class="flex justify-end gap-2 mt-4">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">{{ isEditingSalesperson ? "Update" : "Save" }}</UButton>
    </div>
  </UForm>
</template>
