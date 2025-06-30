import { Button, Form, Input, Modal } from "antd";
import logo from "../../assets/svgs/Purple-Athletic-logo-text.svg";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userSignUp } from "actions/auth.action";
import { AuthStore } from "stores/auth.store";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = AuthStore();
  const [isError, setIsError] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const value = await form.validateFields();
      const { status, data } = await userSignUp(value.email);

      if (status >= 200 && status < 300 && data) {
        handleShowEmailSentModal();
      }
    } catch (error: any) {
      console.error("error handleSubmit", error);
      const errorMessage = error?.response?.data?.message;

      if (errorMessage?.includes("already exists")) {
        handleShowEmailTakenModal();
      } else if (errorMessage?.includes("Too many verification attempts")) {
        handleShowRateLimitModal();
      } else if (errorMessage?.includes("Please wait")) {
        handleShowCooldownModal(errorMessage);
      } else {
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowEmailTakenModal = () => {
    Modal.error({
      title: "Email already in use",
      content: "Please use a different email address",
      centered: true,
      okText: "Ok",
      okButtonProps: {
        type: "primary",
        className:
          "bg-nyu-purple-light hover:!bg-white hover:!text-nyu-purple-light transition-colors",
      },
    });
  };

  const handleShowEmailSentModal = () => {
    const modal = Modal.success({
      title: "Verification Email Sent!",
      content:
        "A verification link has been sent to your email. Please check your inbox and click the link to continue.",
      centered: true,
      okText: "Back to login",
      okButtonProps: {
        type: "primary",
        block: true,
        className:
          "bg-nyu-purple-light hover:!bg-white hover:!text-nyu-purple-light transition-colors",
        onClick: () => {
          modal.destroy();
          navigate("/login");
        },
      },
    });
  };

  const handleShowRateLimitModal = () => {
    Modal.error({
      title: "Too Many Attempts",
      content:
        "You've reached the maximum number of verification attempts. Please try again in an hour.",
      centered: true,
      okText: "Ok",
      okButtonProps: {
        type: "primary",
        className:
          "bg-nyu-purple-light hover:!bg-white hover:!text-nyu-purple-light transition-colors",
      },
    });
  };

  const handleShowCooldownModal = (message: string) => {
    Modal.error({
      title: "Please Wait",
      content: message,
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
          <div className="font-nyu-perstare-condensed pl-1 mb-2">Sign up</div>
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
                  className="h-9 w-44 bg-nyu-purple-light text-white enabled:hover:!bg-white enabled:hover:!text-nyu-purple-light enabled:transition-colors enabled:!border-nyu-purple-light"
                >
                  Register
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
