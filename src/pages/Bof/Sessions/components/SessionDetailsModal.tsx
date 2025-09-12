import React, { FC, useState } from "react";
import {
  Modal,
  Tabs,
  Select,
  Table,
  Tag,
  Space,
  Avatar,
  Divider,
  Button,
  Popconfirm,
  Collapse,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ISession } from "interfaces/session.interface";
import { IRegistrationWithUser } from "interfaces/registration.interface";
import { SessionStatus } from "constants/enum/session.status.enum";
import { RegistrationStatus } from "constants/enum/registration.status.enum";
import SessionStatusManagement from "./SessionStatusManagement";
import EmailSection from "./EmailSection";
import AttendanceSection from "./AttendanceSection";
import type { ColumnsType } from "antd/es/table";

const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

interface SessionDetailsModalProps {
  visible: boolean;
  selectedSession: ISession | null;
  sessionRegistrations: IRegistrationWithUser[];
  registrationsLoading: boolean;
  isMobile: boolean;

  // Status management
  pendingStatusChange: SessionStatus | null;
  statusChangeLoading: boolean;

  // Email
  emailForm: any;
  emailLoading: boolean;
  emailRecipients: "registered" | "waitlist" | "both";

  // Event handlers
  onClose: () => void;
  onEditSession: (session: ISession) => void;
  onDeleteSession: (session: ISession) => void;
  onStatusChange: (status: SessionStatus) => void;
  onApplyStatusChange: () => void;
  onCancelStatusChange: () => void;
  onEmailRecipientsChange: (value: "registered" | "waitlist" | "both") => void;
  onEmailSubmit: (values: {
    header: string;
    subject: string;
    body: string;
  }) => void;
  onMarkAttendance: (registrationId: number, hasAttended: boolean) => void;
}

const SessionDetailsModal: FC<SessionDetailsModalProps> = ({
  visible,
  selectedSession,
  sessionRegistrations,
  registrationsLoading,
  isMobile,
  pendingStatusChange,
  statusChangeLoading,
  emailForm,
  emailLoading,
  emailRecipients,
  onClose,
  onEditSession,
  onDeleteSession,
  onStatusChange,
  onApplyStatusChange,
  onCancelStatusChange,
  onEmailRecipientsChange,
  onEmailSubmit,
  onMarkAttendance,
}) => {
  const [activeTab, setActiveTab] = useState("registered");

  const registeredUsers = sessionRegistrations.filter(
    (reg) =>
      reg.status === RegistrationStatus.REGISTERED ||
      reg.status === RegistrationStatus.COMPLETED ||
      reg.status === RegistrationStatus.NO_SHOW
  );
  const waitlistedUsers = sessionRegistrations.filter(
    (reg) => reg.status === RegistrationStatus.WAITLISTED
  );

  const registrationColumns: ColumnsType<IRegistrationWithUser> = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-semibold">
              {record.user?.firstName} {record.user?.lastName}
            </div>
            <div className="text-gray-500 text-sm">{record.user?.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Phone",
      key: "phone",
      render: (_, record) => record.user?.phoneNumber || "N/A",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case "completed":
              return "green";
            case "no_show":
              return "red";
            case "registered":
              return "blue";
            default:
              return "default";
          }
        };

        const getStatusText = (status: string) => {
          switch (status) {
            case "completed":
              return "Attended";
            case "no_show":
              return "No Show";
            case "registered":
              return "Registered";
            default:
              return status;
          }
        };

        return (
          <Tag color={getStatusColor(record.status)}>
            {getStatusText(record.status)}
          </Tag>
        );
      },
    },
    {
      title: "No-Show Count",
      key: "noShowCount",
      render: (_, record) => (
        <Tag color={(record.user?.noShowCount || 0) > 0 ? "orange" : "green"}>
          {record.user?.noShowCount || 0}
        </Tag>
      ),
    },
    {
      title: "Registered At",
      key: "createdAt",
      render: (_, record) => new Date(record.createdAt).toLocaleString(),
    },
  ];

  const waitlistColumns: ColumnsType<IRegistrationWithUser> = [
    {
      title: "Position",
      key: "position",
      render: (_, record) => <Tag color="orange">#{record.position}</Tag>,
    },
    ...registrationColumns,
  ];

  // Mobile tab content rendering
  const renderMobileTabContent = () => {
    switch (activeTab) {
      case "registered":
        return (
          <div>
            <h4 className="text-lg font-semibold mb-3">Registered Users</h4>
            <Collapse
              ghost
              className="[&_.ant-collapse-item]:bg-white/60 [&_.ant-collapse-item]:backdrop-blur-md [&_.ant-collapse-item]:border [&_.ant-collapse-item]:border-white/30 [&_.ant-collapse-item]:rounded-xl [&_.ant-collapse-item]:mb-3 [&_.ant-collapse-header]:text-gray-800 [&_.ant-collapse-header]:font-medium [&_.ant-collapse-content]:bg-white/40 [&_.ant-collapse-content]:backdrop-blur-md [&_.ant-collapse-content]:rounded-b-xl"
            >
              {registeredUsers.map((registration) => (
                <Panel
                  key={registration.id}
                  header={
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {registration.user?.firstName}{" "}
                          {registration.user?.lastName}
                        </span>
                        <span className="text-sm text-gray-600">
                          {registration.user?.email}
                        </span>
                      </div>
                      <Tag color="green" className="ml-2">
                        Registered
                      </Tag>
                    </div>
                  }
                >
                  <div className="space-y-3 p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">
                        {registration.user?.phoneNumber || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">No-Show Count:</span>
                      <Tag
                        color={
                          registration.user?.noShowCount &&
                          registration.user.noShowCount > 0
                            ? "orange"
                            : "green"
                        }
                      >
                        {registration.user?.noShowCount || 0}
                      </Tag>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Registration Date:</span>
                      <span className="font-medium">
                        {registration.createdAt
                          ? new Date(
                              registration.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>
        );

      case "waitlist":
        return (
          <div>
            <h4 className="text-lg font-semibold mb-3">Waitlist Users</h4>
            <Collapse
              ghost
              className="[&_.ant-collapse-item]:bg-white/60 [&_.ant-collapse-item]:backdrop-blur-md [&_.ant-collapse-item]:border [&_.ant-collapse-item]:border-white/30 [&_.ant-collapse-item]:rounded-xl [&_.ant-collapse-item]:mb-3 [&_.ant-collapse-header]:text-gray-800 [&_.ant-collapse-header]:font-medium [&_.ant-collapse-content]:bg-white/40 [&_.ant-collapse-content]:backdrop-blur-md [&_.ant-collapse-content]:rounded-b-xl"
            >
              {waitlistedUsers.map((registration) => (
                <Panel
                  key={registration.id}
                  header={
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {registration.user?.firstName}{" "}
                          {registration.user?.lastName}
                        </span>
                        <span className="text-sm text-gray-600">
                          {registration.user?.email}
                        </span>
                      </div>
                      <Tag color="orange" className="ml-2">
                        Waitlist
                      </Tag>
                    </div>
                  }
                >
                  <div className="space-y-3 p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">
                        {registration.user?.phoneNumber || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">No-Show Count:</span>
                      <Tag
                        color={
                          registration.user?.noShowCount &&
                          registration.user.noShowCount > 0
                            ? "orange"
                            : "green"
                        }
                      >
                        {registration.user?.noShowCount || 0}
                      </Tag>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Waitlist Date:</span>
                      <span className="font-medium">
                        {registration.createdAt
                          ? new Date(
                              registration.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>
        );

      case "attendance":
        return (
          <AttendanceSection
            isMobile={true}
            selectedSession={selectedSession}
            registeredUsers={registeredUsers}
            registrationsLoading={registrationsLoading}
            onMarkAttendance={onMarkAttendance}
          />
        );

      case "email":
        return (
          <EmailSection
            form={emailForm}
            emailLoading={emailLoading}
            emailRecipients={emailRecipients}
            registeredUsers={registeredUsers}
            waitlistedUsers={waitlistedUsers}
            onEmailRecipientsChange={onEmailRecipientsChange}
            onEmailSubmit={onEmailSubmit}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">{selectedSession?.name}</h3>
            <div className="text-gray-600 text-sm">
              {selectedSession && (
                <>
                  <CalendarOutlined />{" "}
                  {new Date(selectedSession.date).toLocaleDateString()} at{" "}
                  {selectedSession.time}
                  <Divider type="vertical" />
                  <EnvironmentOutlined /> {selectedSession.location}
                </>
              )}
            </div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
    >
      <div className="mt-4">
        {/* Session Actions - Edit & Delete Buttons */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              if (selectedSession) {
                onEditSession(selectedSession);
                onClose();
              }
            }}
            className="bg-nyu-purple hover:!bg-nyu-purple-light flex-1 sm:flex-none"
          >
            Edit Session
          </Button>
          <Popconfirm
            title="Delete Session"
            description="Are you sure you want to delete this session? This action cannot be undone."
            onConfirm={() => {
              if (selectedSession) {
                onDeleteSession(selectedSession);
                onClose();
              }
            }}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              className="flex-1 sm:flex-none"
            >
              Delete Session
            </Button>
          </Popconfirm>
        </div>

        {/* Session Status Management */}
        <SessionStatusManagement
          selectedSession={selectedSession}
          pendingStatusChange={pendingStatusChange}
          statusChangeLoading={statusChangeLoading}
          onStatusChange={onStatusChange}
          onApplyStatusChange={onApplyStatusChange}
          onCancelStatusChange={onCancelStatusChange}
        />

        {/* Mobile: Dropdown tabs, Desktop: Regular tabs */}
        {isMobile ? (
          <div className="space-y-4">
            <Select
              value={activeTab}
              onChange={setActiveTab}
              style={{ width: "100%" }}
              className="mb-4"
            >
              <Option value="registered">
                Registered ({registeredUsers.length})
              </Option>
              <Option value="waitlist">
                Waitlist ({waitlistedUsers.length})
              </Option>
              <Option value="attendance">
                Attendance ({registeredUsers.length})
              </Option>
              <Option value="email">Email</Option>
            </Select>
            {renderMobileTabContent()}
          </div>
        ) : (
          <Tabs defaultActiveKey="registered">
            <TabPane
              tab={`Registered (${registeredUsers.length})`}
              key="registered"
            >
              <Table
                columns={registrationColumns}
                dataSource={registeredUsers}
                loading={registrationsLoading}
                pagination={false}
                rowKey="id"
                size="small"
              />
            </TabPane>
            <TabPane
              tab={`Waitlist (${waitlistedUsers.length})`}
              key="waitlist"
            >
              <Table
                columns={waitlistColumns}
                dataSource={waitlistedUsers}
                loading={registrationsLoading}
                pagination={false}
                rowKey="id"
                size="small"
              />
            </TabPane>
            <TabPane
              tab={`Attendance (${registeredUsers.length})`}
              key="attendance"
            >
              <AttendanceSection
                isMobile={false}
                selectedSession={selectedSession}
                registeredUsers={registeredUsers}
                registrationsLoading={registrationsLoading}
                onMarkAttendance={onMarkAttendance}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <MailOutlined /> Email
                </span>
              }
              key="email"
            >
              <EmailSection
                form={emailForm}
                emailLoading={emailLoading}
                emailRecipients={emailRecipients}
                registeredUsers={registeredUsers}
                waitlistedUsers={waitlistedUsers}
                onEmailRecipientsChange={onEmailRecipientsChange}
                onEmailSubmit={onEmailSubmit}
              />
            </TabPane>
          </Tabs>
        )}
      </div>
    </Modal>
  );
};

export default SessionDetailsModal;
