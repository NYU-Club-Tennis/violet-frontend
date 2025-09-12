import React, { FC } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  InputNumber,
  Select,
  Button,
  Tag,
} from "antd";
import { ISession } from "interfaces/session.interface";
import { LEVELS } from "constants/enum/levels.enum";
import { CreateSessionFormData } from "./CreateSessionModal";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

interface EditSessionModalProps {
  visible: boolean;
  loading: boolean;
  form: any;
  sessionToEdit: ISession | null;
  onCancel: () => void;
  onSubmit: (values: CreateSessionFormData) => void;
}

const EditSessionModal: FC<EditSessionModalProps> = ({
  visible,
  loading,
  form,
  sessionToEdit,
  onCancel,
  onSubmit,
}) => {
  return (
    <Modal
      title="Edit Session"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      {sessionToEdit &&
        sessionToEdit.spotsAvailable < sessionToEdit.spotsTotal && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="text-yellow-800">
                <strong>⚠️ Warning:</strong> This session has existing
                registrations. Changing the date, time, or location may affect
                registered users.
              </div>
            </div>
          </div>
        )}

      <Form form={form} layout="vertical" onFinish={onSubmit} className="mt-4">
        <Form.Item
          name="name"
          label="Session Name"
          rules={[
            { required: true, message: "Please enter session name" },
            { min: 3, message: "Session name must be at least 3 characters" },
          ]}
        >
          <Input placeholder="e.g., Sunday Morning Tennis" />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input placeholder="e.g., NYU Tennis Courts" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: "Please select time" }]}
          >
            <TimePicker
              style={{ width: "100%" }}
              format="HH:mm"
              minuteStep={15}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="skillLevels"
          label="Skill Levels"
          rules={[
            {
              required: true,
              message: "Please select at least one skill level",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select skill levels"
            style={{ width: "100%" }}
          >
            <Option value={LEVELS.Beginner}>
              <Tag color="green">{LEVELS.Beginner}</Tag>
            </Option>
            <Option value={LEVELS.Intermediate}>
              <Tag color="blue">{LEVELS.Intermediate}</Tag>
            </Option>
            <Option value={LEVELS.Advanced}>
              <Tag color="red">{LEVELS.Advanced}</Tag>
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="spotsTotal"
          label="Total Spots"
          rules={[
            { required: true, message: "Please enter total spots" },
            { type: "number", min: 1, message: "Must be at least 1 spot" },
            { type: "number", max: 100, message: "Cannot exceed 100 spots" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="e.g., 12"
            min={1}
            max={100}
          />
        </Form.Item>

        <Form.Item name="notes" label="Additional Notes (Optional)">
          <TextArea
            rows={3}
            placeholder="e.g., Please bring your own racket. Water will be provided."
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-nyu-purple hover:!bg-nyu-purple-light"
          >
            Update Session
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditSessionModal;
