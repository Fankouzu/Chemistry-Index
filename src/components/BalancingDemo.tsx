import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Equation } from '../data/equations';
import { EquationDisplay } from './EquationDisplay';
import { Play, Pause, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { parseFormula, countTotalAtoms } from '../utils/chemistry';

interface BalancingDemoProps {
  equation: Equation;
  onClose: () => void;
}

export const BalancingDemo: React.FC<BalancingDemoProps> = ({ equation, onClose }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 获取所有涉及的元素
  const allElements = useMemo(() => {
    const elements = new Set<string>();
    equation.reactants.forEach(r => {
      Object.keys(parseFormula(r.formula)).forEach(e => elements.add(e));
    });
    return Array.from(elements);
  }, [equation]);

  // 生成配平步骤
  const steps = useMemo(() => {
    const generatedSteps = [];
    const currentR = equation.reactants.map(() => 1);
    const currentP = equation.products.map(() => 1);
    
    generatedSteps.push({ 
      r: [...currentR], 
      p: [...currentP], 
      desc: '初始状态：假设所有物质的系数均为 1' 
    });

    let changed = true;
    while(changed) {
      changed = false;
      
      // 尝试增加反应物系数
      for (let i = 0; i < currentR.length; i++) {
        if (currentR[i] < equation.reactants[i].coef) {
          currentR[i]++;
          generatedSteps.push({ 
            r: [...currentR], 
            p: [...currentP], 
            desc: `在 ${equation.reactants[i].formula.replace(/[↑↓]/g, '')} 前添加系数 ${currentR[i]}，观察原子变化` 
          });
          changed = true;
          break; // 每次只变动一个
        }
      }
      if (changed) continue;

      // 尝试增加生成物系数
      for (let i = 0; i < currentP.length; i++) {
        if (currentP[i] < equation.products[i].coef) {
          currentP[i]++;
          generatedSteps.push({ 
            r: [...currentR], 
            p: [...currentP], 
            desc: `在 ${equation.products[i].formula.replace(/[↑↓]/g, '')} 前添加系数 ${currentP[i]}，观察原子变化` 
          });
          changed = true;
          break;
        }
      }
    }
    
    generatedSteps[generatedSteps.length - 1].desc = '配平完成！左右两边各元素原子数量相等。';
    return generatedSteps;
  }, [equation]);

  const currentStep = steps[stepIndex];
  const leftAtoms = countTotalAtoms(equation.reactants, currentStep.r);
  const rightAtoms = countTotalAtoms(equation.products, currentStep.p);

  // 构造当前步骤的方程式用于显示
  const stepEquation: Equation = {
    ...equation,
    reactants: equation.reactants.map((r, i) => ({ ...r, coef: currentStep.r[i] })),
    products: equation.products.map((p, i) => ({ ...p, coef: currentStep.p[i] }))
  };

  // 自动播放逻辑
  useEffect(() => {
    let timer: number;
    if (isPlaying && stepIndex < steps.length - 1) {
      timer = window.setTimeout(() => {
        setStepIndex(s => s + 1);
      }, 2000);
    } else if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, steps.length]);

  // Portal to body + z above App header (z-50): fixed inside <main z-0> cannot stack above the sticky header.
  const modal = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 p-4 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-sm"
      role="presentation"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="flex max-h-[min(90vh,calc(100dvh-env(safe-area-inset-top,0px)-2rem))] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — relative z so it stays above scrollable demo content */}
        <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">配平动画演示</h3>
          <button
            type="button"
            onClick={onClose}
            className="relative z-10 p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-0 min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
          {/* Equation Display */}
          <div className="min-h-[120px] flex items-center justify-center bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 mb-8 p-4">
            <EquationDisplay equation={stepEquation} showCoefficients={true} interactive={false} />
          </div>

          {/* Step Description */}
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-sm font-bold mb-3">
              步骤 {stepIndex + 1} / {steps.length}
            </span>
            <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">{currentStep.desc}</p>
          </div>

          {/* Atom Counter */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h4 className="text-center text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">原子数量对比</h4>
            
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-8 gap-y-4 items-center max-w-md mx-auto">
              <div className="text-right font-bold text-gray-400 dark:text-gray-500 text-sm">反应物 (左)</div>
              <div className="text-center font-bold text-gray-400 dark:text-gray-500 text-sm">元素</div>
              <div className="text-left font-bold text-gray-400 dark:text-gray-500 text-sm">生成物 (右)</div>

              {allElements.map(elem => {
                const left = leftAtoms[elem] || 0;
                const right = rightAtoms[elem] || 0;
                const isBalanced = left === right;

                return (
                  <React.Fragment key={elem}>
                    <div className="text-right flex justify-end items-center gap-2">
                      <span className={`text-xl font-bold ${isBalanced ? 'text-green-600' : 'text-amber-500'}`}>
                        {left}
                      </span>
                    </div>
                    
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-xl font-black text-gray-700 dark:text-gray-200">{elem}</span>
                    </div>
                    
                    <div className="text-left flex justify-start items-center gap-2">
                      <span className={`text-xl font-bold ${isBalanced ? 'text-green-600' : 'text-amber-500'}`}>
                        {right}
                      </span>
                      <AnimatePresence>
                        {isBalanced && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-green-100 text-green-600 rounded-full p-0.5"
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex shrink-0 items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <button
            onClick={() => setStepIndex(s => Math.max(0, s - 1))}
            disabled={stepIndex === 0}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-md shadow-blue-600/20 dark:shadow-blue-900/40"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" /> 暂停
              </>
            ) : (
              <>
                <Play className="w-5 h-5" /> {stepIndex >= steps.length - 1 ? '重新播放' : '自动播放'}
              </>
            )}
          </button>

          <button
            onClick={() => setStepIndex(s => Math.min(steps.length - 1, s + 1))}
            disabled={stepIndex === steps.length - 1}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modal, document.body);
};
