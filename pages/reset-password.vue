<script setup lang="ts">
definePageMeta({
  layout: "blank",
});

useSeoMeta({
  title: "Reset Password",
  ogTitle: "Reset Password",
  description: "",
  ogDescription: "",
});
</script>

<template>
  <div class="flex flex-col justify-between min-h-screen">
    <div class="flex items-center justify-center flex-1">
      <div class="w-full max-w-md text-center">
        <UCard>
          <!-- Logo -->
          <div class="mb-6">
            <img src="/logo.png" class="h-16 w-16" alt="LegendArt Logo" />
          </div>
          <h2 class="text-2xl font-bold text-gray mb-2">Reset Password?</h2>

          <p class="text-sm text-gray-500 mb-6">Let's help you get back</p>

          <!-- Form -->
          <FormsResetPasswordForm />
        </UCard>
      </div>
    </div>

    <!-- Footer text at bottom -->
    <div class="text-center pb-40">
      <NuxtLink
        :to="`mailto:brian@legendartcraft.com`"
        target="_blank"
        class="text-sm text-primary"
      >
        For any inquiries, please contact the system admin
      </NuxtLink>
    </div>
  </div>
</template>
