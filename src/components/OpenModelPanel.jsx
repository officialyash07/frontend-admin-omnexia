import { useState } from "react";
import "../assets/css/styles/open-model-panel.css";

export default function OpenModelPanel({ models, onOpen }) {
  const [search, setSearch] = useState("");

  const filtered = models.filter((m) =>
    m.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="open-model-panel">
      <div className="omp-header">Open a Model</div>

      <div className="omp-search">
        <input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="omp-body">
        <p className="omp-title">ALL MODELS</p>

        <ul>
          {filtered.map((m) => (
            <li key={m.key} onClick={() => onOpen(m.key)}>
              <span>{m.label}</span>
              <span className="count">{m.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
