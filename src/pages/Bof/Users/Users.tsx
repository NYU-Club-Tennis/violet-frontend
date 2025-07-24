import React, { FC, useEffect, useState } from "react";
import { Table, Input, Button, Tag, Space, Pagination } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { getUsersPaginate } from "actions/user.action";
import { IUser } from "interfaces/user.interface";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;

const Users: FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const fetchUsers = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const query = {
        page,
        limit: pageSize,
        sortOptions: [{ createdAt: "DESC" }],
        ...(search && { search }),
      };

      const response = await getUsersPaginate(query);
      setUsers(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchUsers(1, value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnsType<IUser> = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <Space>
          <UserOutlined />
          {`${record.firstName} ${record.lastName}`}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone) => phone || "N/A",
    },
    {
      title: "Role",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin) => (
        <Tag color={isAdmin ? "red" : "blue"}>{isAdmin ? "Admin" : "User"}</Tag>
      ),
    },
    {
      title: "No-Show Count",
      dataIndex: "noShowCount",
      key: "noShowCount",
      render: (count) => (
        <Tag color={count > 0 ? "orange" : "green"}>{count || 0}</Tag>
      ),
    },
    {
      title: "Last Sign In",
      dataIndex: "lastSignInAt",
      key: "lastSignInAt",
      render: (date) => {
        if (!date) return "Never";
        return new Date(date).toLocaleDateString();
      },
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="flex gap-4">
          <Search
            placeholder="Search users by name or email"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={false}
          rowKey="id"
          scroll={{ x: 800 }}
        />

        {total > pageSize && (
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} users`
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
