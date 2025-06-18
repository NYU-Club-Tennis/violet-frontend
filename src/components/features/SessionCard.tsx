import React from "react";

interface Session {
  id: number;
  spotsAvailable: number;
  day: string;
  date: string;
  time: string;
  location: string;
  levels: string;
  spotsTotal: number;
  // Add other session fields as needed
}

interface User {
  id: number;
  name: string;
  // Add other user fields as needed
}

interface SessionCardProps {
  session: Session;
  isSelected: boolean;
  onSelect: (id: number) => void;
  disabled: boolean;
  user: User;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  isSelected,
  onSelect,
  disabled,
  user,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
        isSelected ? "border-nyu-purple" : "border-transparent"
      }`}
    >
      <div className="bg-nyu-purple py-3 px-4">
        <h3 className="text-xl font-bold text-white">
          {session.day} - {session.date}
        </h3>
      </div>
      <div className="p-6">
        {/* Card content */}
        <div className="mb-4">
          <p className="text-lg font-semibold">{session.time}</p>
          <p className="text-gray-600">{session.location}</p>
        </div>
        <div className="mb-4">
          <span className="inline-block bg-purple-100 text-nyu-purple px-3 py-1 rounded-full text-sm font-medium">
            {session.levels}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">
            <span className="font-semibold">{session.spotsAvailable}</span> of{" "}
            <span className="font-semibold">{session.spotsTotal}</span> spots
            available
          </p>
          <button
            onClick={() => onSelect(session.id)}
            className={`px-4 py-2 rounded-md ${
              disabled || !user
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-nyu-purple text-white hover:bg-purple-800"
            }`}
            disabled={disabled}
          >
            {!user
              ? "Sign in to register"
              : isSelected
              ? "Selected"
              : disabled
              ? "Full"
              : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
