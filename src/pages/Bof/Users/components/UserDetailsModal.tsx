import React, { FC } from "react";
import { Modal, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { IUser, Role, MembershipLevel } from "interfaces/user.interface";
import RoleSelector from "./RoleSelector";
import BanStatusSelector from "./BanStatusSelector";

interface UserDetailsModalProps {
  user: IUser | null;
  visible: boolean;
  currentUser: any;
  updatingRoles: Set<number>;
  onClose: () => void;
  onRoleChange: (userId: number, newRole: Role, currentRole: Role) => void;
  onBanStatusChange: (
    userId: number,
    newBanStatus: boolean,
    currentBanStatus: boolean | null
  ) => void;
}

const UserDetailsModal: FC<UserDetailsModalProps> = ({
  user,
  visible,
  currentUser,
  updatingRoles,
  onClose,
  onRoleChange,
  onBanStatusChange,
}) => {
  if (!user) return null;

  // Helper function to determine user's effective role
  const getUserEffectiveRole = (user: IUser): Role => {
    if (user.isAdmin) {
      return Role.ADMIN;
    }
    return user.membershipLevel === MembershipLevel.MEMBER
      ? Role.MEMBER
      : Role.USER;
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3">
          <UserOutlined className="text-purple-500 text-xl" />
          <div>
            <h3 className="text-xl font-bold mb-1">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <div className="space-y-6">
        {/* User Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{user.phoneNumber || "N/A"}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">No-Show Count:</span>
            <Tag color={(user.noShowCount || 0) > 0 ? "orange" : "green"}>
              {user.noShowCount || 0}
            </Tag>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Last Sign In:</span>
            <span className="font-medium">
              {user.lastSignInAt
                ? new Date(user.lastSignInAt).toLocaleDateString()
                : "Never"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Joined:</span>
            <span className="font-medium">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Role Management */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Role Management:</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Role:</span>
            <RoleSelector
              user={user}
              currentUser={currentUser}
              updatingRoles={updatingRoles}
              onRoleChange={onRoleChange}
              size="middle"
              width={150}
              showBorder={true}
            />
          </div>
        </div>

        {/* Ban Status Management */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Ban Management:</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <BanStatusSelector
              user={user}
              currentUser={currentUser}
              updatingRoles={updatingRoles}
              onBanStatusChange={onBanStatusChange}
              size="middle"
              width={120}
              showBorder={true}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
