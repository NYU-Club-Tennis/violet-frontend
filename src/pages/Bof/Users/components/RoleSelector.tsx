import React, { FC } from "react";
import { Select, Tag } from "antd";
import { IUser, Role } from "interfaces/user.interface";

const { Option } = Select;

interface RoleSelectorProps {
  user: IUser;
  currentUser: any;
  updatingRoles: Set<number>;
  onRoleChange: (userId: number, newRole: Role, currentRole: Role) => void;
  size?: "small" | "middle" | "large";
  width?: number;
  showBorder?: boolean;
}

const RoleSelector: FC<RoleSelectorProps> = ({
  user,
  currentUser,
  updatingRoles,
  onRoleChange,
  size = "small",
  width = 100,
  showBorder = false,
}) => {
  // Helper function to determine user's effective role
  const getUserEffectiveRole = (user: IUser): Role => {
    if (user.isAdmin) {
      return Role.ADMIN;
    }
    return user.membershipLevel === "MEMBER" ? Role.MEMBER : Role.USER;
  };

  const currentRole = getUserEffectiveRole(user);
  const isUpdating = updatingRoles.has(user.id);
  const isCurrentUser = currentUser ? user.id === currentUser.id : false;

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
      onChange={(newRole) => onRoleChange(user.id, newRole, currentRole)}
      loading={isUpdating}
      disabled={isUpdating || isCurrentUser}
      size={size}
      style={{ width }}
      dropdownStyle={{ minWidth: width }}
      optionLabelProp="label"
      className={
        showBorder
          ? ""
          : "[&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!bg-transparent"
      }
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
    </Select>
  );
};

export default RoleSelector;
