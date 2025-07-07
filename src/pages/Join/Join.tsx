import { getSessionPaginate } from "actions/session.action";
import React, { FC, useEffect, useState } from "react";
import { AuthStore } from "stores/auth.store";
import { Pagination, Row, Col, Spin } from "antd";
import SessionCard from "components/features/SessionCard";
import { ISession } from "interfaces/session.interface";
import { LoadingOutlined } from "@ant-design/icons";
import { IPaginateResponse } from "interfaces/common.interface";

const Join: FC = () => {
  const { token, user } = AuthStore();
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 9;

  const fetchSessions = async (page: number) => {
    setLoading(true);
    try {
      const { data: response } = await getSessionPaginate({
        page,
        limit: pageSize,
        sortOptions: [{ createdAt: "DESC" }],
      });
      setSessions(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // TODO: Replace with actual registration check
  const isRegistered = (sessionId: number) => false;

  return (
    <div className="container mx-auto px-4 py-8 pt-36">
      <h1 className="text-2xl font-bold mb-6">Available Sessions</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {sessions.map((session) => (
              <Col xs={24} sm={12} lg={8} key={session.id}>
                <SessionCard
                  session={session}
                  isLoggedIn={!!token}
                  isRegistered={isRegistered(session.id)}
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
      )}
    </div>
  );
};

export default Join;
