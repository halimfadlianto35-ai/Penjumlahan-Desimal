import React from 'react';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onOpenTeacherGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTeacherGuide }) => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 px-6 text-slate-500 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Animasi Desimal
          </span>
          <span aria-hidden="true">·</span>
          <span>Media Pembelajaran Matematika SMP / SD Fase C-D</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenTeacherGuide}
            className="hover:text-slate-800 dark:hover:text-slate-200 underline transition-colors"
          >
            Modul & RPP Guru
          </button>
          <span aria-hidden="true">·</span>
          <span>Kaidah Emas: Luruskan Koma & Lengkapi Nolnya</span>
        </div>
      </div>
    </footer>
  );
};
