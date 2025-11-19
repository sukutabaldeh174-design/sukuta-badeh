
import React, { useState } from 'react';
import { GeneratedDocs, OutputTab } from '../types';
import { CopyButton } from './CopyButton';

interface OutputDisplayProps {
  docs: GeneratedDocs | null;
  isLoading: boolean;
  error: string | null;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 ${
      active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);

const SkeletonLoader: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/4"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-700 rounded w-1/3 mt-6"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
    </div>
);


export const OutputDisplay: React.FC<OutputDisplayProps> = ({ docs, isLoading, error }) => {
  const [activeTab, setActiveTab] = useState<OutputTab>('budget');

  const renderContent = () => {
    if (isLoading) {
        return <SkeletonLoader />;
    }
    
    if (error) {
        return <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>;
    }

    if (!docs) {
      return (
        <div className="text-center text-gray-500 py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <h3 className="mt-2 text-lg font-medium text-gray-300">Documentos del Proyecto</h3>
          <p className="mt-1 text-sm">Los resultados generados aparecerán aquí.</p>
        </div>
      );
    }
    
    let contentToDisplay = '';
    switch(activeTab) {
        case 'budget':
            contentToDisplay = docs.budget;
            break;
        case 'milestones':
            contentToDisplay = docs.milestones;
            break;
        case 'userStories':
            contentToDisplay = docs.userStories;
            break;
    }

    // A simple markdown-to-html renderer
    const formattedContent = contentToDisplay
        .split('\n')
        .map((line, index) => {
            if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-blue-300">{line.substring(4)}</h3>;
            if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-blue-400">{line.substring(3)}</h2>;
            if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-extrabold mt-8 mb-4 text-blue-400">{line.substring(2)}</h1>;
            if (line.startsWith('* ') || line.startsWith('- ')) return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
            if (line.trim() === '') return <br key={index} />;
            return <p key={index}>{line}</p>;
        });

    return (
        <div className="relative">
            <CopyButton textToCopy={contentToDisplay} />
            <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                 {formattedContent}
            </div>
        </div>
    );
  };


  return (
    <div className="bg-gray-800/50 rounded-xl shadow-lg border border-gray-700/50">
        <div className="p-4 border-b border-gray-700/50">
            <div className="flex space-x-2">
                <TabButton active={activeTab === 'budget'} onClick={() => setActiveTab('budget')}>Presupuesto</TabButton>
                <TabButton active={activeTab === 'milestones'} onClick={() => setActiveTab('milestones')}>Hitos</TabButton>
                <TabButton active={activeTab === 'userStories'} onClick={() => setActiveTab('userStories')}>H. de Usuario</TabButton>
            </div>
        </div>
        <div className="p-6 min-h-[400px]">
            {renderContent()}
        </div>
    </div>
  );
};
