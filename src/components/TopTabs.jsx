export default function TopTabs({ tabs, active, setActive }) {
  return (
    <div className="flex border-b bg-gray-50">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-4 py-2 text-sm border-r ${
            active === tab
              ? "bg-white font-semibold"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
      <button className="px-3 text-lg">+</button>
    </div>
  );
}
