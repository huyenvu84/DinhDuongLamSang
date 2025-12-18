
import React, { useState, useCallback } from 'react';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import AiAdvisor from './components/AiAdvisor';
import { PatientData, NutritionResults } from './types';
import { ACTIVITY_LEVELS, STRESS_FACTORS, PROTEIN_NEEDS } from './constants';
import { getNutritionAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [results, setResults] = useState<NutritionResults | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const calculateNutrition = useCallback((data: PatientData) => {
    const { age, gender, weight, height, activityLevel, stressFactor, proteinNeed } = data;

    if (!age || !weight || !height) {
      setError('Vui lòng nhập đầy đủ thông tin Tuổi, Cân nặng và Chiều cao.');
      setResults(null);
      return;
    }

    setError('');
    setPatientData(data);
    
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultiplier = ACTIVITY_LEVELS.find(l => l.value === activityLevel)?.multiplier || 1.2;
    const stressMultiplier = STRESS_FACTORS.find(f => f.value === stressFactor)?.multiplier || 1.0;
    
    const tdee = bmr * activityMultiplier * stressMultiplier;

    const proteinMultiplier = PROTEIN_NEEDS.find(p => p.value === proteinNeed)?.multiplier || 1.2;
    const proteinGrams = weight * proteinMultiplier;
    const proteinCalories = proteinGrams * 4;

    const remainingCalories = tdee - proteinCalories;
    const fatCalories = remainingCalories * 0.3; // 30% of remaining calories for fat
    const carbCalories = remainingCalories * 0.7; // 70% for carbs

    const fatGrams = fatCalories / 9;
    const carbGrams = carbCalories / 4;

    const newResults = {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      proteinGrams: Math.round(proteinGrams),
      fatGrams: Math.round(fatGrams),
      carbGrams: Math.round(carbGrams),
      macros: {
        protein: Math.round((proteinCalories / tdee) * 100),
        carbs: Math.round((carbCalories / tdee) * 100),
        fat: Math.round((fatCalories / tdee) * 100),
      }
    };
    setResults(newResults);
    setAiAdvice('');
  }, []);

  const handleGenerateAdvice = async () => {
    if (!patientData || !results) return;
    setIsGenerating(true);
    setError('');
    setAiAdvice('');
    try {
      const advice = await getNutritionAdvice(patientData, results);
      setAiAdvice(advice);
    } catch (err) {
      setError('Không thể tạo tư vấn. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-teal-600">Dinh dưỡng Lâm sàng</h1>
          <p className="text-slate-600 mt-1">Chăm sóc sức toàn diện cho người bệnh.</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <CalculatorForm onSubmit={calculateNutrition} />
          </div>
          
          <div className="lg:col-span-3">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">{error}</div>}

            {results && patientData ? (
              <>
                <ResultsDisplay results={results} />
                <div className="text-center mt-6">
                  <button
                    onClick={handleGenerateAdvice}
                    disabled={isGenerating}
                    className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                  >
                    {isGenerating && (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isGenerating ? 'Đang tạo tư vấn...' : 'Tạo tư vấn dinh dưỡng AI'}
                  </button>
                </div>
                <AiAdvisor advice={aiAdvice} isLoading={isGenerating} />
              </>
            ) : (
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 h-full flex items-center justify-center">
                    <div className="text-center">
                        <svg className="mx-auto h-24 w-24 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <h3 className="mt-4 text-2xl font-semibold text-slate-800">Bắt đầu Tính toán</h3>
                        <p className="mt-2 text-slate-500">
                            Nhập thông tin bệnh nhân để xem kết quả tại đây.
                        </p>
                    </div>
                </div>
            )}
          </div>
        </div>
      </main>
      <footer className="bg-white mt-8 py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>Tuyên bố miễn trừ trách nhiệm: Ứng dụng này chỉ cung cấp thông tin tham khảo nên tham khảo ý kiến của chuyên gia y tế.</p>
          <p className="mt-2">© 2025 Dinh dưỡng lâm sàng - Phát triển bởi BS Huyền Vũ.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
