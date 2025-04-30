import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Sample data for category-wise inventory
const data = [
  {
    name: 'Physical Products',
    stockLevel: 400,
  },
  {
    name: 'Digital Products',
    stockLevel: 300,
  },
  {
    name: 'Affiliate Products',
    stockLevel: 500,
  },
  {
    name: 'Others',
    stockLevel: 200,
  },
];

// Colors for each bar (you can customize these)
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CategoryWiseInventoryBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="stockLevel" fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CategoryWiseInventoryBarChart;
