import React, { FC } from "react";
import {
  Card,
  Select,
  Radio,
  List,
  Tag,
  Space,
  Button,
  Spin,
  Popconfirm,
} from "antd";
import { CalendarOutlined, HistoryOutlined } from "@ant-design/icons";
import { ISession } from "interfaces/session.interface";
import dayjs from "dayjs";

interface SessionsSectionProps {
  upcomingSessions: ISession[];
  pastSessions: ISession[];
  sessionsLoading: boolean;
  activeSessionTab: "upcoming" | "past";
  isMobile: boolean;
  onTabChange: (tab: "upcoming" | "past") => void;
  onSessionClick: (session: ISession) => void;
  onCancelSession: (sessionId: number) => void;
}

const SessionsSection: FC<SessionsSectionProps> = ({
  upcomingSessions,
  pastSessions,
  sessionsLoading,
  activeSessionTab,
  isMobile,
  onTabChange,
  onSessionClick,
  onCancelSession,
}) => {
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

  const renderSessionList = (
    sessions: ISession[],
    showCancelButton: boolean = false
  ) => (
    <List
      dataSource={sessions}
      renderItem={(session) => (
        <List.Item
          key={session.id}
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onSessionClick(session)}
          actions={
            showCancelButton
              ? [
                  <Popconfirm
                    title="Cancel Registration"
                    description="Are you sure you want to cancel your registration for this session?"
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      onCancelSession(session.id);
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
                ]
              : undefined
          }
        >
          <List.Item.Meta
            title={
              <Space>
                <span className="font-semibold">{session.name}</span>
                {getSessionStatus(session)}
              </Space>
            }
            description={
              <div className="text-sm text-gray-600">
                <div>
                  {formatDate(session.date)} at {formatTime(session.time)}
                </div>
                <div>{session.location}</div>
              </div>
            }
          />
        </List.Item>
      )}
      className="max-h-96 overflow-y-auto"
    />
  );

  const renderEmptyState = (isUpcoming: boolean) => (
    <div className="text-center py-8 text-gray-500">
      {isUpcoming ? (
        <>
          <CalendarOutlined className="text-4xl mb-4" />
          <p>No upcoming sessions</p>
        </>
      ) : (
        <>
          <HistoryOutlined className="text-4xl mb-4" />
          <p>No past sessions</p>
        </>
      )}
    </div>
  );

  return (
    <Card>
      <div className="mb-4">
        {isMobile ? (
          <Select
            value={activeSessionTab}
            onChange={onTabChange}
            style={{ width: "100%" }}
            className="[&_.ant-select-selector]:!rounded-xl"
          >
            <Select.Option value="upcoming">
              <span className="flex items-center">
                <CalendarOutlined className="mr-2" />
                Upcoming Sessions
                {upcomingSessions.length > 0 && (
                  <Tag className="ml-2" color="blue">
                    {upcomingSessions.length}
                  </Tag>
                )}
              </span>
            </Select.Option>
            <Select.Option value="past">
              <span className="flex items-center">
                <HistoryOutlined className="mr-2" />
                Past Sessions
                {pastSessions.length > 0 && (
                  <Tag className="ml-2" color="default">
                    {pastSessions.length}
                  </Tag>
                )}
              </span>
            </Select.Option>
          </Select>
        ) : (
          <Radio.Group
            value={activeSessionTab}
            onChange={(e) => onTabChange(e.target.value)}
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
        )}
      </div>

      <Spin spinning={sessionsLoading}>
        {activeSessionTab === "upcoming"
          ? upcomingSessions.length > 0
            ? renderSessionList(upcomingSessions, true)
            : renderEmptyState(true)
          : pastSessions.length > 0
          ? renderSessionList(pastSessions, false)
          : renderEmptyState(false)}
      </Spin>
    </Card>
  );
};

export default SessionsSection;
