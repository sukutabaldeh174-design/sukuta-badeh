
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { OutputDisplay } from './components/OutputDisplay';
import { LoaderIcon } from './components/icons/LoaderIcon';
import { generateProjectDocuments } from './services/geminiService';
import { GeneratedDocs } from './types';

const App: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocs | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!transcript.trim()) {
      setError('Por favor, pega una transcripción antes de generar los documentos.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedDocs(null);

    try {
      const docs = await generateProjectDocuments(transcript);
      setGeneratedDocs(docs);
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  }, [transcript]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Column */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold text-gray-100">1. Pega tu Transcripción</h2>
            <div className="flex-grow flex flex-col">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Pega aquí el texto de tu reunión. Incluye detalles del proyecto, presupuesto, timeline, etc."
                  className="w-full flex-grow p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-300 min-h-[400px] resize-y"
                  disabled={isLoading}
                />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="mr-2" />
                  Generando Documentos...
                </>
              ) : (
                'Generar Documentos'
              )}
            </button>
          </div>

          {/* Output Column */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold text-gray-100">2. Revisa los Resultados</h2>
            <OutputDisplay docs={generatedDocs} isLoading={isLoading} error={error} />
          </div>

        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-gray-500 text-sm">
        <p>Desarrollado con ❤️ por IA</p>
      </footer>
    </div>
  );
};

export default App;
