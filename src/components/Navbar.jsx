import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <h3>Admin Panel</h3>

      <div style={styles.right}>
        <span style={{ marginRight: 15, color: "var(--text-dark)" }}>
          {user.name} ({user.role})
        </span>
        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

const styles = {
  navbar: {
    height: 60,
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid #e5e7eb",
  },
  right: {
    display: "flex",
    alignItems: "center",
  },
  logout: {
    padding: "6px 12px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    borderRadius: 4,
    cursor: "pointer",
  },
};
