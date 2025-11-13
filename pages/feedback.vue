<script setup lang="ts">
useSeoMeta({
  title: "Feedback",
  ogTitle: "Feedback",
  description: "Manage stock levels and product feedback.",
  ogDescription: "Monitor feedback changes and stock availability.",
});

const {
  feedback,
  getAllFeedback,
  getSingleFeedback,
  deleteFeedback,
  feedbackFormState,
  isEditingFeedback,
  resetFeedbackFormState,
} = useFeedback();

const isDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedFeedbackId = ref<number>(0);

const response = await getAllFeedback();

const columns = ref([
  { key: "name", label: "Name" },
  { key: "rating", label: "Rating" },
  { key: "message", label: "Message" },
]);

const openEditDrawer = async (id: number) => {
  isEditingFeedback.value = true;
  selectedFeedbackId.value = id;
  isDrawerOpen.value = true;

  // Fetch and populate form state
  const { data } = await getSingleFeedback(id);
  if (data) {
    feedbackFormState.value = { ...data };
  }
};

const refreshFeedback = async () => {
  isDrawerOpen.value = false;
  await getAllFeedback();
};

const confirmDelete = (id: number) => {
  selectedFeedbackId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedFeedbackId.value) {
    await deleteFeedback(selectedFeedbackId.value);
    await getAllFeedback();
  }
  isDeleteModalOpen.value = false;
};

const createNewFeedback = async () => {
  isDrawerOpen.value = true;
  isEditingFeedback.value = false;
  await resetFeedbackFormState();
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Hand Tools":
      return "amber";
    case "Power Tools":
      return "primary";
    case "Measuring Tools":
      return "teal";
    case "Safety Gear":
      return "red";
    case "Packaging":
      return "blue";
    default:
      return "gray"; // fallback for unknown categories
  }
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Feedback</h1>
      <!-- <UButton color="primary" @click="createNewFeedback()">
        Add Feedback Item
      </UButton> -->
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="feedback">
        <template #actions="{ row }">
          <div class="space-x-2">
            <!-- <UButton
              icon="mdi:pencil"
              size="xs"
              @click="openEditDrawer(row.id)"
            /> -->
            <UButton
              icon="mdi:trash-can"
              color="red"
              size="xs"
              @click="confirmDelete(row.id)"
            />
          </div>
        </template>

        <template #condition="{ row }">
          <UBadge v-if="row.condition === 'New'" color="green">
            {{ row.condition }}
          </UBadge>
          <UBadge v-else-if="row.condition === 'Good'" color="blue">
            {{ row.condition }}
          </UBadge>
          <UBadge v-else color="gray">
            {{ row.condition }}
          </UBadge>
        </template>

        <template #rating="{ row }">
          <NuxtRating
            :read-only="true"
            border-color="#db8403"
            active-color="#ffa41c"
            inactive-color="#fff"
            :rating-step="0.5"
            :rounded-corners="true"
            :border-width="2"
            :rating-size="20"
            :rating-value="row.rating"
          />
        </template>

        <template #category="{ row }">
          <UBadge :color="getCategoryColor(row.category)">
            {{ row.category }}
          </UBadge>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer
      v-model="isDrawerOpen"
      :title="isEditingFeedback ? 'Edit Feedback' : 'New Feedback'"
    >
      <FormsFeedbackForm @cancel="refreshFeedback" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this feedback item?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
