import React, { FC } from "react";
import { Table, Tag, Space, Button } from "antd";
import {
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ISession } from "interfaces/session.interface";
import { SessionStatus } from "constants/enum/session.status.enum";
import { LEVELS } from "constants/enum/levels.enum";
import type { ColumnsType } from "antd/es/table";

interface SessionsTableProps {
  sessions: ISession[];
  loading: boolean;
  isMobile: boolean;
  onSessionClick: (session: ISession) => void;
  onEditSession: (session: ISession) => void;
  onDeleteSession: (session: ISession) => void;
  deletingSessionId: number | null;
}

const SessionsTable: FC<SessionsTableProps> = ({
  sessions,
  loading,
  isMobile,
  onSessionClick,
  onEditSession,
  onDeleteSession,
  deletingSessionId,
}) => {
  const getStatusColor = (status: SessionStatus): string => {
    switch (status) {
      case SessionStatus.OPEN:
        return "green";
      case SessionStatus.FULL:
        return "orange";
      case SessionStatus.VIEW_ONLY:
        return "blue";
      case SessionStatus.CLOSED:
        return "red";
      default:
        return "default";
    }
  };

  const getSkillLevelColor = (level: LEVELS): string => {
    switch (level) {
      case LEVELS.Beginner:
        return "green";
      case LEVELS.Intermediate:
        return "blue";
      case LEVELS.Advanced:
        return "red";
      default:
        return "default";
    }
  };

  const isSessionPast = (session: ISession): boolean => {
    const sessionDateTime = new Date(`${session.date}T${session.time}`);
    return sessionDateTime < new Date();
  };

  const columns: ColumnsType<ISession> = [
    {
      title: "Session",
      key: "session",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div className="font-semibold">{record.name}</div>
          <Space size="small">
            <EnvironmentOutlined />
            <span className="text-gray-600">{record.location}</span>
          </Space>
          {isSessionPast(record) && (
            <Tag color="purple">📋 Attendance Available</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Date & Time",
      key: "datetime",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>{new Date(record.date).toLocaleDateString()}</div>
          <div className="text-gray-600">{record.time}</div>
        </Space>
      ),
      sorter: (a, b) => {
        // Combine date and time for proper sorting
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        return dateTimeA.getTime() - dateTimeB.getTime();
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Skill Levels",
      dataIndex: "skillLevels",
      key: "skillLevels",
      render: (skillLevels: LEVELS[]) => (
        <Space size={4} wrap>
          {skillLevels.map((level, index) => (
            <Tag key={index} color={getSkillLevelColor(level)}>
              {level}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Capacity",
      key: "capacity",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <span className="font-semibold">{record.spotsAvailable}</span>
            <span className="text-gray-600">/{record.spotsTotal}</span>
          </div>
          <div className="text-xs text-gray-500">Available/Total</div>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: SessionStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => {
        const dateA = new Date(a.createdAt || "");
        const dateB = new Date(b.createdAt || "");
        return dateA.getTime() - dateB.getTime();
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              onEditSession(record);
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            type="link"
            danger
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSession(record);
            }}
            loading={deletingSessionId === record.id}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Mobile-optimized columns - show only essential info
  const mobileColumns: ColumnsType<ISession> = [
    {
      title: "Session Info",
      key: "sessionInfo",
      render: (_, record) => (
        <div className="space-y-1 p-2">
          {/* Session Name */}
          <div className="font-semibold text-sm text-gray-800 truncate">
            {record.name}
          </div>

          {/* Location */}
          <div className="flex items-center text-xs text-gray-600">
            <EnvironmentOutlined className="mr-1 text-purple-500 text-xs" />
            <span className="truncate">{record.location}</span>
          </div>

          {/* Date, Time, and Status Row */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col min-w-0 flex-1">
              <div className="font-medium text-xs text-gray-800">
                {new Date(record.date).toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-600">{record.time}</div>
            </div>
            <div className="flex flex-col items-end space-y-1 ml-1">
              <Tag color={getStatusColor(record.status)}>{record.status}</Tag>
              {isSessionPast(record) && <Tag color="purple">📋</Tag>}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="backdrop-blur-xl bg-white/60 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
      <Table
        columns={isMobile ? mobileColumns : columns}
        dataSource={sessions}
        loading={loading}
        pagination={false}
        rowKey="id"
        scroll={{ x: isMobile ? 250 : 1000 }}
        onRow={(record) => ({
          onClick: () => onSessionClick(record),
          style: { cursor: "pointer" },
        })}
        className={`glass-table ${isMobile ? "overflow-x-hidden" : ""}`}
      />
    </div>
  );
};

export default SessionsTable;
