import React from 'react';
import { Equation } from '../data/equations';
import { formatEquationConditionsWithEmojis } from '../utils/chemistry';
import { Formula } from './Formula';

interface EquationDisplayProps {
  equation: Equation;
  showCoefficients?: boolean;
  userCoefficients?: Record<string, string>;
  onCoefficientChange?: (key: string, value: string) => void;
  interactive?: boolean;
}

/** Larger formula line; font family stays on Formula (font-serif) */
const FORMULA_SIZE = 'text-2xl sm:text-3xl md:text-[2.125rem] leading-tight';

export const EquationDisplay: React.FC<EquationDisplayProps> = ({
  equation,
  showCoefficients = true,
  userCoefficients = {},
  onCoefficientChange,
  interactive = false,
}) => {
  const renderMolecule = (mol: { formula: string; coef: number }, index: number, type: 'reactant' | 'product') => {
    const key = `${type}-${index}`;

    if (interactive) {
      return (
        <div key={key} className="flex items-center">
          <input
            type="text"
            value={userCoefficients[key] || ''}
            onChange={(e) => onCoefficientChange?.(key, e.target.value.replace(/[^0-9]/g, ''))}
            className="font-serif mx-1 h-12 w-10 rounded-t border-b-2 border-blue-400 bg-blue-50/50 text-center text-xl font-bold text-zinc-900 transition-colors focus:border-blue-600 focus:bg-blue-100 focus:outline-none dark:border-blue-600 dark:bg-blue-900/20 dark:text-zinc-100 dark:focus:border-blue-400 dark:focus:bg-blue-900/40"
            placeholder="1"
            maxLength={2}
          />
          <Formula text={mol.formula} className={FORMULA_SIZE} />
        </div>
      );
    }

    return (
      <span key={key} className="flex items-center">
        {showCoefficients && mol.coef > 1 && (
          <span className={`font-serif mr-0.5 font-bold tabular-nums text-zinc-600 dark:text-white ${FORMULA_SIZE}`}>
            {mol.coef}
          </span>
        )}
        <Formula text={mol.formula} className={FORMULA_SIZE} />
      </span>
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-y-4 py-5 sm:py-6">
      <div className="flex flex-wrap items-center justify-center">
        {equation.reactants.map((mol, i) => (
          <React.Fragment key={`r-${i}`}>
            {i > 0 && (
              <span className="mx-2 font-bold text-zinc-900 dark:text-white sm:mx-3 text-2xl sm:text-3xl md:text-[2rem]" aria-hidden>
                +
              </span>
            )}
            {renderMolecule(mol, i, 'reactant')}
          </React.Fragment>
        ))}
      </div>

      <div className="relative mx-3 flex min-w-[4.5rem] flex-col items-center sm:mx-5 sm:min-w-[5.5rem]">
        <span className="absolute -top-6 max-w-[min(90vw,18rem)] whitespace-normal text-center text-sm font-medium text-zinc-600 dark:text-white sm:-top-5 sm:text-base">
          {formatEquationConditionsWithEmojis(equation.conditions)}
        </span>
        <div className="flex w-full items-center">
          <div className="h-0.5 w-full bg-zinc-800 dark:bg-zinc-200" />
          <div className="-ml-1.5 h-2 w-2 rotate-45 border-t-2 border-r-2 border-zinc-800 dark:border-zinc-200" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center">
        {equation.products.map((mol, i) => (
          <React.Fragment key={`p-${i}`}>
            {i > 0 && (
              <span className="mx-2 font-bold text-zinc-900 dark:text-white sm:mx-3 text-2xl sm:text-3xl md:text-[2rem]" aria-hidden>
                +
              </span>
            )}
            {renderMolecule(mol, i, 'product')}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
