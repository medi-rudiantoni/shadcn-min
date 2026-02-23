import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, Bounce } from "react-toastify";
import { Col, Row, Form, Input, Button, Select, Skeleton } from "antd";
import { useRouter } from "next/router";
import { UilSave } from "@iconscout/react-unicons";
import { PageHeaders } from "@/components/page-headers";
import { createAdmin } from "@/functions/admin";

const { Option } = Select;

function AddAdmin() {
  const [admin, setAdmin] = useState<any>({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInvalidOldPassword, setInvalidOldPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState("");
  const [form] = Form.useForm();

  const token = Cookies.get("access_token");
  const router = useRouter();

  const onSubmit = async () => {
    const values = await form.validateFields();

    if (password && !confirmPassword) {
      toast.error("Confirm Password is required when adding new admin.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    setSubmit(true);

    const payload = {
      username: values.username,
      email: values.email,
      role: values.role,
      status: values.status,
      password: password,
    };

    const res = await createAdmin(payload, token)
      .then(() => {
        toast.success("Admin updated successfully!", {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
          transition: Bounce,
        });
        router.push("/admin/users/admin");
      })
      .catch((error) => {
        console.error("Failed to update admin data: ", error);
        toast.error(
          error.response.data.message || "Failed to update admin data",
        );
        error.response.data.message &&
          error.response.data.message === "Invalid Current Password" &&
          setInvalidOldPassword(true);
      })
      .finally(() => {
        setSubmit(false);
      });
  };
  useEffect(() => {
    verifyPassword();
  }, [password, confirmPassword]);
  const verifyPassword = () => {
    console.log("NEW  PASS", password, "VERIF PASS", confirmPassword);
    if (password != "" && confirmPassword != "") {
      if (password === confirmPassword) {
        setErrorPassword("");
      } else {
        setErrorPassword("Confirm password didn't match!");
      }
    }
  };

  const PageRoutes = [
    { path: "/admin", breadcrumbName: "Dashboard" },
    { path: "/admin/users/admin", breadcrumbName: "Admin" },
    { path: "#", breadcrumbName: "Edit Admin" },
  ];

  const validateMessages = {
    required: "This field is required",
    types: {
      email: "Please enter a valid email!",
    },
  };

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Edit Admin"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <div className="bg-white dark:bg-white/10 m-0 p-0 text-theme-gray dark:text-white/60 text-[15px] rounded-10 relative mb-[25px]">
          <div className="min-h-[580px] px-8 xl:px-[15px] pb-[30px] p-[25px]">
            {loading ? (
              <Skeleton active />
            ) : (
              <Form
                layout="vertical"
                form={form}
                onFinish={onSubmit}
                validateMessages={validateMessages}
                initialValues={admin}
              >
                <Row gutter={30}>
                  <Col md={8} xs={24}>
                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[{ required: true }]}
                    >
                      <Input
                        placeholder="Username"
                        onChange={(e) =>
                          setAdmin({ ...admin, username: e.target.value })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col md={8} xs={24}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[{ required: true }, { type: "email" }]}
                    >
                      <Input
                        placeholder="Email"
                        onChange={(e) =>
                          setAdmin({ ...admin, email: e.target.value })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col md={8} xs={24}>
                    <Form.Item
                      name="role"
                      label="Role"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Select Role"
                        onChange={(value) =>
                          setAdmin({ ...admin, role: value })
                        }
                      >
                        <Option value="admin">Admin</Option>
                        <Option value="superadmin">Superadmin</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={8} xs={24}>
                    <Form.Item
                      name="status"
                      label="Status"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Select Status"
                        onChange={(value) =>
                          setAdmin({ ...admin, status: value })
                        }
                      >
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={8} xs={24}>
                    <Form.Item name="password" label="New Password">
                      <Input
                        type="password"
                        placeholder="New Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={8} xs={24}>
                    <Form.Item name="confirmPassword" label="Confirm Password">
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e) => {
                          setErrorPassword("");
                          setConfirmPassword(e.target.value);
                        }}
                      />

                      <small className="text-red-600">
                        {errorPassword != "" && errorPassword}
                      </small>
                    </Form.Item>
                  </Col>
                </Row>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submit}
                  icon={<UilSave />}
                  className="mt-[20px] bg-primary text-white px-[30px] h-[44px] rounded-[4px]"
                >
                  Save Data
                </Button>
              </Form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AddAdmin;
