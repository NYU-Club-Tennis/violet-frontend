import React, { FC } from "react";
import { Modal, Form, Input, Button, Space } from "antd";

export interface EditProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

interface EditProfileModalProps {
  visible: boolean;
  loading: boolean;
  form: any;
  onCancel: () => void;
  onSubmit: (values: EditProfileFormData) => void;
}

const EditProfileModal: FC<EditProfileModalProps> = ({
  visible,
  loading,
  form,
  onCancel,
  onSubmit,
}) => {
  return (
    <Modal
      title="Edit Profile"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "First name is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Last name is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Phone Number">
          <Input placeholder="Optional" />
        </Form.Item>
        <Form.Item className="mb-0">
          <Space className="w-full justify-end">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Changes
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
