// import React, { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   HomeIcon,
//   UsersIcon,
//   AcademicCapIcon,
//   UserGroupIcon,
//   ClipboardDocumentListIcon,
//   CalendarIcon,
//   ChartBarIcon,
//   CogIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   ChevronDownIcon,
//   BookOpenIcon,
//   PlusIcon,
//   UserPlusIcon,
//   ArrowRightOnRectangleIcon,
// } from "@heroicons/react/24/outline";
// import { useAuth } from "../context/AuthContext";

// interface SidebarProps {
//   collapsed?: boolean;
//   onToggle?: () => void;
// }

// interface NavItem {
//   name: string;
//   path?: string;
//   icon?: React.ReactNode;
//   roles?: Array<"ADMIN" | "TEACHER" | "STUDENT" | "PARENT">;
//   children?: NavItem[];
// }

// /* ================= FULL NAVIGATION TREE ================= */

// const navigationTree: NavItem[] = [
//   {
//     name: "Dashboard",
//     path: "/dashboard",
//     icon: <HomeIcon className="h-5 w-5" />,
//   },
//   {
//     name: "Users",
//     icon: <UsersIcon className="h-5 w-5" />,
//     roles: ["ADMIN"],
//     children: [
//       {
//         name: "All Users",
//         path: "/admin/users",
//         icon: <UsersIcon className="h-5 w-5" />,
//       },
//       {
//         name: "Add User",
//         path: "/admin/users/new",
//         icon: <PlusIcon className="h-5 w-5" />,
//       },
//       {
//         name: "Assign Parent",
//         path: "/admin/users/assign-parent",
//         icon: <UserPlusIcon className="h-5 w-5" />,
//       },
//     ],
//   },
//   {
//     name: "Students",
//     path: "/students",
//     icon: <UsersIcon className="h-5 w-5" />,
//     roles: ["ADMIN", "TEACHER"],
//   },
//   {
//     name: "Teachers",
//     path: "/teachers",
//     icon: <AcademicCapIcon className="h-5 w-5" />,
//     roles: ["ADMIN"],
//   },
//   {
//     name: "Parents",
//     path: "/parents",
//     icon: <UserGroupIcon className="h-5 w-5" />,
//     roles: ["ADMIN", "TEACHER"],
//   },
//   {
//     name: "Classes",
//     path: "/classes",
//     icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
//     roles: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
//   },
//   {
//     name: "Subjects",
//     path: "/subjects",
//     icon: <BookOpenIcon className="h-5 w-5" />,
//     roles: ["ADMIN"],
//   },
//   {
//     name: "Assignments",
//     path: "/assignments",
//     icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
//     roles: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
//   },
//   {
//     name: "Events",
//     path: "/events",
//     icon: <CalendarIcon className="h-5 w-5" />,
//   },
//   {
//     name: "Reports",
//     path: "/reports",
//     icon: <ChartBarIcon className="h-5 w-5" />,
//     roles: ["ADMIN", "TEACHER"],
//   },
//   {
//     name: "Settings",
//     path: "/settings",
//     icon: <CogIcon className="h-5 w-5" />,
//     roles: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
//   },
// ];

// /* ================= ROLE FILTER ================= */

// const filterNavTree = (items: NavItem[], role?: string): NavItem[] => {
//   if (!role) return [];
//   const normalizedRole = role.toUpperCase() as any;
//   return items
//     .filter((item) => !item.roles || item.roles.includes(normalizedRole))
//     .map((item) => ({
//       ...item,
//       children: item.children ? filterNavTree(item.children, normalizedRole) : undefined,
//     }));
// };

// /* ================= NAV ITEM COMPONENT (MEMOIZED) ================= */

// const NavItemComponent: React.FC<{
//   item: NavItem;
//   collapsed: boolean;
// }> = React.memo(({ item, collapsed }) => {
//   const location = useLocation();
//   const hasChildren = item.children && item.children.length > 0;

//   const isExactActive = item.path && location.pathname === item.path;
//   const isChildActive = item.children?.some((child) => child.path === location.pathname) ?? false;

//   const [manualOpen, setManualOpen] = useState(false);
//   const isOpen = isChildActive || manualOpen;

//   const toggle = useCallback(() => {
//     if (!isChildActive) {
//       setManualOpen((prev) => !prev);
//     }
//   }, [isChildActive]);

//   if (hasChildren) {
//     return (
//       <div>
//         <button
//           onClick={toggle}
//           className={`group flex items-center w-full px-3 py-2 mx-2 my-1 text-sm font-medium rounded-md transition-all duration-200 ${
//             isChildActive
//               ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
//               : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//           } ${collapsed ? "justify-center" : ""}`}
//           title={collapsed ? item.name : undefined}
//           aria-expanded={isOpen}
//         >
//           <span className={collapsed ? "" : "mr-3"}>{item.icon}</span>
//           {!collapsed && (
//             <>
//               <span className="flex-1 text-left">{item.name}</span>
//               <ChevronDownIcon
//                 className={`h-4 w-4 transition-transform duration-200 ${
//                   isOpen ? "rotate-180" : ""
//                 } ${isChildActive ? "text-indigo-500" : "text-gray-400"}`}
//               />
//             </>
//           )}
//         </button>

//         {!collapsed && (
//           // Grid‑based height transition to auto (smooth, no max-height limit)
//           <div
//             className="grid transition-all duration-300 ease-in-out"
//             style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
//           >
//             <div className="overflow-hidden">
//               <div className="ml-6 mt-1 space-y-1 border-l-2 border-indigo-100 pl-2">
//                 {item.children?.map((child) => (
//                   <NavItemComponent key={child.name} item={child} collapsed={collapsed} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // Leaf node
//   return (
//     <Link
//       to={item.path!}
//       className={`group flex items-center px-3 py-2 mx-2 my-1 text-sm font-medium rounded-md transition-all duration-200 ${
//         isExactActive
//           ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
//           : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//       } ${collapsed ? "justify-center" : ""}`}
//       title={collapsed ? item.name : undefined}
//     >
//       <span className={collapsed ? "" : "mr-3"}>{item.icon}</span>
//       {!collapsed && <span>{item.name}</span>}
//     </Link>
//   );
// });

// /* ================= SIDEBAR ================= */

// const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
//   const { user, logout } = useAuth();
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const filteredNavTree = useMemo(() => {
//     return filterNavTree(navigationTree, user?.role);
//   }, [user?.role]);

//   useLayoutEffect(() => {
//     const saved = sessionStorage.getItem("sidebar-scroll");
//     if (saved && scrollRef.current) {
//       scrollRef.current.scrollTop = parseInt(saved, 10);
//     }
//   }, []);

//   const handleScroll = useCallback(() => {
//     if (scrollRef.current) {
//       requestAnimationFrame(() => {
//         sessionStorage.setItem("sidebar-scroll", scrollRef.current!.scrollTop.toString());
//       });
//     }
//   }, []);

//   const handleLogout = useCallback(() => {
//     logout();
//   }, [logout]);

//   if (!user) return null;

//   const initials = user.firstName?.[0] || user.email?.[0] || "U";

//   return (
//     <div
//       className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-xl flex flex-col transition-all duration-300 z-40 ${
//         collapsed ? "w-20" : "w-64"
//       }`}
//     >
//       {/* Header */}
//       <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
//         <span className="text-xl font-bold text-indigo-600">
//           {collapsed ? "EM" : "EduManage"}
//         </span>
//         <button
//           onClick={onToggle}
//           className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
//           aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           {collapsed ? (
//             <ChevronRightIcon className="h-5 w-5 text-gray-500" />
//           ) : (
//             <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
//           )}
//         </button>
//       </div>

//       {/* Navigation with hidden scrollbar */}
//       <nav
//         ref={scrollRef}
//         onScroll={handleScroll}
//         className="flex-1 overflow-y-auto py-4 hide-scrollbar"
//       >
//         {filteredNavTree.map((item) => (
//           <NavItemComponent key={item.name} item={item} collapsed={collapsed} />
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="border-t border-gray-200 p-4 space-y-3">
//         <div className="flex items-center space-x-3">
//           <div className="flex-shrink-0">
//             <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
//               {initials}
//             </div>
//           </div>
//           {!collapsed && (
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-gray-900 truncate">
//                 {user.firstName} {user.lastName}
//               </p>
//               <p className="text-xs text-gray-500 truncate">{user.role}</p>
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleLogout}
//           className="flex items-center w-full text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-all duration-200"
//         >
//           <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
//           {!collapsed && "Logout"}
//         </button>
//       </div>

//       {/* Inline style to hide scrollbar (add this to your global CSS for better maintainability) */}
//       <style>{`
//         .hide-scrollbar {
//           -ms-overflow-style: none;  /* IE and Edge */
//           scrollbar-width: none;      /* Firefox */
//         }
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none;              /* Chrome, Safari, Opera */
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  BookOpenIcon,
  PlusIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon, // <-- Added for Attendance
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

interface NavItem {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  roles?: Array<"ADMIN" | "TEACHER" | "STUDENT" | "PARENT">;
  children?: NavItem[];
}

/* ================= FULL NAVIGATION TREE ================= */

const navigationTree: NavItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    name: "Users",
    icon: <UsersIcon className="h-5 w-5" />,
    roles: ["ADMIN"],
    children: [
      {
        name: "All Users",
        path: "/admin/users",
        icon: <UsersIcon className="h-5 w-5" />,
      },
      {
        name: "Add User",
        path: "/admin/users/new",
        icon: <PlusIcon className="h-5 w-5" />,
      },
      {
        name: "Assign Parent",
        path: "/admin/users/assign-parent",
        icon: <UserPlusIcon className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Students",
    path: "/students",
    icon: <UsersIcon className="h-5 w-5" />,
    roles: ["ADMIN", "TEACHER"],
  },
  {
    name: "Teachers",
    path: "/teachers",
    icon: <AcademicCapIcon className="h-5 w-5" />,
    roles: ["ADMIN"],
  },
  {
    name: "Parents",
    path: "/parents",
    icon: <UserGroupIcon className="h-5 w-5" />,
    roles: ["ADMIN", "TEACHER"],
  },
  {
    name: "Classes",
    icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
    roles: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
    children: [
      {
        name: "All Classes",
        path: "/classes",
        icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
      },
      {
        name: "Add Class",
        path: "/classes/new",
        icon: <PlusIcon className="h-5 w-5" />,
        roles: ["ADMIN"], // only admin can add
      },
    ],
  },
  {
    name: "Subjects",
    path: "/subjects",
    icon: <BookOpenIcon className="h-5 w-5" />,
    roles: ["ADMIN"],
  },
  {
    name: "Assignments",
    path: "/assignments",
    icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
    roles: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
  },
  // ✅ New Attendance item
  {
    name: "Attendance",
    path: "/attendance",
    icon: <CheckCircleIcon className="h-5 w-5" />,
    roles: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
  },
  // Add to navigationTree
{
  name: "Teacher Attendance",
  icon: <CalendarIcon className="h-5 w-5" />,
  roles: ["ADMIN", "TEACHER"],
  children: [
    {
      name: "Calendar",
      path: "/admin/teacher-leave",
      roles: ["ADMIN"],
    },
    {
      name: "My Attendance",
      path: "/teacher/my-attendance",
      roles: ["TEACHER"],
    },
  ],
},
  {
    name: "Events",
    path: "/events",
    icon: <CalendarIcon className="h-5 w-5" />,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <ChartBarIcon className="h-5 w-5" />,
    roles: ["ADMIN", "TEACHER"],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <CogIcon className="h-5 w-5" />,
    roles: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
  },
];

/* ================= ROLE FILTER ================= */

const filterNavTree = (items: NavItem[], role?: string): NavItem[] => {
  if (!role) return [];
  const normalizedRole = role.toUpperCase() as any;
  return items
    .filter((item) => !item.roles || item.roles.includes(normalizedRole))
    .map((item) => ({
      ...item,
      children: item.children ? filterNavTree(item.children, normalizedRole) : undefined,
    }));
};

/* ================= NAV ITEM COMPONENT ================= */

const NavItemComponent: React.FC<{
  item: NavItem;
  collapsed: boolean;
}> = React.memo(({ item, collapsed }) => {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;

  const isExactActive = item.path && location.pathname === item.path;
  const isChildActive = item.children?.some((child) => child.path === location.pathname) ?? false;

  const [manualOpen, setManualOpen] = useState(false);
  const isOpen = isChildActive || manualOpen;

  const toggle = useCallback(() => {
    if (!isChildActive) {
      setManualOpen((prev) => !prev);
    }
  }, [isChildActive]);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={toggle}
          className={`group flex items-center w-full px-3 py-2 mx-2 my-1 text-sm font-medium rounded-md transition-all duration-200 ${
            isChildActive
              ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          } ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? item.name : undefined}
          aria-expanded={isOpen}
        >
          <span className={collapsed ? "" : "mr-3"}>{item.icon}</span>
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.name}</span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                } ${isChildActive ? "text-indigo-500" : "text-gray-400"}`}
              />
            </>
          )}
        </button>

        {!collapsed && (
          <div
            className="grid transition-all duration-300 ease-in-out"
            style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <div className="ml-6 mt-1 space-y-1 border-l-2 border-indigo-100 pl-2">
                {item.children?.map((child) => (
                  <NavItemComponent key={child.name} item={child} collapsed={collapsed} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path!}
      className={`group flex items-center px-3 py-2 mx-2 my-1 text-sm font-medium rounded-md transition-all duration-200 ${
        isExactActive
          ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      } ${collapsed ? "justify-center" : ""}`}
      title={collapsed ? item.name : undefined}
    >
      <span className={collapsed ? "" : "mr-3"}>{item.icon}</span>
      {!collapsed && <span>{item.name}</span>}
    </Link>
  );
});

/* ================= SIDEBAR ================= */

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
  const { user, logout } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredNavTree = useMemo(() => {
    return filterNavTree(navigationTree, user?.role);
  }, [user?.role]);

  useLayoutEffect(() => {
    const saved = sessionStorage.getItem("sidebar-scroll");
    if (saved && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(saved, 10);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        sessionStorage.setItem("sidebar-scroll", scrollRef.current!.scrollTop.toString());
      });
    }
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (!user) return null;

  const initials = user.firstName?.[0] || user.email?.[0] || "U";

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-xl flex flex-col transition-all duration-300 z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
        <span className="text-xl font-bold text-indigo-600">
          {collapsed ? "EM" : "EduManage"}
        </span>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation with hidden scrollbar */}
      <nav
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-4 hide-scrollbar"
      >
        {filteredNavTree.map((item) => (
          <NavItemComponent key={item.name} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
              {initials}
            </div>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center w-full text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
          {!collapsed && "Logout"}
        </button>
      </div>

      {/* Inline style to hide scrollbar */}
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;