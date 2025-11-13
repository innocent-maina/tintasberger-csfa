<script setup lang="ts">
defineProps<{
  name: string;
  count: number;
  icon: string;
  link?: string;
  color?: string; // optional for different bg colors
}>();
</script>

<template>
  <NuxtLink :to="link || '#'" class="block">
    <div
      class="rounded-2xl p-4 shadow-md text-white"
      :class="color || 'bg-gradient-to-r from-purple-500 to-indigo-500'"
    >
      <div class="flex items-center gap-3">
        <div class="bg-white/20 rounded-full p-2">
          <Icon :name="icon" class="w-6 h-6" />
        </div>
        <h2 class="text-lg font-semibold">{{ name }}</h2>
      </div>

      <p class="mt-4 text-3xl font-bold">{{ Intl.NumberFormat().format(count) }}</p>
    </div>
  </NuxtLink>
</template>
