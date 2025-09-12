import React, { FC } from "react";
import { Select, Tag } from "antd";
import { IUser } from "interfaces/user.interface";

const { Option } = Select;

interface BanStatusSelectorProps {
  user: IUser;
  currentUser: any;
  updatingRoles: Set<number>;
  onBanStatusChange: (
    userId: number,
    newBanStatus: boolean,
    currentBanStatus: boolean | null
  ) => void;
  size?: "small" | "middle" | "large";
  width?: number;
  showBorder?: boolean;
}

const BanStatusSelector: FC<BanStatusSelectorProps> = ({
  user,
  currentUser,
  updatingRoles,
  onBanStatusChange,
  size = "small",
  width = 120,
  showBorder = false,
}) => {
  const isUpdating = updatingRoles.has(user.id);
  const isCurrentUser = currentUser ? user.id === currentUser.id : false;

  // Ensure isBanned is a boolean
  const banStatus = user.isBanned === null ? false : Boolean(user.isBanned);

  return (
    <Select
      value={banStatus}
      onChange={(newBanStatus) =>
        onBanStatusChange(user.id, newBanStatus, banStatus)
      }
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
      title={isCurrentUser ? "You cannot change your own ban status" : ""}
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
};

export default BanStatusSelector;
