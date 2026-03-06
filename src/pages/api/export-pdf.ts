// pages/api/export-pdf.ts
import fs from "fs";
import path from "path";
import { generateMasterContractHTML } from "@/components/custom/masterContractTemplate";
import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

function getPublicImage(filepath: string){
  const imagePath = path.join(process.cwd(), filepath);
  const imageBase64 = fs.readFileSync(imagePath, "base64");
  const imageSrc = `data:image/png;base64,${imageBase64}`;
  return imageSrc;
}

const logoSrc = getPublicImage("public/logo_rak.png");
const shapesSrc = getPublicImage("public/shapes.png");
const footerSrc = getPublicImage("public/mou_footer.png");

function renderTemplate(
  htmlTemplate: string,
  data: Record<string, any>,
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
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { htmlTemplate, templateData, partnerType, cover } = req.body;

  if (!htmlTemplate || typeof htmlTemplate !== "string") {
    return res.status(400).json({ error: "Invalid HTML template" });
  }

  try {
    // Render HTML dengan data dinamis
    const content = renderTemplate(htmlTemplate, templateData);
    const filledHtml = generateMasterContractHTML({
      content,
      shapesSrc,
      partnerType,
      // preparedFor: cover
      preparedFor: {
        companyName: templateData.secondParty.companyName,
        address: templateData.secondParty.address,
      },
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(filledHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,

      headerTemplate: `
    <div style="width:100%; font-size:9px; padding:0 14mm;">
      <img src="${logoSrc}" style="width: 240px;" />
      </div>
      `,

      footerTemplate: `
    <div style="width:100%; font-size:9px; padding:0 14mm; display: flex; justify-content: flex-end;">
      <img src="${footerSrc}" style="width: 400px;" />  
    </div>
  `,

      margin: {
        top: "35mm",
        bottom: "25mm",
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
