import React, { FC } from "react";
import { Card, Button, Tag, Typography } from "antd";
import { ISession } from "interfaces/session.interface";
import { ButtonProps } from "antd/lib/button";
import classNames from "classnames";

const { Text } = Typography;

interface SessionCardProps {
  session: ISession;
  isLoggedIn: boolean;
  isRegistered?: boolean;
}

const SessionCard: FC<SessionCardProps> = ({
  session,
  isLoggedIn,
  isRegistered,
}) => {
  const getButtonProps = (): ButtonProps & { className?: string } => {
    if (!isLoggedIn) {
      return {
        children: "Login to Register",
        disabled: true,
        type: "default",
      };
    }

    if (isRegistered) {
      return {
        children: "Registered",
        type: "primary",
        disabled: true,
        className:
          "!bg-nyu-purple !border-nyu-purple hover:!bg-nyu-purple-light hover:!border-nyu-purple-light",
        style: { backgroundColor: "#57068c" },
      };
    }

    if (session.spotsAvailable === 0) {
      return {
        children: "No Spots Available",
        disabled: true,
        type: "default",
      };
    }

    return {
      children: "Register",
      type: "primary",
      disabled: false,
      className:
        "!bg-nyu-purple !border-nyu-purple hover:!bg-nyu-purple-light hover:!border-nyu-purple-light",
      style: { backgroundColor: "#57068c" },
    };
  };

  const getSkillLevelColor = (skillLevel: string): string => {
    switch (skillLevel.toLowerCase()) {
      case "beginner":
        return "green";
      case "intermediate":
        return "blue";
      case "advanced":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <Card
      title={session.name}
      extra={
        <Tag color={getSkillLevelColor(session.skillLevel)}>
          {session.skillLevel}
        </Tag>
      }
      className="mb-4"
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
        <div className="mt-4">
          <Button {...getButtonProps()} block />
        </div>
      </div>
    </Card>
  );
};

export default SessionCard;
