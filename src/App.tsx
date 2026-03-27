import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { LearningMode } from './components/LearningMode';
import { PracticeMode } from './components/PracticeMode';
import { BookOpen, Edit3, FlaskConical, Sun, Moon, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { PrivacyPolicyPanel } from './components/PrivacyPolicyPanel';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

function App() {
  const [activeTab, setActiveTab] = useState<'learning' | 'practice'>('learning');
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('chem_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('chem_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('chem_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const meta = document.getElementById('app-theme-color') as HTMLMetaElement | null;
    if (meta) meta.content = isDarkMode ? '#030712' : '#ffffff';
  }, [isDarkMode]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    void StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    void StatusBar.setStyle({
      style: isDarkMode ? Style.Dark : Style.Light,
    }).catch(() => {});
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-blue-200 dark:selection:bg-blue-900 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white pt-[env(safe-area-inset-top,0px)] transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2 min-h-14 sm:h-16 sm:py-0">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-inner shadow-blue-400/20 dark:bg-blue-500 dark:shadow-blue-600/20">
              <FlaskConical className="h-6 w-6 text-white" aria-hidden />
            </div>
            <h1 className="truncate text-lg font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl">
              初中化学方程式
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <nav
              className="flex items-center rounded-xl bg-gray-100 p-1 dark:bg-gray-800"
              aria-label="模式切换"
            >
              <button
                type="button"
                onClick={() => setActiveTab('learning')}
                aria-pressed={activeTab === 'learning'}
                className={`flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all [touch-action:manipulation] sm:px-4 ${
                  activeTab === 'learning'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
                <span className="hidden sm:inline">方程式大全</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('practice')}
                aria-pressed={activeTab === 'practice'}
                className={`flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all [touch-action:manipulation] sm:px-4 ${
                  activeTab === 'practice'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Edit3 className="h-4 w-4 shrink-0" aria-hidden />
                <span className="hidden sm:inline">配平练习</span>
              </button>
            </nav>

            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="inline-flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors [touch-action:manipulation] hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label={isDarkMode ? '切换为浅色模式' : '切换为深色模式'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-0">
        <motion.div
          key={activeTab}
          className="text-gray-900 dark:text-[rgb(243,244,246)]"
          initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.3 }}
        >
          {activeTab === 'learning' ? <LearningMode /> : <PracticeMode />}
        </motion.div>

        {/* End of scroll — not fixed; flows after tab content */}
        <footer
          className="mt-12 border-t border-gray-200 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-950/80"
          style={{
            paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))',
            paddingTop: '1.25rem',
          }}
        >
          <div className="mx-auto flex max-w-5xl justify-center px-4">
            <button
              type="button"
              onClick={() => setPrivacyOpen(true)}
              className="flex min-h-11 w-full max-w-md items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors [touch-action:manipulation] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
              aria-label="查看隐私政策（离线可阅）"
            >
              <Shield className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" aria-hidden />
              隐私政策
            </button>
          </div>
        </footer>
      </main>

      <PrivacyPolicyPanel open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}

export default App;
