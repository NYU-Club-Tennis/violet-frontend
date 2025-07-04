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
    <div className="bg-nyu-purple-light w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-[600px] h-[600px] bg-white flex flex-col items-center py-20 gap-9 px-28 shadow-2xl">
        <img src={logo} alt="logo" className="w-24 h-auto" />
        <div className="w-full flex flex-col gap-1">
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFieldsChange={() => setIsError(false)}
            className="w-full flex flex-col items-center gap-1"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="email"
              required
              label={<span className="font-nyu-perstare-condensed">Email</span>}
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
              <Input
                placeholder="Your NYU Email"
                className="font-nyu-perstare-condensed"
              />
            </Form.Item>

            <Form.Item
              name="password"
              required
              label={
                <span className="font-nyu-perstare-condensed">Password</span>
              }
              rules={[{ required: true, message: "" }]}
              validateTrigger="onChange"
              validateStatus={isError ? "error" : ""}
              className="w-full"
            >
              <Input
                placeholder="Your Password"
                className="font-nyu-perstare-condensed"
              />
            </Form.Item>

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
                  className="h-9 w-44 bg-nyu-purple-light text-white"
                >
                  Log in
                </Button>
              )}
            </Form.Item>
            <Button
              color="purple"
              onClick={() => navigate("/signup")}
              className="h-9 w-44 text-nyu-purple-light border-0 shadow-none"
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
