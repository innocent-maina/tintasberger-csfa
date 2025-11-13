<script setup lang="ts">
useSeoMeta({
  title: "Dashboard",
  ogTitle: "Dashboard",
  description: "View your dashboard overview.",
  ogDescription: "Stay updated with your dashboard insights.",
});

const { counts, fetchCounts } = useDashboard();

const { getAllOrders, orders } = useOrder();

onBeforeMount(async () => {
  await getAllOrders();
  await fetchCounts();
});

const items = computed(() => [
  {
    name: "Total Employees",
    icon: "mdi-account-group",
    count: counts.value.employees,
    link: "/employees",
    color: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
  {
    name: "Total Inventory",
    icon: "mdi-clipboard-list",
    count: counts.value.inventory,
    link: "/inventory",
    color: "bg-gradient-to-r from-sky-500 to-cyan-500",
  },
  {
    name: "All Suppliers",
    icon: "mdi-truck",
    count: counts.value.suppliers,
    link: "/suppliers",
    color: "bg-gradient-to-r from-orange-500 to-yellow-500",
  },
  {
    name: "Pending Orders",
    icon: "mdi-clock-alert",
    count: counts.value.orders?.pending || 0,
    link: "/orders?status=Pending",
    color: "bg-gradient-to-r from-rose-500 to-pink-500",
  },
  {
    name: "Orders In Progress",
    icon: "mdi-progress-clock",
    count: counts.value.orders?.inProgress || 0,
    link: "/orders?status=In+Progress",
    color: "bg-gradient-to-r from-purple-500 to-indigo-500",
  },
]);
</script>

<template>
  <div class="space-y-8">
    <!-- Page Title -->
    <header>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard Overview
      </h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        Quick insights and activity summary
      </p>
    </header>

    <!-- Summary Cards -->
    <section>
      <h2 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
        Quick Stats
      </h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        <SharedStatsCard
          v-for="item in items"
          :key="item.name"
          :name="item.name"
          :count="item.count"
          :icon="item.icon"
          :link="item.link"
          :color="item.color"
          class="h-32 flex flex-col justify-between"
        />
      </div>
    </section>

    <!-- Orders Chart -->
    <section>
      <h2 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
        Orders Over Time
      </h2>
      <p class="text-gray-500 text-sm mb-4">
        Track order trends based on creation date.
      </p>
      <ChartsOrdersLineChart :orders="orders" />
    </section>
  </div>
</template>
