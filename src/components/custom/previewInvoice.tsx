"use client";

import Image from "next/image";
import html2canvas from "html2canvas";
import { MailOutlined, GlobalOutlined } from "@ant-design/icons";
import saveAs from "file-saver";
import { useEffect, useRef, useState } from "react";
import { PreviewModal } from "./previewModal";

interface Props {
  open: boolean;
  onClose: VoidFunction;
  onDownload?: (fn: () => void) => void;
  data: {
    contracts?: {
      date: string;
      number: string;
      devices: number;
    }[];
    transaction_id: string;
    invoice_date: string;
    due_date: string;
    reference: string;
    customer: {
      name: string;
      address: string;
      email: string;
      phone: string;
    };
    InvoiceItem: {
      description: string;
      totalContracts: number;
      totalDevices: number;
      contractNumber?: string;
      unitLabel?: string;
      unitPrice: string;
      amount: string;
    };
    Totals: {
      subtotal: number | string;
      discountPercent: number | string;
      discountAmount: number | string;
      untaxedAmount: number | string;
      taxPercent: number | string;
      taxAmount: number | string;
      total: number | string;
    };
    PaymentInfo: {
      method: string;
      bank?: string;
      accountNumber?: string;
      accountName?: string;
    };
  };
}

export default function PreviewInvoice({
  open,
  onClose,
  onDownload,
  data,
}: Props) {
  const [isTransfer, setTransfer] = useState(false);

  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.PaymentInfo.method === "transfer") {
      setTransfer(true);
    }
  }, [data.PaymentInfo]);

  useEffect(() => {
    if (!onDownload) return;
    onDownload(downloadInvoice);
  }, [onDownload]);

  const downloadInvoice = async () => {
    if (!invoiceRef.current) return;

    await new Promise((r) => setTimeout(r, 300));

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      saveAs(blob, `${data.transaction_id}.png`);
    });
  };

  return (
    <>
      <PreviewModal open={open} onClose={onClose}>
        <div className="min-h-screen bg-gray-100 px-4 pb-8">
          <div className="w-full p-5">
            <h3 className="text-lg font-semibold">Preview Invoice</h3>
          </div>
          <div
            ref={invoiceRef}
            className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-10"
          >
            {/* Header */}
            <div className="flex justify-between items-start pb-6 mb-8 border-b-4 border-neutral-950">
              <div className="text-4xl font-bold text-primary">
                <Image
                  className="w-full max-w-[200px]"
                  src={"/img/rak.png"}
                  alt="Logo"
                  width="250"
                  height="58"
                />
              </div>
              <div className="text-right text-xs text-gray-600 leading-relaxed">
                <h4>PT Rumah Aplikasi Kita</h4>
                <p>
                  Bukti Cimanggu City, Jl. Kencana Residence, Cluster Greenwood
                </p>
                <p>Blok KA 10 No. 10 Cibadak, Tanah Sareal Kota Bogor, 16169</p>
                <p>
                  <MailOutlined size={20} /> info@rak.co.id {"  "}
                  <GlobalOutlined size={20} /> www.rak.co.id
                </p>
              </div>
            </div>

            <div className="w-full">
              {/* Invoice Title */}
              <h2 className="font-semibold text-primary mb-6">
                {data.transaction_id}
              </h2>

              {/* Invoice Meta Information */}
              <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
                <div>
                  <label className="block text-gray-500 mb-1 text-xs">
                    Invoice Date
                  </label>
                  <span className="block text-gray-900 font-semibold">
                    {data.invoice_date}
                  </span>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1 text-xs no-ligatures">
                    Due Date
                  </label>
                  <span className="block text-gray-900 font-semibold">
                    {data.due_date}
                  </span>
                </div>
              </div>
            </div>

            {/* Billed To Section */}
            <div className="bg-gray-100 p-5 mb-8 rounded">
              <p className="text-neutral-500 font-semibold mb-2.5">
                Customer Address:
              </p>
              <div className="text-sm text-gray-800 space-y-1">
                <p className="font-bold">{data.customer.name}</p>
                <p>{data.customer.address}</p>
                <p>Email: {data.customer.email}</p>
                <p>Phone: {data.customer.phone}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-xs">
                      Total Contracts
                    </th>
                    <th className="py-3 px-4 text-center font-semibold text-xs">
                      Total Devices
                    </th>
                    <th className="py-3 px-4 text-right font-semibold text-xs">
                      Unit Price
                    </th>
                    <th className="py-3 px-4 text-right font-semibold text-xs">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-center">
                      {data.InvoiceItem.totalContracts}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {data.InvoiceItem.totalDevices}{" "}
                      {data.InvoiceItem.unitLabel}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {data.InvoiceItem.unitPrice}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {data.InvoiceItem.amount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="ml-auto w-80 mb-8">
              <div className="flex justify-between py-2 text-sm text-gray-600 border-t border-gray-300">
                <span>Subtotal</span>
                <span>{data.Totals.subtotal}</span>
              </div>
              <div className="flex justify-between py-2 text-sm text-gray-800">
                <span>Discount ({data.Totals.discountPercent}%)</span>
                <span>{data.Totals.discountAmount}</span>
              </div>
              <div className="flex justify-between py-2 text-sm text-gray-800">
                <span>Untaxed Amount</span>
                <span>{data.Totals.untaxedAmount}</span>
              </div>
              <div className="flex justify-between py-2 text-sm text-gray-800">
                <span>Tax ({data.Totals.taxPercent}%)</span>
                <span>{data.Totals.taxAmount}</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-bold text-primary border-t-2 border-primary mt-3">
                <span>Total</span>
                <span>{data.Totals.total}</span>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-100 p-5 mb-6 rounded-lg">
              <p className="text-neutral-500 font-semibold mb-3">
                Payment Information:
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p>
                    <strong className="text-gray-700">Payment Method:</strong>{" "}
                    {data.PaymentInfo.method}
                  </p>
                  {isTransfer && (
                    <p>
                      <strong className="text-gray-700">Bank:</strong>{" "}
                      {data.PaymentInfo.bank}
                    </p>
                  )}
                </div>
                {isTransfer && (
                  <div className="space-y-2">
                    <p>
                      <strong className="text-gray-700">Account Number:</strong>{" "}
                      {data.PaymentInfo.accountNumber}
                    </p>
                    <p>
                      <strong className="text-gray-700">Account Name:</strong>{" "}
                      {data.PaymentInfo.accountName}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Signature Section */}
            <div className="text-right mt-12">
              <div className="inline-block text-center">
                <p className="mb-2 font-semibold text-primary">Regards</p>
                <div className="mt-2 pt-3 border-gray-800 w-52">
                  <strong className="text-gray-900">
                    PT Rumah Aplikasi Kita
                  </strong>
                </div>
              </div>
            </div>
          </div>
          {data?.contracts && data.contracts.length > 0 && (
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-10 mt-6">
              <h3 className="mb-5">Contract List</h3>
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-start py-2">Date</th>
                    <th className="text-start py-2">Number</th>
                    <th className="text-start py-2">Total Device</th>
                  </tr>
                </thead>
                <tbody>
                  {data.contracts.map((c, idx) => (
                    <tr key={idx}>
                      <td className="py-2">{c.date}</td>
                      <td className="py-2">{c.number}</td>
                      <td className="py-2">{c.devices}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PreviewModal>
    </>
  );
}
