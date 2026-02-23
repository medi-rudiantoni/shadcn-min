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
} from "antd";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, Bounce } from "react-toastify";
import { UilSave, UilSpinner, UilPlus } from "@iconscout/react-unicons";
import {
  createPartner,
  getCities,
  getProvinces,
  getSubdistricts,
  getSubById,
} from "@/functions/partner";
import { PageHeaders } from "@/components/page-headers";
import { getCategories } from "@/functions/category";
const { TextArea } = Input;
const { Option } = Select;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

function AddPartner() {
  const [partner, setPartner] = useState<any>({});
  const [submit, setSubmit] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [postalCode, setPostalCode] = useState("");
  const [categories, setCategories] = useState<any>([]);
  const [selectedValue, setSelecteValue] = useState("");
  const token = Cookies.get("access_token");
  const router = useRouter();
  useEffect(() => {
    getCategories().then((res) => {
      if (res.data.success) {
        setCategories(res.data.categories);
        setSubmit(false);
      }
    });
    getProvinces(token).then((res) => {
      if (res) {
        setProvinces(res.data);
      }
    });
  }, []);
  useEffect(() => {
    if (selectedValue) {
      getSubById(selectedValue, token).then((res) => {
        setPartner({
          ...partner,
          postalCode: res.data.postal_code,
          status: "Active",
        });
        setPostalCode(res.data.postal_code);
      });
    }
  }, [selectedValue]);
  const onChangeProvince = (value: any) => {
    setPartner({ ...partner, province: value });
    getCities(value, token).then((res) => {
      setCities(res.data);
    });
  };
  const onChangeCity = (value: any) => {
    setPartner({ ...partner, city: value });
    getSubdistricts(value, token).then((res) => {
      setSubdistricts(res.data);
    });
  };
  const onChangeSubdistrict = (value: any) => {
    setPartner({ ...partner, subdistrict: value });
    setSelecteValue(value);
  };
  const onSubmit = () => {
    setSubmit(true);
    createPartner(partner, token)
      .then((res: any) => {
        if (res.data.success) {
          router.push("/admin/users/partner");
          toast.success("Partner created successfully!", {
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
        } else {
          setSubmit(false);
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
        }
      })
      .catch((error) => {
        console.error(error);
        setSubmit(false);
        toast.error("error", {
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
      });
  };
  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setUploading(false);
        setImageUrl(url);
        setPartner({
          ...partner,
          companyPhoto: info.file.response.image,
        });
      });
    }
  };
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {uploading ? <UilSpinner /> : <UilPlus />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

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
      path: "/admin",
      breadcrumbName: "Dashboard",
    },
    {
      path: "/admin/users/partner/add",
      breadcrumbName: "Add Partner",
    },
  ];
  const [form] = Form.useForm();
  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Add Partner"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Row gutter={15}>
          <Col xs={24} className="mb-[25px]">
            <div className="bg-white dark:bg-white/10 m-0 p-0 text-theme-gray dark:text-white/60 text-[15px] rounded-10 relative mb-[25px]">
              <div className="p-[25px]">
                <Form
                  name="sDash_validation-form"
                  form={form}
                  disabled={submit}
                  layout="vertical"
                  validateMessages={validateMessages}
                  onSubmitCapture={onSubmit}
                  initialValues={partner}
                >
                  <Row gutter={30}>
                    <Col xs={24}>
                      <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                        <h1 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                          Company Data
                        </h1>
                      </div>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="companyName"
                        label="Company Name"
                        rules={[
                          {
                            required: true,
                            message: "Company  Name is required!",
                          },
                        ]}
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Company Name"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              companyName: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24} hidden>
                      <Form.Item
                        className="mb-[20px]"
                        name="storeName"
                        label="Store Name"
                        rules={[
                          {
                            required: true,
                            message: "Store  Name is required!",
                          },
                        ]}
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Store Name"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              storeName: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="companyEmail"
                        label="Company Email"
                        rules={[
                          {
                            required: true,
                            message: "Company Email is required!",
                          },
                          { type: "email" },
                        ]}
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Company Email"
                          type="email"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              companyEmail: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="companyPhone"
                        label="Company Phone"
                        rules={[
                          {
                            required: true,
                            message: "Company Phone is required!",
                          },
                        ]}
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Company Phone"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              companyPhone: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={16} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="companyAddress"
                        label="Company Address"
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Company Address"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              companyAddress: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="province"
                        label="Provice"
                        rules={[
                          {
                            type: "string",
                            message: "Please enter a valid provice!",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          placeholder="-- Select Province --"
                          className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                          onChange={onChangeProvince}
                        >
                          {provinces.map((data: any, i: number) => (
                            <Option value={data.province_id} key={i}>
                              {data.province}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="city"
                        label="Regency/City"
                        rules={[
                          {
                            type: "string",
                            message: "Please enter a valid city!",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          placeholder={
                            cities.length > 0
                              ? "-- Select City --"
                              : "-- Select Province First --"
                          }
                          className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                          onChange={onChangeCity}
                        >
                          {cities &&
                            cities.map((data: any, i: number) => (
                              <Option value={data.city_id} key={i}>
                                {data.city_name}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="subdistrict"
                        label="Subdistrict"
                        rules={[
                          {
                            type: "string",
                            message: "Please enter a valid Subdistrict!",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          placeholder={
                            subdistricts.length > 0
                              ? "-- Select Subdistrict --"
                              : "-- Select City First --"
                          }
                          className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                          onChange={onChangeSubdistrict}
                        >
                          {subdistricts &&
                            subdistricts.map((data: any, i: number) => (
                              <Option value={data.subdistrict_id} key={i}>
                                {data.subdistrict_name}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="postal-code"
                        label="Postal Code"
                        rules={[
                          {
                            type: "string",
                            message: "Please enter a valid postal code!",
                          },
                        ]}
                      >
                        <p className="ant-input css-dev-only-do-not-override-qnu6hi ant-input-outlined ant-input-status-success h-12 p-3 rounded-6 dark:placeholder-white/60">
                          {postalCode}
                        </p>
                      </Form.Item>
                    </Col>

                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="typeRegister"
                        label="Partner Type"
                      >
                        <Select
                          size="large"
                          showSearch
                          placeholder="-- Select Partner Type --"
                          className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                          onChange={(value) =>
                            setPartner({
                              ...partner,
                              typeRegister: value,
                            })
                          }
                        >
                          <Option value="Business Partner">
                            Business Partner
                          </Option>
                          <Option value="Service Partner">
                            Service Partner
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="ticketingMode"
                        label="Ticketing Mode"
                      >
                        <Select
                          size="large"
                          showSearch
                          placeholder="-- Select Ticketing Mode --"
                          className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                          onChange={(value) =>
                            setPartner({
                              ...partner,
                              ticketingMode: value,
                            })
                          }
                        >
                          <Option value="auto">Auto</Option>
                          <Option value="manual">Manual</Option>
                        </Select>
                      </Form.Item>
                      <p>
                        <small>
                          Auto: Ticket akan langsung dikirim ke engineer
                        </small>
                      </p>
                      <p>
                        <small>
                          Manual: Ticket akan masuk ke dispatcher dan akan
                          diassign ke Service Partner untuk dapat diteruskan ke
                          engineer
                        </small>
                      </p>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="companyPhoto"
                        label="Partner Image"
                      >
                        <Upload
                          name="companyPhoto"
                          listType="picture-card"
                          className="avatar-uploader"
                          accept="png, jpg, jpeg, gif, webp"
                          showUploadList={false}
                          action={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/upload/partner-image`}
                          headers={{
                            Authorization: `Bearer ${token}`,
                          }}
                          beforeUpload={beforeUpload}
                          onChange={handleChange}
                        >
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt="avatar"
                              style={{
                                width: "100%",
                              }}
                            />
                          ) : (
                            uploadButton
                          )}
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                        <h1 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                          Owner Data
                        </h1>
                      </div>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="ownerFullName"
                        label="Owner Name"
                        rules={[
                          {
                            required: true,
                            message: "Owner Name is required!",
                          },
                        ]}
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Owner Name"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              ownerFullName: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    {/* <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="ownerNIK"
                        label="National ID (NIK)"
                        rules={[
                          {
                            required: true,
                            message: "National ID is required!",
                          },
                          { type: "number" },
                        ]}
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="National ID"
                          type="number"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              ownerNIK: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col> */}
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="ownerPhone"
                        label="Owner Phone"
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Phone"
                          type="number"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              ownerPhone: e.target.value.replace("0", "62"),
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="ownerEmail"
                        label="Owner Email"
                        rules={[
                          {
                            required: true,

                            message: "Owner Email is required!",
                          },
                          { type: "email" },
                        ]}
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Owner Email"
                          type="email"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              ownerEmail: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={16} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="ownerAddress"
                        label="Owner Address"
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Owner Address"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              ownerAddress: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                        <h1 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                          PIC Data
                        </h1>
                      </div>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="fullName"
                        label="Full Name"
                        rules={[
                          {
                            required: true,
                            message: "Full Name is required!",
                          },
                        ]}
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Full Name"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              fullName: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="phone"
                        label="Phone"
                        rules={[
                          {
                            required: true,
                            message: "Phone is required!",
                          },
                        ]}
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Phone"
                          type="number"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              phone: e.target.value.replace("0", "62"),
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="email"
                        label="Email"
                        rules={[
                          {
                            required: true,
                            message: "Email is required!",
                          },
                          { type: "email" },
                        ]}
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Email"
                          type="email"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              email: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="password"
                        label="Password"
                        rules={[
                          {
                            required: true,
                            message: "Password is required!",
                          },
                        ]}
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Password"
                          type="password"
                          onChange={(e) =>
                            setPartner({
                              ...partner,
                              password: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  {/* {JSON.stringify(partner)} */}
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
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AddPartner;
