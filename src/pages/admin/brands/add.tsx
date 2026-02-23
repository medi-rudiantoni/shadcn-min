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
import { PageHeaders } from "@/components/page-headers";
import { createBrand, getBrand, updateBrand } from "@/functions/brand";
import { getCategories } from "@/functions/category";
const { TextArea } = Input;
const { Option } = Select;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

function AddBrand() {
  const [brand, setBrand] = useState<any>({});
  const [submit, setSubmit] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [categories, setCategories] = useState<any>([]);
  const token = Cookies.get("access_token");
  const router = useRouter();
  useEffect(() => {
    getCategories().then((res) => {
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    });
  }, []);

  const onSubmit = () => {
    setSubmit(true);
    createBrand(brand, token).then((res: any) => {
      if (res.data.success) {
        toast.success("Brand created successfully!", {
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
        router.push("/admin/brands");
      }
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
        setBrand({ ...brand, brandLogo: info.file.response.image });
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
      path: "/admin/users/brand/add",
      breadcrumbName: "Add Brand",
    },
  ];
  const [form] = Form.useForm();
  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Add Brand"
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
                  initialValues={brand}
                >
                  <Row gutter={30}>
                    <Col xs={24}>
                      <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                        <h1 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                          Brand Data
                        </h1>
                      </div>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="name"
                        label="Brand Name"
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Brand Name"
                          onChange={(e) =>
                            setBrand({
                              ...brand,
                              name: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="brandId"
                        label="Brand ID"
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Brand ID"
                          onChange={(e) =>
                            setBrand({
                              ...brand,
                              brandId: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="category"
                        label="Category"
                        rules={[
                          {
                            required: true,
                            message: "Category is required!",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          showSearch
                          placeholder="-- Select Category --"
                          className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                          onChange={(value) =>
                            setBrand({
                              ...brand,
                              category: value,
                            })
                          }
                        >
                          {categories &&
                            categories.map((data: any, i: number) => (
                              <Option value={data._id} key={i}>
                                {data.name}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md={16} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="brandDetail"
                        label="Brand Detail"
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Brand Detail"
                          onChange={(e) =>
                            setBrand({
                              ...brand,
                              brandDetail: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="brandLogo"
                        label="Brand Logo"
                      >
                        <Upload
                          name="brandLogo"
                          listType="picture-card"
                          className="avatar-uploader"
                          accept="png, jpg, jpeg, gif, webp"
                          showUploadList={false}
                          action={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/upload/brand-logo`}
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
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AddBrand;
