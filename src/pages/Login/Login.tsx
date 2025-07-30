import { Button, Form, Input, Modal } from "antd";
import { purpleAthleticLogoText as logo } from "assets";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthStore } from "stores/auth.store";
import { IAuthLoginRequest } from "interfaces/auth.interface";
import { login } from "actions/auth.action";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser, setToken, setRefreshToken } = AuthStore();
  const [isError, setIsError] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const { email, password } = values;

      const payload: IAuthLoginRequest = {
        email,
        password,
      };

      const { data } = await login(payload);
      if (data) {
        setUser(data.user);
        setToken(data.token);
        setRefreshToken(data.refreshToken);

        // Add a small delay to ensure store is updated
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      navigate("/");
      console.log(data);
    } catch (error) {
      console.error("Error logging in:", error);

      handleShowInvalidCredentialsModal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowInvalidCredentialsModal = () => {
    Modal.error({
      title: "Invalid credentials",
      content: "Your email, password, or both are incorrect",
      centered: true,
      okText: "Ok",
      okButtonProps: {
        type: "primary",
        className:
          "bg-nyu-purple-light hover:!bg-white hover:!text-nyu-purple-light transition-colors",
      },
    });
  };

  return (
    <div className="bg-nyu-purple-light w-screen h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white flex flex-col items-center py-8 sm:py-12 gap-6 sm:gap-9 px-6 sm:px-8 shadow-2xl rounded-lg">
        <img src={logo} alt="logo" className="w-20 sm:w-24 h-auto" />
        <div className="w-full flex flex-col gap-1">
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFieldsChange={() => setIsError(false)}
            className="w-full flex flex-col items-center gap-4 sm:gap-6"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="email"
              required
              label={
                <span className="font-nyu-perstare-condensed text-sm sm:text-base">
                  Email
                </span>
              }
              rules={[
                { required: true, message: "" },
                {
                  validator: (_, value) => {
                    if (!value || value.toLowerCase().endsWith("@nyu.edu")) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "Please use your NYU email address (@nyu.edu)"
                    );
                  },
                },
              ]}
              validateTrigger="onChange"
              validateStatus={isError ? "error" : ""}
              className="w-full"
            >
              <Input size="large" className="h-10 sm:h-9" />
            </Form.Item>

            <Form.Item
              name="password"
              required
              label={
                <span className="font-nyu-perstare-condensed text-sm sm:text-base">
                  Password
                </span>
              }
              rules={[{ required: true, message: "" }]}
              validateTrigger="onChange"
              validateStatus={isError ? "error" : ""}
              className="w-full"
            >
              <Input.Password size="large" className="h-10 sm:h-9" />
            </Form.Item>

            <div className="w-full flex justify-end">
              <Button
                type="link"
                onClick={() => navigate("/forgot-password")}
                className="text-nyu-purple-light hover:!text-nyu-purple-light/80 p-0 h-auto text-sm font-nyu-perstare-condensed"
              >
                Forgot Password?
              </Button>
            </div>

            <Form.Item shouldUpdate>
              {() => (
                <Button
                  htmlType="submit"
                  color="purple"
                  loading={isLoading}
                  disabled={
                    !form.isFieldTouched("email") ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length
                  }
                  className="h-10 sm:h-9 w-full sm:w-44 bg-nyu-purple-light text-white"
                  size="large"
                >
                  Log in
                </Button>
              )}
            </Form.Item>
            <Button
              color="purple"
              onClick={() => navigate("/signup")}
              className="h-10 sm:h-9 w-full sm:w-44 text-nyu-purple-light border-0 shadow-none"
              size="large"
            >
              Sign Up
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
