
import React from 'react';
import { NutritionResults } from '../types';
import Card from './ui/Card';
import NutritionChart from './NutritionChart';

interface ResultsDisplayProps {
  results: NutritionResults;
}

const ResultItem: React.FC<{ label: string; value: string | number; unit: string; bgColor?: string }> = ({ label, value, unit, bgColor = 'bg-slate-100' }) => (
    <div className={`p-4 rounded-lg ${bgColor} text-center`}>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">
            {value} <span className="text-base font-normal text-slate-600">{unit}</span>
        </p>
    </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b pb-4">Kết quả Tính toán</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultItem label="BMR (Năng lượng nghỉ)" value={results.bmr} unit="kcal/ngày" bgColor="bg-blue-50"/>
          <ResultItem label="TDEE (Tổng Năng lượng)" value={results.tdee} unit="kcal/ngày" bgColor="bg-teal-50"/>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-700 pt-4">Nhu cầu Dinh dưỡng Đa lượng</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ResultItem label="Chất đạm (Protein)" value={results.proteinGrams} unit="g/ngày" />
          <ResultItem label="Chất bột đường (Carb)" value={results.carbGrams} unit="g/ngày" />
          <ResultItem label="Chất béo (Fat)" value={results.fatGrams} unit="g/ngày" />
        </div>

        <div className="pt-4">
            <h3 className="text-lg font-semibold text-slate-700 text-center mb-2">Phân bổ Năng lượng Đa lượng (%)</h3>
            <div className="w-full h-64">
                <NutritionChart data={results.macros} />
            </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultsDisplay;
