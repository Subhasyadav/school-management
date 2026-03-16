"use client";

import React, { useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Navbar */}
      <Navbar sidebarCollapsed={sidebarCollapsed} />

      {/* Main Content */}
      <main
        className={`
          absolute top-16 bottom-0 right-0
          transition-all duration-300
          ${sidebarCollapsed ? "left-20" : "left-64"}
          overflow-y-auto p-6
        `}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;