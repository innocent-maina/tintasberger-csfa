<script setup lang="ts">
const toast = useToast();

const { invoiceFormState, showInvoicePreview } = useInvoice();

const { getOrderByOrderNumber, orderFormState, getAllOrders } = useOrder();

// const selectedOrder = ref<number | string>(0);
const isLoading = ref(false);

const generateDocumentName = () => {
  console.log('checkpoint 1')
  const customerName = orderFormState.value.customer?.name || "Customer";
  const invoiceNumber = invoiceFormState.value.invoiceNumber || "INV-XXXXXX";
  const dateIssued =
    invoiceFormState.value.general.documentDate ||
    new Date().toISOString().substring(0, 10);

  invoiceFormState.value.general.documentName = `Invoice for ${customerName} - ${invoiceNumber} - Issued ${dateIssued}`;
};

const orderOptions = ref<{ label: string; value: string }[]>([]);

const fetchOrders = async () => {
  try {
    const ordersResponse = await getAllOrders();
    orderOptions.value = ordersResponse.map((order: any) => ({
      label: `${order.order_number} - ${order.customer.name}`,
      value: order.order_number,
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    toast.add({
      title: "Error",
      description: "Failed to load orders.",
      color: "red",
      id: "user-fetch-error",
    });
  }
};

// Computed for two-way binding
const selectedOrder = computed({
  get() {
    return (
      orderOptions.value.find(
        (option) => option.value === orderFormState.value.order_number
      ) || null
    );
  },
  set(newOption) {
    orderFormState.value.order_number = newOption ? newOption.value : null;
  },
});

// ✅ Watch for changes to orderFormState.value.order_number to trigger functions
watch(
  () => orderFormState.value.order_number,
  async (newOrderNumber) => {
    if (newOrderNumber) {
      console.log('newOrderNumber', newOrderNumber)
      const result = await getOrderByOrderNumber(newOrderNumber);
      console.log('result', result)
      await generateDocumentName();
      showInvoicePreview.value = true;
    }
  }
);

const addTableRow = () => {
  invoiceFormState.value.documentTableData.push({
    serviceId: "",
    serviceName: "",
    quantity: 1,
    totalPrice: 0,
  });
};

// TODO: RETURN WHEN USING UNITPRICE
// const calculateTotal = (index: number) => {
//   const row = invoiceFormState.value.documentTableData[index];
//   const quantity = parseFloat(String(row.quantity)) || 0;
//   row.totalPrice = parseFloat(quantity); // Placeholder, update when you bring back unitPrice
// };

const totalInvoiceAmount = computed(() => {
  const total = invoiceFormState.value.documentTableData.reduce(
    (sum, item) => sum + (parseFloat(String(item.totalPrice)) || 0),
    0
  );

  invoiceFormState.value.invoiceTotal = parseFloat(total.toFixed(2));
  return total;
});

const generateInvoiceNumber = async () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const datePart = `${year}${month}${day}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 random digits

  return `INV-${datePart}-${randomPart}-LCD`;
};

onMounted(async () => {
  await fetchOrders();
  const invNumber = await generateInvoiceNumber();
  invoiceFormState.value.invoiceNumber = invNumber;
});
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto space-y-8">
    <div class="space-y-8">
      <!-- Order Search  -->
      <UCard>
        <template #header>
          <p class="font-semibold text-lg">Search the order</p>
        </template>

        <p class="text-sm font-medium pb-2">
          Which order would you like to create an invoice for?
        </p>

        <div class="flex flex-col sm:flex-row gap-2 w-full">
          <USelectMenu
            v-model="selectedOrder"
            class="custom-input w-full"
            :options="orderOptions"
            placeholder="Select the order"
          />
        </div>
      </UCard>

      <!-- Document General Info -->
      <UCard>
        <template #header
          ><p class="font-semibold text-lg">Name the document</p></template
        >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium pb-2" style="">Invoice Number</p>
            <UInput
              v-model="invoiceFormState.invoiceNumber"
              class="custom-input"
              disabled
              style="display: block"
            />
          </div>
          <div>
            <p class="text-sm font-medium pb-2" style="">Issue Date</p>
            <UInput
              v-model="invoiceFormState.general.documentDate"
              class="custom-input"
              style="display: block"
              type="date"
            />
          </div>
        </div>
        <div class="pt-5">
          <div>
            <p class="text-sm font-medium pb-2" style="">Document Name</p>
            <UInput
              v-model="invoiceFormState.general.documentName"
              class="custom-input"
              style="display: block"
              placeholder="Simon Ndu'ngu, May 20, 2025"
              disabled
            />
          </div>
        </div>
      </UCard>

      <!-- Document Table -->
      <UCard>
        <template #header
          ><p class="font-semibold text-lg">Services</p></template
        >
        <div
          v-for="(item, index) in invoiceFormState.documentTableData"
          :key="index"
          class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
        >
          <div>
            <p class="text-sm font-medium pb-2" style="">Service Name</p>
            <UInput
              v-model="item.serviceName"
              class="custom-input"
              style="display: block"
              placeholder="Service Name"
            />
          </div>
          <div>
            <p class="text-sm font-medium pb-2" style="">Quantity</p>
            <UInput
              v-model.number="item.quantity"
              class="custom-input"
              type="number"
              placeholder="Qty"
            />
          </div>
          <div>
            <p class="text-sm font-medium pb-2" style="">Total</p>
            <UInput
              v-model.number="item.totalPrice"
              class="custom-input"
              type="number"
              placeholder="Total"
            />
          </div>
        </div>
        <UButton variant="soft" @click="addTableRow">Add Service</UButton>
      </UCard>

      <div class="text-right mt-4 font-semibold text-lg">
        Total Amount: KSh {{ totalInvoiceAmount }}
      </div>
    </div>
  </div>
</template>
