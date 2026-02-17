import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useMemo } from "react";

export default function DashboardCharts({
  jobApplications,
  contactSubmissions,
}) {
  // 1. Process Data for Timeline Chart (Last 7 Days or All Time)
  const timelineData = useMemo(() => {
    const dataMap = {};

    const process = (items, key) => {
      items.forEach((item) => {
        if (!item.createdAt) return;
        const date = new Date(item.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (!dataMap[date]) {
          dataMap[date] = { date, jobs: 0, contacts: 0 };
        }
        dataMap[date][key] += 1;
      });
    };

    process(jobApplications, "jobs");
    process(contactSubmissions, "contacts");

    // Convert map to sorted array
    return Object.values(dataMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
  }, [jobApplications, contactSubmissions]);

  // 2. Process Data for Pie Chart
  const pieData = [
    { name: "Job Applications", value: jobApplications.length },
    { name: "Contact Submissions", value: contactSubmissions.length },
  ];

  const COLORS = ["#3b82f6", "#10b981"];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "24px",
        marginTop: "24px",
      }}
    >
      {/* LINE CHART */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Activity Trends</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f293b",
                  borderColor: "#334155",
                  color: "#f1f5f9",
                }}
                itemStyle={{ color: "#f1f5f9" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="jobs"
                name="Job Applications"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#3b82f6" }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="contacts"
                name="Contact Submissions"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHART */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Distribution</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f293b",
                  borderColor: "#334155",
                  color: "#f1f5f9",
                }}
                itemStyle={{ color: "#f1f5f9" }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Inline Styles to match Dashboard Theme
const cardStyle = {
  background: "rgba(30, 41, 59, 0.7)", // Matches glassy dark theme
  backdropFilter: "blur(12px)",
  borderRadius: "16px",
  padding: "20px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  display: "flex",
  flexDirection: "column",
};

const titleStyle = {
  color: "#f3f4f6", // Light gray text
  fontSize: "1.1rem",
  fontWeight: 600,
  marginBottom: "16px",
};
