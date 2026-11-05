import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { VideoPlayer } from './components/video/VideoPlayer';
import { DecimalLab } from './components/simulator/DecimalLab';
import { AlignmentGame } from './components/practice/AlignmentGame';
import { QuizModule } from './components/practice/QuizModule';
import { TeacherGuideModal } from './components/teacher/TeacherGuideModal';
import { VIDEO_SCENES } from './data/videoCurriculum';
import { Operation } from './types/math';
import {
  PlayCircle,
  Cpu,
  Gamepad2,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Flame,
  Info,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'video' | 'simulator' | 'game' | 'quiz'>('video');
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Dark chalkboard theme looks gorgeous for classroom video

  // Prepopulated values when transitioning to simulator
  const [simNum1, setSimNum1] = useState<number>(18.76);
  const [simNum2, setSimNum2] = useState<number>(5.4);
  const [simOp, setSimOp] = useState<Operation>('+');

  // Sync dark class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleOpenSimulatorWith = (n1: number, n2: number, op: Operation) => {
    setSimNum1(n1);
    setSimNum2(n2);
    setSimOp(op);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Navigation Tabs on Mobile / Quick Switcher */}
        <div className="flex md:hidden items-center justify-between gap-1 p-1 bg-slate-200 dark:bg-slate-900 rounded-xl overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'video'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Video Pembelajaran
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'simulator'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Simulator
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'game'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Tantangan
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Kuis
          </button>
        </div>

        {/* TAB 1: Animated Video Player & Chapters */}
        {activeTab === 'video' && (
          <div className="space-y-6">
            {/* Pedagogical Banner Rule */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Prinsip Utama Bilangan Desimal
                </div>
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Luruskan Tanda Koma, Lengkapi Angka Nol Bayangan, dan Turunkan Komanya
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Video pembelajaran bersuara narasi interaktif yang dirancang khusus untuk membasmi miskonsepsi berhitung desimal.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsTeacherGuideOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Lihat Tips Mengajar
                </button>
              </div>
            </div>

            {/* Video Player Component */}
            <VideoPlayer
              scenes={VIDEO_SCENES}
              currentSceneIndex={currentSceneIdx}
              onSelectScene={setCurrentSceneIdx}
              onOpenSimulatorWithNumbers={handleOpenSimulatorWith}
            />

            {/* Video Chapters Playlist Grid */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Daftar Bab & Episode Animasi ({VIDEO_SCENES.length} Episode)
                </h2>
                <span className="text-xs text-slate-400">
                  Klik episode untuk memutar materi spesifik
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {VIDEO_SCENES.map((scene, idx) => {
                  const isActive = idx === currentSceneIdx;

                  return (
                    <button
                      key={scene.id}
                      onClick={() => setCurrentSceneIdx(idx)}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isActive
                          ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              isActive
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {scene.badge}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            ~{scene.durationSeconds} dtk
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                          {scene.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {scene.summary}
                        </p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                        <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}>
                          {isActive ? 'Sedang Diputar' : 'Buka Bab Ini'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Custom Simulator Lab */}
        {activeTab === 'simulator' && (
          <DecimalLab
            initialNum1={simNum1}
            initialNum2={simNum2}
            initialOp={simOp}
          />
        )}

        {/* TAB 3: Comma Alignment Practice Game */}
        {activeTab === 'game' && <AlignmentGame />}

        {/* TAB 4: Quiz & Comprehension Evaluation */}
        {activeTab === 'quiz' && (
          <QuizModule onOpenSimulatorWithNumbers={handleOpenSimulatorWith} />
        )}
      </main>

      {/* Teacher Guide & Lesson Plan Modal */}
      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
      />

      {/* Footer */}
      <Footer onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)} />
    </div>
  );
}
