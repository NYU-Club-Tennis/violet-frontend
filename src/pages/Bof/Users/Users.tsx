import React, { FC, useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Space,
  Pagination,
  Select,
  Modal,
  message,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  getUsersPaginate,
  updateUserRole,
  updateMembershipLevel,
} from "actions/user.action";
import { IUser, Role, MembershipLevel } from "interfaces/user.interface";
import { AuthStore } from "stores/auth.store";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const Users: FC = () => {
  const { user: currentUser } = AuthStore();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingRoles, setUpdatingRoles] = useState<Set<number>>(new Set());
  const pageSize = 10;

  const fetchUsers = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const query = {
        page,
        limit: pageSize,
        sortOptions: [{ createdAt: "DESC" }],
        ...(search && { search }),
      };

      const response = await getUsersPaginate(query);
      setUsers(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (
    userId: number,
    newRole: Role,
    currentRole: Role
  ) => {
    if (newRole === currentRole) return;

    // Prevent users from changing their own role
    if (currentUser && userId === currentUser.id) {
      message.error(
        "You cannot change your own role. Please ask another admin to do this for you."
      );
      return;
    }

    const user = users.find((u) => u.id === userId);
    const roleName =
      newRole === Role.ADMIN
        ? "Admin"
        : newRole === Role.MEMBER
        ? "Member"
        : "User";
    const currentRoleName =
      currentRole === Role.ADMIN
        ? "Admin"
        : currentRole === Role.MEMBER
        ? "Member"
        : "User";

    confirm({
      title: "Confirm Role Change",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to change ${user?.firstName} ${user?.lastName}'s role from ${currentRoleName} to ${roleName}?`,
      okText: "Yes, Change Role",
      cancelText: "Cancel",
      onOk: async () => {
        setUpdatingRoles((prev) => new Set(prev).add(userId));

        try {
          if (newRole === Role.ADMIN) {
            // Changing to admin: update isAdmin to true
            await updateUserRole(userId, { role: newRole });
          } else {
            // Changing between USER and MEMBER: update membership level
            const membershipLevel =
              newRole === Role.MEMBER
                ? MembershipLevel.MEMBER
                : MembershipLevel.USER;

            // If current role is ADMIN, we need to remove admin status first
            if (currentRole === Role.ADMIN) {
              await updateUserRole(userId, { role: Role.USER }); // Remove admin status
            }

            // Update membership level
            await updateMembershipLevel(userId, { membershipLevel });
          }

          // Update the user in the local state
          setUsers((prev) =>
            prev.map((u) =>
              u.id === userId
                ? {
                    ...u,
                    isAdmin: newRole === Role.ADMIN,
                    // When promoting to admin, ensure membershipLevel is at least MEMBER
                    // When demoting from admin or changing between USER/MEMBER, set accordingly
                    membershipLevel:
                      newRole === Role.ADMIN
                        ? u.membershipLevel === MembershipLevel.USER
                          ? MembershipLevel.MEMBER
                          : u.membershipLevel
                        : newRole === Role.MEMBER
                        ? MembershipLevel.MEMBER
                        : MembershipLevel.USER,
                  }
                : u
            )
          );

          message.success(
            `Successfully updated ${user?.firstName} ${user?.lastName}'s role to ${roleName}`
          );
        } catch (error) {
          console.error("Failed to update user role:", error);
          message.error("Failed to update user role. Please try again.");
        } finally {
          setUpdatingRoles((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        }
      },
    });
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchUsers(1, value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Helper function to determine user's effective role
  const getUserEffectiveRole = (user: IUser): Role => {
    if (user.isAdmin) {
      return Role.ADMIN;
    }
    return user.membershipLevel === MembershipLevel.MEMBER
      ? Role.MEMBER
      : Role.USER;
  };

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
      render: (isAdmin, record) => {
        // Use the effective role instead of just checking isAdmin
        const currentRole = getUserEffectiveRole(record);
        const isUpdating = updatingRoles.has(record.id);
        const isCurrentUser = currentUser
          ? record.id === currentUser.id
          : false;

        const getRoleConfig = (role: Role) => {
          switch (role) {
            case Role.ADMIN:
              return { color: "red", label: "Admin" };
            case Role.MEMBER:
              return { color: "orange", label: "Member" };
            case Role.USER:
            default:
              return { color: "blue", label: "User" };
          }
        };

        const currentRoleConfig = getRoleConfig(currentRole);

        return (
          <Select
            value={currentRole}
            onChange={(newRole) =>
              handleRoleChange(record.id, newRole, currentRole)
            }
            loading={isUpdating}
            disabled={isUpdating || isCurrentUser}
            size="small"
            style={{ width: 100 }}
            dropdownStyle={{ minWidth: 100 }}
            optionLabelProp="label"
            className="
            [&_.ant-select-selector]:!border-none 
            [&_.ant-select-selector]:!bg-transparent"
            title={isCurrentUser ? "You cannot change your own role" : ""}
          >
            <Option
              value={Role.USER}
              label={
                <Tag color="blue" style={{ margin: 0 }}>
                  User
                </Tag>
              }
            >
              <Tag color="blue" style={{ margin: 0 }}>
                User
              </Tag>
            </Option>
            <Option
              value={Role.ADMIN}
              label={
                <Tag color="red" style={{ margin: 0 }}>
                  Admin
                </Tag>
              }
            >
              <Tag color="red" style={{ margin: 0 }}>
                Admin
              </Tag>
            </Option>
            <Option
              value={Role.MEMBER}
              label={
                <Tag color="orange" style={{ margin: 0 }}>
                  Member
                </Tag>
              }
            >
              <Tag color="orange" style={{ margin: 0 }}>
                Member
              </Tag>
            </Option>
          </Select>
        );
      },
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
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Users Management
      </h1>

      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 p-6 mb-6">
        <div className="text-blue-800 text-sm">
          💡 <strong>Note:</strong> You cannot change your own role. Your row is
          highlighted in blue. Please ask another admin to modify your role if
          needed.
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 p-6 mb-6">
        <Search
          placeholder="Search users by name or email..."
          onSearch={handleSearch}
          style={{ width: 300 }}
          className="mb-4 [&_.ant-input]:bg-white/70 [&_.ant-input]:backdrop-blur-md [&_.ant-input]:border-white/30 [&_.ant-input]:rounded-xl [&_.ant-input]:focus:bg-white/90 [&_.ant-input]:focus:border-purple-500/50 [&_.ant-input]:focus:shadow-lg [&_.ant-input]:focus:shadow-purple-500/20"
        />
      </div>

      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={false}
          rowKey="id"
          rowClassName={(record) =>
            currentUser && record.id === currentUser.id
              ? "bg-gradient-to-r from-blue-100/50 to-purple-100/50 border-l-4 border-blue-400"
              : ""
          }
          className="glass-table"
        />
      </div>

      {total > pageSize && (
        <div className="mt-6 flex justify-center">
          <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl border border-white/30 p-4 [&_.ant-pagination-item]:bg-white/70 [&_.ant-pagination-item]:backdrop-blur-md [&_.ant-pagination-item]:border-white/30 [&_.ant-pagination-item]:rounded-lg [&_.ant-pagination-item:hover]:bg-white/90 [&_.ant-pagination-item-active]:bg-gradient-to-r [&_.ant-pagination-item-active]:from-purple-500 [&_.ant-pagination-item-active]:to-blue-500 [&_.ant-pagination-item-active]:border-transparent [&_.ant-pagination-item-active]:text-white [&_.ant-pagination-item-active_a]:text-white">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
