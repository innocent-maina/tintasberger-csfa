<script setup>
const { forgotPassword, forgotPasswordFormState } = useAuthentication();
const emit = defineEmits(["save", "cancel"]);

const handleSubmit = async () => {
  const response = await forgotPassword();
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="forgotPasswordFormState">
    <UFormGroup
      class="py-3"
      label="Enter your legendartcraft email to receive the reset password link"
      name="email"
    >
      <UInput
        class="py-4"
        v-model="forgotPasswordFormState.email"
        placeholder="person@legendartcraft.com"
      />
    </UFormGroup>

    <div class="flex justify-center pb-10">
      <UButton color="primary" block type="submit">Save</UButton>
    </div>

    <div>
      <NuxtLink
        to="/"
        class="text-sm text-primary inline-flex items-center gap-1"
      >
        <Icon name="mdi:arrow-left" class="w-4 h-4" />
        Back to login
      </NuxtLink>
    </div>
  </UForm>
</template>
