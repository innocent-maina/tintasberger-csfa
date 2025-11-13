<script setup>
definePageMeta({
  layout: "blank",
});

useSeoMeta({
  title: "Password Reset Email Sent",
  ogTitle: "Password Reset Email Sent",
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="text-center max-w-md">
      <Icon
        name="mdi:check-circle-outline"
        class="text-green-500 mx-auto mb-4"
        size="48"
      />
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        Password Reset Email Sent
      </h1>
      <p class="text-gray-600 mb-6">
        We've sent you an email with instructions to reset your password. Please
        check your inbox and follow the link to proceed.
      </p>
      <UButton to="/" color="primary">Return to Login</UButton>
    </div>
  </div>
</template>
