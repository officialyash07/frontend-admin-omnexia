import { useState } from "react";
import api from "../services/api";

export default function AdminCertificate() {
  const [certificateId, setCertificateId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("certificateId", certificateId);
      formData.append("name", name);
      formData.append("email", email);

      // ✅ MUST MATCH multer.single("file")
      formData.append("file", selectedFile);

      await api.post("/certificate/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus("Upload successful ✅");

      // reset
      setCertificateId("");
      setName("");
      setEmail("");
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setStatus("Upload failed ❌");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Certificate (Admin)</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Certificate ID"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          required
        />
        <br />

        <input
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          required
        />
        <br />

        <button type="submit">Upload Certificate</button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}
