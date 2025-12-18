
import React, { useState } from 'react';
import { PatientData, MedicalConditionDetails } from '../types';
import { ACTIVITY_LEVELS, STRESS_FACTORS, PROTEIN_NEEDS, MEDICAL_CONDITIONS, CKD_STAGES } from '../constants';
import Card from './ui/Card';

interface CalculatorFormProps {
  onSubmit: (data: PatientData) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<PatientData>({
    age: 30,
    gender: 'male',
    weight: 70,
    height: 175,
    activityLevel: 'sedentary',
    stressFactor: 'none',
    proteinNeed: 'maintenance',
    medicalConditions: [],
    medicalConditionDetails: {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value,
    }));
  };
  
  const handleGenderChange = (gender: 'male' | 'female') => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const conditions = prev.medicalConditions;
      const newConditions = checked
        ? [...conditions, value]
        : conditions.filter(c => c !== value);

      const newDetails = { ...prev.medicalConditionDetails };
      if (!checked) {
        delete newDetails[value as keyof MedicalConditionDetails];
      }

      return {
        ...prev,
        medicalConditions: newConditions,
        medicalConditionDetails: newDetails,
      };
    });
  };

  const handleConditionDetailChange = (condition: keyof MedicalConditionDetails, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      medicalConditionDetails: {
        ...prev.medicalConditionDetails,
        [condition]: {
          ...prev.medicalConditionDetails[condition],
          [field]: value === '' ? undefined : value,
        },
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderConditionDetails = (conditionValue: string) => {
    const isSelected = formData.medicalConditions.includes(conditionValue);
    if (!isSelected) return null;
    
    const baseInputClasses = "w-full text-sm px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500";
    const baseLabelClasses = "block text-xs font-medium text-slate-500 mb-1";

    return (
      <div className="pl-6 mt-3 mb-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
        {conditionValue === 'hypertension' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="systolic" className={baseLabelClasses}>HA tâm thu (mmHg)</label>
              <input type="number" id="systolic" value={formData.medicalConditionDetails.hypertension?.systolic || ''} onChange={(e) => handleConditionDetailChange('hypertension', 'systolic', e.target.value)} className={baseInputClasses} />
            </div>
            <div>
              <label htmlFor="diastolic" className={baseLabelClasses}>HA tâm trương (mmHg)</label>
              <input type="number" id="diastolic" value={formData.medicalConditionDetails.hypertension?.diastolic || ''} onChange={(e) => handleConditionDetailChange('hypertension', 'diastolic', e.target.value)} className={baseInputClasses} />
            </div>
          </div>
        )}
        {conditionValue === 'diabetes_t2' && (
           <div>
              <label htmlFor="hba1c" className={baseLabelClasses}>HbA1c (%)</label>
              <input type="number" step="0.1" id="hba1c" value={formData.medicalConditionDetails.diabetes_t2?.hba1c || ''} onChange={(e) => handleConditionDetailChange('diabetes_t2', 'hba1c', e.target.value)} className={baseInputClasses} />
            </div>
        )}
        {conditionValue === 'ckd' && (
          <div>
            <label htmlFor="ckd_stage" className={baseLabelClasses}>Giai đoạn Bệnh thận mạn</label>
            <select id="ckd_stage" value={formData.medicalConditionDetails.ckd?.stage || ''} onChange={(e) => handleConditionDetailChange('ckd', 'stage', e.target.value)} className={baseInputClasses}>
              <option value="">Chọn giai đoạn</option>
              {CKD_STAGES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        )}
        {conditionValue === 'gout' && (
          <div>
            <label htmlFor="uricAcid" className={baseLabelClasses}>Acid Uric (mg/dL)</label>
            <input type="number" step="0.1" id="uricAcid" value={formData.medicalConditionDetails.gout?.uricAcid || ''} onChange={(e) => handleConditionDetailChange('gout', 'uricAcid', e.target.value)} className={baseInputClasses} />
          </div>
        )}
        {conditionValue === 'dyslipidemia' && (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="ldl" className={baseLabelClasses}>LDL (mg/dL)</label>
              <input type="number" id="ldl" value={formData.medicalConditionDetails.dyslipidemia?.ldl || ''} onChange={(e) => handleConditionDetailChange('dyslipidemia', 'ldl', e.target.value)} className={baseInputClasses} />
            </div>
            <div>
              <label htmlFor="hdl" className={baseLabelClasses}>HDL (mg/dL)</label>
              <input type="number" id="hdl" value={formData.medicalConditionDetails.dyslipidemia?.hdl || ''} onChange={(e) => handleConditionDetailChange('dyslipidemia', 'hdl', e.target.value)} className={baseInputClasses} />
            </div>
             <div>
              <label htmlFor="triglycerides" className={baseLabelClasses}>Triglycerides</label>
              <input type="number" id="triglycerides" value={formData.medicalConditionDetails.dyslipidemia?.triglycerides || ''} onChange={(e) => handleConditionDetailChange('dyslipidemia', 'triglycerides', e.target.value)} className={baseInputClasses} />
            </div>
          </div>
        )}
      </div>
    );
  };


  return (
    <Card>
      <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b pb-4">Thông tin bệnh nhân</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-slate-600 mb-1">Tuổi</label>
            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Giới tính</label>
            <div className="flex space-x-2">
              <button type="button" onClick={() => handleGenderChange('male')} className={`flex-1 py-2 rounded-lg text-sm transition-colors ${formData.gender === 'male' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>Nam</button>
              <button type="button" onClick={() => handleGenderChange('female')} className={`flex-1 py-2 rounded-lg text-sm transition-colors ${formData.gender === 'female' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>Nữ</button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="weight" className="block text-sm font-medium text-slate-600 mb-1">Cân nặng (kg)</label>
                <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
            <div>
                <label htmlFor="height" className="block text-sm font-medium text-slate-600 mb-1">Chiều cao (cm)</label>
                <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
        </div>

        <div>
          <label htmlFor="activityLevel" className="block text-sm font-medium text-slate-600 mb-1">Mức độ hoạt động</label>
          <select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
            {ACTIVITY_LEVELS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="stressFactor" className="block text-sm font-medium text-slate-600 mb-1">Tình trạng lâm sàng (Hệ số stress)</label>
          <select id="stressFactor" name="stressFactor" value={formData.stressFactor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
            {STRESS_FACTORS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

         <div>
          <label htmlFor="proteinNeed" className="block text-sm font-medium text-slate-600 mb-1">Nhu cầu Protein</label>
          <select id="proteinNeed" name="proteinNeed" value={formData.proteinNeed} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
            {PROTEIN_NEEDS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Bệnh lý nền (nếu có)</label>
          <div className="space-y-2">
            {MEDICAL_CONDITIONS.map(opt => (
              <div key={opt.value}>
                <div className="flex items-center">
                  <input
                    id={`condition-${opt.value}`}
                    name="medicalConditions"
                    type="checkbox"
                    value={opt.value}
                    onChange={handleConditionChange}
                    checked={formData.medicalConditions.includes(opt.value)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor={`condition-${opt.value}`} className="ml-2 block text-sm text-slate-800">
                    {opt.label}
                  </label>
                </div>
                {renderConditionDetails(opt.value)}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-300">Tính toán Nhu cầu</button>
      </form>
    </Card>
  );
};

export default CalculatorForm;
