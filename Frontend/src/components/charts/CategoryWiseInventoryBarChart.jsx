import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Colors for each bar
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CategoryWiseInventoryBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    fetch('http://localhost:3001/api/v1/category-wise-stock', {
      method: 'GET',
      credentials: 'include',
    })
    .then((response) => {
      if (!response) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data)=> {
      setData(data.data)
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching category-wise inventory:', error);
      setLoading(false);
    });
  }, [])

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ResponsiveContainer width="50%" height={300}>
      <div style={{ textAlign: 'center' }}>
        <h3 className="chart-heading">Total Inventory Per Category</h3>
      </div>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" angle={-20} textAnchor="end" />
        <YAxis />
        <Tooltip />
        <Legend 
          layout="vertical"  
          verticalAlign="bottom"  
          wrapperStyle={{
            bottom: -40, 
          }}
        />
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
