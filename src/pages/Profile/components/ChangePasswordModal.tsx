import React, { FC } from "react";
import { Modal, Form, Input, Button, Space } from "antd";

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  visible: boolean;
  loading: boolean;
  form: any;
  onCancel: () => void;
  onSubmit: (values: ChangePasswordFormData) => void;
}

const ChangePasswordModal: FC<ChangePasswordModalProps> = ({
  visible,
  loading,
  form,
  onCancel,
  onSubmit,
}) => {
  return (
    <Modal
      title="Change Password"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[{ required: true, message: "Current password is required" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: "New password is required" },
            { min: 8, message: "Password must be at least 8 characters" },
            {
              validator(_, value) {
                if (!value || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                );
              },
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item className="mb-0">
          <Space className="w-full justify-end">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Change Password
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
