
import React from 'react';
import { NutritionResults, PatientData } from '../types';
import Card from './ui/Card';
import NutritionChart from './NutritionChart';

interface ResultsDisplayProps {
  results: NutritionResults;
  patientData: PatientData;
}

const ResultItem: React.FC<{ label: string; value: string | number; unit: string; icon: React.ReactNode; className?: string }> = ({ label, value, unit, icon, className = '' }) => (
    <div className={`p-4 rounded-lg bg-slate-100 flex items-center gap-4 ${className}`}>
        <div className="bg-white p-2 rounded-full shadow-sm">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-xl font-bold text-slate-800">
                {value} <span className="text-sm font-normal text-slate-600">{unit}</span>
            </p>
        </div>
    </div>
);

const MACRO_RANGES = {
  protein: { min: 10, max: 35, name: 'Protein' },
  carbs: { min: 45, max: 65, name: 'Carbohydrate' },
  fat: { min: 20, max: 35, name: 'Fat' },
};

const getMacroAnalysis = (macro: 'protein' | 'carbs' | 'fat', value: number) => {
  const range = MACRO_RANGES[macro];
  if (value < range.min) return { label: 'Thấp', className: 'bg-blue-100 text-blue-800' };
  if (value > range.max) return { label: 'Cao', className: 'bg-red-100 text-red-800' };
  return { label: 'Tối ưu', className: 'bg-green-100 text-green-800' };
};

const MacroAnalysisItem: React.FC<{macro: 'protein' | 'carbs' | 'fat'; value: number}> = ({ macro, value }) => {
    const analysis = getMacroAnalysis(macro, value);
    const range = MACRO_RANGES[macro];

    return (
        <li className="flex justify-between items-center py-2">
            <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${analysis.className.split(' ')[0]}`}></span>
                <span className="font-semibold text-slate-700 text-sm">{range.name}</span>
                <span className="text-xs text-slate-500 ml-2">{`(${range.min}-${range.max}%)`}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-slate-800">{value}%</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${analysis.className}`}>{analysis.label}</span>
            </div>
        </li>
    );
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Kết quả Nhu cầu Dinh dưỡng</h2>
      <div className="space-y-6">
        
        <div className="bg-teal-50 border border-teal-200 p-6 rounded-xl text-center">
          <p className="text-sm font-medium text-teal-700">Tổng năng lượng khuyến nghị (TDEE)</p>
          <p className="text-5xl font-bold text-teal-600 my-2">
            {results.tdee}
            <span className="text-2xl font-medium text-teal-500 ml-2">kcal/ngày</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultItem label="Protein" value={results.proteinGrams} unit="g" icon={<svg className="w-6 h-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.871 4A1.92 1.92 0 016.79 6.071V18.39a1.871 1.871 0 01-1.872 1.871H3.32a1.87 1.87 0 01-1.871-1.871V6.07A1.92 1.92 0 013.32 4h1.55zM10.51 4A1.92 1.92 0 0112.43 6.071V18.39a1.871 1.871 0 01-1.872 1.871h-1.55a1.87 1.87 0 01-1.871-1.871V6.07A1.92 1.92 0 019 4h1.51zM16 4a1.92 1.92 0 011.92 2.071V18.39a1.871 1.871 0 01-1.872 1.871h-1.55a1.87 1.87 0 01-1.871-1.871V6.07A1.92 1.92 0 0114.45 4H16z" /></svg>} />
            <ResultItem label="Carbs" value={results.carbGrams} unit="g" icon={<svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
            <ResultItem label="Fat" value={results.fatGrams} unit="g" icon={<svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97M15 21H9" /></svg>} />
        </div>
        
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700 text-center mb-4">Phân bổ & Đánh giá Năng lượng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-60">
                <NutritionChart data={results.macros} />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <ul className="divide-y divide-slate-200">
                    <MacroAnalysisItem macro="protein" value={results.macros.protein} />
                    <MacroAnalysisItem macro="carbs" value={results.macros.carbs} />
                    <MacroAnalysisItem macro="fat" value={results.macros.fat} />
                </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-200">
            Năng lượng nghỉ (BMR): <span className="font-semibold text-slate-600">{results.bmr} kcal/ngày</span>
        </div>

      </div>
    </Card>
  );
};

export default ResultsDisplay;
