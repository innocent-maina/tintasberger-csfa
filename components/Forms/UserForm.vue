<script setup>
const { updateUser, userFormState, createUser, isEditingUser } = useUsers();
const emit = defineEmits(["save", "cancel"]);

const handleSubmit = async () => {
  let response;

  if (userFormState.value.id) {
    response = await updateUser(userFormState.value.id, userFormState.value);
  }
  if (response.success) {
    emit("save", response.data);
  }
  emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="userFormState">
    <UFormGroup class="py-3" label="Full name" name="full_name">
      <UInput v-model="userFormState.full_name" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Username" name="username">
      <UInput v-model="userFormState.username" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Email" name="email">
      <UInput v-model="userFormState.email" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Phone Number" name="phone_number">
      <UInput v-model="userFormState.phone_number" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Role" name="role">
      <UInput v-model="userFormState.role" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Image" name="image_url">
      <UInput v-model="userFormState.image_url" />
    </UFormGroup>

    <UFormGroup v-if="!isEditing" class="py-3" label="Password" name="password">
      <UInput v-model="userFormState.password" />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit" @click="createUser()"
        >Save</UButton
      >
    </div>
  </UForm>
</template>
