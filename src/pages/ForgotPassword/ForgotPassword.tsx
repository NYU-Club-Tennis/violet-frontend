import { Button, Form, Input, Modal } from "antd";
import { purpleAthleticLogoText as logo } from "assets";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "actions/auth.action";
import { userExists } from "actions/user.action";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const value = await form.validateFields();

      // 1) Check if the email exists
      const existsResp = await userExists(value.email);
      if (!existsResp?.data?.exists) {
        handleShowEmailNotFoundModal();
        return;
      }

      // 2) Proceed with forgot password
      const { status, data } = await forgotPassword(value.email);

      if (status >= 200 && status < 300 && data) {
        handleShowEmailSentModal();
      }
    } catch (error: any) {
      console.error("error handleSubmit", error);
      const errorMessage = error?.response?.data?.message;

      if (errorMessage?.includes("not found")) {
        handleShowEmailNotFoundModal();
      } else if (errorMessage?.includes("Too many attempts")) {
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

  const handleShowEmailNotFoundModal = () => {
    Modal.error({
      title: "Email not found",
      content:
        "No account found with this email address. Please check your email and try again.",
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
      title: "Password Reset Email Sent!",
      content:
        "A password reset link has been sent to your email. Please check your inbox and click the link to reset your password.",
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
        "You've reached the maximum number of password reset attempts. Please try again in an hour.",
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
    <div className="bg-nyu-purple-light w-screen h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white flex flex-col items-center py-8 sm:py-12 gap-6 sm:gap-9 px-6 sm:px-8 shadow-2xl rounded-lg">
        <img src={logo} alt="logo" className="w-20 sm:w-24 h-auto" />
        <div className="w-full flex flex-col gap-1">
          <div className="font-nyu-perstare-condensed pl-1 mb-2 text-lg sm:text-xl">
            Forgot Password
          </div>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed pl-1">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <Form
            form={form}
            requiredMark={false}
            onFieldsChange={() => setIsError(false)}
            className="w-full flex flex-col items-center gap-6 sm:gap-9"
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
                className="font-nyu-perstare-condensed h-10 sm:h-9"
                size="large"
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
                  className="h-10 sm:h-9 w-full sm:w-44 bg-nyu-purple-light text-white enabled:hover:!bg-white enabled:hover:!text-nyu-purple-light enabled:transition-colors enabled:!border-nyu-purple-light"
                  size="large"
                >
                  Send Reset Link
                </Button>
              )}
            </Form.Item>
            <Button
              color="purple"
              onClick={() => navigate("/login")}
              className="h-10 sm:h-9 w-full sm:w-44 text-nyu-purple-light border-0 shadow-none"
              size="large"
            >
              Back to Login
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
