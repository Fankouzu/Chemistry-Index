import React from 'react';

interface FormulaProps {
  text: string;
  className?: string;
}

export const Formula: React.FC<FormulaProps> = ({ text, className = '' }) => {
  const result = [];
  let currentStr = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[0-9]/.test(char)) {
      const prevChar = i > 0 ? text[i - 1] : '';
      // If preceded by a letter or closing parenthesis, it's a subscript
      if (/[A-Za-z\)]/.test(prevChar)) {
        if (currentStr) result.push(<span key={`str-${i}`}>{currentStr}</span>);
        currentStr = '';
        
        let digits = char;
        while (i + 1 < text.length && /[0-9]/.test(text[i + 1])) {
          digits += text[i + 1];
          i++;
        }
        result.push(<sub key={`sub-${i}`} className="text-[0.75em] bottom-[-0.25em] relative">{digits}</sub>);
      } else {
        currentStr += char;
      }
    } else if (char === '↑' || char === '↓') {
      if (currentStr) result.push(<span key={`str-${i}`}>{currentStr}</span>);
      currentStr = '';
      result.push(<span key={`arrow-${i}`} className="ml-0.5 font-sans">{char}</span>);
    } else {
      currentStr += char;
    }
  }
  
  if (currentStr) result.push(<span key="end">{currentStr}</span>);
  
  return <span className={`font-serif tracking-wide ${className}`}>{result}</span>;
};
