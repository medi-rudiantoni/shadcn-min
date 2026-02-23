export async function exportToPdfUtil(htmlTemplate: string, templateData: Record<string, any>, docName?: string) {

    const processedHtml = htmlTemplate.replace(
    /<!-- pagebreak -->/g,
    '<div class="page-break"></div>'
  );
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
  const a = document.createElement("a");
  a.href = url;
  a.download = docName ? `${docName}.pdf` : "document.pdf";
  a.click();
  window.URL.revokeObjectURL(url);
}
