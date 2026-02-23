import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Row, Col } from "antd";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useAuth } from "./AuthContext";
import { logInAction } from "@/redux/authentication/actionCreator";
import { CheckBox } from "@/components/checkbox";

function SignIn() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (typeof window !== "undefined") {
    (window as any).dropIndex = async (key: string): Promise<void> => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/submission/drop-index/${key}`,
          { method: "POST" },
        );

        const text = await res.text();

        let data: any;
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }

        if (!res.ok) {
          console.error("Error dropping index:", data.message || data);
          return;
        }

        console.log("Drop index result:", data);
      } catch (error) {
        console.error("Error dropping index:", error);
      }
    };
  }

  const dispatch = useDispatch();

  const router = useRouter();
  const { user } = useUser();
  const { currentUser } = useAuth();

  let token = Cookies.get("access_token");
  let loggedInPartner = Cookies.get("loggedIn");
  if (
    token != undefined &&
    token.length > 20 &&
    loggedInPartner != undefined &&
    loggedInPartner == "true"
  ) {
    router.push("/admin");
    // @ts-ignore
    dispatch(logInAction(() => router.push("/admin")));
  }

  const { login } = useAuth();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const loginAct = await login(data.email, data.password);
      Cookies.set("access_token", loginAct.data.access_token);
      Cookies.set("loggedIn", true.toString());
      setError("");
      setLoading(true);
      // @ts-ignore
      dispatch(logInAction(() => router.push("/admin")));
      console.log("Succesfully Logged In!", loginAct.data.access_token);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Failed to Login!");
    }
  };

  const [form] = Form.useForm();
  const [state, setState] = useState({
    checked: false,
  });

  const checkboxChange = (checked: boolean) => {
    setState({ ...state, checked });
  };

  useEffect(() => {
    // Use Initial Email & Password
    let email = document.querySelector('input[type="email"]');
    let emailValue = (email as HTMLInputElement).value;
    let password = document.querySelector('input[type="password"]');
    let passwordValue = (password as HTMLInputElement).value;

    setData({
      email: emailValue,
      password: passwordValue,
    });
  }, []);

  return (
    <Row justify="center">
      <Col xxl={6} xl={8} md={12} sm={18} xs={24}>
        <div className="mt-6 bg-white rounded-md dark:bg-white/10 shadow-regular dark:shadow-none">
          <div className="px-5 py-4 text-center border-b border-gray-200 dark:border-white/10">
            <h2 className="mb-0 text-xl font-semibold text-dark dark:text-white/[.87]">
              Sign in Service Hub
            </h2>
          </div>
          <div className="px-10 pt-8 pb-6">
            <Form
              name="login"
              form={form}
              onFinish={handleLogin}
              layout="vertical"
            >
              <Form.Item
                name="email"
                rules={[
                  { message: "Please input your Email!", required: true },
                ]}
                initialValue=""
                label="Email Address"
                className="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white/60 [&>div>div>label]:font-medium"
              >
                <Input
                  type="email"
                  value={data.email}
                  placeholder=""
                  className="h-12 p-3 hover:border-primary focus:border-primary rounded-4"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setData({
                      ...data,
                      email: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                name="password"
                initialValue=""
                label="Password"
                className="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white/60 [&>div>div>label]:font-medium"
              >
                <Input.Password
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setData({
                      ...data,
                      password: e.target.value,
                    })
                  }
                  value={data.password}
                  type="password"
                  placeholder="Password"
                  className="h-12 p-3 hover:border-primary focus:border-primary rounded-4"
                />
              </Form.Item>
              <div className="flex flex-wrap items-center justify-between gap-[10px]">
                <CheckBox
                  onChange={checkboxChange}
                  checked={state.checked}
                  className="text-xs text-light dark:text-white/60"
                >
                  Keep me logged in
                </CheckBox>
                {/* <Link className=" text-primary text-13" href="/forgotPassword">
                  Forgot password?
                </Link> */}
              </div>
              <Form.Item>
                <Button
                  className="w-full bg-primary h-12 p-0 my-6 text-sm font-medium"
                  htmlType="submit"
                  type="primary"
                  size="large"
                >
                  {loading ? "Signing in please wait..." : "Sign In"}
                </Button>
              </Form.Item>
              {error && (
                <p className="text-danger mb-10 text-center text-base">
                  {error}
                </p>
              )}
            </Form>
          </div>
          {/* <div className="p-6 text-center bg-gray-100 dark:bg-white/10 rounded-b-md">
            <p className="mb-0 text-sm font-medium text-body dark:text-white/60">
              Don`t have an account?
              <Link
                href="https://servicehub.id/signup"
                className="ltr:ml-1.5 rtl:mr-1.5 text-info hover:text-primary"
              >
                Sign up
              </Link>
            </p>
          </div> */}
        </div>
      </Col>
    </Row>
  );
}

export default SignIn;
