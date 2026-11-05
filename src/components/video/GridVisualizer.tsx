import React from 'react';
import { motion } from 'motion/react';

interface GridVisualizerProps {
  num1: number;
  num2: number;
  operation: '+' | '-';
  currentStepIndex: number;
}

export const GridVisualizer: React.FC<GridVisualizerProps> = ({
  num1,
  num2,
  operation,
  currentStepIndex,
}) => {
  // We represent decimals up to 1.00 (or fractions of 100 hundredths)
  // Clamp between 0 and 100 tiles for visual clarity
  const fraction1 = Math.round((num1 % 1) * 100) || Math.round(num1 * 100);
  const fraction2 = Math.round((num2 % 1) * 100) || Math.round(num2 * 100);

  const tiles1 = Math.min(100, Math.max(0, fraction1));
  const tiles2 = Math.min(100, Math.max(0, fraction2));

  // In addition: show tiles1 + tiles2
  // In subtraction: show tiles1, and mark tiles2 as removed (slashed/dimmed)
  const isPostAddition = currentStepIndex >= 3;

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-3 border-b border-slate-700/60 pb-2">
        <div className="text-xs font-semibold tracking-wide text-slate-300">
          Model Visual: Grid 100 Petak (1 Petak = 0,01)
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-blue-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
            Bagian 1 ({num1})
          </span>
          {operation === '+' ? (
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span>
              Ditambah ({num2})
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/40 border border-rose-400 inline-block"></span>
              Dipinjam / Dikurang ({num2})
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-10 gap-1 aspect-square max-w-[280px] mx-auto p-2 bg-slate-950/70 rounded-lg border border-slate-800">
        {Array.from({ length: 100 }).map((_, idx) => {
          let cellStyle = 'bg-slate-800/40 border border-slate-700/40';
          let isHighlighted = false;

          if (operation === '+') {
            if (idx < tiles1) {
              cellStyle = 'bg-blue-500 border-blue-400 shadow-sm';
              isHighlighted = true;
            } else if (idx < tiles1 + tiles2 && isPostAddition) {
              cellStyle = 'bg-amber-500 border-amber-400 shadow-sm';
              isHighlighted = true;
            }
          } else {
            // Subtraction
            if (idx < tiles1) {
              if (idx >= tiles1 - tiles2 && currentStepIndex >= 3) {
                // Dimmed / removed
                cellStyle = 'bg-rose-500/30 border-rose-400/60 opacity-40 line-through';
              } else {
                cellStyle = 'bg-blue-500 border-blue-400';
              }
              isHighlighted = true;
            }
          }

          return (
            <motion.div
              key={idx}
              initial={false}
              animate={{
                scale: isHighlighted ? 1 : 0.95,
                opacity: 1,
              }}
              transition={{ duration: 0.2 }}
              className={`rounded-[2px] transition-colors duration-300 ${cellStyle}`}
              title={`Petak ke-${idx + 1} (nilai 0,01)`}
            />
          );
        })}
      </div>

      <div className="mt-3 text-center text-xs text-slate-400">
        1 Kotak Penuh = 1 Utuh (1,0) · 1 Kolom (10 petak) = 0,1 · 1 Kotak Kecil = 0,01
      </div>
    </div>
  );
};
