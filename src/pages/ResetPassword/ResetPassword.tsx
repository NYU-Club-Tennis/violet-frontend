import { Button, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { purpleAthleticLogoText as logo } from "assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validateCode, resetPassword } from "actions/auth.action";
import { IAuthValidateCodeResponse } from "interfaces/auth.interface";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const ResetPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [searchParams] = useSearchParams();
  const resetCode = searchParams.get("resetCode");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (!resetCode) {
      navigate("/");
    } else {
      handleCheckCode();
    }
  }, [searchParams, navigate]);

  const handleCheckCode = async () => {
    try {
      setIsValidating(true);
      const response = await validateCode(resetCode!);

      const { email } = response.data;

      setEmail(email);
      setToken(resetCode!);
      form.setFieldValue("email", email);
    } catch (error) {
      console.error("Error validating code:", error);
      navigate("/");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);

      await handleCheckCode();

      const { password } = values;

      const { data } = await resetPassword(email, password, token);

      if (data?.success) {
        handleShowSuccessModal();
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      const errorMessage = error?.response?.data?.message;

      if (errorMessage?.includes("Invalid or expired")) {
        handleShowInvalidTokenModal();
      } else if (errorMessage?.includes("not found")) {
        handleShowUserNotFoundModal();
      } else {
        handleShowGenericErrorModal();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowInvalidTokenModal = () => {
    Modal.error({
      title: "Invalid or Expired Link",
      content:
        "This password reset link is invalid or has expired. Please request a new password reset link.",
      centered: true,
      okText: "Go to Forgot Password",
      okButtonProps: {
        type: "primary",
        className:
          "bg-nyu-purple-light hover:!bg-white hover:!text-nyu-purple-light transition-colors",
        onClick: () => {
          navigate("/forgot-password");
        },
      },
    });
  };

  const handleShowUserNotFoundModal = () => {
    Modal.error({
      title: "User Not Found",
      content:
        "No account found with this email address. Please check your email and try again.",
      centered: true,
      okText: "Go to Login",
      okButtonProps: {
        type: "primary",
        className:
          "bg-nyu-purple-light hover:!bg-white hover:!text-nyu-purple-light transition-colors",
        onClick: () => {
          navigate("/login");
        },
      },
    });
  };

  const handleShowGenericErrorModal = () => {
    Modal.error({
      title: "Something went wrong",
      content: "Please try again or contact support if the problem persists.",
      centered: true,
      okText: "Try Again",
      okButtonProps: {
        type: "primary",
        className:
          "bg-nyu-purple-light hover:!bg-white hover:!text-nyu-purple-light transition-colors",
      },
    });
  };

  const handleShowSuccessModal = () => {
    const modal = Modal.success({
      title: "Password Reset Successful!",
      content:
        "Your password has been successfully reset. You can now log in with your new password.",
      centered: true,
      okText: "Go to Login",
      okButtonProps: {
        type: "primary",
        className:
          "bg-nyu-purple-light hover:!bg-white hover:!text-nyu-purple-light transition-colors",
        onClick: () => {
          modal.destroy();
          navigate("/login");
        },
      },
    });
  };

  if (isValidating) {
    return (
      <div className="bg-nyu-purple-light w-screen h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white flex flex-col items-center py-8 sm:py-12 gap-6 sm:gap-9 px-6 sm:px-8 shadow-2xl rounded-lg">
          <img src={logo} alt="logo" className="w-20 sm:w-24 h-auto" />
          <div className="text-center">
            <div className="font-nyu-perstare-condensed text-lg sm:text-xl mb-2">
              Verifying Reset Link
            </div>
            <p className="text-gray-600 text-sm">
              Please wait while we verify your password reset link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-nyu-purple-light w-screen h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white flex flex-col items-center py-8 sm:py-12 gap-6 sm:gap-9 px-6 sm:px-8 shadow-2xl rounded-lg">
        <img src={logo} alt="logo" className="w-20 sm:w-24 h-auto" />
        <div className="w-full flex flex-col gap-1">
          <div className="font-nyu-perstare-condensed pl-1 mb-2 text-lg sm:text-xl">
            Reset Password
          </div>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed pl-1">
            Enter your new password below to complete the password reset
            process.
          </p>
          <Form
            form={form}
            requiredMark={false}
            className="w-full flex flex-col items-center gap-6 sm:gap-9"
            onFinish={handleSubmit}
          >
            <Form.Item name="email" className="w-full">
              <Input
                placeholder="Email"
                value={email}
                disabled
                className="font-nyu-perstare-condensed h-10 sm:h-9 bg-gray-100"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="password"
              required
              rules={[
                { required: true, message: "Password is required" },
                { min: 8, message: "Password must be at least 8 characters" },
                {
                  validator(_, value) {
                    if (
                      !value ||
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                    );
                  },
                },
              ]}
              className="w-full"
            >
              <Input.Password
                placeholder="New Password"
                className="font-nyu-perstare-condensed h-10 sm:h-9"
                size="large"
                iconRender={(visible) =>
                  visible ? (
                    <EyeOutlined className="text-gray-400" />
                  ) : (
                    <EyeInvisibleOutlined className="text-gray-400" />
                  )
                }
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              required
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Passwords do not match");
                  },
                }),
              ]}
              className="w-full"
            >
              <Input.Password
                placeholder="Confirm New Password"
                className="font-nyu-perstare-condensed h-10 sm:h-9"
                size="large"
                iconRender={(visible) =>
                  visible ? (
                    <EyeOutlined className="text-gray-400" />
                  ) : (
                    <EyeInvisibleOutlined className="text-gray-400" />
                  )
                }
              />
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  htmlType="submit"
                  color="purple"
                  loading={isLoading}
                  disabled={
                    !form.isFieldTouched("password") ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length
                  }
                  className="h-10 sm:h-9 w-full sm:w-44 bg-nyu-purple-light text-white enabled:hover:!bg-white enabled:hover:!text-nyu-purple-light enabled:transition-colors enabled:!border-nyu-purple-light"
                  size="large"
                >
                  Reset Password
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

export default ResetPassword;
