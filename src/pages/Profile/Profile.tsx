import React, { useEffect, useState } from "react";
import { Form, message } from "antd";
import { AuthStore } from "stores/auth.store";
import {
  updateUser,
  getCurrentUser,
  updateEmailPreferences,
} from "actions/user.action";
import {
  getUserSessions,
  cancelSessionRegistration,
} from "actions/session.action";
import {
  getCurrentUserRegistrations,
  createRegistration,
  deleteRegistration,
} from "actions/registration.action";
import { changePassword } from "actions/auth.action";
import { IAuthUser } from "interfaces/auth.interface";
import { ISession } from "interfaces/session.interface";
import { IRegistration } from "interfaces/registration.interface";
import { RegistrationStatus } from "constants/enum/registration.status.enum";

// Import our new components
import ProfileInfoCard from "./components/ProfileInfoCard";
import SessionsSection from "./components/SessionsSection";
import EditProfileModal, {
  EditProfileFormData,
} from "./components/EditProfileModal";
import ChangePasswordModal, {
  ChangePasswordFormData,
} from "./components/ChangePasswordModal";
import EmailPreferencesModal, {
  EmailPreferencesFormData,
} from "./components/EmailPreferencesModal";
import ProfileSessionDetailsModal from "./components/ProfileSessionDetailsModal";

const Profile = () => {
  const { user, setUser, clear } = AuthStore();

  // Sessions state
  const [upcomingSessions, setUpcomingSessions] = useState<ISession[]>([]);
  const [pastSessions, setPastSessions] = useState<ISession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [activeSessionTab, setActiveSessionTab] = useState<"upcoming" | "past">(
    "upcoming"
  );

  // UI state
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isPreferencesModalVisible, setIsPreferencesModalVisible] =
    useState(false);
  const [isSessionModalVisible, setIsSessionModalVisible] = useState(false);

  // Registration and session detail state
  const [registrations, setRegistrations] = useState<IRegistration[]>([]);
  const [selectedSession, setSelectedSession] = useState<ISession | null>(null);

  // Forms
  const [editForm] = Form.useForm<EditProfileFormData>();
  const [passwordForm] = Form.useForm<ChangePasswordFormData>();
  const [preferencesForm] = Form.useForm<EmailPreferencesFormData>();

  // Load user data, sessions, and registrations on component mount
  useEffect(() => {
    if (user?.id) {
      loadCurrentUser();
      loadUserSessions();
      loadRegistrations();
    }
  }, [user?.id]);

  // Responsive detection for mobile UI tweaks
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      console.log("Upcoming sessions response:", upcomingResponse);
      console.log("Past sessions response:", pastResponse);
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

  // Event handlers
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

  const handleEditProfileSubmit = async (values: EditProfileFormData) => {
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

  const handlePasswordChange = async (values: ChangePasswordFormData) => {
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

  const handleEmailPreferencesSubmit = async (
    values: EmailPreferencesFormData
  ) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await updateEmailPreferences(
        user.id,
        values.sessionNotifications,
        values.clubAnnouncements
      );
      setUser(response.data);
      message.success("Email preferences updated successfully");
      setIsPreferencesModalVisible(false);
    } catch (error) {
      console.error("Error updating email preferences:", error);
      message.error("Failed to update email preferences");
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

  const handleRegistrationChange = () => {
    // Refresh both registrations AND sessions data
    loadRegistrations();
    loadUserSessions();
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

  const getRegistrationForSession = (
    sessionId: number
  ): IRegistration | null => {
    const registration = registrations.find(
      (reg) => reg.sessionId === sessionId
    );
    return registration || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <ProfileInfoCard
              user={user}
              onEditProfile={handleEditProfile}
              onChangePassword={() => setIsPasswordModalVisible(true)}
              onEmailPreferences={() => setIsPreferencesModalVisible(true)}
              onLogout={handleLogout}
            />
          </div>

          {/* Sessions Tabs */}
          <div className="lg:col-span-2">
            <SessionsSection
              upcomingSessions={upcomingSessions}
              pastSessions={pastSessions}
              sessionsLoading={sessionsLoading}
              activeSessionTab={activeSessionTab}
              isMobile={isMobile}
              onTabChange={setActiveSessionTab}
              onSessionClick={handleSessionClick}
              onCancelSession={handleCancelSession}
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={isEditModalVisible}
        loading={isLoading}
        form={editForm}
        onCancel={() => setIsEditModalVisible(false)}
        onSubmit={handleEditProfileSubmit}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={isPasswordModalVisible}
        loading={isLoading}
        form={passwordForm}
        onCancel={() => setIsPasswordModalVisible(false)}
        onSubmit={handlePasswordChange}
      />

      {/* Email Preferences Modal */}
      <EmailPreferencesModal
        visible={isPreferencesModalVisible}
        loading={isLoading}
        user={user}
        form={preferencesForm}
        onCancel={() => setIsPreferencesModalVisible(false)}
        onSubmit={handleEmailPreferencesSubmit}
      />

      {/* Session Details Modal */}
      <ProfileSessionDetailsModal
        visible={isSessionModalVisible}
        selectedSession={selectedSession}
        user={user}
        registrations={registrations}
        upcomingSessions={upcomingSessions}
        loading={isLoading}
        onClose={handleSessionModalClose}
        onRegisterClick={handleModalButtonClick}
      />
    </div>
  );
};

export default Profile;
