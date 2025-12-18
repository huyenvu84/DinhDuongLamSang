
import { SelectOption } from './types';

export const ACTIVITY_LEVELS: SelectOption[] = [
  { value: 'sedentary', label: 'Ít vận động (công việc văn phòng)', multiplier: 1.2 },
  { value: 'light', label: 'Vận động nhẹ (1-3 ngày/tuần)', multiplier: 1.375 },
  { value: 'moderate', label: 'Vận động vừa (3-5 ngày/tuần)', multiplier: 1.55 },
  { value: 'active', label: 'Vận động nhiều (6-7 ngày/tuần)', multiplier: 1.725 },
  { value: 'very_active', label: 'Vận động rất nhiều (công việc thể chất)', multiplier: 1.9 },
];

export const STRESS_FACTORS: SelectOption[] = [
  { value: 'none', label: 'Không có stress/bệnh tật', multiplier: 1.0 },
  { value: 'mild', label: 'Stress nhẹ (phẫu thuật nhỏ)', multiplier: 1.2 },
  { value: 'moderate', label: 'Stress vừa (nhiễm trùng, gãy xương)', multiplier: 1.4 },
  { value: 'severe', label: 'Stress nặng (bỏng, đa chấn thương)', multiplier: 1.6 },
  { value: 'critical', label: 'Rất nặng (nhiễm trùng huyết, bỏng nặng)', multiplier: 2.0 },
];

export const PROTEIN_NEEDS: SelectOption[] = [
  { value: 'normal', label: 'Bình thường (0.8 - 1.0 g/kg)', multiplier: 0.9 },
  { value: 'maintenance', label: 'Duy trì, stress nhẹ (1.0 - 1.2 g/kg)', multiplier: 1.1 },
  { value: 'moderate', label: 'Stress vừa (1.2 - 1.5 g/kg)', multiplier: 1.35 },
  { value: 'high', label: 'Nhu cầu cao, chữa lành vết thương (1.5 - 2.0 g/kg)', multiplier: 1.75 },
  { value: 'very_high', label: 'Rất cao, bỏng nặng (>2.0 g/kg)', multiplier: 2.2 },
];

export const MEDICAL_CONDITIONS: SelectOption[] = [
  { value: 'hypertension', label: 'Tăng huyết áp' },
  { value: 'diabetes_t2', label: 'Đái tháo đường Type 2' },
  { value: 'ckd', label: 'Bệnh thận mạn' },
  { value: 'gout', label: 'Bệnh Gout' },
  { value: 'dyslipidemia', label: 'Rối loạn mỡ máu' },
];

export const CKD_STAGES: SelectOption[] = [
  { value: '1', label: 'Giai đoạn 1' },
  { value: '2', label: 'Giai đoạn 2' },
  { value: '3a', label: 'Giai đoạn 3a' },
  { value: '3b', label: 'Giai đoạn 3b' },
  { value: '4', label: 'Giai đoạn 4' },
  { value: '5', label: 'Giai đoạn 5' },
];
