<script setup lang="ts">
const { orderFormState, isEditingOrder } = useOrder();

const productTypeOptions = [
  { name: "Bench", img: "/categories/bench.jpeg" },
  { name: "Office Desk", img: "/categories/office_desk.jpeg" },
  { name: "Bookshelf", img: "/categories/bookshelf.jpeg" },
  { name: "Bedside Drawer", img: "/categories/bedside_drawer.jpeg" },
  { name: "Reception Desk", img: "/categories/reception_desk.jpeg" },
  { name: "Mirror", img: "/categories/mirror.jpeg" },
  { name: "Bed", img: "/categories/bed.jpeg" },
  { name: "Kids Bed", img: "/categories/kids_beds.jpeg" },
  { name: "TV Stand", img: "/categories/tv_stand.jpeg" },
  { name: "Dresser/Cabinet", img: "/categories/dresser.jpeg" },
  { name: "Stool", img: "/categories/stool.jpeg" },
  { name: "Shoe Rack", img: "/categories/shoe_rack.jpeg" },
  { name: "Seat", img: "/categories/seat.jpeg" },
  { name: "Side Table", img: "/categories/side_table.jpeg" },
  { name: "Coffee Table", img: "/categories/coffee_table.jpeg" },
  { name: "Dressing Table", img: "/categories/dressing_table.jpeg" },
];

const selectedProductType = computed(() =>
  productTypeOptions.find(
    (option) =>
      option.name.toLowerCase() ===
      orderFormState.value.product_attributes.product_type?.toLowerCase()
  )
);

const colorOptions = [
  { name: "White", img: "/colors/white.jpeg" },
  { name: "Grey", img: "/colors/grey.jpeg" },
  { name: "Metallic", img: "/colors/metallic.jpeg" },
  { name: "Wood Finish", img: "/colors/wood_finish.jpeg" },
  { name: "Custom Color", img: "/colors/custom.jpeg" },
];

const woodTypeOptions = [
  { name: "Mahogany", img: "/wood/mahogany.jpeg" },
  { name: "Pine", img: "/wood/pine.jpeg" },
  { name: "MDF", img: "/wood/mdf.jpeg" },
  { name: "Mvule", img: "/wood/mvule.jpeg" },
  { name: "Oak", img: "/wood/oak.jpeg" },
];

const selectedColor = computed(() =>
  colorOptions.find(
    (opt) => opt.name === orderFormState.value.product_attributes.color
  )
);

const selectedWoodType = computed(() =>
  woodTypeOptions.find(
    (opt) => opt.name === orderFormState.value.product_attributes.wood_type
  )
);
</script>

<template>
  <!-- Product Samples -->
  <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4">
    <div
      v-for="(image, index) in orderFormState.product_image_samples"
      :key="index"
      class="relative w-full rounded-lg overflow-hidden border bg-white"
      style="aspect-ratio: 1 / 1"
    >
      <img :src="image" alt="Product Sample" class="w-50 h-50 object-contain" />
    </div>
  </div>

  <!-- Product Type, Color, Wood Type -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
    <!-- Product Type -->
    <div>
      <label class="text-sm text-gray-600 block mb-1">Product Type</label>
      <div
        v-if="selectedProductType"
        class="rounded-lg overflow-hidden border shadow-sm"
      >
        <img
          :src="selectedProductType.img"
          :alt="selectedProductType.name"
          class="w-full object-contain mx-auto"
          style="height: 250px"
        />

        <div class="p-2 text-center text-sm font-medium text-gray-700">
          {{ selectedProductType.name }}
        </div>
      </div>
      <div v-else class="text-gray-400 italic text-sm">
        No product type selected
      </div>
    </div>

    <!-- Color -->
    <div>
      <label class="text-sm text-gray-600 block mb-1">Color</label>
      <div
        v-if="selectedColor"
        class="rounded-lg overflow-hidden border shadow-sm"
      >
        <img
          :src="selectedColor.img"
          :alt="selectedColor.name"
          class="w-full object-contain mx-auto"
          style="height: 250px"
        />
        <div class="p-2 text-center text-sm font-medium text-gray-700">
          {{ selectedColor.name }}
        </div>
      </div>
      <div v-else class="text-gray-400 italic text-sm">No color selected</div>
    </div>

    <!-- Wood Type -->
    <div>
      <label class="text-sm text-gray-600 block mb-1">Wood Type</label>
      <div
        v-if="selectedWoodType"
        class="rounded-lg overflow-hidden border shadow-sm"
      >
        <img
          :src="selectedWoodType.img"
          :alt="selectedWoodType.name"
          class="w-full object-contain mx-auto"
          style="height: 250px"
        />
        <div class="p-2 text-center text-sm font-medium text-gray-700">
          {{ selectedWoodType.name }}
        </div>
      </div>
      <div v-else class="text-gray-400 italic text-sm">
        No wood type selected
      </div>
    </div>
  </div>

  <!-- Dimensions -->
  <div class="my-6">
    <label class="text-sm text-gray-600 block mb-2">Dimensions (cm)</label>

    <div
      v-if="orderFormState.product_attributes.use_custom_dimensions"
      class="grid grid-cols-1 md:grid-cols-3 gap-3"
    >
      <div class="flex flex-col">
        <span class="text-xs text-gray-500 mb-1">Height</span>
        <UInput
          size="lg"
          v-model="orderFormState.product_attributes.height"
          :disabled="!isEditingOrder"
          placeholder="Height"
        />
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500 mb-1">Width</span>
        <UInput
          size="lg"
          v-model="orderFormState.product_attributes.width"
          :disabled="!isEditingOrder"
          placeholder="Width"
        />
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500 mb-1">Length</span>
        <UInput
          size="lg"
          v-model="orderFormState.product_attributes.length"
          :disabled="!isEditingOrder"
          placeholder="Length"
        />
      </div>
    </div>

    <!-- ❗ Message when use_custom_dimensions is false -->
    <div
      v-else
      class="p-3 border rounded-md text-yellow-700 bg-yellow-50 text-sm mt-2"
    >
      <strong>Note to Store Manager:</strong> Use factory-standard dimensions
      for this order.
    </div>
  </div>

  <!-- Notes -->
  <div>
    <label for="notes" class="text-sm text-gray-600 mb-1 block">Notes</label>
    <UTextarea
      size="lg"
      id="notes"
      v-model="orderFormState.notes"
      :disabled="!isEditingOrder"
    />
  </div>
</template>
