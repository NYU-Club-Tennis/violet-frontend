import React, { useState, useRef, useEffect } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Profile from "../pages/Profile";
import "../../assets/styles/Header.css";
import athleticLogo from "../../assets/images/athletic_logo.png";

const Header = () => {
  const { user, logout, login } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    {
      setIsDropdownOpen(!isDropdownOpen);
      logout();
    }
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center px-48 py-4 bg-white h-20 w-full sticky top-0 z-10">
        <div className="flex gap-24 flex-row">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-nyu-purple font-light"
                : "text-gray-800 font-light hover:text-nyu-purple"
            }
          >
            HOME
          </NavLink>

          <NavLink
            to="/join"
            className={({ isActive }) =>
              isActive
                ? "text-nyu-purple font-light"
                : "text-gray-800 font-light hover:text-nyu-purple"
            }
          >
            JOIN
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-nyu-purple font-light"
                : "text-gray-800 font-light hover:text-nyu-purple"
            }
          >
            CONTACT
          </NavLink>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <img
                src={user.picture}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-nyu-purple"
                onClick={toggleDropdown}
              />
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    {user.name}
                  </div>
                  <Link to="/profile">
                    <button
                      onClick={toggleDropdown}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={login}
              className="px-4 py-2 text-sm text-nyu-purple border border-nyu-purple rounded-md hover:bg-nyu-purple hover:text-white transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
      <div className="bg-nyu-purple text-white p-4 flex flex-row justify-center gap-20 items-center">
        <div className="font-fugaz text-2xl">
          <h1>CLUB</h1>
        </div>
        <img src={athleticLogo} alt="Athletic Logo" className="w-14 h-14" />
        <div className="font-fugaz text-2xl">
          <h1>TENNIS</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
