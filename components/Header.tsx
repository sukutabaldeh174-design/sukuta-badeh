
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6 border-b border-gray-700/50">
      <h1 className="text-4xl md:text-5xl font-bold">
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Yunior
        </span>
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Transforma transcripciones de reuniones en documentos de proyecto.
      </p>
    </header>
  );
};
