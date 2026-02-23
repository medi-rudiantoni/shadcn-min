import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Bounce, toast } from "react-toastify";
import router from "next/router";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Skeleton,
  Switch,
} from "antd";
import { UilSave } from "@iconscout/react-unicons";
import { PageHeaders } from "@/components/page-headers";
import {
  saveSetting,
  getSettings,
  createNewSettings,
} from "@/functions/setting";

function InvoiceSetting() {
  const [data, setData] = useState<any>(undefined);
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("access_token");
  const type = "invoice";
  useEffect(() => {
    if (token) {
      getSettings(token, type).then((res) => {
        if (res.data.success) {
          setData(res.data.settings);
          console.log("DATA: ", res.data.settings);
          setLoading(false);
        }
      });
    }
  }, [token]);

  const handleSave = () => {
    setSubmit(true);
    if (!data) {
      createNewSettings(token, { data, type })
        .then((res: any) => {
          if (res.data.success) {
            router.push("/admin/settings/invoice-setting");
            toast.success(res.data.message);
            setSubmit(false);
          }
        })
        .catch((error) => {
          toast.error(error || "Failed to create");
          setSubmit(false);
        });
    }
    saveSetting(token, { data, type })
      .then((res: any) => {
        if (res.data.success) {
          router.push("/admin/settings/invoice-setting");
          toast.success(res.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          setSubmit(false);
        } else {
          toast.error(res.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          setSubmit(false);
        }
      })
      .catch((error) => {
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setSubmit(false);
      });
  };

  const PageRoutes = [
    {
      path: "/admin",
      breadcrumbName: "Dashboard",
    },
    {
      path: "setttings",
      breadcrumbName: "General Setting",
    },
  ];
  const [form] = Form.useForm();

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Invoice Setting"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        {loading ? (
          <div className="p-5 ant-pagination-custom-style table-responsive hover-tr-none table-th-shape-none table-last-th-text-right table-th-border-none table-head-rounded table-selection-col-pl-25 table-tr-selected-background-transparent table-td-border-none bg-white dark:bg-transparent rounded-[10px] ltr:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-l-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-r-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-none ltr:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-r-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-l-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-none">
            <Skeleton active />
          </div>
        ) : (
          <Row gutter={15}>
            <Col xs={24} className="mb-[25px]">
              <div className="p-5 ant-pagination-custom-style table-responsive hover-tr-none table-th-shape-none table-last-th-text-right table-th-border-none table-head-rounded table-selection-col-pl-25 table-tr-selected-background-transparent table-td-border-none bg-white dark:bg-transparent rounded-[10px] ltr:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-l-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-r-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-none ltr:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-r-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-l-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-none">
                <Form
                  name="sDash_validation-form"
                  form={form}
                  disabled={submit}
                  layout="vertical"
                  onSubmitCapture={handleSave}
                  initialValues={data}
                >
                  {/* {JSON.stringify(data)} */}
                  <Divider>General</Divider>
                  <Row>
                    <Col span={8}>Base Price</Col>
                    <Col span={16}>
                      <Form.Item name="base_price">
                        <Input
                          placeholder="Base Price"
                          style={{ width: 300 }}
                          onChange={(e) =>
                            setData({ ...data, base_price: e.target.value })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={8}>Tax</Col>
                    <Col span={16}>
                      <div className="flex gap-2">
                        <Form.Item name="tax">
                          <Input
                            placeholder="Tax"
                            style={{ width: 250 }}
                            onChange={(e) =>
                              setData({
                                ...data,
                                tax: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                        <p className="relative translate-y-2">%</p>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={8}>Payment method</Col>
                    <Col span={16}>
                      <Select
                        onChange={(e) =>
                          setData({ ...data, payment_method: e })
                        }
                        defaultValue={data.payment_method || "cash"}
                        options={[
                          {
                            value: "transfer",
                            label: (
                              <div className="w-full max-w-[300px]">
                                Transfer
                              </div>
                            ),
                          },
                          {
                            value: "cash",
                            label: (
                              <div className="w-full max-w-[300px]">Cash</div>
                            ),
                          },
                        ]}
                        className="w-full max-w-[300px] mb-10"
                      />
                    </Col>
                  </Row>

                  {data.payment_method &&
                    data.payment_method === "transfer" && (
                      <>
                        <Row>
                          <Col span={8}>Bank Name</Col>
                          <Col span={16}>
                            <Form.Item name="bank_name">
                              <Input
                                placeholder="Bank Name"
                                style={{ width: 300 }}
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    bank_name: e.target.value,
                                  })
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row>
                          <Col span={8}>Account Name</Col>
                          <Col span={16}>
                            <Form.Item name="account_name">
                              <Input
                                placeholder="Account Name"
                                style={{ width: 300 }}
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    account_name: e.target.value,
                                  })
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row>
                          <Col span={8}>Bank Account Number</Col>
                          <Col span={16}>
                            <Form.Item name="account_number">
                              <Input
                                placeholder="Acoount Number"
                                style={{ width: 300 }}
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    account_number: e.target.value,
                                  })
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}

                  <Row>
                    <Col span={8}>Invoice Duration</Col>
                    <Col span={16}>
                      <div className="flex h-fit gap-2">
                        <Form.Item name="invoice_duration">
                          <Input
                            placeholder="Invoice Duration"
                            style={{ width: 250 }}
                            onChange={(e) =>
                              setData({
                                ...data,
                                invoice_duration: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                        <p className="relative translate-y-2">days</p>
                      </div>
                    </Col>
                  </Row>

                  <Row style={{ alignContent: "center", alignItems: "center" }}>
                    <Button
                      className="bg-primary hover:bg-primary-hbr border-solid border-1 border-primary text-white dark:text-white/[.87] text-[14px] font-semibold leading-[22px] inline-flex items-center justify-center rounded-[4px] px-[30px] h-[44px]"
                      htmlType="submit"
                      type="primary"
                      size="large"
                    >
                      <UilSave /> Save
                    </Button>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}

export default InvoiceSetting;
