
import React, { useState } from 'react';
import Card from './ui/Card';
import Spinner from './ui/Spinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AiAdvisorProps {
  advice: string;
  isLoading: boolean;
}

const AiAdvisor: React.FC<AiAdvisorProps> = ({ advice, isLoading }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopy = () => {
    // A simple way to strip markdown for plain text copy
    const plainText = advice
      .replace(/### (.*)/g, '$1\n')
      .replace(/## (.*)/g, '$1\n')
      .replace(/\* \*\*(.*):\*\* /g, '- $1: ')
      .replace(/\*\*/g, '')
      .replace(/\* /g, '- ');

    navigator.clipboard.writeText(plainText).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  if (isLoading) {
    return (
      <Card>
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
    <Card>
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Tư vấn Dinh dưỡng AI</h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          {copyStatus === 'copied' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          )}
          {copyStatus === 'copied' ? 'Đã sao chép!' : 'Sao chép'}
        </button>
      </div>
      <div className="prose prose-slate max-w-none prose-h3:text-teal-600 prose-h3:font-semibold prose-strong:text-slate-700 prose-a:text-teal-600 hover:prose-a:text-teal-700">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {advice}
        </ReactMarkdown>
      </div>
    </Card>
  );
};

export default AiAdvisor;
