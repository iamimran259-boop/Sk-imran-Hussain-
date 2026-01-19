
import React from 'react';
import { PaperType, LayoutContent } from '../types';

interface HandwritingPaperProps {
  text: string;
  layout: LayoutContent;
  fontFamily: string;
  fontSize: number;
  inkColor: string;
  paperType: PaperType;
  lineHeight: number;
  letterSpacing: number;
  fullPage: boolean;
  id?: string;
}

const HandwritingPaper: React.FC<HandwritingPaperProps> = ({
  text,
  layout,
  fontFamily,
  fontSize,
  inkColor,
  paperType,
  lineHeight,
  letterSpacing,
  fullPage,
  id
}) => {
  const getPaperStyles = () => {
    switch (paperType) {
      case PaperType.RULED:
        return {
          backgroundImage: `
            linear-gradient(#e5e7eb 1px, transparent 1px),
            url('https://www.transparenttextures.com/patterns/natural-paper.png')
          `,
          backgroundSize: `100% ${fontSize * lineHeight}px, auto`,
          backgroundColor: '#ffffff',
        };
      case PaperType.GRID:
        return {
          backgroundImage: `
            linear-gradient(#e5e7eb 1px, transparent 1px), 
            linear-gradient(90deg, #e5e7eb 1px, transparent 1px),
            url('https://www.transparenttextures.com/patterns/natural-paper.png')
          `,
          backgroundSize: '20px 20px, 20px 20px, auto',
          backgroundColor: '#ffffff',
        };
      case PaperType.CREAM:
        return {
          backgroundColor: '#fdf6e3',
          backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
        };
      case PaperType.BLANK:
      default:
        return {
          backgroundColor: '#ffffff',
          backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
        };
    }
  };

  const getPadding = () => {
    if (layout.isLayoutMode || fullPage) {
      return '0';
    }
    // Standard A4 handwriting margins: Top 20mm, Right 15mm, Bottom 20mm, Left 25mm
    return '20mm 15mm 20mm 25mm';
  };

  return (
    <div className="flex justify-center bg-slate-300/30 p-4 md:p-12 min-h-full overflow-y-auto custom-scrollbar">
      <div
        id={id}
        className="paper-sheet shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25),0_18px_36px_-18px_rgba(0,0,0,0.3)] rounded-sm transition-all duration-300 relative print:shadow-none print:m-0 print:border-none bg-white"
        style={{
          ...getPaperStyles(),
          width: '210mm',
          minHeight: '297mm',
          height: 'fit-content',
          padding: getPadding(),
          fontFamily,
          fontSize: `${fontSize}px`,
          color: inkColor,
          lineHeight: lineHeight,
          letterSpacing: `${letterSpacing}px`,
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        {/* Red margin line for ruled paper */}
        {paperType === PaperType.RULED && !layout.isLayoutMode && !fullPage && (
          <div 
            className="absolute top-0 bottom-0 w-[1.5px] bg-red-400/40" 
            style={{ left: '20mm' }}
          />
        )}
        
        {layout.isLayoutMode ? (
          <div className="relative w-full h-full min-h-[257mm]">
            {/* Drawings */}
            {layout.drawings.map((draw) => (
              <div
                key={draw.id}
                className="absolute"
                style={{
                  top: `${draw.top}%`,
                  left: `${draw.left}%`,
                  width: `${draw.width}%`,
                  height: `${draw.height}%`,
                }}
              >
                <svg
                  viewBox={draw.viewBox || "0 0 100 100"}
                  className="w-full h-full"
                  style={{ stroke: inkColor, fill: 'none', strokeWidth: 2, strokeLinecap: 'round' }}
                >
                  <path d={draw.svgPath} />
                </svg>
              </div>
            ))}

            {/* Layout Text Blocks */}
            {layout.textElements.map((el) => (
              <div
                key={el.id}
                className="absolute"
                style={{
                  top: `${el.top}%`,
                  left: `${el.left}%`,
                  width: el.width ? `${el.width}%` : 'auto',
                }}
              >
                {el.text}
              </div>
            ))}
          </div>
        ) : (
          <div className="relative z-10 h-full">
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default HandwritingPaper;
