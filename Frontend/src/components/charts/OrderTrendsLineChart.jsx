import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const OrderTrendsLineChart = () => {
  const [data, setData] = useState([]);
  const [interval, setInterval] = useState("week"); // default view

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/order-trends?interval=${interval}`, {
      method: "GET",
      credentials: "include", // because you're using cookies
    })
      .then((res) => res.json())
      .then((result) => {
        // If only one data point, duplicate it with a fake X label
        if (result.length === 1) {
          const fake = { ...result[0], name: result[0].name + " (0)" };
          setData([fake, result[0]]);
        } else {
          setData(result);
        }
      })
      .catch((err) => console.error("Error fetching order trends:", err));
  }, [interval]);

  return (
    <div>
      <h3 className="chart-heading">Order Trend Over Time</h3>

      {/* Toggle Buttons */}
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={() => setInterval("day")}
          style={{
            marginRight: "10px",
            backgroundColor: interval === "day" ? "#8884d8" : "#f0f0f0",
            color: interval === "day" ? "#fff" : "#000",
            border: "1px solid #ccc",
            padding: "5px 12px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Daily
        </button>
        <button
          onClick={() => setInterval("week")}
          style={{
            backgroundColor: interval === "week" ? "#8884d8" : "#f0f0f0",
            color: interval === "week" ? "#fff" : "#000",
            border: "1px solid #ccc",
            padding: "5px 12px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Weekly
        </button>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" domain={["auto", "auto"]} />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderTrendsLineChart;