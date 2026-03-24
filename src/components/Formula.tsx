import React from 'react';
import { CATEGORY_FORMULA_TEXT, ELEMENT_INFO } from '../data/elements';

interface FormulaProps {
  text: string;
  className?: string;
}

const NEUTRAL_TEXT = 'text-zinc-800 dark:text-zinc-200';

function renderBufferWithElementColors(buffer: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let i = 0;
  let part = 0;
  while (i < buffer.length) {
    if (/[A-Z]/.test(buffer[i])) {
      let sym = buffer[i];
      i++;
      if (i < buffer.length && /[a-z]/.test(buffer[i])) {
        sym += buffer[i];
        i++;
      }
      const cat = ELEMENT_INFO[sym]?.category;
      const cls = cat ? CATEGORY_FORMULA_TEXT[cat] : NEUTRAL_TEXT;
      out.push(
        <span key={`${keyPrefix}-p${part++}`} className={`${cls} font-bold`}>
          {sym}
        </span>
      );
    } else {
      const start = i;
      while (i < buffer.length && !/[A-Z]/.test(buffer[i])) {
        i++;
      }
      const chunk = buffer.slice(start, i);
      if (chunk) {
        out.push(
          <span key={`${keyPrefix}-p${part++}`} className={NEUTRAL_TEXT}>
            {chunk}
          </span>
        );
      }
    }
  }
  return out;
}

export const Formula: React.FC<FormulaProps> = ({ text, className = '' }) => {
  const result: React.ReactNode[] = [];
  let currentStr = '';
  let flushSeq = 0;
  const flushBuffer = () => {
    if (!currentStr) return;
    result.push(...renderBufferWithElementColors(currentStr, `f-${flushSeq++}`));
    currentStr = '';
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[0-9]/.test(char)) {
      const prevChar = i > 0 ? text[i - 1] : '';
      if (/[A-Za-z\)]/.test(prevChar)) {
        flushBuffer();
        let digits = char;
        while (i + 1 < text.length && /[0-9]/.test(text[i + 1])) {
          digits += text[i + 1];
          i++;
        }
        result.push(
          <sub
            key={`sub-${i}`}
            className="relative bottom-[-0.2em] text-[0.72em] leading-none text-zinc-900 dark:text-white"
          >
            {digits}
          </sub>
        );
      } else {
        currentStr += char;
      }
    } else if (char === '↑' || char === '↓') {
      flushBuffer();
      result.push(
        <span key={`arrow-${i}`} className="ml-0.5 font-sans text-[0.85em] text-zinc-600 dark:text-white" title={char === '↑' ? '气体逸出' : '沉淀生成'}>
          {char}
        </span>
      );
    } else {
      currentStr += char;
    }
  }

  flushBuffer();

  return (
    <span className={`font-serif tracking-wide inline-flex flex-wrap items-baseline gap-0 ${className}`}>
      {result}
    </span>
  );
};
