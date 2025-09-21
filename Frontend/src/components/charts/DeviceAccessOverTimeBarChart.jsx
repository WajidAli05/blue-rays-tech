import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DeviceAccessChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/v1/trackDeviceOverTime", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(result => {
        if (result.status) {
          setData(result.data);
        }
      })
      .catch(err => console.error("Error fetching device access trend:", err));
  }, []);

return (
  <div>
    <h3 className="chart-heading">Device Access Over Time</h3>
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 40, right: 20, left: 20, bottom: 60 }} // extra space for labels
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={60} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} /> {/* 👈 move legend above chart */}
          <Bar dataKey="mobile" stackId="a" fill="#8884d8" />
          <Bar dataKey="desktop" stackId="a" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

};

export default DeviceAccessChart;