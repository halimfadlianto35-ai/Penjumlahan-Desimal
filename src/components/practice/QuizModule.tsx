import React, { useState } from 'react';
import { QuizQuestion } from '../../types/math';
import { QUIZ_QUESTIONS } from '../../data/videoCurriculum';
import { sound } from '../../utils/audio';
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizModuleProps {
  onOpenSimulatorWithNumbers?: (n1: number, n2: number, op: '+' | '-') => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({ onOpenSimulatorWithNumbers }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answeredMap, setAnsweredMap] = useState<{ [id: string]: boolean }>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const question = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (option: string) => {
    if (selectedAnswer !== null) return; // already submitted

    setSelectedAnswer(option);
    setShowExplanation(true);

    const isCorrect = option === question.correctAnswer;
    if (isCorrect) {
      sound.playSuccess();
      setScore(prev => prev + 1);
    } else {
      sound.playClick();
    }

    setAnsweredMap(prev => ({
      ...prev,
      [question.id]: isCorrect,
    }));
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      sound.playClick();
    } else {
      setIsCompleted(true);
      sound.playSuccess();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredMap({});
    setIsCompleted(false);
    sound.playClick();
  };

  if (isCompleted) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-xl mx-auto text-center shadow-lg">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/40 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Uji Pemahaman Selesai!
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Hebat! Kamu telah menyelesaikan seluruh latihan konsep penjumlahan & pengurangan desimal.
        </p>

        <div className="my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
            {score} / {QUIZ_QUESTIONS.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Nilai Akhir: <span className="font-bold text-slate-800 dark:text-slate-200">{percentage}%</span>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm inline-flex items-center gap-2 shadow-md hover:scale-105 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Ulangi Latihan Kuis
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Top Progress */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md">
              Soal {currentIdx + 1} dari {QUIZ_QUESTIONS.length}
            </span>
          </div>
          <div className="text-xs font-mono text-slate-500">
            Skor Sementara: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{score}</span>
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {question.question}
        </h3>

        {/* Options */}
        <div className="mt-6 space-y-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const isCorrect = opt === question.correctAnswer;
            let btnClass = 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200';

            if (selectedAnswer !== null) {
              if (isCorrect) {
                btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/30';
              } else if (isSelected) {
                btnClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30';
              } else {
                btnClass = 'opacity-50 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40';
              }
            }

            return (
              <button
                key={idx}
                disabled={selectedAnswer !== null}
                onClick={() => handleSelectOption(opt)}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between text-sm sm:text-base transition-all ${btnClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-bold font-mono">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {selectedAnswer !== null && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Feedback Callout */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                    Penjelasan Pembahasan:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {question.explanation}
                  </p>
                  {question.num1 > 0 && onOpenSimulatorWithNumbers && (
                    <button
                      onClick={() => onOpenSimulatorWithNumbers(question.num1, question.num2, question.operation)}
                      className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800"
                    >
                      Buka animasi bersusun soal ini di Simulator →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        {selectedAnswer !== null && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm inline-flex items-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
