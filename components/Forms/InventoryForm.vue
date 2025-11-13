<script setup lang="ts">
const {
  updateInventory,
  createInventory,
  inventoryFormState,
  isEditingInventory,
} = useInventory();
const emit = defineEmits(["save", "cancel"]);

const { storageFiles, uploadImage } = useStorage();
const toast = useToast();

// Select a file for upload
const selectFile = () => {
  document.getElementById("input-file-upload")?.click();
};

const loadingState = reactive({
  get: false,
  upload: false,
  remove: false,
});

// Handle file input change
const handleFileChange = async (event: any) => {
  try {
    const files = event?.target?.files;

    // Ensure files are selected
    if (!files || files.length === 0) {
      toast.add({ color: "red", title: "No files selected." });
      return;
    }

    // Loop through the selected files
    for (const file of files) {
      // if (isFileValidateError(file)) return; // Validate each file

      const newFileName = file.name.replace(/\s+/g, "_");

      // Create a new File object with the updated name
      const newFile = new File([file], newFileName, { type: file.type });

      loadingState.upload = true;

      // Assuming uploadImage returns an object or string containing the uploaded file's URL or metadata
      const uploadedFile = await uploadImage(newFile, 'inventory');

      if (uploadedFile) {
        // Push the uploaded file information into images array
        inventoryFormState.value.image = uploadedFile.url;
      } else {
        toast.add({ color: "red", title: "File upload failed." });
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

const handleSubmit = async () => {
  let response;

  if (isEditingInventory.value) {
    response = await updateInventory(
      inventoryFormState.value.id,
      inventoryFormState.value
    );
  } else {
    response = await createInventory(inventoryFormState.value);
  }

  if (response.success) {
    isEditingInventory.value = false;
  }

  await emit("cancel");
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="inventoryFormState">
    <UFormGroup class="py-3" label="Name" name="name">
      <UInput v-model="inventoryFormState.name" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Category" name="category">
      <USelectMenu
        v-model="inventoryFormState.category"
        :options="[
          'Hand Tools',
          'Power Tools',
          'Measuring Tools',
          'Safety Gear',
          'Packaging',
        ]"
      />
    </UFormGroup>

    <UFormGroup class="py-3" label="Quantity" name="quantity">
      <UInput v-model="inventoryFormState.quantity" type="number" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Purchase Date" name="purchase_date">
      <UInput v-model="inventoryFormState.purchase_date" type="date" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Cost per Unit" name="cost_per_unit">
      <UInput v-model="inventoryFormState.cost_per_unit" type="number" />
    </UFormGroup>
    <UFormGroup class="py-3" label="Condition" name="condition">
      <USelect
        v-model="inventoryFormState.condition"
        :options="['New', 'Good', 'Bad']"
      />
    </UFormGroup>

    <UFormGroup class="py-3" label="Serial Number" name="serial_number">
      <UInput v-model="inventoryFormState.serial_number" />
    </UFormGroup>

    <!-- Display uploaded images -->
    <div class="mt-4">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Uploaded Image
      </p>
      <div class="flex flex-wrap gap-4">
        <img
          :src="inventoryFormState.image"
          alt="Uploaded Image"
          class="object-cover w-full h-full"
        />
      </div>
    </div>

    <!-- Images Upload -->
    <UFormGroup class="py-3" label="Images" name="images">
      <!-- <UInput type="file" multiple @change="handleFileChange" /> -->
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

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
