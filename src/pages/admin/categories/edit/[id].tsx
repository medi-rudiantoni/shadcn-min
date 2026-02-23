import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, Bounce } from "react-toastify";
import Link from "next/link";
import { Col, Row, Form, Input, Button, Skeleton } from "antd";
import { useRouter } from "next/router";
import { UilSave, UilTimes } from "@iconscout/react-unicons";
import { PageHeaders } from "@/components/page-headers";
import { getCategory, updateCategory } from "@/functions/category";
import MultiSelect from "@/components/multi-select/MultiSelect";

function EditCategory() {
  const token = Cookies.get("access_token");
  const router = useRouter();
  let { id } = router.query;
  const [category, setCategory] = useState<any>({});
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commonProblems, setCommonProblems] = useState<string[]>([]);
  const [replaceableParts, setReplaceableParts] = useState<string[]>([]);

  useEffect(() => {
    getCategory(id, token).then((res) => {
      setCategory(res.data.category);
      setCommonProblems(
        res.data.category?.commonProblems
          ? res.data.category?.commonProblems
          : [],
      );
      setReplaceableParts(
        res.data.category?.replaceableParts
          ? res.data.category?.replaceableParts
          : [],
      );
      setLoading(false);
    });
  }, []);

  const onSubmit = () => {
    setSubmit(true);
    updateCategory(
      id,
      {
        ...category,
        commonProblems: commonProblems,
        replaceableParts: replaceableParts,
      },
      token,
    ).then((res: any) => {
      if (res.data.success) {
        router.push("/admin/categories");
        toast.success("Category updated successfully!", {
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
      path: "/admin/users/category/add",
      breadcrumbName: "Edit Category",
    },
  ];
  const [form] = Form.useForm();
  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Edit Category"
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
                    disabled={submit}
                    layout="vertical"
                    validateMessages={validateMessages}
                    onSubmitCapture={onSubmit}
                    initialValues={category}
                  >
                    <Row gutter={30}>
                      <Col xs={24}>
                        <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                          <h1 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                            Category Data
                          </h1>
                        </div>
                      </Col>
                      <Col md={12} xs={12}>
                        <Form.Item
                          className="mb-[20px]"
                          name="name"
                          label="Category Name"
                        >
                          <Input
                            className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                            placeholder="Category Name"
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                name: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={30}>
                      <Col md={24} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="commonProblems"
                          label="Most Common Problem (ex: Jam Paper, Low Toner etc.)"
                          rules={[
                            {
                              required: true,
                              message: "Most Common Problem is required!",
                            },
                          ]}
                        >
                          <MultiSelect
                            listData={commonProblems}
                            setListData={setCommonProblems}
                          />
                        </Form.Item>
                      </Col>
                      <Col md={24} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="replaceableParts"
                          label="Replaceable Part List"
                          rules={[
                            {
                              required: true,
                              message: "Replaceable Part List is required!",
                            },
                          ]}
                        >
                          <MultiSelect
                            listData={replaceableParts}
                            setListData={setReplaceableParts}
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
                      <Link
                        className="color-light hover:bg-primary-hbr border-solid border-1 border-primary ml-3 dark:text-white/[.87] text-[14px] font-semibold leading-[22px] inline-flex items-center justify-center rounded-[4px] px-[30px] h-[44px]"
                        href="/admin/categories"
                      >
                        <UilTimes /> Cancel
                      </Link>
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

export default EditCategory;
