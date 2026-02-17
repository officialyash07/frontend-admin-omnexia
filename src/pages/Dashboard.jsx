import AdminLayout from "../layouts/AdminLayout";
import OpenModelPanel from "../components/OpenModelPanel";
import DashboardCharts from "../components/DashboardCharts"; // Import Charts
import { MODELS } from "../config/models";
import { useNavigate } from "react-router-dom";
import "../assets/css/styles/dashboard.css";

import { useState, useEffect } from "react";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [modelCounts, setModelCounts] = useState({});
  const [chartData, setChartData] = useState({ jobs: [], contacts: [] }); // Store full data for charts
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [users, jobs, contacts, certificates, applications] =
        await Promise.all([
          api.get("/models/user").catch(() => ({ data: [] })),
          api.get("/models/jobopening").catch(() => ({ data: [] })),
          api.get("/models/contactsubmission").catch(() => ({ data: [] })),
          api.get("/models/certificate").catch(() => ({ data: [] })),
          api.get("/models/jobapplication").catch(() => ({ data: [] })),
        ]);

      // Normalize data arrays
      const jobsData = Array.isArray(applications.data)
        ? applications.data
        : [];
      const contactsData = Array.isArray(contacts.data) ? contacts.data : [];

      setChartData({
        jobs: jobsData,
        contacts: contactsData,
      });

      setModelCounts({
        User: (Array.isArray(users.data) ? users.data : []).length || 0,
        JobOpening: (Array.isArray(jobs.data) ? jobs.data : []).length || 0,
        ContactSubmission: contactsData.length || 0,
        Certificate:
          (Array.isArray(certificates.data) ? certificates.data : []).length ||
          0,
        JobApplication: jobsData.length || 0,
      });
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const openModel = (modelKey) => {
    // Route convention: /models/:model
    if (modelKey === "JobOpening") {
      navigate("/models/jobs");
    } else if (modelKey === "Certificate") {
      navigate("/admin/certificate");
    } else {
      navigate(`/models/${modelKey.toLowerCase()}`);
    }
  };

  // Filter out 'ApplicationCounter' so it doesn't show up as a card on the dashboard
  const visibleModels = MODELS.filter((model) => {
    const modelName =
      typeof model === "string" ? model : model.name || model.key || "";

    return (
      !modelName.toLowerCase().includes("applicationcounter") &&
      !modelName.toLowerCase().includes("jobopening")
    );
  }).map((model) => ({
    ...model,
    count: loading ? "-" : (modelCounts[model.key] ?? 0),
  }));

  return (
    <AdminLayout>
      <div className="dashboard p-6 bg-transparent">
        <div className="dashboard-inner bg-transparent">
          {/* Top Row: Model Selection Panel */}
          <OpenModelPanel models={visibleModels} onOpen={openModel} />

          {/* Bottom Row: Analytical Charts */}
          {!loading && (
            <DashboardCharts
              jobApplications={chartData.jobs}
              contactSubmissions={chartData.contacts}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
