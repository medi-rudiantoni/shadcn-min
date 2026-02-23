export async function printPdfUtil(htmlTemplate: string, templateData: Record<string, any>) {
  const processedHtml = htmlTemplate;
  const styledHtml = `
    <style>
      .page-break {
        page-break-before: always;
        break-before: page;
      }
      body {
        padding: 40px;
      }
    </style>
    ${processedHtml}
  `;

  const res = await fetch("/api/export-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ htmlTemplate, templateData }),
  });

  if (!res.ok) throw new Error("Failed to generate PDF");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  // Buka tab baru untuk print
  const printWindow = window.open(url, "_blank");
  if (printWindow) {
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
    };
  }
}
