
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface NutritionChartProps {
  data: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const COLORS = {
  protein: '#38bdf8', // sky-400
  carbs: '#34d399', // emerald-400
  fat: '#facc15' // yellow-400
};

const NutritionChart: React.FC<NutritionChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Protein', value: data.protein },
    { name: 'Carbs', value: data.carbs },
    { name: 'Fat', value: data.fat },
  ].filter(d => d.value > 0); // Ensure no zero-value slices are rendered

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          innerRadius={50}
          paddingAngle={5}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${value}%`} />
        <Legend iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default NutritionChart;
