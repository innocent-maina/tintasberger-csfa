<script setup>
definePageMeta({
  layout: "blank",
});

useSeoMeta({
  title: "Unauthorized",
  ogTitle: "Unauthorized",
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="text-center max-w-md">
      <Icon
        name="mdi:alert-circle"
        class="text-red-500 mx-auto mb-4"
        size="48"
      />
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
      <p class="text-gray-600 mb-6">
        You do not have permission to view this page. Please contact your
        administrator if you believe this is a mistake.
      </p>
      <UButton to="/dashboard" color="primary"> Go to Homepage </UButton>
    </div>
  </div>
</template>
