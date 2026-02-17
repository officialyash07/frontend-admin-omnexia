import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../services/api";

export default function AdminCertificateUpload() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    certificateId: "",
    name: "",
    email: "",
  });

  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Select certificate file");
      return;
    }

    const fd = new FormData();
    fd.append("file", file); // must match multer field
    fd.append("certificateId", form.certificateId);
    fd.append("name", form.name);
    fd.append("email", form.email);

    try {
      await api.post("/certificate/upload", fd);
      setMsg("Upload successful");

      setTimeout(() => {
        navigate("/admin/certificate");
      }, 800);
    } catch (err) {
      console.error(err);
      setMsg("Upload failed");
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: "600px", margin: "0 auto" }}>
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/certificate")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-muted)",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        <ArrowLeft size={18} /> Back to List
      </button>

      <div
        className="open-model-panel"
        style={{ width: "100%", padding: "32px" }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 24,
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--text-dark)",
            textAlign: "center",
          }}
        >
          Upload Certificate
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-muted)",
              }}
            >
              Certificate ID
            </label>
            <input
              className="form-input"
              placeholder="e.g. CERT-2024-001"
              required
              value={form.certificateId}
              onChange={(e) =>
                setForm({ ...form, certificateId: e.target.value })
              }
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-muted)",
              }}
            >
              Candidate Name
            </label>
            <input
              className="form-input"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-muted)",
              }}
            >
              Email Address
            </label>
            <input
              className="form-input"
              type="email"
              placeholder="candidate@example.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="file-input-wrapper">
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-muted)",
              }}
            >
              Certificate PDF
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              required
              style={{ width: "100%" }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          >
            Upload Certificate
          </button>
        </form>

        {msg && (
          <p
            style={{
              marginTop: 20,
              textAlign: "center",
              fontSize: "14px",
              fontWeight: 500,
              color: msg.toLowerCase().includes("failed")
                ? "#ef4444"
                : "#10b981",
            }}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
