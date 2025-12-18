
import React from 'react';
import Card from './ui/Card';
import Spinner from './ui/Spinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AiAdvisorProps {
  advice: string;
  isLoading: boolean;
}

const AiAdvisor: React.FC<AiAdvisorProps> = ({ advice, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="mt-8">
        <div className="flex flex-col items-center justify-center p-8">
          <Spinner />
          <p className="mt-4 text-slate-600">AI đang phân tích và tạo tư vấn dinh dưỡng...</p>
        </div>
      </Card>
    );
  }

  if (!advice) {
    return null;
  }

  return (
    <Card className="mt-8">
      <h2 className="text-2xl font-bold text-teal-600 mb-4 border-b pb-4">Tư vấn Dinh dưỡng từ AI</h2>
      <div className="prose prose-slate max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {advice}
        </ReactMarkdown>
      </div>
    </Card>
  );
};

export default AiAdvisor;
