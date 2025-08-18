import {
  Button,
  Divider,
  Modal,
  Form,
  Input,
  Card,
  List,
  Tag,
  Space,
  message,
  Switch,
  Popconfirm,
  Spin,
  Radio,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { AuthStore } from "stores/auth.store";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  UserOutlined,
  LockOutlined,
  BellOutlined,
  CalendarOutlined,
  HistoryOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { updateUser } from "actions/user.action";
import { getCurrentUser } from "actions/user.action";
import {
  getUserSessions,
  cancelSessionRegistration,
} from "actions/session.action";
import { getCurrentUserRegistrations } from "actions/registration.action";
import {
  createRegistration,
  deleteRegistration,
} from "actions/registration.action";
import { changePassword } from "actions/auth.action";
import { IUser } from "interfaces/user.interface";
import { ISession } from "interfaces/session.interface";
import { IRegistration } from "interfaces/registration.interface";
import { RegistrationStatus } from "constants/enum/registration.status.enum";
import { LEVELS } from "constants/enum/levels.enum";
import dayjs from "dayjs";
import SessionCard from "components/features/SessionCard";

const { Text, Title, Paragraph } = Typography;

const Profile = () => {
  const { user, setUser, clear } = AuthStore();
  const [upcomingSessions, setUpcomingSessions] = useState<ISession[]>([]);
  const [pastSessions, setPastSessions] = useState<ISession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [activeSessionTab, setActiveSessionTab] = useState<"upcoming" | "past">(
    "upcoming"
  );
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isPreferencesModalVisible, setIsPreferencesModalVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrations, setRegistrations] = useState<IRegistration[]>([]);
  const [selectedSession, setSelectedSession] = useState<ISession | null>(null);
  const [isSessionModalVisible, setIsSessionModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [preferencesForm] = Form.useForm();
  const navigate = useNavigate();

  // Load user data, sessions, and registrations on component mount
  useEffect(() => {
    if (user?.id) {
      loadCurrentUser();
      loadUserSessions();
      loadRegistrations();
    }
  }, [user?.id]);

  const loadCurrentUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error("Failed to load current user:", error);
      // Don't show error message as this might be a silent refresh
    }
  };

  const loadUserSessions = async () => {
    if (!user?.id) return;

    setSessionsLoading(true);
    try {
      const [upcomingResponse, pastResponse] = await Promise.all([
        getUserSessions(user.id, "upcoming"),
        getUserSessions(user.id, "past"),
      ]);
      console.log("Upcoming sessions response:", upcomingResponse); // Debugging
      console.log("Past sessions response:", pastResponse); // Debugging
      setUpcomingSessions(upcomingResponse.data || []);
      setPastSessions(pastResponse.data || []);
    } catch (error) {
      console.error("Failed to load user sessions:", error);
      message.error("Failed to load sessions");
    } finally {
      setSessionsLoading(false);
    }
  };

  const loadRegistrations = async () => {
    if (!user?.id) return;

    try {
      const query = {
        status: [
          RegistrationStatus.REGISTERED,
          RegistrationStatus.WAITLISTED,
          RegistrationStatus.COMPLETED,
          RegistrationStatus.NO_SHOW,
        ],
        includeSession: true,
      };

      const response = await getCurrentUserRegistrations(query);
      if (response?.data) {
        setRegistrations(response.data);
      } else {
        setRegistrations([]);
      }
    } catch (error) {
      console.error("Failed to load registrations:", error);
      setRegistrations([]);
    }
  };

  const handleLogout = () => {
    clear();
  };

  const handleEditProfile = () => {
    editForm.setFieldsValue({
      firstName: user?.firstName,
      lastName: user?.lastName,
      phoneNumber: (user as any)?.phoneNumber || "",
    });
    setIsEditModalVisible(true);
  };

  const handleEditProfileSubmit = async (values: any) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await updateUser(user.id, values);
      setUser(response.data);
      message.success("Profile updated successfully");
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      await changePassword(values.currentPassword, values.newPassword);
      message.success("Password updated successfully");
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      console.error("Error updating password:", error);
      message.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSession = async (sessionId: number) => {
    try {
      await cancelSessionRegistration(sessionId);
      message.success("Successfully cancelled session registration");
      loadUserSessions(); // Refresh the sessions
    } catch (error) {
      console.error("Failed to cancel session:", error);
      message.error("Failed to cancel session registration");
    }
  };

  const handleSessionClick = (session: ISession) => {
    setSelectedSession(session);
    setIsSessionModalVisible(true);
  };

  const handleSessionModalClose = () => {
    setIsSessionModalVisible(false);
    setSelectedSession(null);
  };

  const getRegistrationForSession = (
    sessionId: number
  ): IRegistration | null => {
    const registration = registrations.find(
      (reg) => reg.sessionId === sessionId
    );
    return registration || null;
  };

  const handleRegistrationChange = () => {
    // Refresh both registrations AND sessions data
    loadRegistrations();
    loadUserSessions();
  };

  const getSkillLevelColor = (skillLevel: LEVELS): string => {
    switch (skillLevel.toLowerCase()) {
      case LEVELS.Beginner.toLowerCase():
        return "green";
      case LEVELS.Intermediate.toLowerCase():
        return "blue";
      case LEVELS.Advanced.toLowerCase():
        return "red";
      default:
        return "default";
    }
  };

  const renderSkillLevels = (inModal: boolean = false) => (
    <Space size={4} wrap={!inModal}>
      {selectedSession?.skillLevels.map((level: LEVELS, index: number) => (
        <Tag
          key={index}
          color={getSkillLevelColor(level)}
          className={inModal ? "text-lg px-4 py-1" : ""}
        >
          {level}
        </Tag>
      ))}
    </Space>
  );

  const renderRegistrationStatus = () => {
    if (!selectedSession) return null;

    const registration = getRegistrationForSession(selectedSession.id);
    if (!registration) return null;

    const isWaitlisted = registration.status === RegistrationStatus.WAITLISTED;
    const isCompleted = registration.status === RegistrationStatus.COMPLETED;
    const isNoShow = registration.status === RegistrationStatus.NO_SHOW;
    const waitlistPosition = isWaitlisted ? registration.position : null;

    if (isWaitlisted) {
      return (
        <div>
          <Text strong className="block mb-2">
            Waitlist Position
          </Text>
          <Tag color="orange">Position #{waitlistPosition}</Tag>
        </div>
      );
    }

    if (isCompleted) {
      return (
        <div>
          <Text strong className="block mb-2">
            Registration Status
          </Text>
          <Tag color="green">Attended</Tag>
        </div>
      );
    }

    if (isNoShow) {
      return (
        <div>
          <Text strong className="block mb-2">
            Registration Status
          </Text>
          <Tag color="red">No Show</Tag>
        </div>
      );
    }

    // Default for active registration
    return (
      <div>
        <Text strong className="block mb-2">
          Registration Status
        </Text>
        <Tag color="blue">Registered</Tag>
      </div>
    );
  };

  const getButtonProps = (isModalButton = false) => {
    if (!selectedSession) return {};

    const registration = getRegistrationForSession(selectedSession.id);
    const isRegistered = !!registration;
    const isWaitlisted = registration?.status === RegistrationStatus.WAITLISTED;
    const isCompleted = registration?.status === RegistrationStatus.COMPLETED;
    const isNoShow = registration?.status === RegistrationStatus.NO_SHOW;

    const baseClassName =
      "!bg-nyu-purple !border-nyu-purple hover:!bg-nyu-purple-light hover:!border-nyu-purple-light";
    const grayClassName =
      "!bg-gray-400 !border-gray-400 hover:!bg-gray-500 hover:!border-gray-500";

    const baseProps = {
      loading: isLoading,
    };

    // If not logged in, show login button
    if (!user) {
      return {
        ...baseProps,
        children: "Log in",
        type: "primary" as const,
        disabled: false,
        className: grayClassName,
      };
    }

    // Handle different session statuses
    switch (selectedSession.status) {
      case "CLOSED":
        return {
          ...baseProps,
          children: "Closed",
          disabled: true,
          type: "default" as const,
        };
      case "VIEW_ONLY":
        return {
          ...baseProps,
          children: "View Only",
          disabled: true,
          type: "default" as const,
        };
      default:
        // If user has completed the session or was marked as no-show, show status
        if (isCompleted) {
          return {
            children: "Attended",
            disabled: true,
            type: "default" as const,
            className: "!bg-green-100 !border-green-300 !text-green-700",
          };
        }

        if (isNoShow) {
          return {
            children: "No Show",
            disabled: true,
            type: "default" as const,
            className: "!bg-red-100 !border-red-300 !text-red-700",
          };
        }

        // If user is registered, show unregister button
        if (isRegistered) {
          return {
            ...baseProps,
            children: isWaitlisted ? "Remove from Waitlist" : "Unregister",
            type: "primary" as const,
            danger: true,
            className: baseClassName,
          };
        }

        // Default: show register button
        return {
          ...baseProps,
          children: "Register",
          type: "primary" as const,
          className: baseClassName,
        };
    }
  };

  const handleModalButtonClick = () => {
    if (!selectedSession) return;

    const registration = getRegistrationForSession(selectedSession.id);
    const isRegistered = !!registration;

    if (!user) {
      message.info("Please log in to register for sessions");
      return;
    }

    if (isRegistered) {
      handleUnregister();
    } else {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    if (!user?.id || !selectedSession) {
      message.error("Please log in to register for sessions");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createRegistration({
        userId: user.id,
        sessionId: selectedSession.id,
      });

      if (response.data.position === 0) {
        message.success("Successfully registered for the session!");
      } else {
        message.success(
          `Added to waitlist at position ${response.data.position}`
        );
      }

      setIsSessionModalVisible(false);
      handleRegistrationChange();
    } catch (error) {
      console.error("Registration failed:", error);
      message.error("Failed to register for session. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!selectedSession) return;

    const registration = getRegistrationForSession(selectedSession.id);
    if (!registration?.id) {
      message.error("Registration not found");
      return;
    }

    setIsLoading(true);
    try {
      await deleteRegistration(registration.id);
      message.success("Successfully unregistered from the session");
      setIsSessionModalVisible(false);
      handleRegistrationChange();
    } catch (error) {
      console.error("Unregistration failed:", error);
      message.error("Failed to unregister from session. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  const formatTime = (timeString: string) => {
    return dayjs(timeString, "HH:mm").format("h:mm A");
  };

  const getSessionStatus = (session: ISession) => {
    const now = dayjs();
    const sessionDate = dayjs(session.date);

    if (sessionDate.isBefore(now, "day")) {
      return <Tag color="default">Completed</Tag>;
    } else if (sessionDate.isSame(now, "day")) {
      return <Tag color="processing">Today</Tag>;
    } else {
      return <Tag color="blue">Upcoming</Tag>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
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
                  Member since{" "}
                  {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="text-gray-900">
                    {(user as any)?.phoneNumber || "Not provided"}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    icon={<EditOutlined />}
                    onClick={handleEditProfile}
                    block
                  >
                    Edit Profile
                  </Button>
                  <Button
                    icon={<LockOutlined />}
                    onClick={() => setIsPasswordModalVisible(true)}
                    block
                  >
                    Change Password
                  </Button>
                </div>

                <Button
                  icon={<BellOutlined />}
                  onClick={() => setIsPreferencesModalVisible(true)}
                  block
                >
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
                <Button
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  danger
                  block
                >
                  Logout
                </Button>
              </div>
            </Card>
          </div>

          {/* Sessions Tabs */}
          <div className="lg:col-span-2">
            <Card>
              <div className="mb-4">
                <Radio.Group
                  value={activeSessionTab}
                  onChange={(e) => setActiveSessionTab(e.target.value)}
                  buttonStyle="solid"
                  className="w-full"
                >
                  <Radio.Button value="upcoming">
                    <CalendarOutlined className="mr-2" />
                    Upcoming Sessions
                    {upcomingSessions.length > 0 && (
                      <Tag className="ml-2" color="blue">
                        {upcomingSessions.length}
                      </Tag>
                    )}
                  </Radio.Button>
                  <Radio.Button value="past">
                    <HistoryOutlined className="mr-2" />
                    Past Sessions
                    {pastSessions.length > 0 && (
                      <Tag className="ml-2" color="default">
                        {pastSessions.length}
                      </Tag>
                    )}
                  </Radio.Button>
                </Radio.Group>
              </div>

              <Spin spinning={sessionsLoading}>
                {activeSessionTab === "upcoming" ? (
                  upcomingSessions.length > 0 ? (
                    <List
                      dataSource={upcomingSessions}
                      renderItem={(session) => (
                        <List.Item
                          key={session.id}
                          className="cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleSessionClick(session)}
                          actions={[
                            <Popconfirm
                              title="Cancel Registration"
                              description="Are you sure you want to cancel your registration for this session?"
                              onConfirm={(e) => {
                                e?.stopPropagation();
                                handleCancelSession(session.id);
                              }}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                size="small"
                                danger
                                onClick={(e) => e.stopPropagation()}
                              >
                                Cancel
                              </Button>
                            </Popconfirm>,
                          ]}
                        >
                          <List.Item.Meta
                            title={
                              <Space>
                                <span className="font-semibold">
                                  {session.name}
                                </span>
                                {getSessionStatus(session)}
                              </Space>
                            }
                            description={
                              <div className="text-sm text-gray-600">
                                <div>
                                  {formatDate(session.date)} at{" "}
                                  {formatTime(session.time)}
                                </div>
                                <div>{session.location}</div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                      className="max-h-96 overflow-y-auto"
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarOutlined className="text-4xl mb-4" />
                      <p>No upcoming sessions</p>
                    </div>
                  )
                ) : pastSessions.length > 0 ? (
                  <List
                    dataSource={pastSessions}
                    renderItem={(session) => (
                      <List.Item
                        key={session.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleSessionClick(session)}
                      >
                        <List.Item.Meta
                          title={
                            <Space>
                              <span className="font-semibold">
                                {session.name}
                              </span>
                              {getSessionStatus(session)}
                            </Space>
                          }
                          description={
                            <div className="text-sm text-gray-600">
                              <div>
                                {formatDate(session.date)} at{" "}
                                {formatTime(session.time)}
                              </div>
                              <div>{session.location}</div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                    className="max-h-96 overflow-y-auto"
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <HistoryOutlined className="text-4xl mb-4" />
                    <p>No past sessions</p>
                  </div>
                )}
              </Spin>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditProfileSubmit}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone Number">
            <Input placeholder="Optional" />
          </Form.Item>
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setIsEditModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              { required: true, message: "Current password is required" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "New password is required" },
              { min: 8, message: "Password must be at least 8 characters" },
              {
                validator(_, value) {
                  if (!value || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                  );
                },
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Passwords do not match");
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setIsPasswordModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Change Password
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Email Preferences Modal */}
      <Modal
        title="Email Preferences"
        open={isPreferencesModalVisible}
        onCancel={() => setIsPreferencesModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          form={preferencesForm}
          layout="vertical"
          onFinish={() => {
            message.success("Preferences updated");
            setIsPreferencesModalVisible(false);
          }}
        >
          <Form.Item
            name="sessionReminders"
            label="Session Reminders"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="sessionCancellations"
            label="Session Cancellations"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="clubAnnouncements"
            label="Club Announcements"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setIsPreferencesModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save Preferences
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Session Details Modal */}
      <Modal
        open={isSessionModalVisible}
        onCancel={handleSessionModalClose}
        footer={
          // Only show footer with register/unregister button for upcoming sessions
          upcomingSessions.some((session) => session.id === selectedSession?.id)
            ? [
                <>
                  {!user && (
                    <Text type="secondary" className="block mb-2">
                      Please log in to register for this session
                    </Text>
                  )}
                  <Button
                    key="register"
                    type="primary"
                    size="large"
                    {...getButtonProps(true)}
                    onClick={handleModalButtonClick}
                  />
                </>,
              ]
            : null
        }
        width={800}
        title={
          <div className="flex justify-between items-center">
            <Title level={3} className="mb-0">
              {selectedSession?.name}
            </Title>
            {renderSkillLevels(true)}
          </div>
        }
      >
        {selectedSession && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <Text strong className="block mb-2">
                Location
              </Text>
              <Text>{selectedSession.location}</Text>
            </div>
            <div>
              <Text strong className="block mb-2">
                Date & Time
              </Text>
              <Text>
                {selectedSession.date} at {selectedSession.time}
              </Text>
            </div>
            <div>
              <Text strong className="block mb-2">
                Available Spots
              </Text>
              <Text>
                {selectedSession.spotsAvailable} / {selectedSession.spotsTotal}
              </Text>
            </div>
            <div>
              <Text strong className="block mb-2">
                Status
              </Text>
              <Tag
                color={selectedSession.status === "OPEN" ? "green" : "orange"}
              >
                {selectedSession.status}
              </Tag>
            </div>
            {renderRegistrationStatus()}
          </div>
        )}

        {selectedSession?.notes && (
          <div className="mb-8">
            <Text strong className="block mb-2">
              Additional Notes
            </Text>
            <Paragraph>{selectedSession.notes}</Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Profile;
