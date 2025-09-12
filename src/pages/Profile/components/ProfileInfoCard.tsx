import React, { FC } from "react";
import { Card, Button, Divider } from "antd";
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { IAuthUser } from "interfaces/auth.interface";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

interface ProfileInfoCardProps {
  user: IAuthUser | null;
  onEditProfile: () => void;
  onChangePassword: () => void;
  onEmailPreferences: () => void;
  onLogout: () => void;
}

const ProfileInfoCard: FC<ProfileInfoCardProps> = ({
  user,
  onEditProfile,
  onChangePassword,
  onEmailPreferences,
  onLogout,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  return (
    <Card className="h-fit">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserOutlined className="text-white text-2xl" />
        </div>
        <h2 className="text-xl font-semibold">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-gray-600">{user?.email}</p>
        <p className="text-sm text-gray-500 mt-1">
          Member since {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <p className="text-gray-900">
            {(user as any)?.phoneNumber || "Not provided"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button icon={<EditOutlined />} onClick={onEditProfile} block>
            Edit Profile
          </Button>
          <Button icon={<LockOutlined />} onClick={onChangePassword} block>
            Change Password
          </Button>
        </div>

        <Button icon={<BellOutlined />} onClick={onEmailPreferences} block>
          Email Preferences
        </Button>

        {user?.isAdmin && (
          <>
            <Divider />
            <Button
              type="primary"
              onClick={() => navigate("/bof/dashboard")}
              className="w-full !bg-gradient-to-r !from-purple-500 !to-blue-500 !border-none 
                !rounded-xl !shadow-lg !shadow-purple-500/30 !transition-all 
                !duration-300 hover:!-translate-y-1 hover:!shadow-xl 
                hover:!shadow-purple-500/40 !text-white
                [&_span]:!text-white [&_.anticon]:!text-white"
              icon={<SettingOutlined />}
            >
              Admin Panel
            </Button>
          </>
        )}

        <Divider />
        <Button icon={<LogoutOutlined />} onClick={onLogout} danger block>
          Logout
        </Button>
      </div>
    </Card>
  );
};

export default ProfileInfoCard;
