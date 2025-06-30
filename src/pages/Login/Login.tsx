import { Button, Form, Input } from "antd";
import logo from "../../assets/svgs/Purple-Athletic-logo-text.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = () => {};

  return (
    <div className="bg-nyu-purple-light w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-[600px] h-[600px] bg-white flex flex-col items-center py-20 gap-9 px-28 shadow-2xl">
        <img src={logo} alt="logo" className="w-24 h-auto" />
        <div className="w-full flex flex-col gap-1">
          <div className="font-nyu-perstare-condensed pl-1 mb-2">Email</div>
          <Form
            form={form}
            requiredMark={false}
            onFieldsChange={() => setIsError(false)}
            className="w-full flex flex-col items-center gap-9"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="email"
              required
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
