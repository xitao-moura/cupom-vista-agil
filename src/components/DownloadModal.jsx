// src/components/DownloadModal.jsx
import React from 'react';
import { X } from 'lucide-react'; // Importa um ícone de fechar

const DownloadModal = ({ isOpen, onClose, urls }) => {
  if (!isOpen) return null;

  return (
    // Fundo escuro transparente (backdrop)
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      {/* Conteúdo do modal */}
      <div 
        className="bg-white p-6 rounded-lg shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar dentro do modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Exportação Concluída!</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Clique nos links abaixo para fazer o download dos arquivos.
        </p>

        <ul className="list-none p-0 space-y-3 max-h-64 overflow-y-auto">
          {urls.map((url, index) => (
            <li key={index} className="bg-gray-100 rounded-md">
              <a
                href={url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span>Download Parte {index + 1}</span>
                <span className="text-sm text-gray-500 hover:underline">
                  {url.substring(url.lastIndexOf('/') + 1)}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;