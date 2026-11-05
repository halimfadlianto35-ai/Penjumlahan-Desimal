import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../../utils/audio';
import { CheckCircle2, Sparkles, RefreshCw, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface Problem {
  id: string;
  num1Str: string;
  num2Str: string;
  op: '+' | '-';
  ghostZeroNeeded: boolean;
  correctAnswer: string;
  hint: string;
}

const CHALLENGES: Problem[] = [
  {
    id: 'c1',
    num1Str: '4,5',
    num2Str: '2,38',
    op: '+',
    ghostZeroNeeded: true,
    correctAnswer: '6,88',
    hint: 'Tambahkan nol di belakang 4,5 menjadi 4,50 lalu jumlahkan perseratusan: 0 + 8 = 8.',
  },
  {
    id: 'c2',
    num1Str: '8,75',
    num2Str: '3,4',
    op: '-',
    ghostZeroNeeded: true,
    correctAnswer: '5,35',
    hint: 'Tulis 3,4 menjadi 3,40. Kurangkan: 5 - 0 = 5; 7 - 4 = 3; 8 - 3 = 5.',
  },
  {
    id: 'c3',
    num1Str: '12,6',
    num2Str: '4,75',
    op: '+',
    ghostZeroNeeded: true,
    correctAnswer: '17,35',
    hint: 'Ubah 12,6 menjadi 12,60. Pada persepuluhan: 6 + 7 = 13 (tulis 3, simpan 1).',
  },
  {
    id: 'c4',
    num1Str: '10,0',
    num2Str: '4,65',
    op: '-',
    ghostZeroNeeded: true,
    correctAnswer: '5,35',
    hint: 'Tulis 10,00 - 4,65. Pinjam dari bilangan bulat 10.',
  },
];

export const AlignmentGame: React.FC = () => {
  const [problemIdx, setProblemIdx] = useState<number>(0);
  const [isAligned, setIsAligned] = useState<boolean>(false);
  const [hasGhostZero, setHasGhostZero] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const problem = CHALLENGES[problemIdx];

  const handleAlign = () => {
    setIsAligned(true);
    sound.playLaserAlign();
  };

  const handleAddGhostZero = () => {
    setHasGhostZero(true);
    sound.playBubblePop();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = userAnswer.trim().replace('.', ',');
    const cleanCorrect = problem.correctAnswer;
    const match = cleanUser === cleanCorrect;

    setIsAnswerSubmitted(true);
    setIsCorrect(match);

    if (match) {
      sound.playSuccess();
    } else {
      sound.playClick();
    }
  };

  const handleNextProblem = () => {
    setProblemIdx(prev => (prev + 1) % CHALLENGES.length);
    setIsAligned(false);
    setHasGhostZero(false);
    setUserAnswer('');
    setIsAnswerSubmitted(false);
    setIsCorrect(false);
    sound.playClick();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-sm">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            Tantangan Interaktif: Jurus Penyelarasan Koma
          </h3>
          <p className="text-xs text-slate-500">
            Praktekkan langkah emas: luruskan tanda koma, aktifkan angka nol bayangan, dan cari hasil akhirnya!
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md">
          Tantangan {problemIdx + 1} / {CHALLENGES.length}
        </div>
      </div>

      {/* Interactive Chalkboard for Game */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 bg-chalkboard-grid border border-slate-700 text-white flex flex-col items-center justify-center min-h-[260px] relative">
        {/* Vertical laser line when aligned */}
        {isAligned && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            className="absolute top-4 bottom-4 left-1/2 -translate-x-3 w-0.5 bg-rose-500 shadow-[0_0_10px_#f43f5e] z-10"
          />
        )}

        {/* Display calculation */}
        <div className="font-mono text-3xl sm:text-4xl space-y-3">
          {/* Row 1 */}
          <div
            className={`flex items-center justify-end tracking-widest transition-transform duration-500 ${
              isAligned ? 'translate-x-0' : 'translate-x-6'
            }`}
          >
            <span>{problem.num1Str}</span>
            {hasGhostZero && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-amber-400 border border-dashed border-amber-400/80 rounded px-1 ml-0.5"
                title="Angka Nol Bayangan"
              >
                0
              </motion.span>
            )}
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-end tracking-widest text-slate-100">
            <span>{problem.num2Str}</span>
          </div>

          {/* Line */}
          <div className="border-t-2 border-slate-400 pt-2 flex items-center justify-between text-2xl text-amber-400">
            <span>{problem.op}</span>
          </div>
        </div>

        {/* Action helper buttons */}
        <div className="mt-6 flex flex-wrap gap-2.5 items-center justify-center z-20">
          {!isAligned ? (
            <button
              onClick={handleAlign}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Langkah 1: Luruskan Tanda Koma!
            </button>
          ) : !hasGhostZero && problem.ghostZeroNeeded ? (
            <button
              onClick={handleAddGhostZero}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Langkah 2: Tambahkan Nol Bayangan (0)
            </button>
          ) : (
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Posisi Koma & Nol Siap! Silakan hitung di bawah.
            </div>
          )}
        </div>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            disabled={!isAligned || (!hasGhostZero && problem.ghostZeroNeeded)}
            placeholder="Tulis jawabanmu, contoh: 6,88"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-slate-900 dark:text-slate-100 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={!isAligned || (!hasGhostZero && problem.ghostZeroNeeded) || !userAnswer.trim()}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-sm transition-all"
        >
          Periksa Jawaban
        </button>
      </form>

      {/* Result feedback */}
      <AnimatePresence>
        {isAnswerSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-xl border flex items-start justify-between gap-3 ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Hebat! Jawabanmu Tepat Sekali: {problem.correctAnswer}
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                    Belum tepat. Coba periksa kembali langkah hitungmu!
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                <Lightbulb className="w-3.5 h-3.5 inline mr-1" />
                {problem.hint}
              </p>
            </div>

            {isCorrect && (
              <button
                onClick={handleNextProblem}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 flex items-center gap-1.5"
              >
                Tantangan Berikutnya
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
