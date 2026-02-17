import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../assets/css/styles/sidebar.css";
/* ✅ IMPORT LOGO CORRECTLY (VITE WAY) */
import omnexiaLogo from "../assets/logo/omnexia-logo.jpg";

import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Award,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/models/user",
      icon: Users,
    },
    {
      name: "Jobs",
      path: "/models/jobs",
      icon: Briefcase,
    },
    {
      name: "Job Application",
      path: "/models/jobapplication",
      icon: Calendar,
    },
    {
      name: "Contact Submission",
      path: "/models/contactsubmission",
      icon: FileText,
    },
    {
      name: "Admin Certificate",
      path: "/admin/certificate",
      icon: Award,
    },
  ];

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      style={{ width: collapsed ? "80px" : "260px" }}
    >
      {/* ================= LOGO + TOGGLE ================= */}
      <div className="sidebar-header">
        {!collapsed && (
          <img
            src={omnexiaLogo} /* ✅ THIS IS THE FIX */
            alt="Omnexia Technology"
            className="sidebar-logo-img"
          />
        )}

        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* ================= MENU BUTTONS ================= */}
      <nav className="sidebar-menu">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-btn ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* ================= FOOTER ================= */}
      {!collapsed && <div className="sidebar-footer">© 2026 Omnexia</div>}
    </aside>
  );
}
