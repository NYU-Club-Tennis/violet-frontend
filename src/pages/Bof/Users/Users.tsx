import React, { FC, useEffect, useState } from "react";
import { Pagination, Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  getUsersPaginate,
  updateUserRole,
  updateMembershipLevel,
  updateUserBanStatus,
} from "actions/user.action";
import { IUser, Role, MembershipLevel } from "interfaces/user.interface";
import { AuthStore } from "stores/auth.store";

// Import our new components
import UsersSearch from "./components/UsersSearch";
import UsersTable from "./components/UsersTable";
import MobileUserCards from "./components/MobileUserCards";
import UserDetailsModal from "./components/UserDetailsModal";

const { confirm } = Modal;

const Users: FC = () => {
  const { user: currentUser } = AuthStore();

  // Main state
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingRoles, setUpdatingRoles] = useState<Set<number>>(new Set());

  // UI state
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

  const handleUserClick = (user: IUser) => {
    setSelectedUser(user);
  };

  const handleModalClose = () => {
    setSelectedUser(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Users Management
      </h1>

      {/* Info Note */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 p-6 mb-6">
        <div className="text-blue-800 text-sm">
          💡 <strong>Note:</strong> You cannot change your own role or ban
          status. Your row is highlighted in blue. Please ask another admin to
          modify your role or ban status if needed.
        </div>
      </div>

      {/* Search Component */}
      <UsersSearch onSearch={handleSearch} />

      {/* Mobile: User Cards, Desktop: Table */}
      {isMobile ? (
        <MobileUserCards
          users={users}
          currentUser={currentUser}
          onUserClick={handleUserClick}
        />
      ) : (
        <UsersTable
          users={users}
          loading={loading}
          currentUser={currentUser}
          updatingRoles={updatingRoles}
          onRoleChange={handleRoleChange}
          onBanStatusChange={handleBanStatusChange}
        />
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        visible={!!selectedUser}
        currentUser={currentUser}
        updatingRoles={updatingRoles}
        onClose={handleModalClose}
        onRoleChange={handleRoleChange}
        onBanStatusChange={handleBanStatusChange}
      />

      {/* Pagination */}
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
