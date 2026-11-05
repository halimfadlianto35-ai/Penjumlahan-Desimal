import React from 'react';
import { motion } from 'motion/react';
import { VideoScene } from '../../types/math';
import { ShoppingBag, Scale, Scissors, Store, Sparkles } from 'lucide-react';

interface StorySceneProps {
  scene: VideoScene;
  currentStepIndex: number;
}

export const StoryScene: React.FC<StorySceneProps> = ({ scene, currentStepIndex }) => {
  const currentStep = scene.steps[currentStepIndex] || scene.steps[0];
  const story = scene.storyContext;

  const isStep2 = currentStepIndex >= 1;
  const isFinalStep = currentStepIndex >= scene.steps.length - 1;

  return (
    <div className="relative w-full h-full min-h-[440px] bg-slate-900 bg-chalkboard-grid rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-700/80">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-slate-200">
            {story?.setting || 'Studi Kasus Kontekstual'}
          </span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium">
          Aplikasi Sehari-hari
        </span>
      </div>

      {/* Main Story Content */}
      <div className="my-auto py-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left Card: Story Visual Illustration */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
            <Scale className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-100">
            Timbangan Digital Buah
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {story?.question || 'Berapa total berat belanjaan buah?'}
          </p>

          {/* Fruit Items */}
          <div className="w-full mt-5 space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold">
                  🍊
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {story?.item1 || 'Jeruk'}
                </span>
              </div>
              <span className="text-sm font-mono font-bold text-amber-400">
                {story?.qty1 || '2,75 kg'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-sm font-bold">
                  🍎
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {story?.item2 || 'Apel'}
                </span>
              </div>
              <span className="text-sm font-mono font-bold text-rose-400">
                {isStep2 ? '1,50 kg' : story?.qty2 || '1,5 kg'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Digital Scale Simulator */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
          <div className="text-xs font-semibold text-slate-400 mb-2">
            LAYAR TIMBANGAN DIGITAL
          </div>

          {/* Glowing Digital Scale Screen */}
          <div className="w-full py-5 px-6 rounded-xl bg-slate-900 border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col items-center justify-center font-mono">
            <span className="text-[10px] tracking-widest text-emerald-400/80 uppercase font-sans mb-1">
              TOTAL BERAT (KG)
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 tracking-wider">
              {isFinalStep ? (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  className="flex items-center gap-1"
                >
                  4,25 <span className="text-xl font-normal text-emerald-500">kg</span>
                </motion.span>
              ) : (
                <span className="text-slate-600">--,-- kg</span>
              )}
            </div>
          </div>

          {/* Vertical Math Preview inside story */}
          <div className="w-full mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center font-mono text-xs text-slate-300">
            <div className="flex items-center justify-center gap-4 text-sm font-semibold">
              <span>2,75 kg</span>
              <span className="text-amber-400 font-bold">+</span>
              <span>1,50 kg</span>
              <span className="text-emerald-400 font-bold">=</span>
              <span className={isFinalStep ? 'text-emerald-300 font-bold underline' : 'text-slate-500'}>
                {isFinalStep ? '4,25 kg' : '?'}
              </span>
            </div>
            <div className="mt-1.5 text-[11px] text-slate-400 font-sans">
              *Tanda koma harus lurus agar gram tidak tertukar dengan kilogram!
            </div>
          </div>
        </div>
      </div>

      {/* Footer Callout */}
      <motion.div
        key={currentStep.stepIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 p-4 rounded-xl bg-slate-800/90 border border-slate-700 flex items-start gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0 font-bold text-sm">
          {currentStep.stepIndex}
        </div>
        <div>
          <div className="text-sm font-semibold text-emerald-300">
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
