import Sidebar from "./Sidebar";
import StudioHeader from "./StudioHeader";
import "../assets/css/styles/layout.css";

const Layout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-right">
        <StudioHeader />
        <section className="admin-section">
          {children}
        </section>
      </div>
    </div>
  );
};

export default Layout;
