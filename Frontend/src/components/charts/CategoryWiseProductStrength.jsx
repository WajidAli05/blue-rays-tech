import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';

// Colors for different bars
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

// Sample data for product categories strength
const data = [
  {
    name: 'Elect',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Clothes',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Home',
    uv: 5000,
    pv: 3000,
    amt: 3500,
  },
  {
    name: 'Books',
    uv: 2000,
    pv: 1500,
    amt: 1800,
  },
  {
    name: 'Beauty',
    uv: 3000,
    pv: 2000,
    amt: 2500,
  },
  {
    name: 'Sports',
    uv: 5000,
    pv: 4000,
    amt: 4500,
  },
  {
    name: 'Software',
    uv: 2000,
    pv: 1800,
    amt: 2200,
  },
];


// Function to create the triangle shape for bars
const getPath = (x, y, width, height) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
  Z`;
};

// Custom triangle-shaped bar component
const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

// CategoryWiseProductStrength component
const CategoryWiseProductStrength = () => {
  return (
    <div>
      {/* Title label */}
      <h3 className='chart-heading'>Category Wise Product Strength</h3>

      {/* Bar chart */}
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 30,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-30} textAnchor="end"/>
        <YAxis />
        <Bar dataKey="uv" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};

export default CategoryWiseProductStrength;
