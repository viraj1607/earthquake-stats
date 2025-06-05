import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const numericFields = [
  "latitude",
  "longitude",
  "depth",
  "mag",
  "nst",
  "gap",
  "dmin",
  "rms",
  "horizontalError",
  "depthError",
  "magError",
  "magNst",
];

interface ChartPanelProps {
  selectedRow: any | null;
}

export default function ChartPanel({ selectedRow }: ChartPanelProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [xKey, setXKey] = useState("mag");
  const [yKey, setYKey] = useState("depth");

  useEffect(() => {
    setLoading(true);
    Papa.parse("/all_month.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const filtered = result.data.filter(
          (row: any) =>
            row[xKey] !== null &&
            row[yKey] !== null &&
            !isNaN(row[xKey]) &&
            !isNaN(row[yKey])
        );
        setData(filtered);
        setLoading(false);
      },
    });
  }, [xKey, yKey]); // re-parse CSV if axis changes

  const filteredData = useMemo(() => {
    return data.filter(
      (row: any) =>
        row[xKey] !== null &&
        row[yKey] !== null &&
        !isNaN(row[xKey]) &&
        !isNaN(row[yKey])
    );
  }, [data, xKey, yKey]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-800">
        <p>Loading earthquake data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Earthquake Scatter Plot
      </h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-700">X Axis</label>
          <select
            value={xKey}
            onChange={(e) => setXKey(e.target.value)}
            className="mt-1 block w-full rounded-md bg-white text-gray-900 border border-gray-300"
          >
            {numericFields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Y Axis</label>
          <select
            value={yKey}
            onChange={(e) => setYKey(e.target.value)}
            className="mt-1 block w-full rounded-md bg-white text-gray-900 border border-gray-300"
          >
            {numericFields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <div style={{ width: "100%", height: 400, minWidth: 300 }}>
          <ResponsiveContainer
            width="100%"
            height="100%"
            key={`${xKey}-${yKey}-${filteredData.length}`}
          >
            {filteredData && (
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey={xKey}
                  name={xKey}
                  tick={{ fill: "#888" }}
                />
                <YAxis
                  type="number"
                  dataKey={yKey}
                  name={yKey}
                  tick={{ fill: "#888" }}
                />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  name="Earthquakes"
                  data={filteredData.map((point) => ({
                    ...point,
                    highlight:
                      selectedRow &&
                      point.time === selectedRow.time && // match logic based on a unique field
                      point.mag === selectedRow.mag,
                  }))}
                  shape={(props:any) => {
                    const color = props.payload.highlight
                      ? "#f43f5e"
                      : "#06b6d4"; // red if selected
                    const radius = props.payload.highlight ? 10 : 5;
                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={radius}
                        fill={color}
                      />
                    );
                  }}
                  isAnimationActive={false}
                />
              </ScatterChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-gray-600">
          No valid data available for selected axes.
        </p>
      )}
    </div>
  );
}
