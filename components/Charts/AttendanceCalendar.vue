<script setup lang="ts">
import dayjs from "dayjs";

const props = defineProps<{
  attendance: Array<{
    id: number;
    date: string;
    check_in: string | null;
    check_out: string | null;
  }>;
}>();

// 📅 Define start & end dates for the calendar view (optional)
const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
const endDate = dayjs().endOf("month").format("YYYY-MM-DD");

// ✅ Map attendance records to UCalendar event format
const calendarEvents = computed(() =>
  props.attendance
    .filter((record) => record.check_out) // 👉 Mark only if they checked out
    .map((record) => ({
      date: dayjs(record.date).format("YYYY-MM-DD"),
      title: "Present",
      color: "#4ade80", // Green for present
    }))
);
</script>

<template>
  <UCalendar
    :events="calendarEvents"
    :range="{ start: startDate, end: endDate }"
  />
</template>
