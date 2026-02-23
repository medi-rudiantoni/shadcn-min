import Cookies from "js-cookie";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card, Col, Row, Skeleton, Button, Modal, Table } from "antd";
import { EyeOutlined, DownloadOutlined, SendOutlined } from "@ant-design/icons";
import { PageHeaders } from "@/components/page-headers";
import { getInvoiceById } from "@/functions/invoice";
import "moment/locale/id";
import formatCurrency from "@/utils/formatCurrency";
import calculatePercent from "@/utils/calculatePercent";
import PreviewInvoice from "@/components/custom/previewInvoice";
import InvoiceDownload from "@/components/custom/InvoiceDownload";

export default function DetailInvoice() {
  const router = useRouter();
  const { id } = router.query;
  const token = Cookies.get("access_token");

  const [invoice, setInvoice] = useState<any>(undefined);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPreview, setPreview] = useState(false);
  const [filename, setFilename] = useState<string | undefined>(undefined);
  const [downloadPDF, setDownloadPDF] = useState<() => void>();

  useEffect(() => loadInvoice(), [id]);
  useEffect(() => console.log("CONTRACTS [id]: ", contracts), [contracts]);

  function loadInvoice() {
    if (!id) return;
    getInvoiceById(id, token)
      .then((res) => {
        setLoading(false);
        setInvoice(res.data.invoice);
        setContracts(res.data.contracts);
        setFilename(res.data.invoice.transaction_id);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  const PageRoutes = [
    {
      path: "/",
      breadcrumbName: "Dashboard",
    },
    {
      path: "/admin/invoice",
      breadcrumbName: "Invoice",
    },
    {
      path: "first",
      breadcrumbName: "Detail",
    },
  ];

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "unpaid") return "bg-red-100 text-red-700";
    if (statusLower === "paid") return "bg-green-100 text-green-700";
    if (statusLower === "pending") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const contractsTableData: any[] = [];

  contracts.map((contract: any, idx) => {
    const { number, devices, created_at } = contract;

    return contractsTableData.push({
      key: idx,
      date: moment(created_at).format("LL"),
      contractNumber: number,
      totalDevices: devices,
    });
  });

  const contractsTableColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Contract Number",
      dataIndex: "contractNumber",
      key: "contractNumber",
    },
    {
      title: "Total Devices",
      dataIndex: "totalDevices",
      key: "totalDevices",
    },
  ];

  return (
    <>
      <Head>
        <title>Invoice Detail - Admin Service Hub</title>
      </Head>

      <PageHeaders
        routes={PageRoutes}
        title={`New Invoice: ${invoice?.transaction_id || "Loading..."}`}
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />

      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Row gutter={20}>
          <Col xs={24} lg={16}>
            {loading ? (
              <Card className="rounded-xl shadow-sm">
                <Skeleton active />
              </Card>
            ) : (
              <>
                {/* Company Header */}
                <div className="bg-neutral-800 min-h-[160px] text-white p-8 rounded-xl mb-6 flex justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1 text-inherit">
                      {invoice?.partner?.companyName}
                    </h2>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {invoice?.partner?.companyPhone}
                      <br />
                      {invoice?.partner?.companyEmail}
                    </p>
                  </div>
                  <div className="">
                    <p className="text-sm opacity-90 leading-relaxed">
                      {invoice?.partner?.companyAddress}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-200 min-h-[160px] p-8 rounded-xl mb-6 flex justify-between">
                  <div>
                    <h3 className="text-neutral-900 mb-2 font-semibold">
                      Invoice Number
                    </h3>
                    <p className="text-sm text-gray-800 font-medium">
                      {invoice?.transaction_id}
                    </p>
                    <div className="text-sm text-gray-600 mt-2 leading-relaxed">
                      <div className="mb-1">
                        <strong>Issued Date:</strong>{" "}
                        {moment(invoice?.invoice_date).format("LL")}
                      </div>
                      <div>
                        <strong>Due Date:</strong>{" "}
                        {moment(invoice?.due_date).format("LL")}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-neutral-900 mb-2 font-semibold">
                      Billed to
                    </h3>
                    <p className="text-sm text-gray-800 font-medium">
                      {invoice?.partner?.companyName}
                    </p>
                    <div className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {invoice?.partner?.companyEmail}
                      <br />
                      {invoice?.partner?.companyPhone}
                      <br />
                      {invoice?.partner?.companyAddress}
                    </div>
                  </div>
                </div>

                {/* Main Card */}
                <Card className="rounded-xl shadow-sm mb-6">
                  {/* Invoice Header */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-sm text-gray-500 mb-2 font-medium">
                        Invoice Number
                      </h3>
                      <p className="text-base text-gray-800 font-medium">
                        {invoice?.transaction_id}
                      </p>
                      <div className="text-sm text-gray-600 mt-4 leading-relaxed">
                        <div className="mb-1">
                          <strong>Issued Date:</strong>{" "}
                          {moment(invoice?.invoice_date).format("LL")}
                        </div>
                        <div>
                          <strong>Due Date:</strong>{" "}
                          {moment(invoice?.due_date).format("LL")}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm text-gray-500 mb-2 font-medium">
                        Billed to
                      </h3>
                      <p className="text-base text-gray-800 font-medium">
                        {invoice?.partner?.companyName}
                      </p>
                      <div className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {invoice?.partner?.companyEmail}
                        <br />
                        {invoice?.partner?.companyPhone}
                        <br />
                        {invoice?.partner?.companyAddress}
                      </div>
                    </div>
                  </div>

                  {/* Item Details */}
                  <h2 className="text-lg font-semibold mb-5 text-gray-900">
                    Item Details
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full mt-5">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left text-xs text-gray-500 font-medium pb-4 uppercase">
                            Total Contracts
                          </th>
                          <th className="text-left text-xs text-gray-500 font-medium pb-4 uppercase">
                            Total Devices
                          </th>
                          <th className="text-right text-xs text-gray-500 font-medium pb-4 uppercase">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 text-sm text-gray-800">
                            {invoice?.totalContracts}
                          </td>
                          <td className="py-4 text-sm text-gray-800">
                            {invoice?.totalDevices}
                          </td>
                          <td className="py-4 text-sm text-gray-800 text-end">
                            {/* {invoice?.totalDevices} */}
                            {formatCurrency(
                              invoice?.totalDevices * invoice?.base_price,
                            ) + ",00"}
                          </td>
                        </tr>
                        <tr className="border-t mt-4 pt-2">
                          <td className="font-medium">Discount</td>
                          <td></td>
                          <td className="font-medium text-end">
                            {calculatePercent(invoice.total_discount)}%
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium">Tax</td>
                          <td></td>
                          <td className="font-medium text-end">
                            {invoice.total_tax}%
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold">Total</td>
                          <td></td>
                          <td className="font-bold text-end">
                            {formatCurrency(invoice.total_payment)},00-
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Summary */}
                  <div className="mt-8">
                    <div className="flex justify-between py-3 text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-800">
                        {formatCurrency(
                          invoice?.totalDevices * invoice?.base_price,
                        )}
                        ,00
                      </span>
                    </div>
                    <div className="flex justify-between py-3 text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-gray-800">
                        {calculatePercent(invoice?.total_discount)}%
                      </span>
                    </div>
                    <div className="flex justify-between py-3 text-sm">
                      <span className="text-gray-500">
                        Tax ({invoice?.total_tax}%)
                      </span>
                      <span className="text-gray-800">
                        {formatCurrency(
                          (invoice?.totalDevices *
                            invoice?.base_price *
                            invoice?.total_tax) /
                            100,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-4 mt-3 border-t-2 border-gray-200 text-base font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        {formatCurrency(invoice?.total_payment)},00
                      </span>
                    </div>
                  </div>
                </Card>
                {contracts.length > 0 && (
                  <Card className="w-full h-max[600] bg-white rounded-xl">
                    <h3 className="mb-4">Contract Lists</h3>
                    <Table
                      pagination={false}
                      dataSource={contractsTableData}
                      columns={contractsTableColumns}
                    />
                    <Table
                      pagination={false}
                      dataSource={contractsTableData}
                      columns={contractsTableColumns}
                    />
                  </Card>
                )}
              </>
            )}
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {loading ? (
              <Card className="rounded-xl shadow-sm">
                <Skeleton active />
              </Card>
            ) : (
              <Card className="rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-6 text-gray-900">
                  Basic Info
                </h2>

                <div className="mb-6">
                  <h4 className="text-sm text-gray-500 mb-2 font-medium">
                    Invoice Date
                  </h4>
                  <p className="text-base text-gray-800 font-medium">
                    {moment(invoice?.invoice_date).format("LL")}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm text-gray-500 mb-2 font-medium">
                    Due Date
                  </h4>
                  <p className="text-base text-gray-800 font-medium">
                    {moment(invoice?.due_date).format("LL")}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm text-gray-500 mb-2 font-medium">
                    Payment Method
                  </h4>
                  <p className="text-base text-gray-800 font-medium">
                    {invoice?.payment_method?.method_name || "-"}
                  </p>
                </div>

                {invoice?.payment_method?.method_name === "transfer" && (
                  <>
                    <div className="mb-6">
                      <h4 className="text-sm text-gray-500 mb-2 font-medium">
                        Bank
                      </h4>
                      <p className="text-base text-gray-800 font-medium">
                        {invoice?.payment_method.bank_name}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm text-gray-500 mb-2 font-medium">
                        Account Number
                      </h4>
                      <p className="text-base text-gray-800 font-medium">
                        {invoice?.payment_method.account_number}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm text-gray-500 mb-2 font-medium">
                        Account Name
                      </h4>
                      <p className="text-base text-gray-800 font-medium">
                        {invoice?.payment_method.account_name}
                      </p>
                    </div>
                  </>
                )}

                <div className="mb-6">
                  <h4 className="text-sm text-gray-500 mb-2 font-medium">
                    Status
                  </h4>
                  <span
                    className={`inline-block px-3 py-1.5 rounded-md text-sm font-medium capitalize ${getStatusColor(
                      invoice?.status,
                    )}`}
                  >
                    {invoice?.status}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-5">
                  <Button
                    onClick={() => setPreview(true)}
                    className="flex-1 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 border-0 text-gray-800 font-medium"
                    icon={<EyeOutlined />}
                  >
                    Preview
                  </Button>
                  <Button
                    onClick={() => downloadPDF?.()}
                    type="primary"
                    className="flex-1 h-10 rounded-lg font-medium"
                    style={{ background: "#a0d911", borderColor: "#a0d911" }}
                    icon={<DownloadOutlined />}
                  >
                    Download
                  </Button>
                </div>

                {/* <Button
                  className="w-full h-10 mt-2 rounded-lg bg-gray-200 hover:bg-gray-300 border-0 text-gray-800 font-medium"
                  icon={<DownloadOutlined />}
                >
                  Download
                </Button> */}
              </Card>
            )}
          </Col>
        </Row>
        <PreviewInvoice
          open={isPreview}
          onClose={() => setPreview(false)}
          data={{
            contracts: contracts.map((c) => ({
              date: moment(c.created_at).format("LL"),
              devices: c.devices,
              number: c.number,
            })),
            invoice_date: moment(invoice?.invoice_date).format("LL"),
            due_date: moment(invoice?.dua_date).format("LL"),
            transaction_id: invoice?.transaction_id,
            reference: "",
            customer: {
              name: invoice?.partner?.companyName,
              address: invoice?.partner?.companyAddress,
              email: invoice?.partner?.companyEmail,
              phone: invoice?.partner?.companyPhone,
            },
            InvoiceItem: {
              description: invoice?.transaction_id,
              totalContracts: invoice?.totalContracts,
              totalDevices: invoice?.totalDevices,
              unitPrice: formatCurrency(invoice?.base_price) + ",00",
              unitLabel: "Unit",
              amount:
                formatCurrency(invoice?.totalDevices * invoice?.base_price) +
                ",00",
              // contractNumber: invoice?.contract.number,
            },
            Totals: {
              subtotal:
                formatCurrency(invoice?.totalDevices * invoice?.base_price) +
                ",00",
              discountPercent: calculatePercent(invoice?.total_discount),
              discountAmount: "",
              taxPercent: invoice?.total_tax,
              taxAmount:
                formatCurrency(
                  (invoice?.totalDevices *
                    invoice?.base_price *
                    invoice?.total_tax) /
                    100,
                ) + ",00",
              untaxedAmount: "",
              total: formatCurrency(invoice?.total_payment) + ",00",
            },
            PaymentInfo: {
              method: invoice?.payment_method?.method_name,
              bank: invoice?.payment_method?.bank_name,
              accountName: invoice?.payment_method?.account_name,
              accountNumber: invoice?.payment_method.account_number,
            },
          }}
        />
        <InvoiceDownload
          onReady={(fn) => setDownloadPDF(() => fn)}
          data={{
            contracts: contracts.map((c) => ({
              date: moment(c.created_at).format("LL"),
              devices: c.devices,
              number: c.number,
            })),
            invoice_date: moment(invoice?.invoice_date).format("LL"),
            due_date: moment(invoice?.due_date).format("LL"),
            transaction_id: invoice?.transaction_id,

            customer: {
              name: invoice?.partner?.companyName,
              address: invoice?.partner?.companyAddress,
              email: invoice?.partner?.companyEmail,
              phone: invoice?.partner?.companyPhone,
            },
            InvoiceItem: {
              description: invoice?.transaction_id,
              totalContracts: invoice?.totalContracts,
              totalDevices: invoice?.totalDevices,
              unitPrice: formatCurrency(invoice?.base_price) + ",00",
              unitLabel: "Unit",
              amount:
                formatCurrency(invoice?.totalDevices * invoice?.base_price) +
                ",00",
              // contractNumber: invoice?.contract.number,
            },
            Totals: {
              subtotal:
                formatCurrency(invoice?.totalDevices * invoice?.base_price) +
                ",00",
              discountPercent: calculatePercent(invoice?.total_discount),
              discountAmount: "",
              taxPercent: invoice?.total_tax,
              taxAmount:
                formatCurrency(
                  (invoice?.totalDevices *
                    invoice?.base_price *
                    invoice?.total_tax) /
                    100,
                ) + ",00",
              untaxedAmount: "",
              total: formatCurrency(invoice?.total_payment) + ",00",
            },
            PaymentInfo: {
              method: invoice?.payment_method?.method_name,
              bank: invoice?.payment_method?.bank_name,
              accountName: invoice?.payment_method?.account_name,
              accountNumber: invoice?.payment_method.account_number,
            },
          }}
        />
      </div>
    </>
  );
}
