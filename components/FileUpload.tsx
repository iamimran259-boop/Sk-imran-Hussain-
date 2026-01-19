
import React, { useState } from 'react';
import { Upload, Loader2, AlertCircle, Zap, Sparkles } from 'lucide-react';
import { extractTextFromFile, analyzeLayoutAndDrawings } from '../services/geminiService';
import { LayoutContent } from '../types';

interface FileUploadProps {
  onDataExtracted: (text: string, layout?: LayoutContent) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'fast' | 'enhanced'>('fast');

  const resizeImage = (file: File): Promise<{ base64: string; type: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_DIM = 1200; // Slightly larger for layout mode
          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve({ base64: dataUrl.split(',')[1], type: 'image/jpeg' });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      let base64Data: string;
      let mimeType: string;

      if (file.type.startsWith('image/')) {
        const resized = await resizeImage(file);
        base64Data = resized.base64;
        mimeType = resized.type;
      } else {
        const reader = new FileReader();
        const pdfData: string = await new Promise((resolve) => {
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(file);
        });
        base64Data = pdfData;
        mimeType = file.type;
      }

      if (mode === 'enhanced') {
        const result = await analyzeLayoutAndDrawings(base64Data, mimeType);
        onDataExtracted("", { 
          textElements: result.textElements, 
          drawings: result.drawings, 
          isLayoutMode: true 
        });
      } else {
        const extractedText = await extractTextFromFile(base64Data, mimeType);
        onDataExtracted(extractedText, { textElements: [], drawings: [], isLayoutMode: false });
      }
    } catch (err: any) {
      setError(err.message || "Failed to convert.");
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex bg-slate-100 p-1 rounded-lg">
        <button 
          onClick={() => setMode('fast')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${mode === 'fast' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
        >
          <Zap size={12} /> Fast Text
        </button>
        <button 
          onClick={() => setMode('enhanced')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${mode === 'enhanced' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
        >
          <Sparkles size={12} /> Same Layout
        </button>
      </div>

      <label className={`group flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
        isProcessing ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-300 hover:border-blue-400 hover:bg-blue-50/30'
      }`}>
        <div className="flex flex-col items-center justify-center">
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-[10px] font-bold text-blue-700 uppercase">{mode === 'enhanced' ? 'Recreating Layout...' : 'Converting...'}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Upload className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">Upload File</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-medium">Drawings & Layout preserved in Enhanced</p>
            </>
          )}
        </div>
        <input type="file" className="hidden" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} disabled={isProcessing} />
      </label>
      {error && (
        <p className="text-[10px] text-red-500 flex items-center gap-1">
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
