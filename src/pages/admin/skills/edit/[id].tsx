import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, Bounce } from "react-toastify";
import { Col, Row, Form, Input, Button, Select, Skeleton } from "antd";
import { useRouter } from "next/router";
import { UilSave } from "@iconscout/react-unicons";
import { PageHeaders } from "@/components/page-headers";
import { getSkill, updateSkill } from "@/functions/skill";

function EditSkill() {
  const [skill, setSkill] = useState<any>({});
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("access_token");
  const router = useRouter();
  let { id } = router.query;
  useEffect(() => {
    if (id) {
      getSkill(id, token).then((res) => {
        setSkill(res.data);
        setLoading(false);
      });
    }
  }, [id]);
  const onSubmit = () => {
    setSubmit(true);
    updateSkill(id, skill, token).then((res: any) => {
      if (res.data.success) {
        router.push("/admin/skills");
        toast.success("Skill updated successfully!", {
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
      path: "/admin/users/skill/add",
      breadcrumbName: "Edit Skill",
    },
  ];
  const [form] = Form.useForm();
  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Edit Skill"
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
                    initialValues={skill}
                  >
                    <Row gutter={30}>
                      <Col xs={24}>
                        <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                          <h1 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                            Skill Data
                          </h1>
                        </div>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="name"
                          label="Skill Name"
                        >
                          <Input
                            className="h-12 p-3 rounded-6 dark:placeholder-white/60"
                            placeholder="Skill Name"
                            onChange={(e) =>
                              setSkill({
                                ...skill,
                                name: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col md={8} xs={24}>
                        <Form.Item
                          className="mb-[20px]"
                          name="status"
                          label="Status"
                        >
                          <Select
                            showSearch
                            size="large"
                            placeholder={"-- Select Status --"}
                            optionFilterProp="label"
                            className="[&>div]:px-[20px] [&>div]:bg-white dark:[&>div]:bg-white/10 [&>div]:h-[50px] [&>div]:border-normal dark:[&>div]:border-white/10 [&>div]:leading-[48px] [&>div]:rounded-6 [&>div>.ant-select-selection-item]:leading-[48px]"
                            onChange={(value) =>
                              setSkill({
                                ...skill,
                                status: value,
                              })
                            }
                            options={[
                              {
                                label: "Active",
                                value: "active",
                              },
                              {
                                label: "Inactive",
                                value: "inactive",
                              },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    {/* {JSON.stringify(skill)} */}
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

export default EditSkill;
