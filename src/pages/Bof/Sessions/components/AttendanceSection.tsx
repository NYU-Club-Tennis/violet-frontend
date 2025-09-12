import React, { FC } from "react";
import { Table, Tag, Space, Button, Avatar, Collapse } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { IRegistrationWithUser } from "interfaces/registration.interface";
import { ISession } from "interfaces/session.interface";
import type { ColumnsType } from "antd/es/table";

const { Panel } = Collapse;

interface AttendanceSectionProps {
  isMobile: boolean;
  selectedSession: ISession | null;
  registeredUsers: IRegistrationWithUser[];
  registrationsLoading: boolean;
  onMarkAttendance: (registrationId: number, hasAttended: boolean) => void;
}

const AttendanceSection: FC<AttendanceSectionProps> = ({
  isMobile,
  selectedSession,
  registeredUsers,
  registrationsLoading,
  onMarkAttendance,
}) => {
  const isSessionPast = (session: ISession): boolean => {
    const sessionDateTime = new Date(`${session.date}T${session.time}`);
    return sessionDateTime < new Date();
  };

  const attendanceColumns: ColumnsType<IRegistrationWithUser> = [
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
      title: "Attended",
      key: "hasAttended",
      render: (_, record) => (
        <Tag color={record.hasAttended ? "green" : "default"}>
          {record.hasAttended ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            type="primary"
            className="bg-green-500 hover:!bg-green-600"
            onClick={() => onMarkAttendance(record.id, true)}
            disabled={record.hasAttended}
          >
            Mark Attended
          </Button>
          <Button
            size="small"
            danger
            onClick={() => onMarkAttendance(record.id, false)}
            disabled={record.status === "no_show"}
          >
            Mark No-Show
          </Button>
        </Space>
      ),
    },
  ];

  if (isMobile) {
    return (
      <div>
        <h4 className="text-lg font-semibold mb-3">Attendance Management</h4>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="text-blue-800">
            <strong>📋 Attendance Management</strong>
            <div className="text-sm mt-1">
              Mark attendance for users who registered for this session.
              {selectedSession && isSessionPast(selectedSession)
                ? " No-shows will increment the user's no-show count."
                : " This session hasn't occurred yet - you can pre-mark attendance if needed."}
            </div>
          </div>
        </div>
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
                  <div className="flex items-center space-x-2">
                    <Tag color="green">Registered</Tag>
                    <Tag
                      color={
                        registration.user?.noShowCount &&
                        registration.user.noShowCount > 0
                          ? "orange"
                          : "green"
                      }
                    >
                      No-Shows: {registration.user?.noShowCount || 0}
                    </Tag>
                  </div>
                </div>
              }
            >
              <div className="space-y-4 p-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">
                    {registration.user?.phoneNumber || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Attendance:</span>
                  <div className="flex space-x-2">
                    <Button
                      size="small"
                      type={registration.hasAttended ? "primary" : "default"}
                      onClick={() => onMarkAttendance(registration.id, true)}
                      className={
                        registration.hasAttended
                          ? "bg-green-500 hover:!bg-green-600"
                          : ""
                      }
                    >
                      Present
                    </Button>
                    <Button
                      size="small"
                      type={!registration.hasAttended ? "primary" : "default"}
                      onClick={() => onMarkAttendance(registration.id, false)}
                      className={
                        !registration.hasAttended
                          ? "bg-red-500 hover:!bg-red-600"
                          : ""
                      }
                    >
                      Absent
                    </Button>
                  </div>
                </div>
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="text-blue-800">
          <strong>📋 Attendance Management</strong>
          <div className="text-sm mt-1">
            Mark attendance for users who registered for this session.
            {selectedSession && isSessionPast(selectedSession)
              ? " No-shows will increment the user's no-show count."
              : " This session hasn't occurred yet - you can pre-mark attendance if needed."}
          </div>
        </div>
      </div>
      <Table
        columns={attendanceColumns}
        dataSource={registeredUsers}
        loading={registrationsLoading}
        pagination={false}
        rowKey="id"
        size="small"
      />
    </div>
  );
};

export default AttendanceSection;
