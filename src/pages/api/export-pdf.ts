// pages/api/export-pdf.ts
import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

function renderTemplate(
  htmlTemplate: string,
  data: Record<string, any>
): string {
  return htmlTemplate.replace(/{{(.*?)}}/g, (_, key) => {
    const keys = key.trim().split(".");
    let value: any = data;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined || value === null) return "";
    }
    return String(value);
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { htmlTemplate, templateData } = req.body;

  if (!htmlTemplate || typeof htmlTemplate !== "string") {
    return res.status(400).json({ error: "Invalid HTML template" });
  }

  try {
    // Render HTML dengan data dinamis
    const filledHtml = renderTemplate(htmlTemplate, templateData);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(filledHtml, { waitUntil: "networkidle0" });

    // const pdfBuffer = await page.pdf({
    //   format: "A4",
    //   printBackground: true,
    // });
    const pdfBuffer = await page.pdf({
      path: "output.pdf",
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "20mm",
        right: "20mm",
      },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating PDF" });
  }
}
