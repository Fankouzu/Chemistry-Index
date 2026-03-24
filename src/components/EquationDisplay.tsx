import React from 'react';
import { Equation } from '../data/equations';
import { Formula } from './Formula';

interface EquationDisplayProps {
  equation: Equation;
  showCoefficients?: boolean;
  userCoefficients?: Record<string, string>; // key: reactant-0, product-1, etc.
  onCoefficientChange?: (key: string, value: string) => void;
  interactive?: boolean;
}

export const EquationDisplay: React.FC<EquationDisplayProps> = ({
  equation,
  showCoefficients = true,
  userCoefficients = {},
  onCoefficientChange,
  interactive = false
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
            className="w-8 h-10 text-center border-b-2 border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 mx-1 text-lg font-bold focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 focus:bg-blue-100 dark:focus:bg-blue-900/40 transition-colors rounded-t dark:text-gray-100"
            placeholder="1"
            maxLength={2}
          />
          <Formula text={mol.formula} className="text-xl" />
        </div>
      );
    }

    return (
      <span key={key} className="flex items-center">
        {showCoefficients && mol.coef > 1 && (
          <span className="text-xl font-bold mr-0.5 text-blue-700 dark:text-blue-400">{mol.coef}</span>
        )}
        <Formula text={mol.formula} className="text-xl dark:text-gray-100" />
      </span>
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-y-4 py-4">
      {/* Reactants */}
      <div className="flex items-center flex-wrap justify-center">
        {equation.reactants.map((mol, i) => (
          <React.Fragment key={`r-${i}`}>
            {i > 0 && <span className="mx-3 text-xl font-bold text-gray-400 dark:text-gray-500">+</span>}
            {renderMolecule(mol, i, 'reactant')}
          </React.Fragment>
        ))}
      </div>

      {/* Arrow and Conditions */}
      <div className="flex flex-col items-center mx-4 relative min-w-[60px]">
        <span className="text-sm text-gray-600 dark:text-gray-400 absolute -top-5 whitespace-nowrap">
          {equation.conditions}
        </span>
        <div className="flex items-center w-full">
          <div className="h-0.5 bg-gray-800 dark:bg-gray-200 w-full"></div>
          <div className="w-2 h-2 border-t-2 border-r-2 border-gray-800 dark:border-gray-200 transform rotate-45 -ml-1.5"></div>
        </div>
      </div>

      {/* Products */}
      <div className="flex items-center flex-wrap justify-center">
        {equation.products.map((mol, i) => (
          <React.Fragment key={`p-${i}`}>
            {i > 0 && <span className="mx-3 text-xl font-bold text-gray-400 dark:text-gray-500">+</span>}
            {renderMolecule(mol, i, 'product')}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
