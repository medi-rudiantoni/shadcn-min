import {
  Col,
  Row,
  Form,
  Input,
  Button,
  Select,
  Skeleton,
  DatePicker,
  DatePickerProps,
  InputNumber,
  InputNumberProps,
} from "antd";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, Bounce } from "react-toastify";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { UilSave } from "@iconscout/react-unicons";
import { PageHeaders } from "@/components/page-headers";
import {
  updateContract,
  getContractByNumber,
  getContract,
} from "@/functions/contract";
import { getCustomers } from "@/functions/customer";
const { TextArea } = Input;
const { Option } = Select;

function EditContract() {
  const [customers, setCustomers] = useState<any>([]);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [submit, setSubmit] = useState(false);
  const token = Cookies.get("access_token_partner");
  const router = useRouter();
  let { id } = router.query;
  useEffect(() => {
    setSubmit(false);
    if (id) {
      getContract(id, token).then((res) => {
        if (res.data.success) {
          res.data.contract.start_date = dayjs(
            res.data.contract.start_date.toString(),
            "YYYY-MM-DD",
          );
          res.data.contract.end_date = dayjs(
            res.data.contract.end_date.toString(),
            "YYYY-MM-DD",
          );
          setData(res.data.contract);
          setLoading(false);
        }
      });
    }
    getCustomers(token).then((res: any) => {
      if (res.data) {
        setCustomers(res.data);
      }
    });
  }, [id]);

  const onChangeStart: DatePickerProps["onChange"] = (date, dateString) => {
    // consol.log(date, dateString);
    setData({ ...data, start_date: date });
  };
  const onChangeEnd: DatePickerProps["onChange"] = (date, dateString) => {
    // //console.log(date, dateString);
    setData({ ...data, end_date: date });
  };
  const onChangeValue: InputNumberProps["onChange"] = (value) => {
    //console.log("changed", value);
    setData({ ...data, values: value });
  };
  const fetchContract = (value: any) => {
    getContractByNumber(value, token).then((res) => {
      if (res.data.result == "Found") {
        return "";
      }
    });
  };
  const onSubmit = () => {
    updateContract(id, data, token).then((res) => {
      setSubmit(true);
      //console.log("res", res);
      if (res.data.success) {
        toast.success("Contract created successfully!", {
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
        router.push(`/manage/contracts/detail/${res.data.contract._id}`);
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
    });
  };
  const validateMessages = {
    types: {
      string: "Please enter a valid ${label}!",
      method: "Please enter a valid ${label}!",
      array: "Please enter a valid ${label}!",
      object: "Please enter a valid ${label}!",
      number: "Please enter a valid ${label}!",
      date: "Please enter a valid ${label}!",
      boolean: "Please check this ${label}!",
      email: "Please enter a valid email!",
      url: "Please enter a valid URL!",
      hex: "Please enter a valid hex code!",
    },
    required: "This field is required.",
  };
  const PageRoutes = [
    {
      path: "/manage",
      breadcrumbName: "Dashboard",
    },
    {
      path: "first",
      breadcrumbName: "Edit Contract",
    },
  ];
  const [form] = Form.useForm();
  // //console.log("Number", number);
  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Edit Contract "
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Row gutter={15}>
          <Col xs={24} className="mb-[25px]">
            <div className="bg-white dark:bg-white/10 m-0 p-0 text-theme-gray dark:text-white/60 text-[15px] rounded-10 relative mb-[25px]">
              <div className="p-[25px]">
                {loading ? (
                  <Skeleton active />
                ) : (
                  <Form
                    name="sDash_validation-form"
                    form={form}
                    layout="vertical"
                    disabled={submit}
                    validateMessages={validateMessages}
                    onSubmitCapture={onSubmit}
                    initialValues={data}
                  >
                    <Row gutter={30}>
                      <Col xs={24}>
                        <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                          <h1 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                            Contract Data
                          </h1>
                        </div>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="customer"
                          label="Company Name"
                          rules={[
                            {
                              required: true,
                              message: "Company Name is required!",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            placeholder="-- Select Company --"
                            className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                            onChange={(e) => setData({ ...data, customer: e })}
                            defaultValue={data.customer}
                          >
                            {customers &&
                              customers.map((data: any, i: number) => (
                                <Option value={data._id} key={i}>
                                  {data.companyName}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="name"
                          label="Contract Name"
                          rules={[
                            {
                              required: true,
                              message: "Contract Name is required!",
                            },
                          ]}
                        >
                          <Input
                            className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                            placeholder="Contract Name"
                            onChange={(e) =>
                              setData({ ...data, name: e.target.value })
                            }
                            defaultValue={data.name}
                          />
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="number"
                          label="Contract Number"
                          // validateTrigger="onBlur"
                          rules={[
                            {
                              required: true,
                              message: "Contract Number is required!",
                            },
                          ]}
                        >
                          <Input
                            className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                            placeholder="Contract Number"
                            onChange={(e) =>
                              setData({ ...data, number: e.target.value })
                            }
                            // onBlur={fetchContract}
                          />
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="duration"
                          label="Duration"
                          rules={[
                            {
                              required: true,
                              message: "Duration is required!",
                            },
                          ]}
                        >
                          <Input
                            placeholder={"Contract Duration"}
                            className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                            onChange={(e) =>
                              setData({ ...data, duration: e.target.value })
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="durationUnit"
                          label="Duration Unit"
                          rules={[
                            {
                              required: true,
                              message: "Duration Unit is required!",
                            },
                          ]}
                        >
                          <Select
                            className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                            placeholder="-- Select Duration Unit --"
                            onChange={(value) =>
                              setData({ ...data, durationUnit: value })
                            }
                          >
                            <Option value="bulan">Bulan</Option>
                            <Option value="tahun"> Tahun</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="devices"
                          label="Total Device"
                          rules={[
                            {
                              required: true,
                              message: "Total Device is required!",
                            },
                          ]}
                        >
                          <Input
                            className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                            placeholder="Total Device"
                            type="number"
                            onChange={(e) =>
                              setData({ ...data, device: e.target.value })
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="values"
                          label="Contract Value"
                          rules={[
                            {
                              required: true,
                              message: "Contract Value is required!",
                            },
                          ]}
                        >
                          <InputNumber<number>
                            style={{ width: "100%" }}
                            //className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                            // className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                            formatter={(v) =>
                              `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(val) =>
                              val?.replace(
                                /\$\s?|(,*)/g,
                                "",
                              ) as unknown as number
                            }
                            max={1000000000}
                            onChange={onChangeValue}
                          />
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="slaResponTime"
                          label="SLA Respon Time (hour)"
                          rules={[
                            {
                              required: true,
                              message: "SLA Respon Time is required!",
                            },
                          ]}
                        >
                          <Input
                            className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                            placeholder="SLA Respon Time"
                            type="number"
                            onChange={(e) =>
                              setData({
                                ...data,
                                slaResponTime: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="slaDoneTime"
                          label="SLA Done Time (hour)"
                          rules={[
                            {
                              required: true,
                              message: "SLA Done Time is required!",
                            },
                          ]}
                        >
                          <Input
                            className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                            placeholder="SLA Done Time"
                            type="number"
                            onChange={(e) =>
                              setData({ ...data, slaDoneTime: e.target.value })
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="start_date"
                          label="Start Date"
                          rules={[
                            {
                              required: true,
                              message: "Start Date is required!",
                            },
                          ]}
                        >
                          <DatePicker
                            className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                            onChange={onChangeStart}
                            format="YYYY-MM-DD"
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={8}>
                        <Form.Item
                          className="mb-[20px]"
                          name="end_date"
                          label="End Date"
                          rules={[
                            {
                              required: true,
                              message: "End Date is required!",
                            },
                          ]}
                        >
                          <DatePicker
                            className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                            onChange={onChangeEnd}
                            format="YYYY-MM-DD"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <div className="hexadash-form-action mt-[20px]">
                      <Button
                        className="bg-primary hover:bg-primary-hbr border-solid border-1 border-primary text-white dark:text-white/[.87] text-[14px] font-semibold leading-[22px] inline-flex items-center justify-center rounded-[4px] px-[30px] h-[44px]"
                        htmlType="submit"
                        type="primary"
                        size="large"
                      >
                        <UilSave /> Save Data
                      </Button>
                    </div>
                  </Form>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default EditContract;
