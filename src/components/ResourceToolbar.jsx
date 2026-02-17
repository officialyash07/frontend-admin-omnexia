export default function ResourceToolbar() {
  return (
    <div className="flex items-center gap-2 p-2 border-b bg-white text-sm">
      <button className="border px-2 py-1 rounded">Filters</button>
      <button className="border px-2 py-1 rounded">Fields</button>
      <span className="ml-auto">Showing 1–10</span>
      <button className="bg-black text-white px-3 py-1 rounded">
        Add record
      </button>
    </div>
  );
}
