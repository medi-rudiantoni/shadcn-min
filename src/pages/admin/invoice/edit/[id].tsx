import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, Bounce } from "react-toastify";
import {
  Col,
  Row,
  Form,
  Input,
  Button,
  Select,
  Skeleton,
  Upload,
  UploadProps,
  GetProp,
  message,
  DatePicker,
} from "antd";
import { useRouter } from "next/router";
import moment from "moment";
import { UilSave, UilSpinner, UilPlus } from "@iconscout/react-unicons";
import { PageHeaders } from "@/components/page-headers";
import { getCategories } from "@/functions/category";
import { getContractDevices, getContractSelect } from "@/functions/contract";
import "moment/locale/id";
import { getSettings } from "@/functions/setting";
import calculatePercent from "@/utils/calculatePercent";
import { getInvoiceById, updateInvoice } from "@/functions/invoice";
const { TextArea } = Input;
const { Option } = Select;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

function UpdateInvoice() {
  const router = useRouter();
  const { id } = router.query;
  const token = Cookies.get("access_token");

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(true);
  const [invoice, setInvoice] = useState<any | undefined>(undefined);
  const [selectedContract, setSelectedContract] = useState<string | undefined>(
    undefined,
  );
  const [devices, setDevices] = useState<any[] | undefined>(undefined);

  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [data, setData] = useState({
    contract: "",
    partner: "",
    devices: {},
    base_price: 0,
    total_discount: 0,
    total_tax: 0,
    total_amount: 0,
    total_payment: 0,
    due_date: "",
    payment_method: {},
    invoice_duration: 0,
  });

  // FETCH initial settings
  useEffect(() => loadInvoiceSettings(), []);
  useEffect(() => loadContractDevices(), [selectedContract]);

  // 🔥 LOAD EXISTING INVOICE
  useEffect(() => {
    if (!id) return;
    loadInvoiceById();
  }, [id]);

  async function loadInvoiceById() {
    if (!id) return;
    try {
      const res = await getInvoiceById(id, token);
      const invoice = res.data;
      setInvoice(invoice);

      // set contract
      setSelectedContract(invoice.contract?._id);

      setPaymentMethod(invoice.payment_method.method_name);
      setBankName(invoice.payment_method.bank_name);
      setAccountNumber(invoice.payment_method.account_number);

      const dueDateMs = new Date(invoice.due_date).getTime();
      const nowMs = Date.now();

      const diffMs = dueDateMs - nowMs;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      console.log("Selisih hari (ms → hari):", diffDays);

      setData({
        contract: invoice.contract?._id,
        partner: invoice.partner?._id,
        devices: invoice.devices,
        base_price: invoice.base_price,
        total_discount: invoice.total_discount,
        total_tax: invoice.total_tax,
        total_amount: invoice.total_amount,
        total_payment: invoice.total_payment,
        due_date: invoice.due_date,
        payment_method: invoice.payment_method,
        invoice_duration: invoice.invoice_duration,
      });
    } catch (e) {
      console.log("FAILED LOAD INVOICE", e);
      toast.error("Failed to load invoice");
    } finally {
      setLoadingInvoice(false);
    }
  }

  function loadInvoiceSettings() {
    if (!token) return;
    getSettings(token, "invoice")
      .then((res) => {
        setPaymentMethod(res.data.settings.payment_method);
        setBankName(res.data.settings.bank_name);
        setAccountNumber(res.data.settings.account_number);
        setData((prev: any) => ({
          ...prev,
          base_price: res.data.settings.base_price,
          payment_method: {
            method_name: res.data.settings.payment_method,
            bank_name: res.data.settings.bank_name,
            account_number: res.data.settings.account_number,
          },
          total_tax: res.data.settings.tax,
          invoice_duration: res.data.settings.invoice_duration,
        }));
      })
      .catch((error) => {
        console.log("ERROR FETCH INVOICE SETTINGS: ", error);
      });
  }

  function loadContractDevices() {
    if (!selectedContract) return;
    getContractDevices(selectedContract, token)
      .then((res) => setDevices(res.data.devices))
      .catch(() => setDevices(undefined));
  }

  // TOTAL PAYMENT CALC
  useEffect(() => {
    if (!devices) return;
    const deviceCount = devices.length;
    const subtotal = deviceCount * data.base_price;
    const discValue = calculatePercent(subtotal, data.total_discount);
    const taxValue = calculatePercent(subtotal, data.total_tax);
    const totalAmount = subtotal - discValue;
    const totalPayment = totalAmount + taxValue;

    setData((prev) => ({
      ...prev,
      total_amount: totalAmount,
      total_payment: totalPayment,
      devices,
    }));
  }, [devices, data.base_price, data.total_discount, data.total_tax]);

  function handleSubmit() {
    setLoadingSubmit(true);

    updateInvoice(id, data, token)
      .then((res) => {
        toast.success(res.data.message || "Invoice updated successfully");
        router.replace("/admin/invoice");
      })
      .catch((err) => {
        console.log("Error update invoice:", err);
        toast.error("Failed to update invoice");
      })
      .finally(() => setLoadingSubmit(false));
  }

  // If loading invoice → show skeleton
  if (loadingInvoice) {
    return (
      <div className="px-8 py-10">
        <Skeleton active />
      </div>
    );
  }

  const PageRoutes = [
    {
      path: "/admin",
      breadcrumbName: "Dashboard",
    },
    {
      path: "/admin/invoice",
      breadcrumbName: "Invoice",
    },
    {
      breadcrumbName: "Edit",
    },
  ];

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Edit Invoice"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />

      {/* FORM BIASA */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(); // kamu tinggal buat function handleSubmit
        }}
      >
        <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
          {/* CONTRACT SELECT */}
          <Row gutter={15}>
            <Col xs={24} className="mb-[25px]">
              <div className="bg-white dark:bg-white/10 p-[25px] rounded-10">
                <h1 className="text-[18px] font-semibold mb-4">Edit Invoice</h1>
                <div>
                  <div className="w-full flex flex-wrap mb-2">
                    <div className="min-w-fit flex-1">
                      <p className="text-neutral-500">Number</p>
                      <p className="font-semibold">{invoice.transaction_id}</p>
                    </div>
                    <div className="min-w-fit flex-1">
                      <p className="text-neutral-500">Issued Date</p>
                      <p className="font-semibold">
                        {moment(invoice.invoice_date).format("LL")}
                      </p>
                    </div>
                    <div className="min-w-fit flex-1">
                      <p className="text-neutral-500">Due Date</p>
                      <p className="font-semibold">
                        {moment(invoice.due_date).format("LL")}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="mt-5 pb-2">
                    <div className="min-w-fit flex-1">
                      <p className="text-neutral-500">Billed to</p>
                      <p className="font-semibold">
                        {invoice.partner.companyName}
                      </p>
                      <p className="font-medium">
                        {invoice.partner.companyEmail}
                      </p>
                      <p className="font-medium">
                        {invoice.partner.companyPhone}
                      </p>
                      <p className="font-medium">
                        {invoice.partner.companyAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={15}>
            <Col xs={24} className="mb-[25px]">
              <div className="bg-white dark:bg-white/10 p-[25px] rounded-10">
                <h2 className="text-lg font-semibold mb-2 border-b pb-1">
                  Item details
                </h2>

                <Row className="items-center mb-2">
                  <Col xs={8} className="font-semibold">
                    Product
                  </Col>
                  <Col xs={8} className="font-semibold">
                    Product Item
                  </Col>
                </Row>

                {devices &&
                  devices.map((device) => (
                    <Row className="items-center mb-2" key={device._id}>
                      <Col xs={8}>
                        {device?.productItem?.product?.productName}
                      </Col>
                      <Col xs={8}>{device?.productItem?.serialNumber}</Col>
                    </Row>
                  ))}
              </div>
            </Col>
          </Row>

          {/* INVOICE DETAILS */}
          <Row gutter={15}>
            <Col xs={24} className="mb-[25px]">
              <div className="bg-white dark:bg-white/10 p-[25px] rounded-10">
                <h2 className="text-lg font-semibold mb-2 border-b pb-1">
                  Invoice details
                </h2>

                {/* TOTAL DEVICES */}
                <Row className="items-center">
                  <Col xs={12}>Total Devices</Col>
                  <Col xs={12}>
                    <p className="my-5">{devices ? devices.length : 0}</p>
                  </Col>
                </Row>

                {/* BASE PRICE */}
                <Row className="items-center">
                  <Col xs={12}>Base Price</Col>
                  <Col xs={12}>
                    <Input
                      className="h-12 p-3 rounded-6"
                      placeholder="Base Price"
                      value={data.base_price}
                      onChange={(e) =>
                        setData({
                          ...data,
                          base_price: Number(e.target.value),
                        })
                      }
                    />
                  </Col>
                </Row>

                {/* DISCOUNT */}
                <Row className="items-center mt-5">
                  <Col xs={12}>Discount</Col>
                  <Col xs={12}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Input
                          className="h-12 p-3 rounded-6"
                          value={data.total_discount}
                          onChange={(e) =>
                            setData({
                              ...data,
                              total_discount: Number(e.target.value),
                            })
                          }
                        />
                        <p>%</p>
                      </div>
                      <Input
                        disabled
                        className="h-12 p-3 rounded-6"
                        value={
                          devices
                            ? calculatePercent(
                                devices.length * data.base_price,
                                data.total_discount,
                              )
                            : 0
                        }
                      />
                    </div>
                  </Col>
                </Row>

                {/* TOTAL AMOUNT */}
                <Row className="items-center mt-5">
                  <Col xs={12}>Total Amount</Col>
                  <Col xs={12}>
                    <Input
                      className="h-12 p-3 rounded-6"
                      disabled
                      value={
                        devices
                          ? devices.length * data.base_price -
                            calculatePercent(
                              devices.length * data.base_price,
                              data.total_discount,
                            )
                          : 0
                      }
                    />
                  </Col>
                </Row>

                {/* TAX */}
                <Row className="items-center mt-5">
                  <Col xs={12}>Tax</Col>
                  <Col xs={12}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Input
                          className="h-12 p-3 rounded-6"
                          value={data.total_tax}
                          onChange={(e) =>
                            setData({
                              ...data,
                              total_tax: Number(e.target.value),
                            })
                          }
                        />
                        <p>%</p>
                      </div>
                      <Input
                        disabled
                        className="h-12 p-3 rounded-6"
                        value={
                          devices
                            ? calculatePercent(
                                devices.length * data.base_price,
                                data.total_tax,
                              )
                            : 0
                        }
                      />
                    </div>
                  </Col>
                </Row>

                {/* TOTAL PAYMENT */}
                <Row className="items-center mt-5">
                  <Col xs={12}>Total Payment</Col>
                  <Col xs={12}>
                    <Input
                      disabled
                      className="h-12 p-3 rounded-6"
                      value={
                        devices
                          ? devices.length * data.base_price -
                            calculatePercent(
                              devices.length * data.base_price,
                              data.total_discount,
                            ) +
                            calculatePercent(
                              devices.length * data.base_price,
                              data.total_tax,
                            )
                          : 0
                      }
                    />
                  </Col>
                </Row>

                {/* PAYMENT METHOD */}
                <Row className="items-center mt-5">
                  <Col xs={12}>Payment Method</Col>
                  <Col xs={12}>
                    <Select
                      size="large"
                      className="[&>div]:px-[20px] [&>div]:h-[50px]"
                      value={paymentMethod}
                      onChange={(v) => {
                        setPaymentMethod(v);
                        setData((prev) => ({
                          ...prev,
                          payment_method: {
                            ...prev.payment_method,
                            method_name: v,
                          },
                        }));
                      }}
                    >
                      <Option value="transfer">Transfer</Option>
                      <Option value="cash">Cash</Option>
                    </Select>
                  </Col>
                </Row>

                {/* BANK FIELDS */}
                {paymentMethod === "transfer" && (
                  <>
                    <Row className="items-center mt-5">
                      <Col xs={12}>Account Number</Col>
                      <Col xs={12}>
                        <Input
                          className="h-12 p-3"
                          value={accountNumber}
                          onChange={(e) => {
                            setAccountNumber(e.target.value);
                            setData((prev) => ({
                              ...prev,
                              payment_method: {
                                ...prev.payment_method,
                                account_number: e.target.value,
                              },
                            }));
                          }}
                        />
                      </Col>
                    </Row>

                    <Row className="items-center mt-5">
                      <Col xs={12}>Bank Name</Col>
                      <Col xs={12}>
                        <Input
                          className="h-12 p-3"
                          value={bankName}
                          onChange={(e) => {
                            setBankName(e.target.value);
                            setData((prev) => ({
                              ...prev,
                              payment_method: {
                                ...prev.payment_method,
                                bank_name: e.target.value,
                              },
                            }));
                          }}
                        />
                      </Col>
                    </Row>
                  </>
                )}

                {/* PERIODE */}
                <Row className="items-center mt-5">
                  <Col xs={12}>Invoice Periode</Col>
                  <Col xs={12}>
                    <div className="flex items-center gap-2">
                      <Input
                        className="h-12 p-3 flex-1"
                        value={data.invoice_duration}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            invoice_duration: Number(e.target.value),
                          }))
                        }
                      />
                      <p>Days</p>
                    </div>
                  </Col>
                </Row>

                {/* DUE DATE */}
                <Row className="items-center mt-5">
                  <Col xs={12}>Due Date</Col>
                  <Col xs={12}>
                    <DatePicker
                      disabled
                      value={data.due_date ? moment(data.due_date) : undefined}
                      onChange={(date) =>
                        setData({
                          ...data,
                          due_date: date?.toISOString() || "",
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Submit Invoice
          </button>
        </div>
      </form>
    </>
  );
}

export default UpdateInvoice;
