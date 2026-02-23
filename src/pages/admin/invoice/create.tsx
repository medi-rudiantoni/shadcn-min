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
import { useEffect, useState } from "react";
import moment from "moment";
import Cookies from "js-cookie";
import { toast, Bounce } from "react-toastify";
import { PageHeaders } from "@/components/page-headers";
import { getContractDevices, getContractSelect } from "@/functions/contract";
import "moment/locale/id";
import { getSettings } from "@/functions/setting";
import calculatePercent from "@/utils/calculatePercent";
import { createInvoice } from "@/functions/invoice";
import {
  getAllPartnerForInvoice,
  getDetailPartnerForInvoice,
} from "@/functions/partnerContract";
const { TextArea } = Input;
const { Option } = Select;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface PartnerForInvoice {
  _id: string;
  companyName: string;
  totalContracts: number;
  totalDevices: number;
}

interface InvoiceData {
  totalContracts: number;
  partner: string;
  totalDevices: number;
  base_price: number;
  total_discount: number;
  total_tax: number;
  total_amount: number;
  total_payment: number;
  due_date: string;
  payment_method: {
    method_name?: string;
    bank_name?: string;
    account_number?: string;
    account_name?: string;
  };
  invoice_duration: number;
}

function CreateInvoice() {
  const router = useRouter();
  const token = Cookies.get("access_token");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingPartnerDetail, setLoadingPartnerDetail] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string | undefined>();
  const [listPartner, setListPartner] = useState<PartnerForInvoice[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "cash">(
    "transfer",
  );
  const [bankName, setBankName] = useState<string | undefined>(undefined);
  const [accountNumber, setAccountNumber] = useState<string | undefined>(
    undefined,
  );
  const [accountName, setAccountName] = useState<string | undefined>(undefined);

  const [data, setData] = useState<InvoiceData>({
    totalContracts: 0,
    partner: "",
    totalDevices: 0,
    base_price: 0,
    total_discount: 0,
    total_tax: 0,
    total_amount: 0,
    total_payment: 0,
    due_date: "",
    payment_method: {},
    invoice_duration: 0,
  });

  useEffect(() => console.log("DATA STATE: ", data), [data]);

  // Load initial data
  useEffect(() => {
    loadInvoiceSettings();
    loadPartnersInfo();
  }, []);

  // Load partner detail when selected
  useEffect(() => {
    if (selectedPartner) {
      loadPartnerInfo();
    } else {
      // Reset data when no partner selected
      setData((prev) => ({
        ...prev,
        totalContracts: 0,
        totalDevices: 0,
        partner: "",
        total_amount: 0,
        total_payment: 0,
        contracts: [],
      }));
    }
  }, [selectedPartner]);

  // Recalculate due date when duration changes
  useEffect(() => {
    setInvoiceDueDate();
  }, [data.invoice_duration]);

  // Recalculate payment when pricing factors change
  useEffect(() => {
    calculateTotalPayment();
  }, [data.totalDevices, data.base_price, data.total_discount, data.total_tax]);

  function loadPartnersInfo() {
    getAllPartnerForInvoice(token)
      .then((res) => {
        setListPartner(res.data || []);
      })
      .catch((error) => {
        console.error("PARTNER FOR INVOICE ERROR: ", error);
        toast.error("Failed to load partners");
        setListPartner([]);
      });
  }

  function loadPartnerInfo() {
    if (!selectedPartner) return;

    setLoadingPartnerDetail(true);
    getDetailPartnerForInvoice(token, selectedPartner)
      .then((res) => {
        const partnerData = res.data;

        console.log("RES DETAIL PARTNER: ", res.data);

        // Update main data state with latest partner info
        setData((prev) => ({
          ...prev,
          totalContracts: partnerData.totalContracts,
          totalDevices: partnerData.totalDevices,
          partner: partnerData._id,
          contracts: partnerData.contracts.map((c: any) => c._id),
        }));

        // Sync the list data with the latest detail to avoid inconsistency
        setListPartner((prevList) =>
          prevList.map((p) =>
            p._id === selectedPartner
              ? {
                  ...p,
                  totalContracts: partnerData.totalContracts,
                  totalDevices: partnerData.totalDevices,
                }
              : p,
          ),
        );
      })
      .catch((error) => {
        console.error("ERROR FETCH DETAIL PARTNER: ", error);
        toast.error("Failed to load partner details");

        // Reset on error
        setData((prev) => ({
          ...prev,
          totalContracts: 0,
          totalDevices: 0,
          partner: "",
        }));
      })
      .finally(() => {
        setLoadingPartnerDetail(false);
      });
  }

  function loadInvoiceSettings() {
    if (!token) return;

    getSettings(token, "invoice")
      .then((res) => {
        const settings = res.data.settings;

        setPaymentMethod(settings.payment_method || "transfer");
        setBankName(settings.bank_name);
        setAccountNumber(settings.account_number);
        setAccountName(settings.account_name);

        setData((prev) => ({
          ...prev,
          base_price: settings.base_price || 0,
          payment_method: {
            method_name: settings.payment_method || "transfer",
            bank_name: settings.bank_name,
            account_number: settings.account_number,
            account_name: settings.account_name,
          },
          total_tax: settings.tax || 0,
          invoice_duration: settings.invoice_duration || 0,
        }));
      })
      .catch((error) => {
        console.error("ERROR FETCH INVOICE SETTINGS: ", error);
        toast.error("Failed to load invoice settings");
      });
  }

  function setInvoiceDueDate() {
    if (!data.invoice_duration) return;

    const newDueDate = moment()
      .add(data.invoice_duration, "days")
      .toISOString();

    setData((prev) => ({
      ...prev,
      due_date: newDueDate,
    }));
  }

  function calculateTotalPayment() {
    const deviceCount = data.totalDevices;

    if (deviceCount === 0 || data.base_price === 0) {
      setData((prev) => ({
        ...prev,
        total_amount: 0,
        total_payment: 0,
      }));
      return;
    }

    const subtotal = deviceCount * data.base_price;
    const discountValue = calculatePercent(subtotal, data.total_discount);
    const totalAmount = subtotal - discountValue;
    const taxValue = calculatePercent(subtotal, data.total_tax);
    const totalPayment = totalAmount + taxValue;

    setData((prev) => ({
      ...prev,
      total_amount: totalAmount,
      total_payment: totalPayment,
    }));
  }

  function handleSubmit() {
    // Validation
    if (!selectedPartner) {
      toast.error("Please select a partner");
      return;
    }

    if (data.totalDevices === 0) {
      toast.error("Partner has no devices");
      return;
    }

    if (data.base_price === 0) {
      toast.error("Base price cannot be zero");
      return;
    }

    if (
      paymentMethod === "transfer" &&
      (!bankName || !accountNumber || !accountName)
    ) {
      toast.error("Please fill in all bank details");
      return;
    }

    setLoadingSubmit(true);

    // Prepare final data with updated payment method
    const invoiceData = {
      ...data,
      payment_method: {
        method_name: paymentMethod,
        ...(paymentMethod === "transfer" && {
          bank_name: bankName,
          account_number: accountNumber,
          account_name: accountName,
        }),
      },
    };

    createInvoice(invoiceData, token)
      .then((res) => {
        toast.success(res.data.message || "Invoice created successfully");
        router.replace("/admin/invoice");
      })
      .catch((error) => {
        console.error("Error create invoice: ", error);
        toast.error(
          error?.response?.data?.message || "Failed to create invoice",
        );
      })
      .finally(() => setLoadingSubmit(false));
  }

  function handlePaymentMethodChange(method: "transfer" | "cash") {
    setPaymentMethod(method);
    setData((prev) => ({
      ...prev,
      payment_method: {
        method_name: method,
        ...(method === "transfer" && {
          bank_name: bankName,
          account_number: accountNumber,
          account_name: accountName,
        }),
      },
    }));
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
      path: "/admin/invoice/create",
      breadcrumbName: "Create Invoice",
    },
  ];

  // Get current selected partner data
  const selectedPartnerData = listPartner.find(
    (p) => p._id === selectedPartner,
  );

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Create Invoice"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
          {/* PARTNER SELECT */}
          <Row gutter={15}>
            <Col xs={24} className="mb-[25px]">
              <div className="bg-white dark:bg-white/10 p-[25px] rounded-10">
                <h1 className="text-[18px] font-semibold mb-4">
                  Create Invoice
                </h1>

                <label className="block mb-2 font-medium">Select Partner</label>
                <div className="w-full flex items-center gap-2 px-5 mb-2">
                  <div className="w-[240px] text-sm text-gray-500">Name</div>
                  <div className="min-w-[200px] text-sm text-gray-500">
                    Total Contracts
                  </div>
                  <div className="text-sm text-gray-500">Total Devices</div>
                </div>
                <Select
                  size="large"
                  showSearch
                  placeholder="-- Select Partner --"
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    String(option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  className="[&>div]:px-[20px] w-full dark:[&>div]:bg-white/10 [&>div]:h-[50px]"
                  value={selectedPartner}
                  onChange={(value) => setSelectedPartner(value)}
                  loading={loadingPartnerDetail}
                >
                  {listPartner.map((partner) => (
                    <Option
                      key={partner._id}
                      value={partner._id}
                      label={partner.companyName}
                    >
                      <div className="w-full flex items-center gap-2">
                        <div className="w-[240px]">{partner.companyName}</div>
                        <div className="min-w-[200px]">
                          {partner.totalContracts}
                        </div>
                        <div>{partner.totalDevices}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>

          {selectedPartner && (
            <>
              {/* INVOICE DETAILS */}
              <Row gutter={15}>
                <Col xs={24} className="mb-[25px]">
                  <div className="bg-white dark:bg-white/10 p-[25px] rounded-10">
                    <h2 className="text-lg font-semibold mb-2 border-b pb-1">
                      Details
                    </h2>

                    {loadingPartnerDetail ? (
                      <Skeleton active paragraph={{ rows: 2 }} />
                    ) : (
                      <>
                        {/* TOTAL CONTRACTS */}
                        <Row className="items-center">
                          <Col xs={12}>
                            <span className="font-medium">Total Contracts</span>
                          </Col>
                          <Col xs={12}>
                            <p className="my-5">{data.totalContracts}</p>
                          </Col>
                        </Row>

                        {/* TOTAL DEVICES */}
                        <Row className="items-center">
                          <Col xs={12}>
                            <span className="font-medium">Total Devices</span>
                          </Col>
                          <Col xs={12}>
                            <p className="my-5">{data.totalDevices}</p>
                          </Col>
                        </Row>
                      </>
                    )}
                  </div>
                </Col>
              </Row>

              {/* PRICING */}
              <Row gutter={15}>
                <Col xs={24} className="mb-[25px]">
                  <div className="bg-white dark:bg-white/10 p-[25px] rounded-10">
                    <h2 className="text-lg font-semibold mb-2 border-b pb-1">
                      Pricing
                    </h2>

                    {/* BASE PRICE */}
                    <Row className="items-center mt-3">
                      <Col xs={12}>
                        <span className="font-medium">Base Price</span>
                      </Col>
                      <Col xs={12}>
                        <Input
                          type="number"
                          min={0}
                          className="h-12 p-3 rounded-6"
                          placeholder="Enter base price"
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
                      <Col xs={12}>
                        <span className="font-medium">Discount</span>
                      </Col>
                      <Col xs={12}>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              className="h-12 p-3 rounded-6"
                              placeholder="%"
                              value={data.total_discount}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  total_discount: Number(e.target.value),
                                })
                              }
                            />
                            <span>%</span>
                          </div>
                          <Input
                            disabled
                            className="h-12 p-3 rounded-6"
                            value={calculatePercent(
                              data.totalDevices * data.base_price,
                              data.total_discount,
                            )}
                          />
                        </div>
                      </Col>
                    </Row>

                    {/* TOTAL AMOUNT */}
                    <Row className="items-center mt-5">
                      <Col xs={12}>
                        <span className="font-medium">Total Amount</span>
                      </Col>
                      <Col xs={12}>
                        <Input
                          className="h-12 p-3 rounded-6"
                          disabled
                          value={data.total_amount}
                        />
                      </Col>
                    </Row>

                    {/* TAX */}
                    <Row className="items-center mt-5">
                      <Col xs={12}>
                        <span className="font-medium">Tax</span>
                      </Col>
                      <Col xs={12}>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              className="h-12 p-3 rounded-6"
                              placeholder="%"
                              value={data.total_tax}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  total_tax: Number(e.target.value),
                                })
                              }
                            />
                            <span>%</span>
                          </div>
                          <Input
                            disabled
                            className="h-12 p-3 rounded-6"
                            value={calculatePercent(
                              data.totalDevices * data.base_price,
                              data.total_tax,
                            )}
                          />
                        </div>
                      </Col>
                    </Row>

                    {/* TOTAL PAYMENT */}
                    <Row className="items-center mt-5">
                      <Col xs={12}>
                        <span className="font-medium text-lg">
                          Total Payment
                        </span>
                      </Col>
                      <Col xs={12}>
                        <Input
                          disabled
                          className="h-12 p-3 rounded-6 font-semibold"
                          value={data.total_payment}
                        />
                      </Col>
                    </Row>

                    {/* PAYMENT METHOD */}
                    <Row className="items-center mt-5">
                      <Col xs={12}>
                        <span className="font-medium">Payment Method</span>
                      </Col>
                      <Col xs={12}>
                        <Select
                          size="large"
                          className="[&>div]:px-[20px] [&>div]:h-[50px] w-full"
                          value={paymentMethod}
                          onChange={handlePaymentMethodChange}
                        >
                          <Option value="transfer">Bank Transfer</Option>
                          <Option value="cash">Cash</Option>
                        </Select>
                      </Col>
                    </Row>

                    {/* BANK FIELDS */}
                    {paymentMethod === "transfer" && (
                      <>
                        <Row className="items-center mt-5">
                          <Col xs={12}>
                            <span className="font-medium">Bank Name</span>
                          </Col>
                          <Col xs={12}>
                            <Input
                              className="h-12 p-3 rounded-6"
                              placeholder="Enter bank name"
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

                        <Row className="items-center mt-5">
                          <Col xs={12}>
                            <span className="font-medium">Account Number</span>
                          </Col>
                          <Col xs={12}>
                            <Input
                              className="h-12 p-3 rounded-6"
                              placeholder="Enter account number"
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
                          <Col xs={12}>
                            <span className="font-medium">Account Name</span>
                          </Col>
                          <Col xs={12}>
                            <Input
                              className="h-12 p-3 rounded-6"
                              placeholder="Enter account name"
                              value={accountName}
                              onChange={(e) => {
                                setAccountName(e.target.value);
                                setData((prev) => ({
                                  ...prev,
                                  payment_method: {
                                    ...prev.payment_method,
                                    account_name: e.target.value,
                                  },
                                }));
                              }}
                            />
                          </Col>
                        </Row>
                      </>
                    )}

                    {/* INVOICE DURATION */}
                    <Row className="items-center mt-5">
                      <Col xs={12}>
                        <span className="font-medium">Invoice Period</span>
                      </Col>
                      <Col xs={12}>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            className="h-12 p-3 flex-1 rounded-6"
                            placeholder="Duration"
                            value={data.invoice_duration}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                invoice_duration: Number(e.target.value),
                              }))
                            }
                          />
                          <span>Days</span>
                        </div>
                      </Col>
                    </Row>

                    {/* DUE DATE */}
                    <Row className="items-center mt-5">
                      <Col xs={12}>
                        <span className="font-medium">Due Date</span>
                      </Col>
                      <Col xs={12}>
                        <DatePicker
                          disabled
                          size="large"
                          className="w-full"
                          value={
                            data.due_date ? moment(data.due_date) : undefined
                          }
                          format="DD MMMM YYYY"
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>

              {/* SUBMIT BUTTON */}
              <Row gutter={15}>
                <Col xs={24}>
                  <div className="flex gap-3">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loadingSubmit}
                      disabled={loadingSubmit || data.totalDevices === 0}
                      className="bg-blue-600 hover:bg-blue-700 px-8"
                    >
                      {loadingSubmit ? "Creating..." : "Create Invoice"}
                    </Button>
                    <Button
                      size="large"
                      onClick={() => router.back()}
                      disabled={loadingSubmit}
                    >
                      Cancel
                    </Button>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </div>
      </form>
    </>
  );
}

export default CreateInvoice;
