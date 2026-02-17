import React, { useState } from "react";
import api from "../api";

const CertificateDownload = () => {
  const [applicationId, setApplicationId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/certificate/download", {
        params: { applicationId, email },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${applicationId}-certificate.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("❌ Invalid details OR certificate already downloaded");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto" }}>
      <h2>Download Certificate</h2>

      <input
        placeholder="Application ID"
        value={applicationId}
        onChange={(e) => setApplicationId(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Registered Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button onClick={handleDownload} disabled={loading}>
        {loading ? "Downloading..." : "Download Certificate"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CertificateDownload;
