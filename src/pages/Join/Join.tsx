import { getSessionPaginate } from "actions/session.action";
import React, { FC, useEffect, useState } from "react";
import { AuthStore } from "stores/auth.store";
import { Pagination, Row, Col, Spin, Radio } from "antd";
import SessionCard from "components/features/SessionCard";
import { ISession } from "interfaces/session.interface";
import {
  LoadingOutlined,
  CalendarOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { IPaginateResponse } from "interfaces/common.interface";
import { getCurrentUser } from "actions/user.action";
import { getCurrentUserRegistrations } from "actions/registration.action";
import { IRegistration } from "interfaces/registration.interface";
import { RegistrationStatus } from "constants/enum/registration.status.enum";
import axios from "axios";

const Join: FC = () => {
  const { token, user, setUser } = AuthStore();
  const [availableSessions, setAvailableSessions] = useState<ISession[]>([]);
  const [pastSessions, setPastSessions] = useState<ISession[]>([]);
  const [registrations, setRegistrations] = useState<IRegistration[]>([]);
  const [availableTotal, setAvailableTotal] = useState(0);
  const [pastTotal, setPastTotal] = useState(0);
  const [availablePage, setAvailablePage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [activeTab, setActiveTab] = useState("available");
  const pageSize = 9;

  const fetchSessions = async (
    page: number,
    type: "available" | "past" = "available"
  ) => {
    setLoading(true);
    try {
      const { data: response } = await getSessionPaginate({
        page,
        limit: pageSize,
        sortOptions: [{ createdAt: "DESC" }],
      });

      // Filter sessions based on status
      const availableSessions = response.data.filter(
        (session) => session.status !== "CLOSED"
      );
      const pastSessions = response.data.filter(
        (session) => session.status === "CLOSED"
      );

      if (type === "available") {
        setAvailableSessions(availableSessions);
        setAvailableTotal(availableSessions.length);
      } else {
        setPastSessions(pastSessions);
        setPastTotal(pastSessions.length);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSessions = async (page: number) => {
    await fetchSessions(page, "available");
  };

  const fetchPastSessions = async (page: number) => {
    await fetchSessions(page, "past");
  };

  const fetchRegistrations = async () => {
    if (!token) {
      return;
    }

    setLoadingRegistrations(true);
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
        console.warn("No data in registration response");
        setRegistrations([]);
      }
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response);
      }
      setRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser?.data) {
          setUser(currentUser.data);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    initializeUser();
  }, [setUser]); // Only run when setUser changes (which should be never)

  useEffect(() => {
    fetchSessions(availablePage, "available");
  }, [availablePage]); // Only run when page changes

  useEffect(() => {
    if (token) {
      fetchRegistrations();
    } else {
      setRegistrations([]);
    }
  }, [token, user?.id]); // Also watch for user ID changes

  const handlePageChange = (page: number) => {
    if (activeTab === "available") {
      setAvailablePage(page);
    } else {
      setPastPage(page);
    }
  };

  const handleRegistrationChange = () => {
    // Refresh both registrations AND sessions data
    fetchRegistrations();
    if (activeTab === "available") {
      fetchSessions(availablePage, "available");
    } else {
      fetchSessions(pastPage, "past");
    }
  };

  const getRegistrationForSession = (
    sessionId: number
  ): IRegistration | null => {
    if (loadingRegistrations) {
      return null;
    }

    const registration = registrations.find(
      (reg) => reg.sessionId === sessionId
    );

    return registration || null;
  };

  const handleTabChange = (e: any) => {
    setActiveTab(e.target.value);
    if (e.target.value === "available") {
      fetchSessions(availablePage, "available");
    } else {
      fetchSessions(pastPage, "past");
    }
  };

  const renderSessions = (
    sessions: ISession[],
    total: number,
    currentPage: number
  ) => (
    <>
      <Row gutter={[16, 16]}>
        {sessions.map((session) => (
          <Col xs={24} sm={12} lg={8} key={session.id}>
            <SessionCard
              session={session}
              isLoggedIn={!!token}
              registration={getRegistrationForSession(session.id)}
              onRegistrationChange={handleRegistrationChange}
            />
          </Col>
        ))}
      </Row>
      {total > pageSize && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8 pt-36">
      <h1 className="text-2xl font-bold mb-6">Sessions</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <Radio.Group
              value={activeTab}
              onChange={handleTabChange}
              buttonStyle="solid"
              className="w-full"
            >
              <Radio.Button value="available">
                <CalendarOutlined className="mr-2" />
                Available Sessions
                {availableTotal > 0 && (
                  <span className="ml-2 text-gray-500">({availableTotal})</span>
                )}
              </Radio.Button>
              <Radio.Button value="past">
                <HistoryOutlined className="mr-2" />
                Past Sessions
                {pastTotal > 0 && (
                  <span className="ml-2 text-gray-500">({pastTotal})</span>
                )}
              </Radio.Button>
            </Radio.Group>
          </div>

          {activeTab === "available" ? (
            availableSessions.length > 0 ? (
              renderSessions(availableSessions, availableTotal, availablePage)
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarOutlined className="text-4xl mb-4" />
                <p>No available sessions</p>
              </div>
            )
          ) : pastSessions.length > 0 ? (
            renderSessions(pastSessions, pastTotal, pastPage)
          ) : (
            <div className="text-center py-8 text-gray-500">
              <HistoryOutlined className="text-4xl mb-4" />
              <p>No past sessions</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Join;
