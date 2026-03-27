import React, { useState, useEffect, useCallback } from 'react';
import { equations, Equation, Difficulty } from '../data/equations';
import { EquationDisplay } from './EquationDisplay';
import { BalancingDemo } from './BalancingDemo';
import { motion, AnimatePresence } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { CheckCircle2, XCircle, RefreshCw, Lightbulb, Trophy, PlayCircle } from 'lucide-react';
import { countTotalAtoms, getArrayGcd } from '../utils/chemistry';

export const PracticeMode: React.FC = () => {
  const [currentEq, setCurrentEq] = useState<Equation | null>(null);
  const [userCoefficients, setUserCoefficients] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | '全部'>('全部');
  const reducedMotion = usePrefersReducedMotion();

  const pickRandomEquation = useCallback((diff: Difficulty | '全部' = difficulty) => {
    // Filter out equations that don't need balancing (all coefficients are 1)
    const balanceableEqs = equations.filter(eq => 
      (eq.reactants.some(r => r.coef > 1) || eq.products.some(p => p.coef > 1)) &&
      (diff === '全部' || eq.difficulty === diff)
    );
    
    if (balanceableEqs.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * balanceableEqs.length);
    setCurrentEq(balanceableEqs[randomIndex]);
    setUserCoefficients({});
    setStatus('idle');
    setErrorMessage('');
    setShowHint(false);
    setShowDemo(false);
  }, [difficulty]);

  useEffect(() => {
    pickRandomEquation();
  }, [pickRandomEquation]);

  const handleCoefficientChange = (key: string, value: string) => {
    setUserCoefficients(prev => ({ ...prev, [key]: value }));
    setStatus('idle');
    setErrorMessage('');
  };

  const checkAnswer = () => {
    if (!currentEq) return;

    const rCoefs = currentEq.reactants.map((_, i) => parseInt(userCoefficients[`reactant-${i}`] || '1', 10));
    const pCoefs = currentEq.products.map((_, i) => parseInt(userCoefficients[`product-${i}`] || '1', 10));

    if ([...rCoefs, ...pCoefs].some(c => isNaN(c) || c <= 0)) {
      setStatus('incorrect');
      setErrorMessage('化学计量数必须是大于0的整数。');
      setStreak(0);
      return;
    }

    const leftAtoms = countTotalAtoms(currentEq.reactants, rCoefs);
    const rightAtoms = countTotalAtoms(currentEq.products, pCoefs);

    const allElements = Array.from(new Set([...Object.keys(leftAtoms), ...Object.keys(rightAtoms)]));

    let isBalanced = true;
    let errorMsg = '';

    for (const elem of allElements) {
      const left = leftAtoms[elem] || 0;
      const right = rightAtoms[elem] || 0;
      if (left !== right) {
        isBalanced = false;
        errorMsg = `${elem} 原子不守恒：反应物有 ${left} 个，生成物有 ${right} 个。`;
        break;
      }
    }

    if (!isBalanced) {
      setStatus('incorrect');
      setErrorMessage(errorMsg);
      setStreak(0);
      return;
    }

    const allCoefs = [...rCoefs, ...pCoefs];
    const gcd = getArrayGcd(allCoefs);
    if (gcd > 1) {
      setStatus('incorrect');
      setErrorMessage(`原子已配平，但系数不是最简整数比（存在公约数 ${gcd}）。`);
      setStreak(0);
      return;
    }

    setStatus('correct');
    setErrorMessage('');
    setScore(s => s + 10 + streak * 2);
    setStreak(s => s + 1);
    setTimeout(() => {
      pickRandomEquation();
    }, 1500);
  };

  const fillHint = () => {
    if (!currentEq) return;
    const correct: Record<string, string> = {};
    currentEq.reactants.forEach((mol, i) => {
      correct[`reactant-${i}`] = mol.coef > 1 ? mol.coef.toString() : '';
    });
    currentEq.products.forEach((mol, i) => {
      correct[`product-${i}`] = mol.coef > 1 ? mol.coef.toString() : '';
    });
    setUserCoefficients(correct);
    setShowHint(true);
    setStatus('idle');
    setStreak(0);
  };

  if (!currentEq) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">配平练习</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-3">在方框中填入正确的化学计量数（系数为1时可留空）</p>
          <div className="inline-flex rounded-xl bg-gray-200/50 p-1 dark:bg-gray-800/50">
            {['全部', '初级', '中级', '高级'].map(d => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDifficulty(d as any);
                  pickRandomEquation(d as any);
                  setStreak(0); // Reset streak on difficulty change
                }}
                aria-pressed={difficulty === d}
                className={`min-h-11 rounded-lg px-4 text-sm font-bold transition-colors [touch-action:manipulation] ${
                  difficulty === d
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6 bg-white dark:bg-gray-900 px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">总分</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{score}</div>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-amber-500" /> 连对
            </div>
            <div className="text-2xl font-black text-amber-500">{streak}</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="bg-blue-50/50 dark:bg-blue-900/10 px-8 py-4 border-b border-blue-100 dark:border-blue-900/30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 text-lg">{currentEq.description}</h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
              currentEq.difficulty === '初级' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
              currentEq.difficulty === '中级' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {currentEq.difficulty}
            </span>
          </div>
          <span className="text-xs font-medium px-3 py-1 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full shadow-sm">
            {currentEq.type}
          </span>
        </div>
        
        <div className="px-4 py-6 sm:p-8 md:p-12">
          <div className="flex min-h-[120px] items-center justify-center sm:min-h-[160px]">
            <EquationDisplay
              equation={currentEq}
              interactive={true}
              userCoefficients={userCoefficients}
              onCoefficientChange={handleCoefficientChange}
            />
          </div>

          <div className="mt-12 flex flex-col items-center gap-6">
            <AnimatePresence mode="wait">
              {status === 'correct' && (
                <motion.div
                  initial={
                    reducedMotion
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 10, scale: 0.9 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
                  className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-6 py-3 rounded-full font-bold"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  回答正确！准备下一题...
                </motion.div>
              )}
              {status === 'incorrect' && (
                <motion.div
                  initial={
                    reducedMotion
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 10, scale: 0.9 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
                  className="flex flex-col items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-6 py-3 rounded-2xl font-bold text-center"
                >
                  <div className="flex items-center gap-2">
                    <XCircle className="w-6 h-6" />
                    <span>配平不正确</span>
                  </div>
                  {errorMessage && (
                    <span className="text-sm font-medium text-red-500 dark:text-red-400">{errorMessage}</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap justify-center gap-3 w-full max-w-2xl">
              <button
                type="button"
                onClick={checkAnswer}
                disabled={status === 'correct'}
                className="flex-[2] min-h-11 min-w-[150px] rounded-2xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-blue-600/20 transition-colors [touch-action:manipulation] hover:bg-blue-700 motion-safe:active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-blue-900/40"
              >
                检查答案
              </button>
              
              <button
                type="button"
                onClick={() => setShowDemo(true)}
                className="flex min-h-11 min-w-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-50 px-4 py-4 font-bold text-indigo-600 transition-colors [touch-action:manipulation] hover:bg-indigo-100 motion-safe:active:scale-95 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 sm:min-w-[120px]"
                title="查看配平演示"
                aria-label="查看配平演示"
              >
                <PlayCircle className="w-5 h-5" />
                <span className="hidden sm:inline">动画演示</span>
              </button>

              <button
                type="button"
                onClick={fillHint}
                disabled={status === 'correct' || showHint}
                className="flex min-h-11 min-w-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-amber-50 px-4 py-4 font-bold text-amber-600 transition-colors [touch-action:manipulation] hover:bg-amber-100 motion-safe:active:scale-95 disabled:opacity-50 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 sm:min-w-[100px]"
                title="显示答案"
                aria-label="显示答案提示"
              >
                <Lightbulb className="w-5 h-5" />
                <span className="hidden sm:inline">答案</span>
              </button>

              <button
                type="button"
                onClick={pickRandomEquation}
                className="flex min-h-11 min-w-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-100 px-4 py-4 font-bold text-gray-600 transition-colors [touch-action:manipulation] hover:bg-gray-200 motion-safe:active:scale-95 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:min-w-[100px]"
                title="跳过此题"
                aria-label="跳过此题"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="hidden sm:inline">跳过</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDemo && (
          <BalancingDemo 
            equation={currentEq} 
            onClose={() => setShowDemo(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
