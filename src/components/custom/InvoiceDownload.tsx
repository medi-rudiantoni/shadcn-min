"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useCallback, useEffect, useRef } from "react";

interface ContractItem {
  date: string;
  number: string;
  devices: number;
}

interface InvoiceData {
  readonly contracts?: ContractItem[];
  readonly transaction_id: string;
  readonly invoice_date: string;
  readonly due_date: string;
  reference?: string;
  readonly customer: {
    readonly name: string;
    readonly address: string;
    readonly email: string;
    readonly phone: string;
  };
  readonly InvoiceItem: {
    readonly description?: string;
    readonly totalContracts: number;
    readonly totalDevices: number;
    readonly unitLabel?: string;
    readonly unitPrice: string;
    readonly amount: string;
  };
  readonly Totals: {
    readonly subtotal: number | string;
    readonly discountPercent: number | string;
    readonly discountAmount: number | string;
    readonly untaxedAmount: number | string;
    readonly taxPercent: number | string;
    readonly taxAmount: number | string;
    readonly total: number | string;
  };
  readonly PaymentInfo: {
    readonly method: string;
    readonly bank?: string;
    readonly accountNumber?: string;
    readonly accountName?: string;
  };
}

interface Props {
  readonly data: InvoiceData;
  readonly onReady?: (download: () => void) => void;
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export default function InvoiceDownload({ data, onReady }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const contractPages = data.contracts ? chunkArray(data.contracts, 27) : [];

  const downloadPDF = useCallback(async () => {
    if (!ref.current) return;

    const currentData = dataRef.current;
    if (!currentData?.transaction_id) return;

    await new Promise((r) => setTimeout(r, 300));

    const pages = ref.current.querySelectorAll("[data-pdf-page]");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 6;
    const contentWidth = pageWidth - margin * 2;

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      const page = pages[i] as HTMLElement;
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", margin, margin, contentWidth, imgHeight);

      // Add footer
      const pageNum = i + 1;
      const totalPages = pages.length;
      pdf.setFontSize(9);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Halaman ${pageNum} dari ${totalPages}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: "center" },
      );
    }

    pdf.save(`${currentData.transaction_id}.pdf`);
  }, []);

  useEffect(() => {
    onReady?.(downloadPDF);
  }, [onReady, downloadPDF]);

  const isTransfer = data.PaymentInfo.method === "transfer";

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: "-10000px",
        width: "210mm",
        background: "#ffffff",
        zIndex: -100,
      }}
    >
      {/* ================= INVOICE PAGE ================= */}
      <div
        data-pdf-page
        style={{
          width: "210mm",
          height: "297mm",
          margin: 0,
          padding: "6mm",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
        }}
        className="text-sm text-gray-900"
      >
        {/* HEADER */}
        <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-3 mb-4">
          <div className="text-4xl font-bold text-primary">
            <img
              className="w-full max-w-[250px]"
              src={"/img/rak.png"}
              alt="Logo"
              width="200"
              height="47"
            />
          </div>
          <div className="text-right text-xs text-gray-600 leading-relaxed">
            <h4 className="font-semibold">PT Rumah Aplikasi Kita</h4>
            <p className="text-xs">
              Bukti Cimanggu City, Jl. Kencana Residence Cluster Greenwood{" "}
            </p>
            <p className="text-xs">
              Blok KA 10 No. 10, Cibadak, Tanah Sareal Kota Bogor, 16169
            </p>
            <p className="text-xs mt-1">
              Email: info@rak.co.id | Web: www.rak.co.id
            </p>
          </div>
        </div>

        {/* META */}
        <p className="text-lg font-semibold text-primary mb-3">
          Invoice {data.transaction_id}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Invoice Date</p>
            <p className="font-semibold text-sm">{data.invoice_date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Due Date</p>
            <p className="font-semibold text-sm">{data.due_date}</p>
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="bg-gray-100 p-3 rounded mb-4">
          <p className="font-semibold text-gray-600 mb-2 text-xs">
            Customer Address
          </p>
          <p className="font-bold text-sm">{data.customer.name}</p>
          <p className="text-xs">{data.customer.address}</p>
          <p className="text-xs">Email: {data.customer.email}</p>
          <p className="text-xs">Phone: {data.customer.phone}</p>
        </div>

        {/* ITEM TABLE */}
        <table className="w-full mb-4 border-collapse text-xs">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-2 px-2 text-left">Total Contracts</th>
              <th className="py-2 px-2 text-center">Total Devices</th>
              <th className="py-2 px-2 text-right">Unit Price</th>
              <th className="py-2 px-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-2">{data.InvoiceItem.totalContracts}</td>
              <td className="py-2 px-2 text-center">
                {data.InvoiceItem.totalDevices} {data.InvoiceItem.unitLabel}
              </td>
              <td className="py-2 px-2 text-right">
                {data.InvoiceItem.unitPrice}
              </td>
              <td className="py-2 px-2 text-right">
                {data.InvoiceItem.amount}
              </td>
            </tr>
          </tbody>
        </table>

        {/* TOTAL */}
        <div className="ml-auto w-64 mb-4">
          <Row label="Subtotal" value={data.Totals.subtotal} />
          <Row
            label={`Discount (${data.Totals.discountPercent}%)`}
            value={data.Totals.discountAmount}
          />
          <Row label="Untaxed Amount" value={data.Totals.untaxedAmount} />
          <Row
            label={`Tax (${data.Totals.taxPercent}%)`}
            value={data.Totals.taxAmount}
          />
          <div className="flex justify-between font-bold text-primary border-t-2 border-primary pt-2 mt-1 text-sm">
            <span>Total</span>
            <span>{data.Totals.total}</span>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="bg-gray-100 p-3 rounded mb-4">
          <p className="font-semibold text-gray-600 mb-2 text-xs">
            Payment Information
          </p>
          <p className="text-xs">
            <strong>Method:</strong> {data.PaymentInfo.method}
          </p>
          {isTransfer && (
            <>
              <p className="text-xs">
                <strong>Bank:</strong> {data.PaymentInfo.bank}
              </p>
              <p className="text-xs">
                <strong>Account Number:</strong>{" "}
                {data.PaymentInfo.accountNumber}
              </p>
              <p className="text-xs">
                <strong>Account Name:</strong> {data.PaymentInfo.accountName}
              </p>
            </>
          )}
        </div>

        {/* SIGNATURE - Flex grow untuk push ke bawah */}
        <div className="flex-grow text-right flex justify-end mt-12">
          <div className="w-56 text-center">
            <p className="font-semibold mb-8 text-sm">Regards</p>
            <div className="inline-block border-t pt-2 w-full">
              <strong className="text-xs">PT Rumah Aplikasi Kita</strong>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-right flex justify-end mt-10 border-t pt-4 relative pb-7">
          <img
            src="/img/logo_dark.svg"
            alt="Logo"
            style={{
              position: "absolute",
              bottom: -5,
              left: 0,
              width: "150px",
              opacity: 0.5,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* ================= CONTRACT LIST PAGE ================= */}
      {data.contracts &&
        data.contracts.length > 0 &&
        contractPages.map((contracts, pageIndex) => (
          <div
            key={`contract-page-${pageIndex}-${contracts.length}`}
            data-pdf-page
            style={{
              width: "210mm",
              minHeight: "297mm",
              margin: 0,
              padding: "6mm",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              background: "#ffffff",
            }}
            className="text-sm text-gray-900"
          >
            {/* Header untuk attachment pages */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-bold">Lampiran {pageIndex + 1}</h2>
              <p className="text-xs text-gray-500">{data.transaction_id}</p>
            </div>

            <h3 className="text-base font-semibold mb-3">Daftar Kontrak</h3>

            <table className="w-full border-collapse text-xs">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="text-left py-2 px-2">Tanggal Kontrak</th>
                  <th className="text-left py-2 px-2">Nomor Kontrak</th>
                  <th className="text-center py-2 px-2">Total Device</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => (
                  <tr
                    key={`${c.number}-${c.date}`}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-2 px-2">{c.date}</td>
                    <td className="py-2 px-2">{c.number}</td>
                    <td className="py-2 px-2 text-center">{c.devices}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Spacer untuk push footer ke bawah */}
            <div className="flex-grow"></div>

            {/* Footer untuk attachment pages */}
            <div className="border-t pt-2 mt-4 text-xs text-gray-500 text-center">
              <img
                src="/img/logo_dark.svg"
                alt="Logo"
                style={{
                  position: "absolute",
                  bottom: -5,
                  left: 0,
                  width: "150px",
                  opacity: 0.5,
                  pointerEvents: "none",
                }}
              />
              <p>
                Lampiran {pageIndex + 1} dari {contractPages.length}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}

/* Helper */
function Row({
  label,
  value,
}: {
  readonly label: string;
  readonly value: number | string;
}) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
