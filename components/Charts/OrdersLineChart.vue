<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  orders: Array<{ created_at: string }>;
}>();

// Group orders by date (YYYY-MM-DD) and count them
const ordersByDate = computed(() => {
  const counts: Record<string, number> = {};
  props.orders.forEach((order) => {
    const date = dayjs(order.created_at).format("YYYY-MM-DD");
    counts[date] = (counts[date] || 0) + 1;
  });
  return counts;
});

// Format the dates as "Month Day" for chart labels
const formattedLabels = computed(() =>
  Object.keys(ordersByDate.value).map(
    (dateStr) => dayjs(dateStr).format("MMMM D") // 👉 "June 16"
  )
);

// Prepare chart data
const chartData = computed(() => ({
  labels: formattedLabels.value,
  datasets: [
    {
      label: "Orders",
      backgroundColor: "#4ade80",
      borderColor: "#16a34a",
      data: Object.values(ordersByDate.value),
      fill: false,
      tension: 0.3,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Date",
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Number of Orders",
      },
    },
  },
};
</script>
