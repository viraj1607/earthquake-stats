import React, { useState } from "react";
import ChartPanel from "./ChartPanel";
import DataPanel from "./DataPanel";

const Dashboard:React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Earthquake Dashboard
          </h1>
          <p className="text-gray-600">
            Interactive chart and full dataset with row selection
          </p>
        </div>

        {/* Chart Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ChartPanel selectedRow={selectedRow} />
        </div>

        {/* Data Table Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <DataPanel onRowSelect={setSelectedRow} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
