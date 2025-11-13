<script setup lang="ts">
const { createSupplier, updateSupplier, supplierFormState } = useSupplier();

const emit = defineEmits(["save", "cancel"]);

const toast = useToast();

const { uploadImage } = useStorage();

const handleSubmit = async () => {
  let response;

  if (supplierFormState.value.id) {
    response = await updateSupplier(
      supplierFormState.value.id,
      supplierFormState.value
    );
  } else {
    response = await createSupplier(supplierFormState.value);
  }

  if (response.success) {
    emit("save", response.data);
  }
  emit("cancel");
};

const productOptions = [
  "MDF Boards",
  "Plywood",
  "Particle Board",
  "Hardwood",
  "Softwood",
  "Veneer Sheets",
  "Laminated Boards",
  "Hinges",
  "Drawer Slides",
  "Screws",
  "Nails",
  "Handles & Knobs",
  "Locks",
  "Brackets",
  "Castors",
  "Upholstery Fabric",
  "Foam Sheets",
  "Cushion Filling",
  "Leatherette",
  "Wood Stain",
  "Varnish",
  "Spray Paint",
  "Primer",
  "Sandpaper",
  "Clear Glass",
  "Frosted Glass",
  "Acrylic Sheets",
  "Mirror Panels",
  "Bubble Wrap",
  "Stretch Film",
  "Cardboard Boxes",
  "Edge Protectors",
  "Adhesives",
  "Sealants",
  "Safety Gear",
];

// logo upload
// Select a file for upload
const selectFile = () => {
  document.getElementById("input-file-upload")?.click();
};

const loadingState = reactive({
  get: false,
  upload: false,
  remove: false,
});

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
      const uploadedFile = await uploadImage(newFile, "suppliers");

      if (uploadedFile) {
        // Push the uploaded file information into images array
        supplierFormState.value.logo = uploadedFile.url;
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
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="supplierFormState">
    <UFormGroup class="py-3" label="Name" name="name">
      <UInput v-model="supplierFormState.name" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Business Phone" name="phone_number">
      <UInput v-model="supplierFormState.phone_number" type="tel" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Business Email" name="email">
      <UInput v-model="supplierFormState.email" type="email" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Address" name="address">
      <UInput v-model="supplierFormState.address" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Website" name="website">
      <UInput v-model="supplierFormState.website" />
    </UFormGroup>

    <UFormGroup class="py-3" label="Category" name="category">
      <USelectMenu
        v-model="supplierFormState.category"
        :options="[
          'Timber',
          'Fabric',
          'Hardware',
          'Paint',
          'Glass',
          'Packaging',
          'Other',
        ]"
        placeholder="Select a category"
      />
    </UFormGroup>

    <UFormGroup class="py-3" label="Products Supplied" name="products_supplied">
      <USelectMenu
        v-model="supplierFormState.products_supplied"
        multiple
        searchable
        :options="productOptions"
        creatable
        placeholder="Add or select products"
      />
    </UFormGroup>

    <!-- Selected items as UBadges -->
    <div class="flex flex-wrap gap-2 mt-3">
      <UBadge
        v-for="(product, index) in supplierFormState.products_supplied"
        :key="index"
        color="primary"
        variant="soft"
        class="text-sm"
      >
        {{ product }}
      </UBadge>
    </div>

    <!-- Images Upload -->
    <!-- <UFormGroup class="py-3" label="Logo" name="logo">
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
    </UFormGroup> -->
    <div class="flex-shrink-0 relative group w-40 h-40 mt-10">
      <img
        :src="supplierFormState.logo"
        alt="Supplier Logo"
        class="w-full h-full object-contain border border-gray-300 shadow-sm rounded-md"
      />

      <!-- Overlay button when editing is enabled -->
      <div
        class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
      >
        <UButton size="sm" color="white" icon="mdi:upload" @click="selectFile">
          Change Logo
        </UButton>
      </div>

      <!-- Hidden file input -->
      <input
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        id="input-file-upload"
        @change="handleFileChange"
      />
    </div>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
