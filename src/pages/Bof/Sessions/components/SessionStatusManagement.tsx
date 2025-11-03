import React, { FC } from "react";
import { Tag, Button } from "antd";
import { ISession } from "interfaces/session.interface";
import { SessionStatus } from "constants/enum/session.status.enum";

interface SessionStatusManagementProps {
  selectedSession: ISession | null;
  pendingStatusChange: SessionStatus | null;
  statusChangeLoading: boolean;
  onStatusChange: (status: SessionStatus) => void;
  onApplyStatusChange: () => void;
  onCancelStatusChange: () => void;
}

const SessionStatusManagement: FC<SessionStatusManagementProps> = ({
  selectedSession,
  pendingStatusChange,
  statusChangeLoading,
  onStatusChange,
  onApplyStatusChange,
  onCancelStatusChange,
}) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-800">Session Status</h4>
        <Tag
          color={
            (pendingStatusChange || selectedSession?.status) ===
            SessionStatus.OPEN
              ? "green"
              : (pendingStatusChange || selectedSession?.status) ===
                SessionStatus.FULL
              ? "orange"
              : (pendingStatusChange || selectedSession?.status) ===
                SessionStatus.VIEW_ONLY
              ? "blue"
              : "red"
          }
          className="text-sm font-medium"
        >
          {pendingStatusChange || selectedSession?.status || "Unknown"}
        </Tag>
      </div>

      {/* Show pending status change */}
      {pendingStatusChange &&
        pendingStatusChange !== selectedSession?.status && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-blue-800 text-sm">
              <strong>Pending Change:</strong> Status will change from{" "}
              <strong>{selectedSession?.status}</strong> to{" "}
              <strong>{pendingStatusChange}</strong>
            </div>
          </div>
        )}

      <div className="text-sm text-gray-600 mb-3">
        Current Status: <strong>{selectedSession?.status}</strong>
        {selectedSession?.status === SessionStatus.OPEN &&
          " - Open for registrations"}
        {selectedSession?.status === SessionStatus.FULL &&
          " - Full but waitlist available"}
        {selectedSession?.status === SessionStatus.VIEW_ONLY &&
          " - Can view but cannot register"}
        {selectedSession?.status === SessionStatus.CLOSED &&
          " - Completely closed"}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <Button
          size="small"
          type={
            (pendingStatusChange || selectedSession?.status) ===
            SessionStatus.OPEN
              ? "primary"
              : "default"
          }
          onClick={() => onStatusChange(SessionStatus.OPEN)}
          className={
            (pendingStatusChange || selectedSession?.status) ===
            SessionStatus.OPEN
              ? "bg-green-500 hover:!bg-green-600"
              : ""
          }
        >
          Open
        </Button>
        <Button
          size="small"
          type={
            (pendingStatusChange || selectedSession?.status) ===
            SessionStatus.FULL
              ? "primary"
              : "default"
          }
          onClick={() => onStatusChange(SessionStatus.FULL)}
          className={
            (pendingStatusChange || selectedSession?.status) ===
            SessionStatus.FULL
              ? "bg-orange-500 hover:!bg-orange-600"
              : ""
          }
        >
          Full
        </Button>
        <Button
          size="small"
          type={
            (pendingStatusChange || selectedSession?.status) ===
            SessionStatus.VIEW_ONLY
              ? "primary"
              : "default"
          }
          onClick={() => onStatusChange(SessionStatus.VIEW_ONLY)}
          className={
            (pendingStatusChange || selectedSession?.status) ===
            SessionStatus.VIEW_ONLY
              ? "bg-blue-500 hover:!bg-blue-600"
              : ""
          }
        >
          View Only
        </Button>
        <Button
          size="small"
          type={
            (pendingStatusChange || selectedSession?.status) ===
            SessionStatus.CLOSED
              ? "primary"
              : "default"
          }
          onClick={() => onStatusChange(SessionStatus.CLOSED)}
          className={
            (pendingStatusChange || selectedSession?.status) ===
            SessionStatus.CLOSED
              ? "bg-red-500 hover:!bg-red-600"
              : ""
          }
        >
          Closed
        </Button>
      </div>

      {/* Save/Cancel buttons for pending changes */}
      {pendingStatusChange &&
        pendingStatusChange !== selectedSession?.status && (
          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <Button
              type="primary"
              onClick={onApplyStatusChange}
              loading={statusChangeLoading}
              className="bg-green-500 hover:!bg-green-600"
            >
              Save Status Change
            </Button>
            <Button
              onClick={onCancelStatusChange}
              disabled={statusChangeLoading}
            >
              Cancel
            </Button>
          </div>
        )}
    </div>
  );
};

export default SessionStatusManagement;
