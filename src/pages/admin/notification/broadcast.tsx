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
import { UilMegaphone } from "@iconscout/react-unicons";
import { PageHeaders } from "@/components/page-headers";
import { broadcast } from "@/functions/notification";
const { TextArea } = Input;
function BroadcastNotification() {
  const [data, setData] = useState<any>({ appName: "Customer" });
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("access_token");
  const handleSave = async () => {
    setSubmit(true);
    await broadcast(data, token)
      .then((res: any) => {
        if (res.data.success) {
          router.push("/admin/notification/broadcast");
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
          setLoading(false);
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
      path: "notification",
      breadcrumbName: "Broadcast",
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
                  <Divider>Broadcast Notification</Divider>
                  <Row>
                    <Col span={8}>Select Channel</Col>
                    <Col span={16}>
                      <Form.Item name="channel">
                        <Select
                          defaultValue="Customer"
                          style={{ width: 300 }}
                          onChange={(e) => setData({ ...data, appName: e })}
                          options={[
                            { value: "Customer", label: "Customer" },
                            { value: "Engineer", label: "Engineer" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={8}>Notification Title</Col>
                    <Col span={16}>
                      <Form.Item name="title">
                        <Input
                          placeholder="Title"
                          style={{ width: 300 }}
                          onChange={(e) =>
                            setData({ ...data, title: e.target.value })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>Notification Body</Col>
                    <Col span={16}>
                      <Form.Item name="body">
                        <TextArea
                          rows={5}
                          placeholder="Body message"
                          style={{ width: 300 }}
                          onChange={(e) =>
                            setData({ ...data, body: e.target.value })
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
                      <UilMegaphone /> Send Broadcast
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

export default BroadcastNotification;
