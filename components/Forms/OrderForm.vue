<script setup>
const { createSupplier, updateSupplier, supplierFormState } = useSupplier();
const emit = defineEmits(["save", "cancel"]);

const handleSubmit = async () => {
  let response;

  if (supplierFormState.value.id) {
    response = await updateSupplier(
      supplierFormState.value.id,
      supplierFormState.value
    );
  } else {
    response = await createSupplier(supplierFormState.value);
  }

  if (response.success) {
    emit("save", response.data);
  }
  emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="supplierFormState">
    <UFormGroup class="py-3" label="Name" name="name">
      <UInput v-model="supplierFormState.name" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Description" name="description">
      <UInput v-model="supplierFormState.description" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Contact Name" name="contact_name">
      <UInput v-model="supplierFormState.contact_name" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Phone" name="phone">
      <UInput v-model="supplierFormState.phone" type="tel" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Email" name="email">
      <UInput v-model="supplierFormState.email" type="email" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Address" name="address">
      <UInput v-model="supplierFormState.address" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Country" name="country">
      <UInput v-model="supplierFormState.country" />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
