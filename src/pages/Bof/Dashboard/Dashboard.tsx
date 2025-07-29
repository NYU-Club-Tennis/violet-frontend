import React, { FC, useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { getTotalUsersCount } from "actions/user.action";
import { getActiveSessionsCount } from "actions/session.action";
import { getActiveRegistrationsCount } from "actions/registration.action";

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    activeRegistrations: 0,
  });
  const [loading, setLoading] = useState({
    users: false,
    sessions: false,
    registrations: false,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading({ users: true, sessions: true, registrations: true });

      try {
        // Fetch all counts in parallel
        const [
          userCountResponse,
          sessionCountResponse,
          registrationCountResponse,
        ] = await Promise.all([
          getTotalUsersCount(),
          getActiveSessionsCount(),
          getActiveRegistrationsCount(),
        ]);

        setStats({
          totalUsers: userCountResponse.data.count,
          totalSessions: sessionCountResponse.data.count,
          activeRegistrations: registrationCountResponse.data.count,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Keep placeholder data on error
        setStats({
          totalUsers: 0,
          totalSessions: 0,
          activeRegistrations: 0,
        });
      } finally {
        setLoading({ users: false, sessions: false, registrations: false });
      }
    };

    fetchStats();
  }, []);

  const handleUsersClick = () => {
    navigate("/bof/users");
  };

  const handleSessionsClick = () => {
    navigate("/bof/sessions");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Dashboard
      </h1>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <div
            className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 p-6 cursor-pointer transition-all duration-300 hover:bg-white/80 hover:shadow-3xl hover:scale-105 hover:-translate-y-1"
            onClick={handleUsersClick}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md border border-purple-200/30">
                <UserOutlined className="text-2xl text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {loading.users ? "..." : stats.totalUsers}
            </div>
            <div className="text-gray-600 font-medium">Total Users</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div
            className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 p-6 cursor-pointer transition-all duration-300 hover:bg-white/80 hover:shadow-3xl hover:scale-105 hover:-translate-y-1"
            onClick={handleSessionsClick}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md border border-blue-200/30">
                <CalendarOutlined className="text-2xl text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {loading.sessions ? "..." : stats.totalSessions}
            </div>
            <div className="text-gray-600 font-medium">Active Sessions</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md border border-green-200/30">
                <TeamOutlined className="text-2xl text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {loading.registrations ? "..." : stats.activeRegistrations}
            </div>
            <div className="text-gray-600 font-medium">
              Active Registrations
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
