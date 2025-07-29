import React, { FC, useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Pagination,
  Select,
  Modal,
  Tabs,
  Avatar,
  Divider,
  Form,
  Input,
  DatePicker,
  TimePicker,
  InputNumber,
  message,
  Radio,
  Card,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CloseOutlined,
  MailOutlined,
} from "@ant-design/icons";
import {
  getSessionPaginate,
  createSession,
  updateSession,
  deleteSession,
} from "actions/session.action";
import {
  getSessionRegistrationsWithUsers,
  markAttendance,
} from "actions/registration.action";
import { sendBulkAnnouncement } from "actions/mail.action";
import {
  ISession,
  ISessionCreate,
  ISessionUpdate,
} from "interfaces/session.interface";
import { IRegistrationWithUser } from "interfaces/registration.interface";
import { SessionStatus } from "constants/enum/session.status.enum";
import { LEVELS } from "constants/enum/levels.enum";
import { RegistrationStatus } from "constants/enum/registration.status.enum";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface CreateSessionFormData {
  name: string;
  location: string;
  date: dayjs.Dayjs;
  time: dayjs.Dayjs;
  skillLevels: LEVELS[];
  spotsTotal: number;
  notes?: string;
}

const Sessions: FC = () => {
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<SessionStatus | undefined>();
  const [selectedSession, setSelectedSession] = useState<ISession | null>(null);
  const [registrationsModalVisible, setRegistrationsModalVisible] =
    useState(false);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [sessionRegistrations, setSessionRegistrations] = useState<
    IRegistrationWithUser[]
  >([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<ISession | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<number | null>(
    null
  );
  const [form] = Form.useForm<CreateSessionFormData>();
  const [editForm] = Form.useForm<CreateSessionFormData>();

  // Email-related state
  const [emailForm] = Form.useForm();
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState<
    "registered" | "waitlist" | "both"
  >("registered");

  const pageSize = 10;

  const fetchSessions = async (page: number, status?: SessionStatus) => {
    setLoading(true);
    try {
      const query = {
        page,
        limit: pageSize,
        sortOptions: [{ date: "ASC" }, { time: "ASC" }] as {
          [key: string]: string;
        }[],
      };

      const response = await getSessionPaginate(query);

      // Filter by status on frontend if provided (since backend might not support status filter)
      let filteredSessions = response.data.data;
      if (status) {
        filteredSessions = response.data.data.filter(
          (session) => session.status === status
        );
      }

      setSessions(filteredSessions);
      setTotal(status ? filteredSessions.length : response.data.total);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionRegistrations = async (sessionId: number) => {
    setRegistrationsLoading(true);
    try {
      const response = await getSessionRegistrationsWithUsers(sessionId);
      setSessionRegistrations(response.data.data);
    } catch (error) {
      console.error("Failed to fetch session registrations:", error);
      setSessionRegistrations([]);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const handleSessionClick = (session: ISession) => {
    setSelectedSession(session);
    setRegistrationsModalVisible(true);
    fetchSessionRegistrations(session.id);
  };

  const handleModalClose = () => {
    setRegistrationsModalVisible(false);
    setSelectedSession(null);
    setSessionRegistrations([]);
    // Reset email form and state
    emailForm.resetFields();
    setEmailRecipients("registered");
  };

  const handleCreateSession = () => {
    setCreateModalVisible(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalVisible(false);
    form.resetFields();
  };

  const handleCreateSubmit = async (values: CreateSessionFormData) => {
    setCreateLoading(true);
    try {
      const sessionData: ISessionCreate = {
        name: values.name,
        location: values.location,
        date: values.date.format("YYYY-MM-DD"),
        time: values.time.format("HH:mm"),
        skillLevels: values.skillLevels,
        spotsTotal: values.spotsTotal,
        spotsAvailable: values.spotsTotal, // Initially all spots available
        status: SessionStatus.OPEN, // Default to OPEN
        notes: values.notes,
      };

      await createSession(sessionData);

      message.success("Session created successfully!");
      handleCreateModalClose();

      // Refresh sessions list
      fetchSessions(currentPage, statusFilter);
    } catch (error: any) {
      console.error("Failed to create session:", error);

      // Handle specific error messages from backend
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        if (Array.isArray(errorMessage)) {
          // Handle validation errors array
          message.error(`Validation error: ${errorMessage.join(", ")}`);
        } else {
          message.error(`Error: ${errorMessage}`);
        }
      } else {
        message.error("Failed to create session. Please try again.");
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEmailSubmit = async (values: {
    header: string;
    subject: string;
    body: string;
  }) => {
    if (!selectedSession) return;

    setEmailLoading(true);
    try {
      // Get recipient emails based on selection
      let recipientEmails: string[] = [];

      if (emailRecipients === "registered") {
        recipientEmails = registeredUsers
          .map((reg) => reg.user?.email)
          .filter(Boolean) as string[];
      } else if (emailRecipients === "waitlist") {
        recipientEmails = waitlistedUsers
          .map((reg) => reg.user?.email)
          .filter(Boolean) as string[];
      } else {
        // both
        recipientEmails = [
          ...registeredUsers.map((reg) => reg.user?.email),
          ...waitlistedUsers.map((reg) => reg.user?.email),
        ].filter(Boolean) as string[];
      }

      if (recipientEmails.length === 0) {
        message.warning("No recipients found for the selected group.");
        return;
      }

      // Create subject with session information
      const sessionDate = dayjs(selectedSession.date).format("MMMM D, YYYY");
      const sessionTime = dayjs(`1970-01-01T${selectedSession.time}`).format(
        "h:mm A"
      );
      const enhancedSubject = `${values.subject} - ${selectedSession.name} - ${sessionDate} at ${selectedSession.location}`;

      await sendBulkAnnouncement({
        emails: recipientEmails,
        header: values.header,
        subject: enhancedSubject,
        body: values.body,
      });

      message.success(
        `Email sent successfully to ${recipientEmails.length} recipient(s)!`
      );
      emailForm.resetFields();
    } catch (error: any) {
      console.error("Failed to send email:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to send email. Please try again.";
      message.error(errorMessage);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleEmailRecipientsChange = (
    value: "registered" | "waitlist" | "both"
  ) => {
    setEmailRecipients(value);
  };

  useEffect(() => {
    fetchSessions(currentPage, statusFilter);
  }, [currentPage]);

  const handleStatusFilter = (status: SessionStatus | undefined) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchSessions(1, status);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditSession = (session: ISession) => {
    setSessionToEdit(session);
    setEditModalVisible(true);

    // Pre-populate the form with current session data
    editForm.setFieldsValue({
      name: session.name,
      location: session.location,
      date: dayjs(session.date),
      time: dayjs(session.time, "HH:mm"),
      skillLevels: session.skillLevels,
      spotsTotal: session.spotsTotal,
      notes: session.notes,
    });
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
    setSessionToEdit(null);
    editForm.resetFields();
  };

  const handleEditSubmit = async (values: CreateSessionFormData) => {
    if (!sessionToEdit) return;

    setEditLoading(true);
    try {
      const spotsDifference = values.spotsTotal - sessionToEdit.spotsTotal;
      const newSpotsAvailable = sessionToEdit.spotsAvailable + spotsDifference;

      const updateData: ISessionUpdate = {
        name: values.name,
        location: values.location,
        date: values.date.format("YYYY-MM-DD"),
        time: values.time.format("HH:mm"),
        skillLevels: values.skillLevels,
        spotsTotal: values.spotsTotal,
        // Ensure available spots never go below 0
        spotsAvailable: Math.max(0, newSpotsAvailable),
        notes: values.notes,
      };

      await updateSession(sessionToEdit.id, updateData);

      message.success("Session updated successfully!");
      handleEditModalClose();

      // Refresh sessions list
      fetchSessions(currentPage, statusFilter);
    } catch (error: any) {
      console.error("Failed to update session:", error);

      // Handle specific error messages from backend
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        if (Array.isArray(errorMessage)) {
          message.error(`Validation error: ${errorMessage.join(", ")}`);
        } else {
          message.error(`Error: ${errorMessage}`);
        }
      } else {
        message.error("Failed to update session. Please try again.");
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteSession = (session: ISession) => {
    // Prevent multiple delete operations
    if (deletingSessionId !== null) {
      message.warning("Please wait for the current operation to complete.");
      return;
    }

    const hasRegistrations = session.spotsAvailable < session.spotsTotal;
    const registeredCount = session.spotsTotal - session.spotsAvailable;

    Modal.confirm({
      title: "Delete Session",
      content: (
        <div>
          <p>Are you sure you want to delete this session?</p>
          <div className="mt-2 p-2 bg-gray-50 rounded">
            <strong>{session.name}</strong>
            <br />
            {session.location}
            <br />
            {new Date(session.date).toLocaleDateString()} at {session.time}
          </div>
          {hasRegistrations && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
              <strong className="text-red-800">⚠️ Warning:</strong>
              <div className="text-red-700">
                This session has {registeredCount} registered user
                {registeredCount !== 1 ? "s" : ""}. Deleting it will remove all
                registrations.
              </div>
            </div>
          )}
          <p className="mt-3 text-gray-600">This action cannot be undone.</p>
        </div>
      ),
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      width: 500,
      onOk: async () => {
        setDeletingSessionId(session.id);
        try {
          await deleteSession(session.id);
          message.success("Session deleted successfully!");

          // Refresh sessions list
          fetchSessions(currentPage, statusFilter);
        } catch (error: any) {
          console.error("Failed to delete session:", error);

          const errorMessage = error?.response?.data?.message;
          if (errorMessage) {
            message.error(`Error: ${errorMessage}`);
          } else {
            message.error("Failed to delete session. Please try again.");
          }
        } finally {
          setDeletingSessionId(null);
        }
      },
    });
  };

  const handleMarkAttendance = async (
    registrationId: number,
    hasAttended: boolean
  ) => {
    try {
      console.log(
        "Marking attendance for registration:",
        registrationId,
        "hasAttended:",
        hasAttended
      );

      const response = await markAttendance(registrationId, hasAttended);
      console.log("Mark attendance response:", response);

      // Update the local state immediately instead of refetching everything
      setSessionRegistrations((prevRegistrations) =>
        prevRegistrations.map((reg) =>
          reg.id === registrationId
            ? {
                ...reg,
                hasAttended: hasAttended,
                status: hasAttended
                  ? RegistrationStatus.COMPLETED
                  : RegistrationStatus.NO_SHOW,
              }
            : reg
        )
      );

      message.success(
        `Attendance marked as ${hasAttended ? "attended" : "no-show"}`
      );
    } catch (error: any) {
      console.error("Failed to mark attendance:", error);

      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        message.error(`Error: ${errorMessage}`);
      } else {
        message.error("Failed to mark attendance. Please try again.");
      }
    }
  };

  const getStatusColor = (status: SessionStatus): string => {
    switch (status) {
      case SessionStatus.OPEN:
        return "green";
      case SessionStatus.FULL:
        return "orange";
      case SessionStatus.VIEW_ONLY:
        return "blue";
      case SessionStatus.CLOSED:
        return "red";
      default:
        return "default";
    }
  };

  const getSkillLevelColor = (level: LEVELS): string => {
    switch (level) {
      case LEVELS.Beginner:
        return "green";
      case LEVELS.Intermediate:
        return "blue";
      case LEVELS.Advanced:
        return "red";
      default:
        return "default";
    }
  };

  const isSessionPast = (session: ISession): boolean => {
    const sessionDateTime = new Date(`${session.date}T${session.time}`);
    return sessionDateTime < new Date();
  };

  const registeredUsers = sessionRegistrations.filter(
    (reg) =>
      reg.status === RegistrationStatus.REGISTERED ||
      reg.status === RegistrationStatus.COMPLETED ||
      reg.status === RegistrationStatus.NO_SHOW
  );
  const waitlistedUsers = sessionRegistrations.filter(
    (reg) => reg.status === RegistrationStatus.WAITLISTED
  );

  const registrationColumns: ColumnsType<IRegistrationWithUser> = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-semibold">
              {record.user?.firstName} {record.user?.lastName}
            </div>
            <div className="text-gray-500 text-sm">{record.user?.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Phone",
      key: "phone",
      render: (_, record) => record.user?.phoneNumber || "N/A",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case "completed":
              return "green";
            case "no_show":
              return "red";
            case "registered":
              return "blue";
            default:
              return "default";
          }
        };

        const getStatusText = (status: string) => {
          switch (status) {
            case "completed":
              return "Attended";
            case "no_show":
              return "No Show";
            case "registered":
              return "Registered";
            default:
              return status;
          }
        };

        return (
          <Tag color={getStatusColor(record.status)}>
            {getStatusText(record.status)}
          </Tag>
        );
      },
    },
    {
      title: "No-Show Count",
      key: "noShowCount",
      render: (_, record) => (
        <Tag color={(record.user?.noShowCount || 0) > 0 ? "orange" : "green"}>
          {record.user?.noShowCount || 0}
        </Tag>
      ),
    },
    {
      title: "Registered At",
      key: "createdAt",
      render: (_, record) => new Date(record.createdAt).toLocaleString(),
    },
  ];

  const attendanceColumns: ColumnsType<IRegistrationWithUser> = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-semibold">
              {record.user?.firstName} {record.user?.lastName}
            </div>
            <div className="text-gray-500 text-sm">{record.user?.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case "completed":
              return "green";
            case "no_show":
              return "red";
            case "registered":
              return "blue";
            default:
              return "default";
          }
        };

        const getStatusText = (status: string) => {
          switch (status) {
            case "completed":
              return "Attended";
            case "no_show":
              return "No Show";
            case "registered":
              return "Registered";
            default:
              return status;
          }
        };

        return (
          <Tag color={getStatusColor(record.status)}>
            {getStatusText(record.status)}
          </Tag>
        );
      },
    },
    {
      title: "Attended",
      key: "hasAttended",
      render: (_, record) => (
        <Tag color={record.hasAttended ? "green" : "default"}>
          {record.hasAttended ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            type="primary"
            className="bg-green-500 hover:!bg-green-600"
            onClick={() => handleMarkAttendance(record.id, true)}
            disabled={record.hasAttended}
          >
            Mark Attended
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleMarkAttendance(record.id, false)}
            disabled={record.status === "no_show"}
          >
            Mark No-Show
          </Button>
        </Space>
      ),
    },
  ];

  const waitlistColumns: ColumnsType<IRegistrationWithUser> = [
    {
      title: "Position",
      key: "position",
      render: (_, record) => <Tag color="orange">#{record.position}</Tag>,
    },
    ...registrationColumns,
  ];

  const columns: ColumnsType<ISession> = [
    {
      title: "Session",
      key: "session",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div className="font-semibold">{record.name}</div>
          <Space size="small">
            <EnvironmentOutlined />
            <span className="text-gray-600">{record.location}</span>
          </Space>
          {isSessionPast(record) && (
            <Tag color="purple">📋 Attendance Available</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Date & Time",
      key: "datetime",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>{new Date(record.date).toLocaleDateString()}</div>
          <div className="text-gray-600">{record.time}</div>
        </Space>
      ),
      sorter: (a, b) => {
        // Combine date and time for proper sorting
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        return dateTimeA.getTime() - dateTimeB.getTime();
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Skill Levels",
      dataIndex: "skillLevels",
      key: "skillLevels",
      render: (skillLevels: LEVELS[]) => (
        <Space size={4} wrap>
          {skillLevels.map((level, index) => (
            <Tag key={index} color={getSkillLevelColor(level)}>
              {level}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Capacity",
      key: "capacity",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <span className="font-semibold">{record.spotsAvailable}</span>
            <span className="text-gray-600">/{record.spotsTotal}</span>
          </div>
          <div className="text-xs text-gray-500">Available/Total</div>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: SessionStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => {
        const dateA = new Date(a.createdAt || "");
        const dateB = new Date(b.createdAt || "");
        return dateA.getTime() - dateB.getTime();
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              handleEditSession(record);
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            type="link"
            danger
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSession(record);
            }}
            loading={deletingSessionId === record.id}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Sessions Management
      </h1>

      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: 150 }}
              onChange={handleStatusFilter}
              value={statusFilter}
              className="[&_.ant-select-selector]:bg-white/70 [&_.ant-select-selector]:backdrop-blur-md [&_.ant-select-selector]:border-white/30 [&_.ant-select-selector]:rounded-xl [&_.ant-select-focused_.ant-select-selector]:bg-white/90 [&_.ant-select-focused_.ant-select-selector]:border-purple-500/50 [&_.ant-select-focused_.ant-select-selector]:shadow-lg [&_.ant-select-focused_.ant-select-selector]:shadow-purple-500/20"
            >
              <Option value={SessionStatus.OPEN}>Open</Option>
              <Option value={SessionStatus.FULL}>Full</Option>
              <Option value={SessionStatus.VIEW_ONLY}>View Only</Option>
              <Option value={SessionStatus.CLOSED}>Closed</Option>
            </Select>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleCreateSession}
            className="bg-gradient-to-r from-purple-500 to-blue-500 border-none rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/40"
          >
            Create Session
          </Button>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
        <Table
          columns={columns}
          dataSource={sessions}
          loading={loading}
          pagination={false}
          rowKey="id"
          scroll={{ x: 1000 }}
          onRow={(record) => ({
            onClick: () => handleSessionClick(record),
            style: { cursor: "pointer" },
          })}
          className="glass-table"
        />
      </div>

      {total > pageSize && (
        <div className="flex justify-center mt-6">
          <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl border border-white/30 p-4 [&_.ant-pagination-item]:bg-white/70 [&_.ant-pagination-item]:backdrop-blur-md [&_.ant-pagination-item]:border-white/30 [&_.ant-pagination-item]:rounded-lg [&_.ant-pagination-item:hover]:bg-white/90 [&_.ant-pagination-item-active]:bg-gradient-to-r [&_.ant-pagination-item-active]:from-purple-500 [&_.ant-pagination-item-active]:to-blue-500 [&_.ant-pagination-item-active]:border-transparent [&_.ant-pagination-item-active]:text-white [&_.ant-pagination-item-active_a]:text-white">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} sessions`
              }
            />
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      <Modal
        title="Create New Session"
        open={createModalVisible}
        onCancel={handleCreateModalClose}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Session Name"
            rules={[
              { required: true, message: "Please enter session name" },
              { min: 3, message: "Session name must be at least 3 characters" },
            ]}
          >
            <Input placeholder="e.g., Sunday Morning Tennis" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="e.g., NYU Tennis Courts" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
            </Form.Item>

            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: "Please select time" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                minuteStep={15}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="skillLevels"
            label="Skill Levels"
            rules={[
              {
                required: true,
                message: "Please select at least one skill level",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select skill levels"
              style={{ width: "100%" }}
            >
              <Option value={LEVELS.Beginner}>
                <Tag color="green">{LEVELS.Beginner}</Tag>
              </Option>
              <Option value={LEVELS.Intermediate}>
                <Tag color="blue">{LEVELS.Intermediate}</Tag>
              </Option>
              <Option value={LEVELS.Advanced}>
                <Tag color="red">{LEVELS.Advanced}</Tag>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="spotsTotal"
            label="Total Spots"
            rules={[
              { required: true, message: "Please enter total spots" },
              { type: "number", min: 1, message: "Must be at least 1 spot" },
              { type: "number", max: 100, message: "Cannot exceed 100 spots" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="e.g., 12"
              min={1}
              max={100}
            />
          </Form.Item>

          <Form.Item name="notes" label="Additional Notes (Optional)">
            <TextArea
              rows={3}
              placeholder="e.g., Please bring your own racket. Water will be provided."
            />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleCreateModalClose}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createLoading}
              className="bg-nyu-purple hover:!bg-nyu-purple-light"
            >
              Create Session
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Session Modal */}
      <Modal
        title="Edit Session"
        open={editModalVisible}
        onCancel={handleEditModalClose}
        footer={null}
        width={600}
        destroyOnClose
      >
        {sessionToEdit &&
          sessionToEdit.spotsAvailable < sessionToEdit.spotsTotal && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <div className="text-yellow-800">
                  <strong>⚠️ Warning:</strong> This session has existing
                  registrations. Changing the date, time, or location may affect
                  registered users.
                </div>
              </div>
            </div>
          )}

        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Session Name"
            rules={[
              { required: true, message: "Please enter session name" },
              { min: 3, message: "Session name must be at least 3 characters" },
            ]}
          >
            <Input placeholder="e.g., Sunday Morning Tennis" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="e.g., NYU Tennis Courts" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
            </Form.Item>

            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: "Please select time" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                minuteStep={15}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="skillLevels"
            label="Skill Levels"
            rules={[
              {
                required: true,
                message: "Please select at least one skill level",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select skill levels"
              style={{ width: "100%" }}
            >
              <Option value={LEVELS.Beginner}>
                <Tag color="green">{LEVELS.Beginner}</Tag>
              </Option>
              <Option value={LEVELS.Intermediate}>
                <Tag color="blue">{LEVELS.Intermediate}</Tag>
              </Option>
              <Option value={LEVELS.Advanced}>
                <Tag color="red">{LEVELS.Advanced}</Tag>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="spotsTotal"
            label="Total Spots"
            rules={[
              { required: true, message: "Please enter total spots" },
              { type: "number", min: 1, message: "Must be at least 1 spot" },
              { type: "number", max: 100, message: "Cannot exceed 100 spots" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="e.g., 12"
              min={1}
              max={100}
            />
          </Form.Item>

          <Form.Item name="notes" label="Additional Notes (Optional)">
            <TextArea
              rows={3}
              placeholder="e.g., Please bring your own racket. Water will be provided."
            />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleEditModalClose}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={editLoading}
              className="bg-nyu-purple hover:!bg-nyu-purple-light"
            >
              Update Session
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Session Registrations Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">
                {selectedSession?.name}
              </h3>
              <div className="text-gray-600 text-sm">
                {selectedSession && (
                  <>
                    <CalendarOutlined />{" "}
                    {new Date(selectedSession.date).toLocaleDateString()} at{" "}
                    {selectedSession.time}
                    <Divider type="vertical" />
                    <EnvironmentOutlined /> {selectedSession.location}
                  </>
                )}
              </div>
            </div>
          </div>
        }
        open={registrationsModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={900}
        style={{ top: 20 }}
      >
        <div className="mt-4">
          <Tabs defaultActiveKey="registered">
            <TabPane
              tab={`Registered (${registeredUsers.length})`}
              key="registered"
            >
              <Table
                columns={registrationColumns}
                dataSource={registeredUsers}
                loading={registrationsLoading}
                pagination={false}
                rowKey="id"
                size="small"
              />
            </TabPane>
            <TabPane
              tab={`Waitlist (${waitlistedUsers.length})`}
              key="waitlist"
            >
              <Table
                columns={waitlistColumns}
                dataSource={waitlistedUsers}
                loading={registrationsLoading}
                pagination={false}
                rowKey="id"
                size="small"
              />
            </TabPane>
            <TabPane
              tab={`Attendance (${registeredUsers.length})`}
              key="attendance"
            >
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-blue-800">
                  <strong>📋 Attendance Management</strong>
                  <div className="text-sm mt-1">
                    Mark attendance for users who registered for this session.
                    {selectedSession && isSessionPast(selectedSession)
                      ? " No-shows will increment the user's no-show count."
                      : " This session hasn't occurred yet - you can pre-mark attendance if needed."}
                  </div>
                </div>
              </div>
              <Table
                columns={attendanceColumns}
                dataSource={registeredUsers}
                loading={registrationsLoading}
                pagination={false}
                rowKey="id"
                size="small"
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <MailOutlined /> Email
                </span>
              }
              key="email"
            >
              <div className="mb-4 backdrop-blur-xl bg-purple-50/80 rounded-2xl border border-purple-200/50 p-4">
                <div className="text-purple-800">
                  <strong className="text-lg">
                    📧 Send Announcement Email
                  </strong>
                  <div className="text-sm mt-2 text-gray-600">
                    Send a custom email announcement to users registered for
                    this session. The header appears below the NYU Tennis Club
                    banner, and the subject will automatically include session
                    details.
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl border border-white/30 p-6 mb-4 [&_.ant-radio-wrapper]:bg-white/50 [&_.ant-radio-wrapper]:backdrop-blur-md [&_.ant-radio-wrapper]:border-white/30 [&_.ant-radio-wrapper]:rounded-lg [&_.ant-radio-wrapper]:p-3 [&_.ant-radio-wrapper]:m-1 [&_.ant-radio-wrapper:hover]:bg-white/70 [&_.ant-input]:bg-white/70 [&_.ant-input]:backdrop-blur-md [&_.ant-input]:border-white/30 [&_.ant-input]:rounded-xl [&_.ant-input]:focus:bg-white/90 [&_.ant-input]:focus:border-purple-500/50 [&_.ant-input]:focus:shadow-lg [&_.ant-input]:focus:shadow-purple-500/20 [&_.ant-btn-primary]:bg-gradient-to-r [&_.ant-btn-primary]:from-purple-500 [&_.ant-btn-primary]:to-blue-500 [&_.ant-btn-primary]:border-none [&_.ant-btn-primary]:rounded-xl [&_.ant-btn-primary]:shadow-lg [&_.ant-btn-primary]:shadow-purple-500/30 [&_.ant-btn-primary]:transition-all [&_.ant-btn-primary]:duration-300 [&_.ant-btn-primary:hover]:-translate-y-1 [&_.ant-btn-primary:hover]:shadow-xl [&_.ant-btn-primary:hover]:shadow-purple-500/40">
                <div className="mb-4">
                  <strong>Recipients:</strong>
                  <Radio.Group
                    value={emailRecipients}
                    onChange={(e) =>
                      handleEmailRecipientsChange(e.target.value)
                    }
                    className="ml-4"
                  >
                    <Radio value="registered">
                      Registered Users ({registeredUsers.length})
                    </Radio>
                    <Radio value="waitlist">
                      Waitlisted Users ({waitlistedUsers.length})
                    </Radio>
                    <Radio value="both">
                      Both Registered & Waitlisted (
                      {registeredUsers.length + waitlistedUsers.length})
                    </Radio>
                  </Radio.Group>
                </div>

                <Form
                  form={emailForm}
                  onFinish={handleEmailSubmit}
                  layout="vertical"
                >
                  <Form.Item
                    name="header"
                    label="Email Header"
                    rules={[
                      { required: true, message: "Please enter email header" },
                      {
                        max: 100,
                        message: "Header cannot exceed 100 characters",
                      },
                    ]}
                  >
                    <Input placeholder="e.g., Important Session Announcement!" />
                  </Form.Item>

                  <Form.Item
                    name="subject"
                    label="Subject"
                    rules={[
                      { required: true, message: "Please enter email subject" },
                    ]}
                  >
                    <Input
                      placeholder="e.g., Important Session Update"
                      suffix={
                        <span className="text-gray-400 text-xs">
                          + session details will be added
                        </span>
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    name="body"
                    label="Message Body"
                    rules={[
                      { required: true, message: "Please enter email message" },
                    ]}
                  >
                    <TextArea
                      placeholder="Enter your announcement message here..."
                      rows={6}
                      showCount
                      maxLength={2000}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={emailLoading}
                      disabled={
                        (emailRecipients === "registered" &&
                          registeredUsers.length === 0) ||
                        (emailRecipients === "waitlist" &&
                          waitlistedUsers.length === 0) ||
                        (emailRecipients === "both" &&
                          registeredUsers.length + waitlistedUsers.length === 0)
                      }
                      icon={<MailOutlined />}
                      className="bg-nyu-purple hover:!bg-nyu-purple-light"
                    >
                      Send Email
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    </div>
  );
};

export default Sessions;
