import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data representing order trends over time
const data = [
  {
    name: 'Week 1',
    orders: 400,
  },
  {
    name: 'Week 2',
    orders: 300,
  },
  {
    name: 'Week 3',
    orders: 500,
  },
  {
    name: 'Week 4',
    orders: 600,
  },
  {
    name: 'Week 5',
    orders: 700,
  },
  {
    name: 'Week 6',
    orders: 800,
  },
  {
    name: 'Week 7',
    orders: 900,
  },
];

// OrderTrendsLineChart component that renders the line chart
const OrderTrendsLineChart = () => {
  return (
    <ResponsiveContainer width="50%" height={300}>
      <h3 className='chart-heading'>Order Trend Over Time</h3>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OrderTrendsLineChart;
