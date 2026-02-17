import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import Modal from "../components/Modal";
import "../assets/css/styles/table.css"; // ✅ Import standard table styles

export default function AdminCertificateList() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    certificateId: "",
    name: "",
    email: "",
  });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const res = await api.get("/models/certificate");

      // Handle if data is array or wrapped in object
      const certificates = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.certificates || [];

      setData(certificates);
    } catch (err) {
      console.error("Failed to load certificates:", err);
      if (err.response) {
        console.error("Error Data:", err.response.data);
        alert(`Failed to load: ${JSON.stringify(err.response.data)}`);
      } else {
        alert("Failed to load certificates. Check console.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this certificate?"))
      return;

    try {
      await api.delete(`/models/certificate/${id}`);
      // Reload list after delete
      loadCertificates();
    } catch (err) {
      console.error("Failed to delete certificate:", err);
      alert("Failed to delete certificate");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Select certificate file");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("certificateId", form.certificateId);
    fd.append("name", form.name);
    fd.append("email", form.email);

    try {
      await api.post("/certificate/upload", fd);
      setMsg("Upload successful");
      setIsModalOpen(false);
      setForm({ certificateId: "", name: "", email: "" });
      setFile(null);
      setMsg("");
      loadCertificates();
    } catch (err) {
      console.error(err);
      setMsg("Upload failed");
      alert("Upload failed");
    }
  };

  const openUploadModal = () => {
    setForm({ certificateId: "", name: "", email: "" });
    setFile(null);
    setMsg("");
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="table-page">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Certificate</h2>
          <button onClick={openUploadModal} className="btn-primary">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload Certificate
          </button>
        </div>

        {!data.length && (
          <div className="table-card p-6 text-center text-gray-500">
            No certificates found
          </div>
        )}

        {!!data.length && (
          <div className="table-card">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Certificate ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>File</th>
                    <th>Downloaded</th>
                    <th>Downloaded At</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((c) => (
                    <tr key={c._id}>
                      <td>{c.certificateId}</td>
                      <td>{c.name || ""}</td>
                      <td>{c.email || ""}</td>
                      <td>{c.filePath || ""}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            c.isDownloaded ? "active" : "closed"
                          }`}
                        >
                          {c.isDownloaded ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        {c.downloadedAt
                          ? new Date(c.downloadedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(c._id)}
                          style={{
                            background: "#ff4d4f",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            cursor: "pointer",
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <Modal title="Upload Certificate" onClose={() => setIsModalOpen(false)}>
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
                Certificate ID
              </label>
              <input
                value={form.certificateId}
                onChange={(e) =>
                  setForm({ ...form, certificateId: e.target.value })
                }
                placeholder="e.g. CERT-2024-001"
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
                Candidate Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full Name"
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
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="candidate@example.com"
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
                Certificate PDF
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
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
                  background: "white",
                }}
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
                Upload
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
