import React, { FC } from "react";
import { Form, Input, Button, Radio } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { IRegistrationWithUser } from "interfaces/registration.interface";

const { TextArea } = Input;

interface EmailSectionProps {
  form: any;
  emailLoading: boolean;
  emailRecipients: "registered" | "waitlist" | "both";
  registeredUsers: IRegistrationWithUser[];
  waitlistedUsers: IRegistrationWithUser[];
  onEmailRecipientsChange: (value: "registered" | "waitlist" | "both") => void;
  onEmailSubmit: (values: {
    header: string;
    subject: string;
    body: string;
  }) => void;
}

const EmailSection: FC<EmailSectionProps> = ({
  form,
  emailLoading,
  emailRecipients,
  registeredUsers,
  waitlistedUsers,
  onEmailRecipientsChange,
  onEmailSubmit,
}) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-3">Send Email</h4>
      <div className="mb-4 backdrop-blur-xl bg-purple-50/80 rounded-2xl border border-purple-200/50 p-4">
        <div className="text-purple-800">
          <strong className="text-lg">📧 Send Announcement Email</strong>
          <div className="text-sm mt-2 text-gray-600">
            Send a custom email announcement to users registered for this
            session. The header appears below the NYU Tennis Club banner, and
            the subject will automatically include session details.
          </div>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl border border-white/30 p-6 mb-4 [&_.ant-radio-wrapper]:bg-white/50 [&_.ant-radio-wrapper]:backdrop-blur-md [&_.ant-radio-wrapper]:border-white/30 [&_.ant-radio-wrapper]:rounded-lg [&_.ant-radio-wrapper]:p-3 [&_.ant-radio-wrapper]:m-1 [&_.ant-radio-wrapper:hover]:bg-white/70 [&_.ant-input]:bg-white/70 [&_.ant-input]:backdrop-blur-md [&_.ant-input]:border-white/30 [&_.ant-input]:rounded-xl [&_.ant-input]:focus:bg-white/90 [&_.ant-input]:focus:border-purple-500/50 [&_.ant-input]:focus:shadow-lg [&_.ant-input]:focus:shadow-purple-500/20 [&_.ant-btn-primary]:bg-gradient-to-r [&_.ant-btn-primary]:from-purple-500 [&_.ant-btn-primary]:to-blue-500 [&_.ant-btn-primary]:border-none [&_.ant-btn-primary]:rounded-xl [&_.ant-btn-primary]:shadow-lg [&_.ant-btn-primary]:shadow-purple-500/30 [&_.ant-btn-primary]:transition-all [&_.ant-btn-primary]:duration-300 [&_.ant-btn-primary:hover]:-translate-y-1 [&_.ant-btn-primary:hover]:shadow-xl [&_.ant-btn-primary:hover]:shadow-purple-500/40">
        <div className="mb-4">
          <strong>Recipients:</strong>
          <Radio.Group
            value={emailRecipients}
            onChange={(e) => onEmailRecipientsChange(e.target.value)}
            className="ml-4"
          >
            <Radio value="registered">
              Registered Users ({registeredUsers.length})
            </Radio>
            <Radio value="waitlist">
              Waitlisted Users ({waitlistedUsers.length})
            </Radio>
            <Radio value="both">
              Both Registered & Waitlisted (
              {registeredUsers.length + waitlistedUsers.length})
            </Radio>
          </Radio.Group>
        </div>

        <Form form={form} onFinish={onEmailSubmit} layout="vertical">
          <Form.Item
            name="header"
            label="Email Header"
            rules={[
              {
                required: true,
                message: "Please enter email header",
              },
              {
                max: 100,
                message: "Header cannot exceed 100 characters",
              },
            ]}
          >
            <Input placeholder="e.g., Important Session Announcement!" />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[
              {
                required: true,
                message: "Please enter email subject",
              },
            ]}
          >
            <Input
              placeholder="e.g., Important Session Update"
              suffix={
                <span className="text-gray-400 text-xs">
                  + session details will be added
                </span>
              }
            />
          </Form.Item>

          <Form.Item
            name="body"
            label="Message Body"
            rules={[
              {
                required: true,
                message: "Please enter email message",
              },
            ]}
          >
            <TextArea
              placeholder="Enter your announcement message here..."
              rows={6}
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={emailLoading}
              disabled={
                (emailRecipients === "registered" &&
                  registeredUsers.length === 0) ||
                (emailRecipients === "waitlist" &&
                  waitlistedUsers.length === 0) ||
                (emailRecipients === "both" &&
                  registeredUsers.length + waitlistedUsers.length === 0)
              }
              icon={<MailOutlined />}
              className="bg-nyu-purple hover:!bg-nyu-purple-light"
            >
              Send Email
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EmailSection;
