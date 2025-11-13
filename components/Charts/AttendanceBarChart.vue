<template>
  {{ chartData }}
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import dayjs from "dayjs";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 👇 Props: pass the raw attendance records here
const props = defineProps<{
  attendance: Array<{ date: string; check_in: string | null }>;
}>();

// 👇 Count number of present employees per day
const attendanceCounts = computed(() => {
  const counts: Record<string, number> = {};
  props.attendance.forEach((record) => {
    const date = dayjs(record.date).format("YYYY-MM-DD");
    if (record.check_in) {
      counts[date] = (counts[date] || 0) + 1;
    }
  });
  return counts;
});

// 👇 Prepare data for chart.js
const chartData = computed(() => ({
  labels: Object.keys(attendanceCounts.value).map((d) =>
    dayjs(d).format("MMMM D")
  ),
  datasets: [
    {
      label: "Present Employees",
      backgroundColor: "#4ade80",
      hoverBackgroundColor: "#22c55e",
      data: Object.values(attendanceCounts.value),
    },
  ],
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
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
        text: "Number of Employees Present",
      },
      ticks: {
        stepSize: 1,
      },
    },
  },
};
</script>
