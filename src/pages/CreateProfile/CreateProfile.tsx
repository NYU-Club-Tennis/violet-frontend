import { Button, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { purpleAthleticLogoText as logo } from "assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthStore } from "stores/auth.store";
import { createProfile, validateCode } from "actions/auth.action";
import {
  IAuthCreateProfileRequest,
  IAuthValidateCodeResponse,
} from "interfaces/auth.interface";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";

const CreateProfile = () => {
  const [email, setEmail] = useState<string>("");
  const [searchParams] = useSearchParams();
  const resetCode = searchParams.get("resetCode");
  const { setUser, setToken, setRefreshToken, user } = AuthStore();
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await validateCode(resetCode!);

      console.log("response", response);

      const { email } = response.data;

      console.log("email", email);

      setEmail(email);
      form.setFieldValue("email", email);
    } catch (error) {
      console.error("Error validating code:", error);
      navigate("/");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);

      const { firstName, lastName, phoneNumber, password } = values;

      const payload: IAuthCreateProfileRequest = {
        firstName,
        email,
        lastName,
        phoneNumber,
        password,
      };

      const { data } = await createProfile(payload);

      if (data) {
        setUser(data.user);
        setToken(data.token);
        setRefreshToken(data.refreshToken);

        // Add a small delay to ensure store is updated
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      navigate("/");
    } catch (error) {
      console.error("Error creating profile:", error);
      handleShowEmailTakenModal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowEmailTakenModal = () => {
    Modal.error({
      title: "Something went wrong",
      content: "Please try again.",
      centered: true,
      okText: "Close",
      okButtonProps: {
        type: "primary",
        className:
          "bg-nyu-purple-light hover:!bg-white hover:!text-nyu-purple-light transition-colors",
      },
    });
  };

  return (
    <div className="bg-nyu-purple-light w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-[600px] h-[600px] bg-white flex flex-col items-center py-8 px-28 shadow-2xl overflow-hidden">
        <img src={logo} alt="logo" className="w-24 h-auto mb-8" />
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          requiredMark={false}
          className="w-full flex flex-col"
        >
          <div className="flex gap-4">
            <Form.Item
              name="firstName"
              label={
                <span className="font-nyu-perstare-condensed">First Name</span>
              }
              rules={[{ required: true, message: "First name is required" }]}
              className="flex-1 mb-0"
            >
              <Input className="font-nyu-perstare-condensed" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label={
                <span className="font-nyu-perstare-condensed">Last Name</span>
              }
              rules={[{ required: true, message: "Last name is required" }]}
              className="flex-1 mb-0"
            >
              <Input className="font-nyu-perstare-condensed" />
            </Form.Item>
          </div>

          <Form.Item
            name="phoneNumber"
            label={
              <span className="font-nyu-perstare-condensed">Phone Number</span>
            }
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input className="font-nyu-perstare-condensed" />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span className="font-nyu-perstare-condensed">Set Password</span>
            }
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password
              className="font-nyu-perstare-condensed"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={
              <span className="font-nyu-perstare-condensed">
                Confirm Password
              </span>
            }
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              className="font-nyu-perstare-condensed"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-4">
            <Form.Item shouldUpdate className="mb-0">
              {() => (
                <Button
                  htmlType="submit"
                  loading={isLoading}
                  disabled={
                    !form.isFieldsTouched(
                      [
                        "firstName",
                        "lastName",
                        "phoneNumber",
                        "password",
                        "confirmPassword",
                      ],
                      true
                    ) ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length
                  }
                  className="h-9 w-44 bg-nyu-purple-light text-white mx-auto block disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Register
                </Button>
              )}
            </Form.Item>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateProfile;
