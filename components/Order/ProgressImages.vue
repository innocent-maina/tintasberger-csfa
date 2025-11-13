<script setup lang="ts">
const { updateOrder, createOrder, orderFormState, isEditingOrder } = useOrder();
const emit = defineEmits(["save", "cancel"]);
const { storageFiles, uploadImage } = useStorage();
const toast = useToast();

const MAX_IMAGES = 10;

// Select input
const selectFile = () => {
  document.getElementById("input-file-upload")?.click();
};

// Loading states
const loadingState = reactive({
  get: false,
  upload: false,
  remove: false,
});

// Upload handler
const handleFileChange = async (event: Event) => {
  try {
    const files = (event.target as HTMLInputElement)?.files;
    if (!files || files.length === 0) {
      toast.add({ color: "red", title: "No files selected." });
      return;
    }

    const existingImages = orderFormState.value.production_progress_images || [];
    const totalImages = existingImages.length + files.length;

    if (totalImages > MAX_IMAGES) {
      toast.add({
        color: "red",
        title: `You can only upload a maximum of ${MAX_IMAGES} images.`,
      });
      return;
    }

    loadingState.upload = true;

    // Initialize the images array if not present
    if (!Array.isArray(orderFormState.value.production_progress_images)) {
      orderFormState.value.production_progress_images = [];
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.add({ color: "red", title: "Only image files are allowed." });
        continue;
      }

      const newFileName = file.name.replace(/\s+/g, "_");
      const newFile = new File([file], newFileName, { type: file.type });
      const bucketName = `/orders/${orderFormState.value.order_number}/progress-images/`;

      const uploadedFile = await uploadImage(newFile, bucketName);

      if (uploadedFile?.url) {
        // Update the state directly
        orderFormState.value.production_progress_images.push(uploadedFile.url);
      } else {
        toast.add({ color: "red", title: `Upload failed for ${file.name}` });
      }
    }
  } catch (error) {
    toast.add({
      color: "red",
      title: "Upload failed.",
      description: error?.toString(),
    });
  } finally {
    loadingState.upload = false;
  }
};

</script>
<template>
  <div>
    <!-- Uploaded Images Grid -->
    <div class="mt-4">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Uploaded Images ({{
          orderFormState.production_progress_images?.length || 0
        }}/10)
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <img
          v-for="(img, index) in orderFormState.production_progress_images"
          :key="index"
          :src="img"
          alt="Uploaded Image"
          class="object-cover w-full h-40 rounded-lg border border-gray-200"
        />
      </div>
    </div>

    <!-- Upload Button -->
    <UFormGroup class="py-3" label="Images" name="images">
      <UButton
        class="h-10"
        color="white"
        :disabled="loadingState.upload"
        :loading="loadingState.upload"
        @click="selectFile"
      >
        + Upload new file
      </UButton>
      <input
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        id="input-file-upload"
        @change="handleFileChange"
      />
    </UFormGroup>
  </div>
</template>
