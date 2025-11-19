
import React, { useState } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface CopyButtonProps {
  textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-4 right-4 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 hover:text-white transition-all duration-200"
      aria-label="Copiar al portapapeles"
    >
      {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
    </button>
  );
};
