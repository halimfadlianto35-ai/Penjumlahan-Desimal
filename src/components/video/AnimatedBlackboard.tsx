import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoScene } from '../../types/math';
import { PLACE_VALUES } from '../../utils/decimalEngine';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowDown } from 'lucide-react';

interface AnimatedBlackboardProps {
  scene: VideoScene;
  currentStepIndex: number;
  isMisalignedDemonstration?: boolean;
}

export const AnimatedBlackboard: React.FC<AnimatedBlackboardProps> = ({
  scene,
  currentStepIndex,
  isMisalignedDemonstration = false,
}) => {
  const currentStep = scene.steps[currentStepIndex] || scene.steps[0];
  const { num1, num2, operation, visualMode } = scene;

  // Breakdown digits for num1 and num2
  const str1 = num1.toString();
  const str2 = num2.toString();
  const [int1 = '0', frac1 = ''] = str1.split('.');
  const [int2 = '0', frac2 = ''] = str2.split('.');

  const maxFrac = Math.max(frac1.length, frac2.length);
  const maxInt = Math.max(int1.length, int2.length);

  // Pad fraction with ghost zeros
  const ghostZeroesNum1 = Math.max(0, maxFrac - frac1.length);
  const ghostZeroesNum2 = Math.max(0, maxFrac - frac2.length);

  const paddedFrac1 = frac1 + '0'.repeat(ghostZeroesNum1);
  const paddedFrac2 = frac2 + '0'.repeat(ghostZeroesNum2);

  // Column definitions (e.g. 1, 0, -1, -2)
  const columns: number[] = [];
  for (let c = maxInt - 1; c >= 0; c--) {
    columns.push(c);
  }
  for (let c = -1; c >= -maxFrac; c--) {
    columns.push(c);
  }

  // Active step details
  const activeCol = currentStep.columnFocus;
  const carryBorrow = currentStep.carryOrBorrow;
  const showCommasAligned = currentStep.highlightCommas || currentStepIndex > 0;
  const showGhostZero = (currentStep.highlightGhostZero || currentStepIndex >= 2) && (ghostZeroesNum1 > 0 || ghostZeroesNum2 > 0);

  // Compute final result
  const resultNum = operation === '+' ? num1 + num2 : num1 - num2;
  const resultStr = (Math.round(resultNum * 1000) / 1000).toLocaleString('id-ID', {
    minimumFractionDigits: maxFrac,
    maximumFractionDigits: maxFrac,
  });
  const [resInt = '0', resFrac = ''] = resultStr.split(',');

  // Special mode: Chapter 1 Place value showcase
  if (visualMode === 'place_value_intro') {
    return (
      <div className="relative w-full h-full min-h-[420px] bg-slate-900 bg-chalkboard-grid rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-700/80">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            Papan Konsep: Nilai Tempat Bilangan Desimal
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
            Contoh: 24,35
          </span>
        </div>

        <div className="my-auto py-6 flex flex-col items-center">
          {/* Main Giant Number with Interactive Place Value Highlights */}
          <div className="flex items-center gap-3 sm:gap-6 text-4xl sm:text-6xl md:text-7xl font-bold font-mono tracking-wider">
            {/* Tens: 2 */}
            <motion.div
              animate={{
                scale: activeCol === 1 ? 1.15 : 1,
                color: activeCol === 1 ? '#818cf8' : '#e2e8f0',
              }}
              className="flex flex-col items-center p-2 rounded-xl transition-colors"
            >
              <span>2</span>
              <span className="text-xs sm:text-sm font-sans font-medium text-indigo-400 mt-2">
                Puluhan (20)
              </span>
            </motion.div>

            {/* Units: 4 */}
            <motion.div
              animate={{
                scale: activeCol === 0 ? 1.15 : 1,
                color: activeCol === 0 ? '#60a5fa' : '#e2e8f0',
              }}
              className="flex flex-col items-center p-2 rounded-xl transition-colors"
            >
              <span>4</span>
              <span className="text-xs sm:text-sm font-sans font-medium text-blue-400 mt-2">
                Satuan (4)
              </span>
            </motion.div>

            {/* Comma: , */}
            <motion.div
              animate={{
                scale: currentStep.highlightCommas ? [1, 1.3, 1] : 1,
                color: '#ef4444',
              }}
              transition={{ repeat: currentStep.highlightCommas ? Infinity : 0, duration: 1.5 }}
              className="flex flex-col items-center p-2 rounded-xl"
            >
              <span className="text-rose-500 font-extrabold text-5xl sm:text-7xl">,</span>
              <span className="text-xs sm:text-sm font-sans font-semibold text-rose-400 mt-2">
                Tanda Koma
              </span>
            </motion.div>

            {/* Tenths: 3 */}
            <motion.div
              animate={{
                scale: activeCol === -1 ? 1.15 : 1,
                color: activeCol === -1 ? '#34d399' : '#e2e8f0',
              }}
              className="flex flex-col items-center p-2 rounded-xl transition-colors"
            >
              <span>3</span>
              <span className="text-xs sm:text-sm font-sans font-medium text-emerald-400 mt-2">
                Persepuluhan (0,1)
              </span>
            </motion.div>

            {/* Hundredths: 5 */}
            <motion.div
              animate={{
                scale: activeCol === -2 ? 1.15 : 1,
                color: activeCol === -2 ? '#fbbf24' : '#e2e8f0',
              }}
              className="flex flex-col items-center p-2 rounded-xl transition-colors"
            >
              <span>5</span>
              <span className="text-xs sm:text-sm font-sans font-medium text-amber-400 mt-2">
                Perseratusan (0,01)
              </span>
            </motion.div>
          </div>

          {/* Educational Explanatory Card */}
          <motion.div
            key={currentStep.stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-xl w-full p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-center"
          >
            <div className="text-amber-300 font-semibold text-base mb-1">
              {currentStep.title}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {currentStep.description}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Special mode: Chapter 2 Alignment Rule (Right Align vs Laser Comma Align)
  if (visualMode === 'alignment_rule') {
    const isMisaligned = currentStepIndex === 0;

    return (
      <div className="relative w-full h-full min-h-[420px] bg-slate-900 bg-chalkboard-grid rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-700/80">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <span className="text-rose-400 font-mono font-bold">SOAL:</span> 12,3 + 4,56
          </div>
          <div className="flex items-center gap-2">
            {isMisaligned ? (
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Miskonsepsi Siswa: Rata Kanan (SALAH)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Prinsip Benar: Koma Lurus Sejajar
              </span>
            )}
          </div>
        </div>

        <div className="my-auto flex flex-col items-center justify-center py-6">
          <div className="relative p-6 rounded-2xl bg-slate-950/80 border border-slate-800 min-w-[280px] sm:min-w-[340px]">
            {/* Glowing Laser Comma Line when aligned */}
            {!isMisaligned && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                className="absolute top-2 bottom-2 left-[58%] w-1 bg-rose-500 shadow-[0_0_12px_#f43f5e] z-10 pointer-events-none rounded-full animate-laser"
              >
                <div className="absolute -top-3 -left-12 px-2 py-0.5 rounded text-[10px] bg-rose-600 text-white font-semibold whitespace-nowrap shadow">
                  Garis Laser Koma
                </div>
              </motion.div>
            )}

            <div className="space-y-3 font-mono text-3xl sm:text-4xl text-right pr-6">
              {/* Row 1: 12,3 */}
              <motion.div
                animate={{
                  x: isMisaligned ? 0 : 0,
                }}
                className="flex justify-end items-center tracking-widest text-slate-100"
              >
                <span className="w-8 text-center text-indigo-300">1</span>
                <span className="w-8 text-center text-blue-300">2</span>
                <span className="w-6 text-center text-rose-400 font-bold">,</span>
                <span className="w-8 text-center text-emerald-300">3</span>
                {!isMisaligned && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-8 text-center text-amber-400/90 border border-amber-400/50 rounded bg-amber-400/10 text-2xl font-bold ml-0.5"
                    title="Nol bantuan"
                  >
                    0
                  </motion.span>
                )}
              </motion.div>

              {/* Row 2: 4,56 */}
              <motion.div
                animate={{
                  x: isMisaligned ? 0 : 0,
                }}
                className="flex justify-end items-center tracking-widest text-slate-100"
              >
                <span className="w-8 text-center text-slate-600"> </span>
                <span className="w-8 text-center text-blue-300">4</span>
                <span className="w-6 text-center text-rose-400 font-bold">,</span>
                <span className="w-8 text-center text-emerald-300">5</span>
                <span className="w-8 text-center text-amber-300">6</span>
              </motion.div>

              {/* Line and Plus Sign */}
              <div className="relative pt-2 border-t-2 border-slate-400 flex items-center justify-between">
                <span className="text-2xl font-sans text-amber-400 font-bold">+</span>
                <div className="text-slate-400 text-sm font-sans">
                  {isMisaligned ? 'Bahaya: 3 + 6 menjumlahkan persepuluhan & perseratusan!' : 'Aman: Nilai tempat sejajar rapi'}
                </div>
              </div>

              {/* Result row */}
              {!isMisaligned && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end items-center tracking-widest text-emerald-400 font-bold pt-1"
                >
                  <span className="w-8 text-center">1</span>
                  <span className="w-8 text-center">6</span>
                  <span className="w-6 text-center text-rose-400 font-bold">,</span>
                  <span className="w-8 text-center">8</span>
                  <span className="w-8 text-center">6</span>
                </motion.div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center max-w-lg">
            <p className="text-amber-300 text-sm font-medium">
              {currentStep.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Standard Mode: Animated Vertical Column Calculation (Addition or Subtraction)
  // Let's render the full column board
  const num1IntDigits = int1.padStart(maxInt, ' ');
  const num2IntDigits = int2.padStart(maxInt, ' ');

  // Determine current result display state based on step
  const showResult = currentStepIndex >= scene.steps.length - 2;

  return (
    <div className="relative w-full h-full min-h-[440px] bg-slate-900 bg-chalkboard-grid rounded-2xl p-5 md:p-7 flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-700/80">
      {/* Top Header of Blackboard */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            {operation === '+' ? 'Operasi Penjumlahan' : 'Operasi Pengurangan'}
          </span>
          <span className="text-sm font-bold text-slate-100 font-mono">
            {str1.replace('.', ',')} {operation} {str2.replace('.', ',')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span>Langkah {currentStepIndex + 1} dari {scene.steps.length}</span>
        </div>
      </div>

      {/* Main Calculation Stage */}
      <div className="my-auto py-4 flex flex-col items-center">
        {/* Place Value Header Ribbon */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 text-[11px] sm:text-xs font-semibold text-slate-400">
          {columns.map(col => {
            const pInfo = PLACE_VALUES[col];
            const isColActive = activeCol === col;
            return (
              <div
                key={col}
                className={`w-9 sm:w-11 text-center py-1 rounded transition-colors ${
                  isColActive ? 'bg-amber-400 text-slate-900 font-bold shadow-md' : 'bg-slate-800/80 text-slate-400'
                }`}
              >
                {pInfo ? pInfo.shortLabel : `${col}`}
              </div>
            );
          })}
        </div>

        {/* Calculation Board Box */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-950/85 border border-slate-800 shadow-inner">
          {/* Vertical Laser Comma Line */}
          {showCommasAligned && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                left: `${(maxInt / (maxInt + maxFrac + 0.5)) * 100}%`,
              }}
              className="absolute top-2 bottom-3 w-0.5 bg-rose-500 shadow-[0_0_10px_#f43f5e] z-10 pointer-events-none rounded-full"
            />
          )}

          {/* Carry / Borrow Animated Floater */}
          <AnimatePresence>
            {carryBorrow && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className={`absolute -top-3 z-20 px-2.5 py-1 rounded-full text-xs font-bold font-mono shadow-lg flex items-center gap-1 ${
                  carryBorrow.type === 'carry'
                    ? 'bg-amber-500 text-slate-950 border border-amber-300 animate-bounce'
                    : 'bg-rose-500 text-white border border-rose-300 animate-pulse'
                }`}
                style={{
                  left: carryBorrow.type === 'carry' ? '40%' : '55%',
                }}
              >
                <Sparkles className="w-3 h-3" />
                {carryBorrow.type === 'carry' ? `+${carryBorrow.amount} Simpan!` : `Pinjam 10!`}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4 font-mono text-3xl sm:text-5xl text-right">
            {/* Upper Number Row */}
            <div className="flex items-center justify-end tracking-wider">
              {/* Integers */}
              {num1IntDigits.split('').map((char, idx) => {
                const col = maxInt - 1 - idx;
                const isFocused = activeCol === col;
                const isBorrowedFrom = carryBorrow?.type === 'borrow' && carryBorrow.fromCol === col;

                return (
                  <div key={`int1-${idx}`} className="relative w-9 sm:w-11 text-center">
                    {isBorrowedFrom && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm text-rose-400 font-bold bg-slate-800 px-1.5 rounded">
                        {carryBorrow.newVal}
                      </span>
                    )}
                    <span
                      className={`transition-colors ${
                        isBorrowedFrom ? 'line-through text-slate-500' : isFocused ? 'text-amber-400 font-bold' : 'text-slate-100'
                      }`}
                    >
                      {char}
                    </span>
                  </div>
                );
              })}

              {/* Comma */}
              <span className="w-6 sm:w-7 text-center text-rose-500 font-extrabold">,</span>

              {/* Fraction */}
              {paddedFrac1.split('').map((char, idx) => {
                const col = -(idx + 1);
                const isGhost = idx >= frac1.length;
                const isFocused = activeCol === col;
                const isBorrowTarget = carryBorrow?.type === 'borrow' && carryBorrow.toCol === col;

                return (
                  <div key={`frac1-${idx}`} className="relative w-9 sm:w-11 text-center">
                    {isBorrowTarget && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm text-amber-400 font-bold bg-slate-800 px-1.5 rounded">
                        {char === '0' ? '10' : `1${char}`}
                      </span>
                    )}
                    <span
                      className={`transition-all ${
                        isBorrowTarget
                          ? 'line-through text-slate-500'
                          : isGhost
                          ? showGhostZero
                            ? 'text-amber-400/90 border border-dashed border-amber-400/60 rounded bg-amber-400/10 px-0.5'
                            : 'opacity-0'
                          : isFocused
                          ? 'text-amber-400 font-bold'
                          : 'text-slate-100'
                      }`}
                    >
                      {char}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Lower Number Row */}
            <div className="flex items-center justify-end tracking-wider">
              {/* Integers */}
              {num2IntDigits.split('').map((char, idx) => {
                const col = maxInt - 1 - idx;
                const isFocused = activeCol === col;
                return (
                  <span
                    key={`int2-${idx}`}
                    className={`w-9 sm:w-11 text-center transition-colors ${
                      isFocused ? 'text-amber-400 font-bold' : 'text-slate-100'
                    }`}
                  >
                    {char}
                  </span>
                );
              })}

              {/* Comma */}
              <span className="w-6 sm:w-7 text-center text-rose-500 font-extrabold">,</span>

              {/* Fraction */}
              {paddedFrac2.split('').map((char, idx) => {
                const col = -(idx + 1);
                const isGhost = idx >= frac2.length;
                const isFocused = activeCol === col;

                return (
                  <span
                    key={`frac2-${idx}`}
                    className={`w-9 sm:w-11 text-center transition-all ${
                      isGhost
                        ? showGhostZero
                          ? 'text-amber-400/90 border border-dashed border-amber-400/60 rounded bg-amber-400/10 px-0.5'
                          : 'opacity-0'
                        : isFocused
                        ? 'text-amber-400 font-bold'
                        : 'text-slate-100'
                    }`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Separator Line with Operator */}
            <div className="relative pt-2 border-t-4 border-slate-300 flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-sans text-amber-400 font-extrabold pl-2">
                {operation}
              </span>
            </div>

            {/* Answer Row (Progressively revealed or completed) */}
            <div className="flex items-center justify-end tracking-wider text-emerald-400 font-bold pt-1">
              {/* Result Integers */}
              {resInt.split('').map((char, idx) => (
                <span
                  key={`res-int-${idx}`}
                  className={`w-9 sm:w-11 text-center ${
                    showResult ? 'opacity-100 scale-100' : 'opacity-20'
                  }`}
                >
                  {showResult ? char : '?'}
                </span>
              ))}

              {/* Result Comma */}
              <motion.span
                animate={{
                  scale: showResult ? [1, 1.4, 1] : 1,
                  color: showResult ? '#f43f5e' : '#64748b',
                }}
                className="w-6 sm:w-7 text-center text-rose-500 font-extrabold"
              >
                ,
              </motion.span>

              {/* Result Fraction */}
              {resFrac.split('').map((char, idx) => (
                <span
                  key={`res-frac-${idx}`}
                  className={`w-9 sm:w-11 text-center ${
                    showResult ? 'opacity-100 scale-100' : 'opacity-20'
                  }`}
                >
                  {showResult ? char : '?'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Explanation Callout Footer */}
      <motion.div
        key={currentStep.stepIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 p-4 rounded-xl bg-slate-800/90 border border-slate-700 flex items-start gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0 font-bold text-sm">
          {currentStep.stepIndex}
        </div>
        <div>
          <div className="text-sm font-semibold text-amber-300">
            {currentStep.title}
          </div>
          <div className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
            {currentStep.description}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
