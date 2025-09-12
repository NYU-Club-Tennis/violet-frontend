import React, { FC } from "react";
import { Modal, Tag, Space, Button, Typography } from "antd";
import { ISession } from "interfaces/session.interface";
import { IRegistration } from "interfaces/registration.interface";
import { IAuthUser } from "interfaces/auth.interface";
import { LEVELS } from "constants/enum/levels.enum";
import { RegistrationStatus } from "constants/enum/registration.status.enum";

const { Text, Title, Paragraph } = Typography;

interface ProfileSessionDetailsModalProps {
  visible: boolean;
  selectedSession: ISession | null;
  user: IAuthUser | null;
  registrations: IRegistration[];
  upcomingSessions: ISession[];
  loading: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

const ProfileSessionDetailsModal: FC<ProfileSessionDetailsModalProps> = ({
  visible,
  selectedSession,
  user,
  registrations,
  upcomingSessions,
  loading,
  onClose,
  onRegisterClick,
}) => {
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

  const getRegistrationForSession = (
    sessionId: number
  ): IRegistration | null => {
    const registration = registrations.find(
      (reg) => reg.sessionId === sessionId
    );
    return registration || null;
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

  const getButtonProps = () => {
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
      loading: loading,
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

  return (
    <Modal
      open={visible}
      onCancel={onClose}
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
                  {...getButtonProps()}
                  onClick={onRegisterClick}
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
            <Tag color={selectedSession.status === "OPEN" ? "green" : "orange"}>
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
  );
};

export default ProfileSessionDetailsModal;
