
import React, { useState } from 'react';
import { 
  Settings2, 
  Type as FontIcon, 
  Palette, 
  Layers, 
  Trash2, 
  Printer,
  ChevronRight,
  ChevronLeft,
  Zap,
  RotateCcw,
  Maximize,
  MoveVertical,
  MoveHorizontal,
  FileText
} from 'lucide-react';
import HandwritingPaper from './components/HandwritingPaper';
import FileUpload from './components/FileUpload';
import { HANDWRITING_FONTS, INK_COLORS, INITIAL_STATE } from './constants';
import { PaperType, LayoutContent } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState({
    ...INITIAL_STATE,
    layout: { textElements: [], drawings: [], isLayoutMode: false } as LayoutContent
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig(prev => ({ 
      ...prev, 
      text: e.target.value,
      layout: { ...prev.layout, isLayoutMode: false } 
    }));
  };

  const handleDataExtracted = (extractedText: string, layout?: LayoutContent) => {
    if (layout?.isLayoutMode) {
      setConfig(prev => ({ 
        ...prev, 
        text: "", 
        layout 
      }));
    } else {
      setConfig(prev => ({ 
        ...prev, 
        text: extractedText,
        layout: { textElements: [], drawings: [], isLayoutMode: false }
      }));
    }
  };

  const downloadAsPDF = () => {
    window.print();
  };

  const resetText = () => {
    if (window.confirm("Clear all text?")) {
      setConfig(prev => ({ 
        ...prev, 
        text: "", 
        layout: { textElements: [], drawings: [], isLayoutMode: false } 
      }));
    }
  };

  const toggleMode = () => {
    if (config.layout.isLayoutMode) {
      const combinedText = config.layout.textElements.map(e => e.text).join('\n\n');
      setConfig(prev => ({
        ...prev,
        text: combinedText,
        layout: { ...prev.layout, isLayoutMode: false }
      }));
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      <aside 
        className={`${
          isSidebarOpen ? 'w-80' : 'w-16'
        } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed h-full z-20 shadow-xl`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          {isSidebarOpen ? (
            <h1 className="text-xl font-black italic text-blue-600 flex items-center gap-2">
              <Zap className="fill-blue-600" size={20} /> ScribeAI
            </h1>
          ) : (
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
              <Zap className="text-white fill-white" size={16} />
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto ${isSidebarOpen ? 'p-6' : 'p-2'} space-y-8 custom-scrollbar`}>
          {isSidebarOpen && (
            <>
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={16} className="text-blue-500" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Content Import</h3>
                </div>
                <FileUpload onDataExtracted={handleDataExtracted} />
              </section>

              {config.layout.isLayoutMode && (
                <section className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                  <h4 className="text-[10px] font-black uppercase text-blue-500 mb-3 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Same Layout Mode Active
                  </h4>
                  <button 
                    onClick={toggleMode}
                    className="w-full py-2.5 bg-white text-blue-600 text-[10px] font-bold uppercase rounded-xl border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={14} /> Back to Text Editing
                  </button>
                </section>
              )}

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <FontIcon size={16} className="text-slate-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Handwriting Style</h3>
                </div>
                <select 
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                  value={config.fontFamily}
                  onChange={(e) => setConfig({ ...config, fontFamily: e.target.value })}
                >
                  {HANDWRITING_FONTS.map(f => (
                    <option key={f.id} value={f.family}>{f.name}</option>
                  ))}
                </select>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Palette size={16} className="text-slate-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Ink Color</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {INK_COLORS.map(color => (
                    <button
                      key={color.name}
                      className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                        config.inkColor === color.value ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setConfig({ ...config, inkColor: color.value })}
                      title={color.name}
                    />
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3 flex justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-slate-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Paper Type</h3>
                  </div>
                  <button 
                    onClick={() => setConfig({ ...config, fullPage: !config.fullPage })}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${config.fullPage ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    <Maximize size={10} /> Full Page
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(PaperType).map(type => (
                    <button
                      key={type}
                      className={`py-2 px-3 text-[10px] rounded-xl border capitalize font-bold transition-all ${
                        config.paperType === type 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                      onClick={() => setConfig({ ...config, paperType: type })}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 size={16} className="text-slate-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Fine Tuning</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                      <span>Font Size</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">{config.fontSize}px</span>
                    </div>
                    <input 
                      type="range" min="12" max="64" 
                      value={config.fontSize} 
                      onChange={(e) => setConfig({ ...config, fontSize: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                      <div className="flex items-center gap-1">
                        <MoveVertical size={10} />
                        <span>Line Height</span>
                      </div>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">{config.lineHeight.toFixed(1)}</span>
                    </div>
                    <input 
                      type="range" min="1" max="3" step="0.1"
                      value={config.lineHeight} 
                      onChange={(e) => setConfig({ ...config, lineHeight: parseFloat(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                      <div className="flex items-center gap-1">
                        <MoveHorizontal size={10} />
                        <span>Letter Spacing</span>
                      </div>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">{config.letterSpacing}px</span>
                    </div>
                    <input 
                      type="range" min="-2" max="10" step="1"
                      value={config.letterSpacing} 
                      onChange={(e) => setConfig({ ...config, letterSpacing: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        {isSidebarOpen && (
          <div className="p-4 border-t border-slate-100 bg-white">
            <button 
              onClick={resetText}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all text-[11px] font-black uppercase tracking-widest border border-transparent hover:border-red-100"
            >
              <Trash2 size={16} /> Clear Content
            </button>
          </div>
        )}
      </aside>

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-16'} h-screen overflow-hidden flex flex-col`}>
        <div className="flex-1 w-full h-full flex flex-col p-4 md:p-8 gap-6 overflow-hidden max-w-[1600px] mx-auto">
          <header className="flex items-center justify-between shrink-0 w-full animate-in fade-in duration-700">
            <div className="flex items-center gap-3">
               <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
                 A4 Manuscript Preview
               </h2>
            </div>
            <button 
              onClick={downloadAsPDF}
              className="group flex items-center gap-2.5 px-7 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 font-bold text-sm transform hover:-translate-y-1 active:translate-y-0"
            >
              <Printer size={18} className="group-hover:animate-bounce" /> Print / Save as PDF
            </button>
          </header>
          
          <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0 w-full overflow-hidden">
            <div className={`flex-1 flex flex-col gap-3 min-h-0 relative ${config.layout.isLayoutMode ? 'opacity-40' : ''}`}>
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Editor Panel</span>
                {!config.layout.isLayoutMode && <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">{config.text.length} characters</span>}
              </div>
              <textarea
                className="flex-1 w-full p-8 rounded-[2rem] border-2 border-slate-200 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none resize-none bg-white text-slate-700 leading-relaxed font-mono text-sm transition-all custom-scrollbar"
                placeholder={config.layout.isLayoutMode ? "Layout mode active - content is locked." : "Start typing your message here..."}
                value={config.text}
                onChange={handleTextChange}
                disabled={config.layout.isLayoutMode}
              />
              {config.layout.isLayoutMode && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-[2rem] z-10 p-10 text-center select-none cursor-not-allowed">
                  <div className="p-4 bg-white shadow-xl rounded-full mb-4">
                    <RotateCcw className="text-blue-600 animate-spin-slow" size={32} />
                  </div>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Layout Lock Active</p>
                  <p className="text-xs text-slate-500 mt-2 max-w-[280px] font-medium leading-relaxed italic">
                    The document is currently in layout-aware mode based on your upload. Switch back to "Fast Text" or reset to edit manually.
                  </p>
                </div>
              )}
            </div>

            <div className="flex-[1.6] flex flex-col gap-3 min-h-0 overflow-hidden rounded-[2rem] border-2 border-slate-200 shadow-2xl bg-white/50 relative">
               <div className="flex items-center justify-between px-6 py-4 bg-white/90 border-b border-slate-200 backdrop-blur-md z-10 sticky top-0 shadow-sm">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.1em]">Physical Preview (A4)</span>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-500 tracking-tighter">ISO 216 STANDARD</span>
                      <span className="text-[9px] font-bold text-slate-400">21.0cm x 29.7cm</span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-100/50">
                  <HandwritingPaper 
                    id="handwriting-preview"
                    text={config.text}
                    layout={config.layout}
                    fontFamily={config.fontFamily}
                    fontSize={config.fontSize}
                    inkColor={config.inkColor}
                    paperType={config.paperType}
                    lineHeight={config.lineHeight}
                    letterSpacing={config.letterSpacing}
                    fullPage={config.fullPage}
                  />
               </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          body { background: white !important; }
          body * { visibility: hidden !important; }
          #handwriting-preview, #handwriting-preview * { 
            visibility: visible !important; 
          }
          #handwriting-preview {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 20mm 15mm 20mm 25mm !important;
            box-shadow: none !important;
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
            transform: none !important;
            z-index: 9999 !important;
          }
          /* Ensure text margins are respected on print */
          .paper-sheet {
            padding: 20mm 15mm 20mm 25mm !important;
          }
          /* Hide UI definitively */
          aside, main button, header, textarea, [class*="bg-slate-"], [class*="shadow-"], [class*="border-"], .backdrop-blur-md { 
            display: none !important; 
            opacity: 0 !important;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
