import React, { FC, useEffect, useState } from "react";
import { Button, Pagination, Select, message, Form, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
import { sendSessionNotification } from "actions/mail.action";
import {
  ISession,
  ISessionCreate,
  ISessionUpdate,
} from "interfaces/session.interface";
import { IRegistrationWithUser } from "interfaces/registration.interface";
import { SessionStatus } from "constants/enum/session.status.enum";
import { RegistrationStatus } from "constants/enum/registration.status.enum";
import dayjs from "dayjs";

// Import our new components
import SessionsTable from "./components/SessionsTable";
import CreateSessionModal, {
  CreateSessionFormData,
} from "./components/CreateSessionModal";
import EditSessionModal from "./components/EditSessionModal";
import SessionDetailsModal from "./components/SessionDetailsModal";

const { Option } = Select;

const Sessions: FC = () => {
  // Main state
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<SessionStatus | undefined>();
  const [isMobile, setIsMobile] = useState(false);

  // Session details modal state
  const [selectedSession, setSelectedSession] = useState<ISession | null>(null);
  const [registrationsModalVisible, setRegistrationsModalVisible] =
    useState(false);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [sessionRegistrations, setSessionRegistrations] = useState<
    IRegistrationWithUser[]
  >([]);

  // Create session modal state
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form] = Form.useForm<CreateSessionFormData>();

  // Edit session modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<ISession | null>(null);
  const [editForm] = Form.useForm<CreateSessionFormData>();

  // Delete state
  const [deletingSessionId, setDeletingSessionId] = useState<number | null>(
    null
  );

  // Status management state
  const [pendingStatusChange, setPendingStatusChange] =
    useState<SessionStatus | null>(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);

  // Email state
  const [emailForm] = Form.useForm();
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState<
    "registered" | "waitlist" | "both"
  >("registered");

  const pageSize = 10;

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  useEffect(() => {
    fetchSessions(currentPage, statusFilter);
  }, [currentPage]);

  // Event handlers
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
    // Reset status change state
    setPendingStatusChange(null);
  };

  const handleStatusFilter = (status: SessionStatus | undefined) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchSessions(1, status);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Create session handlers
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

  // Edit session handlers
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
      // Only include fields that actually changed
      const updateData: ISessionUpdate = {};

      if (values.name !== sessionToEdit.name) {
        updateData.name = values.name;
      }

      if (values.location !== sessionToEdit.location) {
        updateData.location = values.location;
      }

      if (values.date.format("YYYY-MM-DD") !== sessionToEdit.date) {
        updateData.date = values.date.format("YYYY-MM-DD");
      }

      if (values.time.format("HH:mm") !== sessionToEdit.time) {
        updateData.time = values.time.format("HH:mm");
      }

      if (
        JSON.stringify(values.skillLevels) !==
        JSON.stringify(sessionToEdit.skillLevels)
      ) {
        updateData.skillLevels = values.skillLevels;
      }

      if (values.spotsTotal !== sessionToEdit.spotsTotal) {
        updateData.spotsTotal = values.spotsTotal;
        // Calculate new spots available only if spots total changed
        const spotsDifference = values.spotsTotal - sessionToEdit.spotsTotal;
        const newSpotsAvailable =
          sessionToEdit.spotsAvailable + spotsDifference;
        updateData.spotsAvailable = Math.max(0, newSpotsAvailable);
      }

      if (values.notes !== sessionToEdit.notes) {
        updateData.notes = values.notes;
      }

      // Only update if there are actual changes
      if (Object.keys(updateData).length === 0) {
        message.info("No changes detected");
        handleEditModalClose();
        return;
      }

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

  // Delete session handler
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

  // Status management handlers
  const handleStatusChange = async (newStatus: SessionStatus) => {
    if (!selectedSession) return;
    // Just set the pending status change - don't apply yet
    setPendingStatusChange(newStatus);
  };

  const applyStatusChange = async () => {
    if (!selectedSession || !pendingStatusChange) return;

    setStatusChangeLoading(true);

    try {
      // Only send the status change - let the backend handle spots automatically
      const updateData: ISessionUpdate = {
        status: pendingStatusChange,
      };

      // Update session first
      await updateSession(selectedSession.id, updateData);
      message.success(`Session status updated to ${pendingStatusChange}!`);

      // Update local state
      setSelectedSession((prev) =>
        prev ? { ...prev, status: pendingStatusChange } : null
      );

      // Clear pending status and refresh sessions list
      setPendingStatusChange(null);
      fetchSessions(currentPage, statusFilter);
    } catch (error: any) {
      console.error("Failed to update session status:", error);
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        message.error(`Error: ${errorMessage}`);
      } else {
        message.error("Failed to update session status. Please try again.");
      }
    } finally {
      setStatusChangeLoading(false);
    }
  };

  const cancelStatusChange = () => {
    setPendingStatusChange(null);
  };

  // Email handlers
  const handleEmailSubmit = async (values: {
    header: string;
    subject: string;
    body: string;
  }) => {
    if (!selectedSession) return;

    setEmailLoading(true);
    try {
      // Get registered and waitlisted users
      const registeredUsers = sessionRegistrations.filter(
        (reg) =>
          reg.status === RegistrationStatus.REGISTERED ||
          reg.status === RegistrationStatus.COMPLETED ||
          reg.status === RegistrationStatus.NO_SHOW
      );
      const waitlistedUsers = sessionRegistrations.filter(
        (reg) => reg.status === RegistrationStatus.WAITLISTED
      );

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

      await sendSessionNotification({
        emails: recipientEmails,
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

  // Attendance handler
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

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Sessions Management
      </h1>

      {/* Controls */}
      <div className="backdrop-blur-xl bg-white/60 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 p-3 sm:p-6 mb-3 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between sm:items-center">
          <div className="flex gap-3 sm:gap-4 items-center">
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
            className="!bg-gradient-to-r !from-purple-500 !to-blue-500 !border-none 
              !rounded-xl !shadow-lg !shadow-purple-500/30 !transition-all 
              !duration-300 hover:!-translate-y-1 hover:!shadow-xl 
              hover:!shadow-purple-500/40 !text-white w-full sm:w-auto
               [&_span]:!text-white [&_.anticon]:!text-white"
          >
            Create Session
          </Button>
        </div>
      </div>

      {/* Sessions Table */}
      <SessionsTable
        sessions={sessions}
        loading={loading}
        isMobile={isMobile}
        onSessionClick={handleSessionClick}
        onEditSession={handleEditSession}
        onDeleteSession={handleDeleteSession}
        deletingSessionId={deletingSessionId}
      />

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex justify-center mt-3 sm:mt-6">
          <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl border border-white/30 p-2 sm:p-4 [&_.ant-pagination-item]:bg-white/70 [&_.ant-pagination-item]:backdrop-blur-md [&_.ant-pagination-item]:border-white/30 [&_.ant-pagination-item]:rounded-lg [&_.ant-pagination-item:hover]:bg-white/90 [&_.ant-pagination-item-active]:bg-gradient-to-r [&_.ant-pagination-item-active]:from-purple-500 [&_.ant-pagination-item-active]:to-blue-500 [&_.ant-pagination-item-active]:border-transparent [&_.ant-pagination-item-active]:text-white [&_.ant-pagination-item-active_a]:text-white">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={
                isMobile
                  ? undefined
                  : (total, range) =>
                      `${range[0]}-${range[1]} of ${total} sessions`
              }
              size={isMobile ? "small" : "default"}
            />
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      <CreateSessionModal
        visible={createModalVisible}
        loading={createLoading}
        form={form}
        onCancel={handleCreateModalClose}
        onSubmit={handleCreateSubmit}
      />

      {/* Edit Session Modal */}
      <EditSessionModal
        visible={editModalVisible}
        loading={editLoading}
        form={editForm}
        sessionToEdit={sessionToEdit}
        onCancel={handleEditModalClose}
        onSubmit={handleEditSubmit}
      />

      {/* Session Details Modal */}
      <SessionDetailsModal
        visible={registrationsModalVisible}
        selectedSession={selectedSession}
        sessionRegistrations={sessionRegistrations}
        registrationsLoading={registrationsLoading}
        isMobile={isMobile}
        pendingStatusChange={pendingStatusChange}
        statusChangeLoading={statusChangeLoading}
        emailForm={emailForm}
        emailLoading={emailLoading}
        emailRecipients={emailRecipients}
        onClose={handleModalClose}
        onEditSession={handleEditSession}
        onDeleteSession={handleDeleteSession}
        onStatusChange={handleStatusChange}
        onApplyStatusChange={applyStatusChange}
        onCancelStatusChange={cancelStatusChange}
        onEmailRecipientsChange={handleEmailRecipientsChange}
        onEmailSubmit={handleEmailSubmit}
        onMarkAttendance={handleMarkAttendance}
      />
    </div>
  );
};

export default Sessions;
