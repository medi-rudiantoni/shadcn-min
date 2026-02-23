import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, Bounce } from "react-toastify";
import { Col, Row, Form, Input, Button, Select } from "antd";
import { useRouter } from "next/router";
import { UilSave } from "@iconscout/react-unicons";
import { PageHeaders } from "@/components/page-headers";
import { getCategories } from "@/functions/category";
import { createSubCategory } from "@/functions/subcategory";
const { Option } = Select;

function AddSubcategory() {
  const [categories, setCategories] = useState<any>([]);
  const [subcategory, setSubcategory] = useState<any>({});
  const [submit, setSubmit] = useState(false);
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
    createSubCategory(subcategory, token).then((res: any) => {
      if (res.data.success) {
        router.push("/admin/subcategories");
        toast.success("Subcategory created successfully!", {
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
    });
  };

  const validateMessages = {
    types: {
      string: "Please enter a valid ${label}!",
    },
    required: "This field is required.",
  };
  const PageRoutes = [
    {
      path: "/admin",
      breadcrumbName: "Dashboard",
    },
    {
      path: "/admin/users/subcategory/add",
      breadcrumbName: "Add Subcategory",
    },
  ];
  const [form] = Form.useForm();
  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Add Subcategory"
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
                  initialValues={subcategory}
                >
                  <Row gutter={30}>
                    <Col xs={24}>
                      <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                        <h1 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                          Subcategory Data
                        </h1>
                      </div>
                    </Col>
                    <Col md={8} xs={24}>
                      <Form.Item
                        className="mb-[20px]"
                        name="name"
                        label="Subcategory Name"
                        rules={[
                          {
                            required: true,
                            message: "Subcategory  Name is required!",
                          },
                        ]}
                      >
                        <Input
                          className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                          placeholder="Subcategory Name"
                          onChange={(e) =>
                            setSubcategory({
                              ...subcategory,
                              name: e.target.value,
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
                            setSubcategory({
                              ...subcategory,
                              parent: value,
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

export default AddSubcategory;
