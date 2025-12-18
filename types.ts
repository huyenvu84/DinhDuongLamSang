
export interface MedicalConditionDetails {
  hypertension?: {
    systolic?: number;
    diastolic?: number;
  };
  diabetes_t2?: {
    hba1c?: number;
  };
  ckd?: {
    stage?: '1' | '2' | '3a' | '3b' | '4' | '5';
  };
  gout?: {
    uricAcid?: number;
  };
  dyslipidemia?: {
    ldl?: number;
    hdl?: number;
    triglycerides?: number;
  };
}

export interface PatientData {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: string;
  stressFactor: string;
  proteinNeed: string;
  medicalConditions: string[];
  medicalConditionDetails: MedicalConditionDetails;
}

export interface NutritionResults {
  bmr: number;
  tdee: number;
  proteinGrams: number;
  fatGrams: number;
  carbGrams: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface SelectOption {
    value: string;
    label: string;
    multiplier?: number;
}