import React from 'react';
import { BookOpen, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  activeTab: 'video' | 'simulator' | 'game' | 'quiz';
  onSelectTab: (tab: 'video' | 'simulator' | 'game' | 'quiz') => void;
  onOpenTeacherGuide: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenTeacherGuide,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onSelectTab('video')}
        className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
      >
        <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
        <span>Animasi Desimal</span>
      </button>

      {/* Zone 2: 4 clean single-line navigation tabs */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
        <button
          onClick={() => onSelectTab('video')}
          className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'video'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400 pb-0.5'
              : ''
          }`}
        >
          Video Pelajaran
        </button>

        <button
          onClick={() => onSelectTab('simulator')}
          className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'simulator'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400 pb-0.5'
              : ''
          }`}
        >
          Simulator Soal
        </button>

        <button
          onClick={() => onSelectTab('game')}
          className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'game'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400 pb-0.5'
              : ''
          }`}
        >
          Tantangan Koma
        </button>

        <button
          onClick={() => onSelectTab('quiz')}
          className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'quiz'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400 pb-0.5'
              : ''
          }`}
        >
          Kuis Evaluasi
        </button>
      </nav>

      {/* Zone 3: 1 primary action + theme toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenTeacherGuide}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Panduan Guru</span>
        </button>
      </div>
    </header>
  );
};
