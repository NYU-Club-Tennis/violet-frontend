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
              className="bg-nyu-purple hover:!bg-nyu-purple-light"
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
