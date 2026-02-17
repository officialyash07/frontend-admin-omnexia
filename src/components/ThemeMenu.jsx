import { useState } from "react";

export default function ThemeMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm border px-3 py-1 rounded"
      >
        ⚙
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-gray-800 text-white rounded shadow">
          <button className="block w-full px-4 py-2 text-left hover:bg-gray-700">
            Dark theme
          </button>
          <button className="block w-full px-4 py-2 text-left hover:bg-gray-700">
            View changelog
          </button>
          <button className="block w-full px-4 py-2 text-left hover:bg-gray-700">
            View shortcuts
          </button>
        </div>
      )}
    </div>
  );
}
