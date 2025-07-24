import React, { FC, useState } from "react";
import { Card, Button, Tag, Typography, Modal, Space } from "antd";
import { ISession } from "interfaces/session.interface";
import { ButtonProps } from "antd/lib/button";
import { LEVELS } from "../../constants/enum/levels.enum";
import { IRegistration } from "interfaces/registration.interface";
import { RegistrationStatus } from "constants/enum/registration.status.enum";

const { Text, Title, Paragraph } = Typography;

interface SessionCardProps {
  session: ISession;
  isLoggedIn: boolean;
  registration?: IRegistration | null;
}

const SessionCard: FC<SessionCardProps> = ({
  session,
  isLoggedIn,
  registration,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isRegistered = !!registration;
  const isWaitlisted = registration?.status === RegistrationStatus.WAITLISTED;
  const isCompleted = registration?.status === RegistrationStatus.COMPLETED;
  const isNoShow = registration?.status === RegistrationStatus.NO_SHOW;
  const isActiveRegistration =
    registration?.status === RegistrationStatus.REGISTERED;
  const waitlistPosition = isWaitlisted ? registration.position : null;

  const getButtonProps = (
    isModalButton = false
  ): ButtonProps & { className?: string } => {
    const baseClassName =
      "!bg-nyu-purple !border-nyu-purple hover:!bg-nyu-purple-light hover:!border-nyu-purple-light";

    const grayClassName =
      "!bg-gray-400 !border-gray-400 hover:!bg-gray-500 hover:!border-gray-500";

    // If not logged in, show login button
    if (!isLoggedIn) {
      return {
        children: "Log in",
        type: "primary",
        disabled: false,
        className: grayClassName,
      };
    }

    // Handle different session statuses
    switch (session.status) {
      case "CLOSED":
        return {
          children: "Closed",
          disabled: true,
          type: "default",
        };
      case "VIEW_ONLY":
        return {
          children: "View Only",
          disabled: true,
          type: "default",
        };
      default:
        // If user has completed the session or was marked as no-show, show status
        if (isCompleted) {
          return {
            children: "Attended",
            disabled: true,
            type: "default",
            className: "!bg-green-100 !border-green-300 !text-green-700",
          };
        }

        if (isNoShow) {
          return {
            children: "No Show",
            disabled: true,
            type: "default",
            className: "!bg-red-100 !border-red-300 !text-red-700",
          };
        }

        // If user is actively registered or waitlisted, show unregister button
        if (isActiveRegistration || isWaitlisted) {
          return {
            children: isWaitlisted ? "Leave Waitlist" : "Unregister",
            type: "primary",
            disabled: false,
            className:
              "!bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700",
            style: { backgroundColor: "#dc2626" },
          };
        }

        // For modal button, show more detailed text
        if (isModalButton) {
          if (session.spotsAvailable === 0) {
            return {
              children: "Join Waitlist",
              type: "primary",
              disabled: false,
              className: baseClassName,
              style: { backgroundColor: "#57068c" },
            };
          }
          return {
            children: "Register for Session",
            type: "primary",
            disabled: false,
            className: baseClassName,
            style: { backgroundColor: "#57068c" },
          };
        }

        // For card button, show shorter text
        if (session.spotsAvailable === 0) {
          return {
            children: "Join Waitlist",
            type: "primary",
            disabled: false,
            className: baseClassName,
            style: { backgroundColor: "#57068c" },
          };
        }
        return {
          children: "Register",
          type: "primary",
          disabled: false,
          className: baseClassName,
          style: { backgroundColor: "#57068c" },
        };
    }
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

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleModalButtonClick = () => {};

  const renderRegistrationStatus = () => {
    if (!isRegistered) return null;

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

  const renderSkillLevels = (inModal: boolean = false) => (
    <Space size={4} wrap={!inModal}>
      {session.skillLevels.map((level: LEVELS, index: number) => (
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

  return (
    <>
      <Card
        title={session.name}
        extra={renderSkillLevels()}
        className="mb-4 cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
        onClick={handleCardClick}
      >
        <div className="flex flex-col gap-2">
          <div>
            <Text strong>Location: </Text>
            <Text>{session.location}</Text>
          </div>
          <div>
            <Text strong>Date: </Text>
            <Text>{session.date}</Text>
          </div>
          <div>
            <Text strong>Time: </Text>
            <Text>{session.time}</Text>
          </div>
          <div>
            <Text strong>Available Spots: </Text>
            <Text>
              {session.spotsAvailable} / {session.spotsTotal}
            </Text>
          </div>
          <div className="min-h-[24px]">
            {isWaitlisted && (
              <>
                <Text strong>Waitlist Position: </Text>
                <Tag color="orange">#{waitlistPosition}</Tag>
              </>
            )}
          </div>
          <div className="mt-4">
            <Button
              {...getButtonProps(false)}
              block
              onClick={(e) => handleCardClick()}
            />
          </div>
        </div>
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <>
            {!isLoggedIn && (
              <Text type="secondary" className="block mb-2">
                Please log in to register for this session
              </Text>
            )}
            <Button
              key="register"
              type="primary"
              size="large"
              {...getButtonProps(true)}
              onClick={(e) => console.log("hello")}
            />
          </>,
        ]}
        width={800}
        title={
          <div className="flex justify-between items-center">
            <Title level={3} className="mb-0">
              {session.name}
            </Title>
            {renderSkillLevels(true)}
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <Text strong className="block mb-2">
              Location
            </Text>
            <Text>{session.location}</Text>
          </div>
          <div>
            <Text strong className="block mb-2">
              Date & Time
            </Text>
            <Text>
              {session.date} at {session.time}
            </Text>
          </div>
          <div>
            <Text strong className="block mb-2">
              Available Spots
            </Text>
            <Text>
              {session.spotsAvailable} / {session.spotsTotal}
            </Text>
          </div>
          <div>
            <Text strong className="block mb-2">
              Status
            </Text>
            <Tag color={session.status === "OPEN" ? "green" : "orange"}>
              {session.status}
            </Tag>
          </div>
          {renderRegistrationStatus()}
        </div>

        {session.notes && (
          <div className="mb-8">
            <Text strong className="block mb-2">
              Additional Notes
            </Text>
            <Paragraph>{session.notes}</Paragraph>
          </div>
        )}
      </Modal>
    </>
  );
};

export default SessionCard;
