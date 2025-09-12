import React, { FC } from "react";
import { Modal, Form, Switch, Button, Space } from "antd";
import { IAuthUser } from "interfaces/auth.interface";

export interface EmailPreferencesFormData {
  sessionNotifications: boolean;
  clubAnnouncements: boolean;
}

interface EmailPreferencesModalProps {
  visible: boolean;
  loading: boolean;
  user: IAuthUser | null;
  form: any;
  onCancel: () => void;
  onSubmit: (values: EmailPreferencesFormData) => void;
}

const EmailPreferencesModal: FC<EmailPreferencesModalProps> = ({
  visible,
  loading,
  user,
  form,
  onCancel,
  onSubmit,
}) => {
  return (
    <Modal
      title="Email Preferences"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          sessionNotifications: user?.emailSessionNotifications ?? true,
          clubAnnouncements: user?.emailClubAnnouncements ?? true,
        }}
      >
        <Form.Item
          name="sessionNotifications"
          label="Session Notifications"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="clubAnnouncements"
          label="Club Announcements"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item className="mb-0">
          <Space className="w-full justify-end">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Preferences
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmailPreferencesModal;
