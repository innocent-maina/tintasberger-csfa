<script setup lang="ts">
defineProps<{ isOpen: boolean }>();

const emit = defineEmits(["toggle"]);

const userRole = useHashedCookie<string | null | undefined>("aa05f44d53a34");

const sidebarItems = [
  {
    section: "General",
    items: [
      { label: "Dashboard", icon: "mdi:home", to: "/dashboard" },
      { label: "Orders", icon: "mdi:shopping", to: "/orders" },
      { label: "Invoices", icon: "mdi:invoice", to: "/invoices" },
    ],
  },
  {
    section: "People",
    items: [
      { label: "Suppliers", icon: "mdi:truck-delivery", to: "/suppliers" },
      { label: "Customers", icon: "mdi:account", to: "/customers" },
      { label: "Employees", icon: "mdi:microsoft-teams", to: "/employees" },
      {
        label: "Attendance",
        icon: "mdi:calendar-check",
        to: "/attendance",
      },
    ],
  },
  {
    section: "Workshop",
    items: [
      { label: "Inventory", icon: "mdi:saw-blade", to: "/inventory" },
      // { label: "Machinery", icon: "mdi:forklift", to: "/machinery" },
    ],
  },
    {
    section: "Business",
    items: [
      { label: "Feedback", icon: "mdi:robot-love-outline", to: "/feedback" },
    ],
  },
  {
    section: "Your Profile",
    items: [
      { label: "Settings", icon: "mdi:cogs", to: "/settings" },
      { label: "Profile", icon: "mdi:account", to: "/profile" },
    ],
  },
];

// Conditionally include the System section for admins only
if (userRole.value === "admin") {
  sidebarItems.push({
    section: "System",
    items: [
      {
        label: "Authenticated Users",
        icon: "mdi:account-circle",
        to: "/users",
      },
    ],
  });
}
</script>
<template>
  <aside
    class="fixed inset-y-0 left-0 h-screen border-r p-4 transition-all duration-300 ease-in-out overflow-y-auto"
    :class="[
      isOpen ? 'w-64' : 'w-20',
      'bg-white dark:bg-stone-800', // Light mode = white, Dark mode = stone-800
      'border-r border-gray-200 dark:border-stone-700', // Light & dark border
    ]"
    style="z-index: 200"
  >
    <!-- Logo & Title -->
    <NuxtLink to="/dashboard" class="flex items-center gap-2 mb-6">
      <img src="/logo.png" class="h-12" />
      <span
        class="text-lg font-semibold transition-opacity duration-200"
        :class="isOpen ? 'opacity-100' : 'opacity-0'"
      >
        Robbialac
      </span>
    </NuxtLink>

    <!-- Navigation Items -->
    <div class="flex-1 overflow-y-auto mb-6">
      <div v-for="section in sidebarItems" :key="section.section" class="mb-6">
        <!-- Hide section titles if sidebar is collapsed -->
        <p v-if="isOpen" class="text-xs font-bold mb-2 text-gray-500 uppercase">
          {{ section.section }}
        </p>
        <div class="space-y-1">
          <NuxtLink
            v-for="link in section.items"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200"
            :class="[
              $route.path === link.to
                ? 'bg-primary text-white'
                : 'hover:bg-primary/10 dark:hover:bg-stone-700 dark:hover:text-white hover:text-primary',
              ' dark:text-gray-300',
            ]"
            @click="emit('toggle')"
          >
            <Icon :name="link.icon" class="w-5 h-5 flex-shrink-0" />
            <!-- Only show label if sidebar is expanded -->
            <span
              v-if="isOpen"
              class="transition-opacity duration-200 opacity-100"
            >
              {{ link.label }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </aside>
</template>
