import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Briefcase, Plus, X } from "lucide-react";
import api from "../services/api";
import Modal from "../components/Modal";
import "../assets/css/styles/table.css"; // ✅ already present

export default function JobsManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    status: "Active",
    description: "",
    location: "Remote",
    position_type: "Full-time",
  });

  const fetchJobs = async () => {
    try {
      const response = await api.get("/models/jobopening");
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await api.put(`/models/jobopening/${editingJob._id}`, formData);
      } else {
        await api.post("/models/jobopening", formData);
      }
      setIsModalOpen(false);
      setFormData({
        title: "",
        startDate: "",
        endDate: "",
        status: "Active",
        description: "",
        location: "",
        position_type: "Full-time",
      });
      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job.");
    }
  };

  const openCreate = () => {
    setEditingJob(null);
    setFormData({
      title: "",
      startDate: "",
      endDate: "",
      status: "Active",
      description: "",
      location: "",
      position_type: "Full-time",
    });
    setIsModalOpen(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || "",
      startDate: job.startDate ? job.startDate.slice(0, 10) : "",
      endDate: job.endDate ? job.endDate.slice(0, 10) : "",
      status: job.status || "Active",
      description: job.description || "",
      location: job.location || "",
      position_type: job.position_type || "Full-time",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (jobId) => {
    if (!confirm("Delete this job?")) return;
    try {
      await api.delete(`/models/jobopening/${jobId}`);
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job.");
    }
  };

  return (
    <AdminLayout>
      {/* ✅ PAGE WRAPPER (ADDED – SAFE) */}
      <div className="table-page">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Jobs Management
            </h1>
          </div>

          <button onClick={openCreate} className="btn-primary">
            <Plus size={20} /> Post New Job
          </button>
        </div>

        {/* ✅ WHITE TABLE CARD (ADDED – THIS IS THE KEY) */}
        <div className="table-card">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job Name</th>
                  <th>Starting Date</th>
                  <th>Ending Date</th>
                  <th className="text-center">Applications</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6">
                      Loading jobs...
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No jobs posted yet.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job._id}>
                      <td>{job.title}</td>

                      <td>
                        {job.startDate
                          ? new Date(job.startDate).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        {job.endDate
                          ? new Date(job.endDate).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="text-center">
                        <span className="badge-count">
                          {job.applicationCount || 0}
                        </span>
                      </td>

                      <td className="text-center">
                        <span
                          className={`status-badge ${job.status?.toLowerCase()}`}
                        >
                          {job.status}
                        </span>
                      </td>

                      <td className="text-center">
                        <button onClick={() => openEdit(job)}>Edit</button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          style={{ marginLeft: 6 }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Replaced with Shared Component */}
      {isModalOpen && (
        <Modal
          title={editingJob ? "Edit Job" : "Post New Job"}
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#1f2937",
                }}
              >
                Job Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Front-End Developer"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "1rem",
                  color: "#000000",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#1f2937",
                }}
              >
                Starting Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "1rem",
                  color: "#000000",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#1f2937",
                }}
              >
                Ending Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "1rem",
                  color: "#000000",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#1f2937",
                }}
              >
                Status
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "1rem",
                    color: "#000000",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                    background: "white",
                    cursor: "pointer",
                    appearance: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
                <div
                  className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none"
                  style={{ color: "#9ca3af" }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#1f2937",
                }}
              >
                Location
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Remote / City"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "1rem",
                  color: "#000000",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#1f2937",
                }}
              >
                Position Type
              </label>
              <div className="relative">
                <select
                  name="position_type"
                  value={formData.position_type}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "1rem",
                    color: "#000000",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                    background: "white",
                    cursor: "pointer",
                    appearance: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Intern">Intern</option>
                </select>
                <div
                  className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none"
                  style={{ color: "#9ca3af" }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#1f2937",
                }}
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "1rem",
                  color: "#000000",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  background: "white",
                  color: "#374151",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {editingJob ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
