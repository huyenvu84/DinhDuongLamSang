
import { GoogleGenAI } from "@google/genai";
import { PatientData, NutritionResults, MedicalConditionDetails } from "../types";
import { ACTIVITY_LEVELS, STRESS_FACTORS, MEDICAL_CONDITIONS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const formatConditionDetails = (details: MedicalConditionDetails): string => {
    let detailsText = [];
    const NA = 'chưa cung cấp';

    if (details.hypertension) {
        const { systolic, diastolic } = details.hypertension;
        if (systolic || diastolic) {
             detailsText.push(`- Tăng huyết áp: Huyết áp ${systolic || NA}/${diastolic || NA} mmHg`);
        }
    }
    if (details.diabetes_t2?.hba1c) {
        detailsText.push(`- Đái tháo đường Type 2: HbA1c ${details.diabetes_t2.hba1c}%`);
    }
    if (details.ckd?.stage) {
        detailsText.push(`- Bệnh thận mạn: Giai đoạn ${details.ckd.stage}`);
    }
    if (details.gout?.uricAcid) {
        detailsText.push(`- Bệnh Gout: Acid Uric ${details.gout.uricAcid} mg/dL`);
    }
    if (details.dyslipidemia) {
        const { ldl, hdl, triglycerides } = details.dyslipidemia;
        if (ldl || hdl || triglycerides) {
            detailsText.push(`- Rối loạn mỡ máu: LDL ${ldl || NA} mg/dL, HDL ${hdl || NA} mg/dL, Triglycerides ${triglycerides || NA} mg/dL`);
        }
    }
    return detailsText.join('\n');
};

export const getNutritionAdvice = async (
  patientData: PatientData,
  results: NutritionResults
): Promise<string> => {
  const activityLevelText = ACTIVITY_LEVELS.find(l => l.value === patientData.activityLevel)?.label || 'Không xác định';
  const stressFactorText = STRESS_FACTORS.find(f => f.value === patientData.stressFactor)?.label || 'Không xác định';

  const conditionsText = patientData.medicalConditions
    .map(conditionValue => {
      return MEDICAL_CONDITIONS.find(c => c.value === conditionValue)?.label;
    })
    .filter(Boolean)
    .join(', ');
    
  const conditionDetailsText = formatConditionDetails(patientData.medicalConditionDetails);

  const prompt = `
Bạn là một chuyên gia dinh dưỡng lâm sàng. Dựa trên thông tin bệnh nhân và nhu cầu dinh dưỡng đã được tính toán sau đây, hãy đưa ra một kế hoạch tư vấn dinh dưỡng chi tiết.

### Thông tin Bệnh nhân
- **Tuổi:** ${patientData.age}
- **Giới tính:** ${patientData.gender === 'male' ? 'Nam' : 'Nữ'}
- **Cân nặng:** ${patientData.weight} kg
- **Chiều cao:** ${patientData.height} cm
- **Mức độ hoạt động:** ${activityLevelText}
- **Tình trạng lâm sàng (hệ số stress):** ${stressFactorText}
- **Bệnh lý nền:** ${conditionsText || 'Không có'}
${conditionDetailsText ? `\n### Chi tiết Bệnh lý nền\n${conditionDetailsText}` : ''}

### Nhu cầu Dinh dưỡng Ước tính
- **Tổng năng lượng (TDEE):** ${results.tdee} kcal/ngày
- **Chất đạm (Protein):** ${results.proteinGrams} g/ngày
- **Chất bột đường (Carbohydrate):** ${results.carbGrams} g/ngày
- **Chất béo (Fat):** ${results.fatGrams} g/ngày

Dựa vào các thông tin trên, **đặc biệt là các bệnh lý nền và chỉ số lâm sàng đã được liệt kê**, hãy cung cấp lời khuyên dinh dưỡng cụ thể bao gồm các mục sau:

1.  **Mục tiêu Dinh dưỡng:** Nêu rõ mục tiêu chính của chế độ ăn (ví dụ: cung cấp đủ năng lượng, hỗ trợ phục hồi, kiểm soát đường huyết dựa trên HbA1c, kiểm soát huyết áp, bảo tồn chức năng thận...).
2.  **Phân bổ Bữa ăn:** Gợi ý cách chia nhỏ các bữa ăn trong ngày (ví dụ: 3 bữa chính, 2 bữa phụ) để tối ưu hấp thu và duy trì năng lượng.
3.  **Lựa chọn Thực phẩm:**
    *   **Nguồn Protein:** Đưa ra ví dụ về các loại thực phẩm giàu protein tốt (thịt nạc, cá, trứng, sữa, các loại đậu...).
    *   **Nguồn Carbohydrate:** Gợi ý các loại carbohydrate phức hợp, giàu chất xơ (gạo lứt, yến mạch, khoai lang, rau củ...).
    *   **Nguồn Chất béo:** Gợi ý các nguồn chất béo lành mạnh (quả bơ, các loại hạt, dầu ô liu, cá béo...).
4.  **Lưu ý Đặc biệt:** Dựa vào tình trạng lâm sàng, **bệnh lý nền và các chỉ số cụ thể**, đưa ra những lời khuyên quan trọng và các thực phẩm cần tránh (ví dụ: với bệnh nhân tăng huyết áp, cần nhấn mạnh chế độ ăn giảm muối; với bệnh nhân đái tháo đường, cần lưu ý về chỉ số đường huyết của thực phẩm; với bệnh thận mạn, cần kiểm soát protein và điện giải tùy theo giai đoạn...).
5.  **Hydrat hóa:** Khuyến nghị lượng nước cần uống mỗi ngày và các loại chất lỏng khác nếu có.

Hãy trình bày câu trả lời một cách chuyên nghiệp, rõ ràng, sử dụng định dạng markdown với tiêu đề và danh sách để người đọc dễ dàng theo dõi.
`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
    });
    
    if (response.text) {
        return response.text;
    } else {
        throw new Error("No text response from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get nutrition advice from AI.");
  }
};
