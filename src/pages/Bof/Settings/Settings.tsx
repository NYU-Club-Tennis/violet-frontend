import React, { FC } from "react";
import { Card, Form, Switch, Button, Divider } from "antd";

const Settings: FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Registration Settings</h2>
        <Form layout="vertical">
          <Form.Item label="Allow New Registrations" name="allowRegistrations">
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item label="Enable Waitlist" name="enableWaitlist">
            <Switch defaultChecked />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button
              type="primary"
              className="!bg-gradient-to-r !from-purple-500 !to-blue-500 !border-none 
              !rounded-xl !shadow-lg !shadow-purple-500/30 !transition-all 
              !duration-300 hover:!-translate-y-1 hover:!shadow-xl 
              hover:!shadow-purple-500/40 !text-white
               [&_span]:!text-white [&_.anticon]:!text-white"
            >
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;
