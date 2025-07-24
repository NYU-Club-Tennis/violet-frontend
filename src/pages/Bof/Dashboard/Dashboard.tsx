import React, { FC, useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { getTotalUsersCount } from "actions/user.action";
import { getActiveSessionsCount } from "actions/session.action";
import { getActiveRegistrationsCount } from "actions/registration.action";

const Dashboard: FC = () => {
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card loading={loading.users}>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#57068c" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={loading.sessions}>
            <Statistic
              title="Active Sessions"
              value={stats.totalSessions}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#57068c" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={loading.registrations}>
            <Statistic
              title="Active Registrations"
              value={stats.activeRegistrations}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#57068c" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
