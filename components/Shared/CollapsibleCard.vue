<script setup lang="ts">
defineProps<{
  title: string;
  bg?: string;
  defaultOpen?: boolean;
}>();

const isOpen = ref(!!useAttrs().defaultOpen);
// const isOpen = ref<boolean>(true)
</script>

<template>
  <div
    class="rounded-xl border border-primary dark:border-stone-700 overflow-hidden my-10"
  >
    <!-- Header -->
    <div
      class="flex justify-between items-center px-4 py-3 cursor-pointer"
      :class="bg || 'bg-gray-100 dark:bg-gray-800'"
      @click="isOpen = !isOpen"
    >
      <h2 class="text-base font-semibold">{{ title }}</h2>
      <Icon
        :name="isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
        class="w-5 h-5 text-gray-500"
      />
    </div>

    <!-- Body -->
    <div v-if="isOpen" class="p-4">
      <!-- azure // darkgrey // dimgrey // whitesmoke // silver -->
      <slot />
    </div>
  </div>
</template>
