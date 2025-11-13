<script setup lang="ts">
interface DataGridProps2 {
  columns: { key: string; label?: string; sortable?: boolean }[];
  rows: any;
  meta?: IMeta;
}

const props = defineProps<DataGridProps2>();

const columnsTable = computed(() => {
  const columnsWithActions = [
    ...props.columns,
    { key: "actions", label: "Actions", sortable: false },
  ];
  return columnsWithActions;
});
</script>

<template>
  <UTable
    :rows="rows"
    :columns="columnsTable"
    class="w-full"
    :ui="{ td: { padding: 'px-4 py-2' }, th: { base: 'sticky top-0' } }"
  >
    <template #actions-data="{ row }">
      <slot name="actions" :row="row" />
    </template>

    <template #severity-data="{ row }">
      <slot name="severity" :row="row" />
    </template>

    <template #status-data="{ row }">
      <slot name="status" :row="row" />
    </template>

    <template #condition-data="{ row }">
      <slot name="condition" :row="row" />
    </template>

    <template #quantity-data="{ row }">
      <slot name="quantity" :row="row" />
    </template>


    <template #rating-data="{ row }">
      <slot name="rating" :row="row" />
    </template>

    <template #is_over_the_counter-data="{ row }">
      <slot name="is_over_the_counter" :row="row" />
    </template>

    <template #category-data="{ row }">
      <slot name="category" :row="row" />
    </template>

    <template #email-data="{ row }">
      <slot name="email" :row="row" />
    </template>

    <template #phone_number-data="{ row }">
      <slot name="phone_number" :row="row" />
    </template>

    <!-- ----------------------------------------- -->
    <!-- Documents -->
    <!-- ----------------------------------------- -->
    <template #invoice_url-data="{ row }">
      <slot name="invoice_url" :row="row" />
    </template>

    <!-- ----------------------------------------- -->
    <!-- Product images -->
    <!-- ----------------------------------------- -->
    <template
      v-for="column in ['images']"
      #[`${column}-data`]="{ row }"
      :key="column"
    >
      <img
        :src="row[column]"
        alt="Profile"
        class="h-10 w-10 object-cover mx-auto"
        style="border-radius: 50%"
      />
    </template>

    <!-- ----------------------------------------- -->
    <!-- Inventory images -->
    <!-- ----------------------------------------- -->
    <template
      v-for="column in ['images']"
      #[`${column}-data`]="{ row }"
      :key="column"
    >
      <img
        :src="row[column]"
        alt="Image"
        class="h-10 w-10 object-cover mx-auto"
        style="border-radius: 50%"
      />
    </template>

    <!-- ----------------------------------------- -->
    <!-- Table images -->
    <!-- ----------------------------------------- -->
    <template
      v-for="column in ['media.logo', 'logo', 'image', 'image_url', 'url']"
      #[`${column}-data`]="{ row }"
      :key="column"
    >
      <img
        :src="row[column]"
        alt="Profile"
        class="h-10 w-10 object-cover mx-auto"
        style="border-radius: 50%"
      />
    </template>
  </UTable>
</template>
