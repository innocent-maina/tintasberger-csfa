<script setup lang="ts">
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { nextTick } from "vue";

const downloadPDF = async () => {
  await nextTick();

  const original = document.getElementById("pdf-content");
  if (!original) return console.error("pdf-content not found");

  const clone = original.cloneNode(true) as HTMLElement;
  clone.style.width = "800px";
  clone.style.padding = "20px";
  clone.style.background = "white";
  clone.style.color = "black";
  clone.style.fontSize = "13px";
  clone.style.position = "fixed";
  clone.style.top = "-10000px";
  document.body.appendChild(clone);

  // ✅ Fix input rendering issues for html2canvas
  clone.querySelectorAll("input, textarea").forEach((el) => {
    const input = el as HTMLElement;
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "4px";
    input.style.boxShadow = "none";
    input.style.backgroundColor = "#f8f8f8";
    input.style.color = "#333";
    input.style.padding = "6px 8px";
    input.style.lineHeight = "1.4"; // Ensures enough vertical spacing
    input.style.webkitAppearance = "none";
    input.style.appearance = "none";
  });

  // Wait for images to load
  await Promise.all(
    Array.from(clone.querySelectorAll("img")).map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          })
    )
  );

  try {
    const canvas = await html2canvas(clone, {
      scale: 5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = 595.28;
    const pdfHeight = 841.89;

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    if (heightLeft <= pdfHeight) {
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    } else {
      while (heightLeft > 0) {
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight;
        if (heightLeft > 0) pdf.addPage();
      }
    }

    pdf.save("customer.pdf");
  } catch (e) {
    console.error("Error generating PDF", e);
  } finally {
    document.body.removeChild(clone);
  }
};
</script>

<template>
  <UButton color="green" @click="downloadPDF">Download PDF </UButton>
</template>
