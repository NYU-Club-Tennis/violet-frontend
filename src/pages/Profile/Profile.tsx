import { Button, Divider } from "antd";
import React from "react";
import { AuthStore } from "stores/auth.store";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, clear } = AuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clear();
  };

  return (
    <div className="px-4 py-8 pt-36">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="mb-6">
        <p>
          <strong>Name:</strong> {user?.firstName} {user?.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </div>

      {user?.isAdmin && (
        <>
          <Divider />
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Admin Access</h2>
            <Button
              type="primary"
              onClick={() => navigate("/bof/dashboard")}
              className="bg-gradient-to-r from-purple-500 to-blue-500 border-none rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/40"
            >
              Go to Admin Panel
            </Button>
          </div>
        </>
      )}

      <Divider />
      <Button onClick={handleLogout} danger>
        Logout
      </Button>
    </div>
  );
};

export default Profile;
