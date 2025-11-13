<script setup lang="ts">
useSeoMeta({
  title: "Single Supplier",
  ogTitle: "Single Supplier",
  description: "View and update your personal profile.",
  ogDescription: "Manage your account details and preferences.",
});

const route = useRoute();

const isEditing = ref<boolean>(false);

const toast = useToast();

const supplierId = ref(route.params.id?.toString());

const { uploadImage } = useStorage();

const {
  supplierFormState,
  getSingleSupplier,
  updateSupplier,
  deleteSupplier,
  getAllSuppliers,
} = useSupplier();

const response = await getSingleSupplier(supplierId.value);

supplierFormState.value = response?.data;


const isDeleteModalOpen = ref(false);

const handleDelete = async () => {
  if (supplierId.value) {
    await deleteSupplier(supplierId.value);
    await getAllSuppliers(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};

const newNote = ref("");

const addNote = () => {
  if (newNote.value.trim()) {
    supplierFormState.value.notes ||= [];
    supplierFormState.value.notes.push(newNote.value.trim());
    newNote.value = "";
  }
};

const addContactPerson = () => {
  supplierFormState.value.contact_people ||= [];
  supplierFormState.value.contact_people.push({
    name: "",
    email: "",
    phone: "",
  });
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

// Logo Upload

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
      const uploadedFile = await uploadImage(newFile, 'suppliers');

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
  <div>
    <div class="flex justify-between items-center mb-6 gap-4 flex-wrap">
      <!-- Left side: Supplier Name & ID -->
      <div class="flex items-center gap-4 flex-1 min-w-[200px]">
        <div>
          <h1 class="text-2xl font-semibold">
            {{ supplierFormState.name }}
          </h1>
          <p class="text-sm text-gray-500">
            Supplier ID : {{ supplierFormState.uuid }}
          </p>
        </div>
      </div>

      <!-- Right side: Logo and Edit Button -->
      <div class="flex items-center gap-4">
        <UButton color="primary" @click="isEditing = !isEditing">
          {{ isEditing ? "Disable Editing" : "Enable Editing" }}
        </UButton>
      </div>
    </div>

    <!-- Supplier Details -->
    <section class="rounded-2xl border border-gray-400 shadow-sm p-6 mb-8">
      <h3 class="text-lg font-semibold mb-4">Supplier Details</h3>

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <!-- Logo Section -->
        <div class="flex-shrink-0 relative group w-40 h-40">
          <img
            :src="supplierFormState.logo"
            alt="Supplier Logo"
            class="w-full h-full object-contain border border-gray-300 shadow-sm rounded-md"
          />

          <!-- Overlay button when editing is enabled -->
          <div
            v-if="isEditing"
            class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
          >
            <UButton
              size="sm"
              color="white"
              icon="mdi:upload"
              @click="selectFile"
            >
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

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 w-full">
          <div>
            <label for="supplier-name" class="text-sm text-gray-600 mb-1 block"
              >Name</label
            >
            <UInput
              size="lg"
              id="supplier-name"
              v-model="supplierFormState.name"
              :disabled="!isEditing"
            />
          </div>

          <div>
            <label for="supplier-email" class="text-sm text-gray-600 mb-1 block"
              >Email</label
            >
            <UInput
              size="lg"
              id="supplier-email"
              v-model="supplierFormState.email"
              type="email"
              :disabled="!isEditing"
            />
          </div>

          <div>
            <label for="supplier-phone" class="text-sm text-gray-600 mb-1 block"
              >Phone</label
            >
            <UInput
              size="lg"
              id="supplier-phone"
              v-model="supplierFormState.phone_number"
              :disabled="!isEditing"
            />
          </div>

          <div>
            <label
              for="supplier-address"
              class="text-sm text-gray-600 mb-1 block"
              >Address</label
            >
            <UInput
              size="lg"
              id="supplier-address"
              v-model="supplierFormState.address"
              :disabled="!isEditing"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Supplier Details -->
    <!-- Supplier Details -->
    <section class="rounded-2xl border border-gray-400 shadow-sm p-6 mb-8">
      <h3 class="text-lg font-semibold mb-4">Supply Details</h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        <!-- Category -->
        <div class="col-span-2">
          <label class="text-sm text-gray-600 mb-1 block">Category</label>
          <USelectMenu
            v-model="supplierFormState.category"
            :disabled="!isEditing"
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
        </div>

        <!-- Products Supplied -->
        <div class="col-span-2">
          <label class="text-sm text-gray-600 mb-1 block"
            >Products Supplied</label
          >
          <USelectMenu
            v-model="supplierFormState.products_supplied"
            :disabled="!isEditing"
            multiple
            searchable
            :options="productOptions"
            creatable
            placeholder="Add or select products"
          />

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
        </div>

        <!-- Website -->
        <div class="col-span-2">
          <label class="text-sm text-gray-600 mb-1 block">Website</label>
          <UInput
            v-model="supplierFormState.website"
            :disabled="!isEditing"
            size="lg"
            placeholder="https://example.com"
            icon="i-heroicons-globe-alt"
          />
        </div>
      </div>
    </section>

    <!-- Notes Section -->
    <section class="rounded-2xl border border-gray-400 shadow-sm p-6 mb-8">
      <h3 class="text-lg font-semibold mb-4">Notes</h3>

      <div v-if="supplierFormState.notes?.length" class="space-y-2 mb-4">
        <div
          v-for="(note, index) in supplierFormState.notes"
          :key="index"
          class="text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded"
        >
          {{ note }}
        </div>
      </div>

      <div v-if="isEditing" class="flex gap-2">
        <UInput v-model="newNote" placeholder="Add a new note" class="flex-1" />
        <UButton @click="addNote" icon="i-heroicons-plus" />
      </div>
    </section>

    <!-- Contact People Section -->
    <section class="rounded-2xl border border-gray-400 shadow-sm p-6 mb-8">
      <h3 class="text-lg font-semibold mb-4">Contact People</h3>

      <div
        v-for="(person, index) in supplierFormState.contact_people"
        :key="index"
        class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4"
      >
        <div>
          <label
            for="supplier-person-name"
            class="text-sm text-gray-600 mb-1 block"
            >Name</label
          >
          <UInput
            v-model="person.name"
            :disabled="!isEditing"
            placeholder="Full Name"
          />
        </div>

        <div>
          <label
            for="supplier-person-email"
            class="text-sm text-gray-600 mb-1 block"
            >Email</label
          >
          <UInput
            v-model="person.email"
            :disabled="!isEditing"
            placeholder="Email"
            type="email"
          />
        </div>

        <div>
          <label
            for="supplier-person-phone"
            class="text-sm text-gray-600 mb-1 block"
            >Phone</label
          >
          <UInput
            v-model="person.phone"
            :disabled="!isEditing"
            placeholder="Phone Number"
          />
        </div>
      </div>

      <div v-if="isEditing">
        <UButton @click="addContactPerson" icon="i-heroicons-plus"
          >Add Contact</UButton
        >
      </div>
    </section>

    <section
      id="delete-supplier"
      class="rounded-2xl border border-red-400 shadow-sm p-6 mb-8"
    >
      <h3 class="text-lg font-semibold mb-4">Danger Zone</h3>

      <div class="flex justify-between items-center mb-6">
        <div>
          <h4 class="text-lg font-semibold">Delete this Supplier</h4>
          <p class="text-sm text-gray-500">
            This action is irreversible.
            <br />
            It will remove all attendance and related fields about the supplier
          </p>
        </div>
        <UButton color="red" @click="isDeleteModalOpen = true"
          >Delete Supplier
        </UButton>
      </div>
    </section>

    <div v-if="isEditing" class="flex justify-end space-x-2">
      <UButton @click="isEditing = false" color="gray">Cancel</UButton>
      <UButton color="primary" @click="updateSupplier()">Save</UButton>
    </div>
  </div>

  <SharedModal
    :show="isDeleteModalOpen"
    message="Are you sure you want to delete this supplier?"
    @confirm="handleDelete"
    @close="isDeleteModalOpen = false"
  />
</template>
