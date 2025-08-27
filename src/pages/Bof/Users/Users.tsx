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
  Collapse,
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
  updateUserBanStatus,
} from "actions/user.action";
import { IUser, Role, MembershipLevel } from "interfaces/user.interface";
import { AuthStore } from "stores/auth.store";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { Panel } = Collapse;

const Users: FC = () => {
  const { user: currentUser } = AuthStore();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingRoles, setUpdatingRoles] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const pageSize = 10;

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const handleBanStatusChange = async (
    userId: number,
    newBanStatus: boolean,
    currentBanStatus: boolean | null
  ) => {
    // Convert null to false for comparison
    const normalizedCurrentStatus =
      currentBanStatus === null ? false : currentBanStatus;

    if (newBanStatus === normalizedCurrentStatus) return;

    // Prevent users from changing their own ban status
    if (currentUser && userId === currentUser.id) {
      message.error(
        "You cannot change your own ban status. Please ask another admin to do this for you."
      );
      return;
    }

    const user = users.find((u) => u.id === userId);
    const statusName = newBanStatus ? "banned" : "unbanned";

    confirm({
      title: "Confirm Ban Status Change",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${statusName} ${user?.firstName} ${user?.lastName}?`,
      okText: `Yes, ${statusName === "banned" ? "Ban" : "Unban"} User`,
      cancelText: "Cancel",
      onOk: async () => {
        setUpdatingRoles((prev) => new Set(prev).add(userId));

        try {
          const result = await updateUserBanStatus(userId, newBanStatus);

          // Update the user in the local state
          setUsers((prev) => {
            const updated = prev.map((u) =>
              u.id === userId ? { ...u, isBanned: newBanStatus } : u
            );
            return updated;
          });

          message.success(
            `Successfully ${statusName} ${user?.firstName} ${user?.lastName}`
          );

          // Force a refresh of the data from the backend
          await fetchUsers(currentPage, searchTerm);
        } catch (error) {
          console.error("Failed to update user ban status:", error);
          message.error("Failed to update user ban status. Please try again.");
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
      title: "Ban Status",
      dataIndex: "isBanned",
      key: "banStatus",
      render: (isBanned, record) => {
        const isUpdating = updatingRoles.has(record.id);
        const isCurrentUser = currentUser
          ? record.id === currentUser.id
          : false;

        // Ensure isBanned is a boolean
        const banStatus = isBanned === null ? false : Boolean(isBanned);

        return (
          <Select
            value={banStatus}
            onChange={(newBanStatus) =>
              handleBanStatusChange(record.id, newBanStatus, banStatus)
            }
            loading={isUpdating}
            disabled={isUpdating || isCurrentUser}
            size="small"
            style={{ width: 120 }} // Increased width to prevent "three dots"
            dropdownStyle={{ minWidth: 120 }} // Increased minWidth to prevent menu cutoff
            optionLabelProp="label"
            className="
            [&_.ant-select-selector]:!border-none 
            [&_.ant-select-selector]:!bg-transparent"
            title={
              currentUser && record.id === currentUser.id
                ? "You cannot change your own ban status"
                : ""
            }
          >
            <Option
              value={false}
              label={
                <Tag color="green" style={{ margin: 0 }}>
                  Active
                </Tag>
              }
            >
              <Tag color="green" style={{ margin: 0 }}>
                Active
              </Tag>
            </Option>
            <Option
              value={true}
              label={
                <Tag color="red" style={{ margin: 0 }}>
                  Banned
                </Tag>
              }
            >
              <Tag color="red" style={{ margin: 0 }}>
                Banned
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
          💡 <strong>Note:</strong> You cannot change your own role or ban
          status. Your row is highlighted in blue. Please ask another admin to
          modify your role or ban status if needed.
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

      {/* Mobile: User Cards, Desktop: Table */}
      {isMobile ? (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className={`backdrop-blur-xl bg-white/60 rounded-xl shadow-lg border border-white/30 p-3 transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-[1.02] ${
                currentUser && user.id === currentUser.id
                  ? "bg-gradient-to-r from-blue-100/50 to-purple-100/50 border-l-4 border-blue-400"
                  : user.isBanned
                  ? "bg-gradient-to-r from-red-100/50 to-pink-100/50 border-l-4 border-red-400"
                  : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              {/* Compact User Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserOutlined className="text-purple-500 text-lg" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Tag
                    color={
                      getUserEffectiveRole(user) === Role.ADMIN
                        ? "red"
                        : getUserEffectiveRole(user) === Role.MEMBER
                        ? "orange"
                        : "blue"
                    }
                  >
                    {getUserEffectiveRole(user) === Role.ADMIN
                      ? "Admin"
                      : getUserEffectiveRole(user) === Role.MEMBER
                      ? "Member"
                      : "User"}
                  </Tag>
                  <Tag
                    color={
                      (user.isBanned === null ? false : user.isBanned)
                        ? "red"
                        : "green"
                    }
                  >
                    {(user.isBanned === null ? false : user.isBanned)
                      ? "Banned"
                      : "Active"}
                  </Tag>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
      )}

      {/* User Details Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-3">
            <UserOutlined className="text-purple-500 text-xl" />
            <div>
              <h3 className="text-xl font-bold mb-1">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </h3>
              <p className="text-gray-600 text-sm">{selectedUser?.email}</p>
            </div>
          </div>
        }
        open={!!selectedUser}
        onCancel={() => setSelectedUser(null)}
        footer={null}
        width={600}
        destroyOnClose
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">
                  {selectedUser.phoneNumber || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">No-Show Count:</span>
                <Tag
                  color={
                    (selectedUser.noShowCount || 0) > 0 ? "orange" : "green"
                  }
                >
                  {selectedUser.noShowCount || 0}
                </Tag>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Sign In:</span>
                <span className="font-medium">
                  {selectedUser.lastSignInAt
                    ? new Date(selectedUser.lastSignInAt).toLocaleDateString()
                    : "Never"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Joined:</span>
                <span className="font-medium">
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Role Management */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">
                  Role Management:
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Role:</span>
                <Select
                  value={getUserEffectiveRole(selectedUser)}
                  onChange={(newRole) =>
                    handleRoleChange(
                      selectedUser.id,
                      newRole,
                      getUserEffectiveRole(selectedUser)
                    )
                  }
                  loading={updatingRoles.has(selectedUser.id)}
                  disabled={
                    updatingRoles.has(selectedUser.id) ||
                    (currentUser && selectedUser.id === currentUser.id)
                  }
                  size="middle"
                  style={{ width: 150 }}
                  className="[&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!bg-transparent"
                  title={
                    currentUser && selectedUser.id === currentUser.id
                      ? "You cannot change your own role"
                      : ""
                  }
                >
                  <Option value={Role.USER}>
                    <Tag color="blue" style={{ margin: 0 }}>
                      User
                    </Tag>
                  </Option>
                  <Option value={Role.MEMBER}>
                    <Tag color="orange" style={{ margin: 0 }}>
                      Member
                    </Tag>
                  </Option>
                  <Option value={Role.ADMIN}>
                    <Tag color="red" style={{ margin: 0 }}>
                      Admin
                    </Tag>
                  </Option>
                </Select>
              </div>
            </div>

            {/* Ban Status Management */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">
                  Ban Management:
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <Select
                  value={
                    selectedUser.isBanned === null
                      ? false
                      : selectedUser.isBanned
                  }
                  onChange={(newBanStatus) =>
                    handleBanStatusChange(
                      selectedUser.id,
                      newBanStatus,
                      selectedUser.isBanned === null
                        ? false
                        : selectedUser.isBanned
                    )
                  }
                  loading={updatingRoles.has(selectedUser.id)}
                  disabled={
                    updatingRoles.has(selectedUser.id) ||
                    (currentUser && selectedUser.id === currentUser.id)
                  }
                  size="middle"
                  style={{ width: 120 }}
                  className="[&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!bg-transparent"
                  title={
                    currentUser && selectedUser.id === currentUser.id
                      ? "You cannot change your own ban status"
                      : ""
                  }
                >
                  <Option value={false}>
                    <Tag color="green" style={{ margin: 0 }}>
                      Active
                    </Tag>
                  </Option>
                  <Option value={true}>
                    <Tag color="red" style={{ margin: 0 }}>
                      Banned
                    </Tag>
                  </Option>
                </Select>
              </div>
            </div>
          </div>
        )}
      </Modal>

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
