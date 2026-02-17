import { Download, ExternalLink } from "lucide-react";

export default function DataTable({ columns, data }) {
  // Helper: Check if column is a resume/file
  const isResumeColumn = (colName) => {
    const name = colName.toLowerCase();
    return name.includes("resume") || name.includes("cv") || name.includes("file");
  };

  // Helper: Check if value is a URL
  const isUrl = (value) => {
    return typeof value === 'string' && (value.startsWith('http') || value.startsWith('/'));
  };

  // Force Download Logic
  const handleDownload = async (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = url.split('/').pop() || "resume"; // Filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download fallback", error);
      window.open(url, '_blank'); // Fallback to new tab
    }
  };

  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-100 border-b">
        <tr>
          <th className="px-2"><input type="checkbox" /></th>
          {columns.map((col) => (
            <th key={col} className="px-3 py-2 text-left font-semibold text-gray-500 uppercase">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id || row._id || Math.random()} className="border-b hover:bg-gray-50">
            <td className="px-2"><input type="checkbox" /></td>
            {columns.map((col) => (
              <td key={col} className="px-3 py-2 max-w-xs truncate">
                {isResumeColumn(col) && isUrl(row[col]) ? (
                  <div className="flex items-center gap-3">
                    {/* View */}
                    <a
                      href={row[col]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} /> View
                    </a>
                    {/* Download */}
                    <button
                      onClick={(e) => handleDownload(e, row[col])}
                      className="text-green-600 hover:text-green-800 flex items-center gap-1 font-medium"
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                ) : (
                  row[col]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}