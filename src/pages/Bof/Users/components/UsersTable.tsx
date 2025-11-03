import React, { FC } from "react";
import { Table, Tag, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { IUser, Role } from "interfaces/user.interface";
import RoleSelector from "./RoleSelector";
import BanStatusSelector from "./BanStatusSelector";
import type { ColumnsType } from "antd/es/table";

interface UsersTableProps {
  users: IUser[];
  loading: boolean;
  currentUser: any;
  updatingRoles: Set<number>;
  onRoleChange: (userId: number, newRole: Role, currentRole: Role) => void;
  onBanStatusChange: (
    userId: number,
    newBanStatus: boolean,
    currentBanStatus: boolean | null
  ) => void;
}

const UsersTable: FC<UsersTableProps> = ({
  users,
  loading,
  currentUser,
  updatingRoles,
  onRoleChange,
  onBanStatusChange,
}) => {
  const columns: ColumnsType<IUser> = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <Space>
          <UserOutlined />
          {`${record.firstName} ${record.lastName}`}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone) => phone || "N/A",
    },
    {
      title: "Role",
      dataIndex: "isAdmin",
      key: "role",
      render: (_, record) => (
        <RoleSelector
          user={record}
          currentUser={currentUser}
          updatingRoles={updatingRoles}
          onRoleChange={onRoleChange}
          size="small"
          width={100}
          showBorder={false}
        />
      ),
    },
    {
      title: "Ban Status",
      dataIndex: "isBanned",
      key: "banStatus",
      render: (_, record) => (
        <BanStatusSelector
          user={record}
          currentUser={currentUser}
          updatingRoles={updatingRoles}
          onBanStatusChange={onBanStatusChange}
          size="small"
          width={120}
          showBorder={false}
        />
      ),
    },
    {
      title: "No-Show Count",
      dataIndex: "noShowCount",
      key: "noShowCount",
      render: (count) => (
        <Tag color={count > 0 ? "orange" : "green"}>{count || 0}</Tag>
      ),
    },
    {
      title: "Last Sign In",
      dataIndex: "lastSignInAt",
      key: "lastSignInAt",
      render: (date) => {
        if (!date) return "Never";
        return new Date(date).toLocaleDateString();
      },
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={false}
        rowKey="id"
        rowClassName={(record) => {
          if (currentUser && record.id === currentUser.id) {
            return "bg-gradient-to-r from-blue-100/50 to-purple-100/50 border-l-4 border-blue-400";
          }
          if (record.isBanned) {
            return "bg-gradient-to-r from-red-100/50 to-pink-100/50 border-l-4 border-red-400";
          }
          return "";
        }}
        className="glass-table"
      />
    </div>
  );
};

export default UsersTable;
