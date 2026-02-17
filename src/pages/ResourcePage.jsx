import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

/**
 * Models that should be READ-ONLY in admin
 * (data comes from public forms, not admin)
 */
const READ_ONLY_MODELS = [];
const BLOCKED_MODELS = ["certificate"];
const HIDDEN_COLUMNS = new Set(["_id", "__v", "createdAt", "updatedAt"]);
const MODEL_COLUMN_OVERRIDES = {
  jobapplication: [
    "applicationId",
    "firstName",
    "lastName",
    "email",
    "phone",
    "education",
    "institution",
    "currentYear",
    "major",
    "linkedinurl",
    "githuburl",
    "portfoliourl",
    "jobOpeningId",
    "positionType",
    "coverLetter",
    "skills",
    "resume",
    "status",
  ],
};

export default function ResourcePage() {
  const { model } = useParams();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingRow, setEditingRow] = useState(null);

  const isReadOnly = READ_ONLY_MODELS.includes(model);

  useEffect(() => {
    if (BLOCKED_MODELS.includes(model)) {
      navigate("/admin/certificate");
      return;
    }
    fetchData();
  }, [model]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/models/${model}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setRows(data);
      setColumns(getColumnsForModel(model, data));
    } catch (err) {
      console.error(err);
      setRows([]);
      setColumns([]);
    }
  };

  // CREATE or UPDATE
  const handleSave = async () => {
    try {
      if (editingRow) {
        await api.put(`/models/${model}/${editingRow._id}`, formData);
      } else {
        await api.post(`/models/${model}`, formData);
      }

      setShowModal(false);
      setFormData({});
      setEditingRow(null);
      fetchData();
    } catch (err) {
      alert("Save failed");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;

    try {
      await api.delete(`/models/${model}/${id}`);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const openCreate = () => {
    setFormData({});
    setEditingRow(null);
    setShowModal(true);
  };

  const openEdit = (row) => {
    setFormData(row);
    setEditingRow(row);
    setShowModal(true);
  };

  const editableColumns = columns.filter((c) => !HIDDEN_COLUMNS.has(c));

  return (
    <AdminLayout>
      <div>
        <h2 style={{ textTransform: "capitalize" }}>
          {model === "jobapplication"
            ? "Job Application"
            : model === "contactsubmission"
              ? "Contact Submission"
              : model}
        </h2>

        {!isReadOnly && (
          <div style={{ marginBottom: "24px" }}>
            <button onClick={openCreate} className="btn-primary">
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
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Record
            </button>
          </div>
        )}

        {!rows.length && <p>No records found</p>}

        {!!rows.length && (
          <div
            style={{
              overflowX: "auto",
              maxWidth: "100%",
              paddingBottom: "10px",
            }}
          >
            <table
              border="1"
              cellPadding="6"
              width="100%"
              style={{ minWidth: "1200px" }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                  {!isReadOnly && <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr key={row._id || index}>
                    <td>{index + 1}</td>
                    {columns.map((col) => (
                      <td key={col}>{formatCellValue(row[col])}</td>
                    ))}
                    {!isReadOnly && (
                      <td>
                        <button onClick={() => openEdit(row)}>Edit</button>
                        <button
                          onClick={() => handleDelete(row._id)}
                          style={{ marginLeft: 6 }}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div style={overlay}>
            <div style={modal}>
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: 20,
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {editingRow ? "Edit" : "Add"}{" "}
                <span style={{ textTransform: "capitalize" }}>{model}</span>
              </h3>

              <div
                style={{
                  maxHeight: "60vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                  paddingRight: 8,
                }}
              >
                {editableColumns.map((col) => (
                  <div key={col} style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "#1f2937",
                        textTransform: "capitalize",
                      }}
                    >
                      {col.replace(/_/g, " ")}
                    </label>
                    <input
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
                      value={formData[col] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [col]: e.target.value })
                      }
                    />
                  </div>
                ))}
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
                  onClick={() => setShowModal(false)}
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
                  onClick={handleSave}
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
                  {editingRow ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(2px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
};

const modal = {
  background: "#fff",
  padding: 30,
  width: "100%",
  maxWidth: 500,
  borderRadius: 12,
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
};

const getColumnsForModel = (model, data) => {
  const override = MODEL_COLUMN_OVERRIDES[model];
  if (override) return override;

  const columnSet = new Set();
  data.forEach((row) => {
    Object.keys(row || {}).forEach((key) => columnSet.add(key));
  });

  return Array.from(columnSet).filter((col) => !HIDDEN_COLUMNS.has(col));
};

const formatCellValue = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};
