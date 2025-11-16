<script setup lang="ts">
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { nextTick } from "vue";

const { orderFormState } = useOrder();

const {
  invoiceFormState,
  showInvoicePreview,
  createInvoice,
  createInvoiceFormState,
} = useInvoice();

const { uploadInvoice } = useStorage();

const toast = useToast();

const generateInvoicePDF = async (): Promise<Blob | null> => {
  await nextTick();

  const original = document.getElementById("pdf-content");
  if (!original) {
    console.error("pdf-content not found");
    return null;
  }

  const clone = original.cloneNode(true) as HTMLElement;
  clone.style.width = "800px";
  clone.style.padding = "40px";
  clone.style.background = "white";
  clone.style.color = "black";
  clone.style.fontSize = "13px";
  clone.style.lineHeight = "1.6";
  clone.style.fontFamily = "Arial, sans-serif";
  clone.style.position = "fixed";
  clone.style.top = "-10000px";
  clone.style.boxSizing = "border-box";
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const margin = 40;
    const imgWidth = pdfWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    while (heightLeft > 0) {
      pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      position -= pdfHeight;
      if (heightLeft > 0) pdf.addPage();
    }

    const pdfBlob = pdf.output("blob");
    return pdfBlob;
  } catch (e) {
    console.error("Error generating PDF", e);
    return null;
  } finally {
    document.body.removeChild(clone);
  }
};

const saveInvoice = async () => {
  const pdfBlob = await generateInvoicePDF();

  if (!pdfBlob) {
    toast.add({
      title: "Error",
      description: "Failed to generate invoice. Please refresh and try again.",
      color: "red",
    });
    return;
  }

  const file = new File(
    [pdfBlob],
    `${invoiceFormState.value.general.documentName || "invoice"}.pdf`,
    { type: "application/pdf" }
  );

  const uploadResult = await uploadInvoice(
    file,
    orderFormState.value.order_number
  );

  if (uploadResult) {
    toast.add({
      title: "Success",
      description: "Invoice generated and uploaded successfully!",
      color: "green",
    });

    createInvoiceFormState.value.invoice_url = uploadResult.url;

    await createInvoice();
  } else {
    toast.add({
      title: "Upload Failed",
      description: "Could not upload the generated invoice.",
      color: "red",
    });
  }
};
</script>

<template>
  <div>
    <div style="border: 1px solid black">
      <div id="pdf-content" class="w-full px-10 py-10 text-sm">
        <!-- Header -->
        <!-- Top: Company Header -->
        <!-- Top Header: Logo + Company Info -->
        <div class="flex justify-between items-start mb-6">
          <!-- Left: Logo -->
          <div class="w-1/2">
            <img src="/logo.png" alt="Nikao Logistics Logo" class="h-24 mb-2" />
          </div>

          <!-- Right: Company Info -->
          <div class="w-1/2 text-right">
            <p class="font-bold text-base">Robbialacs</p>
            <p class="text-xs">For all your furniture needs</p>
            <p class="text-xs mt-4">
              Mbanya Lane, Gathanga<br />
              P.O BOX 16270-00100,<br />
              Mobile: 0708088011
            </p>
          </div>
        </div>

        <!-- Centered Title -->
        <h1 class="text-center text-lg font-bold mb-6 tracking-widest">INVOICE</h1>


        <!-- Details Section: Customer (left) + Invoice Info (right) -->
        <div class="flex justify-between mb-4 text-xs">
          <div class="w-1/2 space-y-1">
            <p class="font-semibold text-sm mb-1">Billed To</p>
            <p>{{ orderFormState.customer.name }}</p>
            <p>{{ orderFormState.customer.email }}</p>
            <p>{{ orderFormState.customer.phone }}</p>
          </div>

          <!-- Right: Invoice Info -->
          <div class="w-1/2 text-right space-y-1 pt-6">
            <p>
              <strong>Order Number:</strong>
              {{ orderFormState.order_number }}
            </p>
            <p>
              <strong>Issue Date:</strong>
              {{ invoiceFormState.general.documentDate }}
            </p>
            <p>
              <strong>Invoice #:</strong>
              {{ invoiceFormState.invoiceNumber }}
            </p>
          </div>
        </div>

        <!-- Title -->

        <!-- Table -->
        <table class="w-full border border-black border-collapse text-xs mt-15">
          <thead class="bg-green-500">
            <tr>
              <th class="border border-black p-2 text-left w-[50%]">ITEM</th>
              <th class="border border-black p-2 text-left w-[20%]">
                QUANTITY
              </th>
              <th class="border border-black p-2 text-right w-[30%]">PRICE</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in invoiceFormState.documentTableData"
              :key="index"
            >
              <td class="border border-black p-2">{{ item.serviceName }}</td>
              <td class="border border-black p-2">{{ item.quantity }}</td>
              <td class="border border-black p-2 text-right">
                {{ item.totalPrice }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td
                colspan="2"
                class="border border-black p-2 font-bold text-right"
              >
                Total
              </td>
              <td class="border border-black p-2 text-right font-bold">
                {{
                  invoiceFormState.documentTableData.reduce(
                    (sum, i) => sum + i.totalPrice,
                    0
                  )
                }}
              </td>
            </tr>
          </tfoot>
        </table>

        <!-- Footer -->
        <p class="text-center text-xs font-medium mt-6">
          WE APPRECIATE YOUR BUSINESS!
        </p>
      </div>
    </div>

    <UButton color="primary" class="my-10" block @click="saveInvoice"
      >Download PDF & Save to Invoice!</UButton
    >
  </div>
</template>
