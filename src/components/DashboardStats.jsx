

export default function DashboardStats({ users }) {
  const total = users.length;
  const admins = users.filter(u => u.role === "admin").length;
  const managers = users.filter(u => u.role === "manager").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-500">Total Users</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-500">Admins</p>
        <p className="text-2xl font-bold text-red-600">{admins}</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-500">Managers</p>
        <p className="text-2xl font-bold text-blue-600">{managers}</p>
      </div>
    </div>
  );
}
