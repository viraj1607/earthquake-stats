import React, { useEffect, useState } from "react";
import Papa from "papaparse";

interface RowData {
  [key: string]: any;
}

interface DataPanelProps {
  onRowSelect?: (row: RowData) => void;
}

const DataPanel: React.FC<DataPanelProps> = ({ onRowSelect }) => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  useEffect(() => {
    Papa.parse("/all_month.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const data = result.data as Record<string, any>[];
        if (data.length > 0) {
          setHeaders(Object.keys(data[0]));
          setRows(data);
        }
        setLoading(false);
      },
    });
  }, []);

  const handleRowClick = (row: RowData, index: number) => {
    setSelectedRowIndex(index);
    if (onRowSelect) {
      onRowSelect(row);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-800">
        Loading full dataset...
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Full Earthquake Data Table
      </h2>
      <div className="overflow-auto max-h-[75vh] border border-gray-300 rounded-md">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 border-b border-gray-300 font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className={`even:bg-gray-50 cursor-pointer transition hover:bg-blue-100 ${
                  selectedRowIndex === index ? "bg-blue-200" : ""
                }`}
                onClick={() => handleRowClick(row, index)}
              >
                {headers.map((header) => (
                  <td
                    key={header}
                    className="px-4 py-1 border-b border-gray-200"
                  >
                    {row[header] !== undefined ? String(row[header]) : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPanel;
