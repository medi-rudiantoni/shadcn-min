import puppeteer from "puppeteer";
import { generateMasterContractHTML } from "@/components/custom/masterContractTemplate";

export default async function handler(req: any, res: any) {
  try {
    const { content } = req.body;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // const html = generateMasterContractHTML(content);
    const html = content;

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div></div>`,
      footerTemplate: `
        <div style="width:100%; text-align:center; font-size:10px;">
          Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span>
        </div>
      `,
      margin: {
        top: "100px",
        bottom: "80px",
      },
    });

    await browser.close();

    // 🔥 INI YANG PENTING
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=master-contract.pdf",
    );
    res.setHeader("Content-Length", pdf.length);

    res.end(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed generate PDF" });
  }
}
