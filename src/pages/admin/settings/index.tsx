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
import { saveSetting, getSettings } from "@/functions/setting";

function GeneralSetting() {
  const [data, setData] = useState<any>({});
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enablePhone, setEnablePhone] = useState<boolean>(false);
  const [enableSms, setEnableSms] = useState<boolean>(false);
  const [enableWhatsapp, setEnableWhatsapp] = useState<boolean>(false);
  const token = Cookies.get("access_token");
  const type = "general";
  useEffect(() => {
    if (token) {
      getSettings(token, type).then((res) => {
        if (res.data.success) {
          setData(res.data.settings);
          setEnablePhone(res.data.settings?.enable_phone);
          setEnableSms(res.data.settings?.enable_sms);
          setEnableWhatsapp(res.data.settings?.enable_whatsapp);
          setLoading(false);
        }
      });
    }
  }, [token]);
  const hanldePhone = (val: any) => {
    setData({ ...data, enable_phone: val });
    if (val) {
      setData({ ...data, enable_sms: enableSms });
      setData({ ...data, enable_whatsapp: enableWhatsapp });
    } else {
      setData({ ...data, enable_sms: val });
      setData({ ...data, enable_whatsapp: val });
    }
    setEnablePhone(val);
  };
  const handleSave = () => {
    setSubmit(true);
    saveSetting(token, { data, type })
      .then((res: any) => {
        if (res.data.success) {
          router.push("/admin/settings");
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
        title="General Setting"
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
                  <Divider>Ticketing</Divider>
                  <Row>
                    <Col span={8}>Ticketing Mode</Col>
                    <Col span={16}>
                      <Form.Item name="ticket_mode">
                        <Select
                          defaultValue="dispatch"
                          style={{ width: 300 }}
                          onChange={(e) => setData({ ...data, ticket_mode: e })}
                          options={[
                            { value: "dispatch", label: "Dispatch" },
                            { value: "auto", label: "Automatic" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={8}>Ticket Prefix</Col>
                    <Col span={16}>
                      <Form.Item name="ticket_prefix">
                        <Input
                          placeholder="Ticket Prefix"
                          style={{ width: 300 }}
                          onChange={(e) =>
                            setData({ ...data, ticket_prefix: e.target.value })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider>OTP & Notification</Divider>
                  <Row>
                    <Col span={8}>Enable Phone</Col>
                    <Col span={16}>
                      <Form.Item name="enable_phone">
                        <Switch
                          checkedChildren="Enabled"
                          unCheckedChildren="Disabled"
                          defaultChecked
                          onChange={(e) => {
                            hanldePhone(e);
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div
                    style={{
                      display: enablePhone ? "block" : "none",
                    }}
                  >
                    <Row>
                      <Col span={8}>Enable SMS</Col>
                      <Col span={16}>
                        <Form.Item name="enable_sms">
                          <Switch
                            checkedChildren="Enabled"
                            unCheckedChildren="Disabled"
                            onChange={(e) =>
                              setData({ ...data, enable_sms: e })
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={8}>Enable Whatsapp</Col>
                      <Col span={16}>
                        <Form.Item name="enable_whatsapp">
                          <Switch
                            checkedChildren="Enabled"
                            unCheckedChildren="Disabled"
                            defaultChecked
                            onChange={(e) =>
                              setData({ ...data, enable_whatsapp: e })
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                  <Row>
                    <Col span={8}>Enable Email</Col>
                    <Col span={16}>
                      <Form.Item name="enable_email">
                        <Switch
                          checkedChildren="Enabled"
                          unCheckedChildren="Disabled"
                          defaultChecked
                          onChange={(e) =>
                            setData({ ...data, enable_email: e })
                          }
                        />
                      </Form.Item>
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

export default GeneralSetting;
