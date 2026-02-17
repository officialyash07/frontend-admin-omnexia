import { useState } from "react";
import api from "../services/api";

export default function Certificate() {
  const [certificateId, setCertificateId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setError("");

    try {
      const res = await api.get("/certificate/download", {
        params: { certificateId, email },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${certificateId}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Invalid details or certificate already downloaded");
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 400 }}>
      <h2>Download Certificate</h2>

      <input
        placeholder="Certificate ID"
        value={certificateId}
        onChange={(e) => setCertificateId(e.target.value)}
      />

      <input
        placeholder="Registered Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleDownload}>Download</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
