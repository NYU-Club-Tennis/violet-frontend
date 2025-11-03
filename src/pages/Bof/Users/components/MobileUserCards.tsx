import React, { FC } from "react";
import { Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { IUser, Role, MembershipLevel } from "interfaces/user.interface";

interface MobileUserCardsProps {
  users: IUser[];
  currentUser: any;
  onUserClick: (user: IUser) => void;
}

const MobileUserCards: FC<MobileUserCardsProps> = ({
  users,
  currentUser,
  onUserClick,
}) => {
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
          onClick={() => onUserClick(user)}
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
  );
};

export default MobileUserCards;
