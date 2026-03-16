// "use client";

// import React, { useState } from "react";

// interface NavbarProps {
//   sidebarCollapsed: boolean;
// }

// const Navbar: React.FC<NavbarProps> = ({ sidebarCollapsed }) => {
//   const [userMenuOpen, setUserMenuOpen] = useState(false);

//   return (
//     <header
//       className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 transition-all duration-300 z-30 ${
//         sidebarCollapsed ? "left-20" : "left-64"
//       }`}
//     >
//       <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

//       <div className="relative">
//         <button
//           onClick={() => setUserMenuOpen(!userMenuOpen)}
//           className="flex items-center space-x-2"
//         >
//           <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
//             AD
//           </div>
//           <span className="hidden md:block text-sm font-medium">
//             Admin
//           </span>
//         </button>

//         {userMenuOpen && (
//           <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border">
//             <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">
//               Profile
//             </a>
//             <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">
//               Settings
//             </a>
//             <hr />
//             <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
//               Logout
//             </a>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Navbar;

"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  sidebarCollapsed: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Generate initials from user's first and last name
  const getInitials = () => {
    if (!user) return "U";
    const firstInitial = user.firstName?.charAt(0) || "";
    const lastInitial = user.lastName?.charAt(0) || "";
    return (firstInitial + lastInitial).toUpperCase() || "U";
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 transition-all duration-300 z-30 ${
        sidebarCollapsed ? "left-20" : "left-64"
      }`}
    >
      {/* You can replace this with a dynamic page title later */}
      <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>

      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            {getInitials()}
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700">
            {user ? `${user.firstName} ${user.lastName}` : "User"}
          </span>
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-1">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setUserMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setUserMenuOpen(false)}
            >
              Settings
            </Link>
            <hr className="my-1" />
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;