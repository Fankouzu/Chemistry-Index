import React, { useState, useEffect } from 'react';
import { LearningMode } from './components/LearningMode';
import { PracticeMode } from './components/PracticeMode';
import { BookOpen, Edit3, FlaskConical, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

function App() {
  const [activeTab, setActiveTab] = useState<'learning' | 'practice'>('learning');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('chem_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('chem_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('chem_theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-blue-200 dark:selection:bg-blue-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center shadow-inner shadow-blue-400/20 dark:shadow-blue-600/20">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              初中化学方程式
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl transition-colors duration-200">
              <button
                onClick={() => setActiveTab('learning')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'learning'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">方程式大全</span>
              </button>
              <button
                onClick={() => setActiveTab('practice')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'practice'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">配平练习</span>
              </button>
            </nav>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        <motion.div
          key={activeTab}
          className="text-gray-900 dark:text-[rgb(243,244,246)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'learning' ? <LearningMode /> : <PracticeMode />}
        </motion.div>
      </main>
    </div>
  );
}

export default App;
