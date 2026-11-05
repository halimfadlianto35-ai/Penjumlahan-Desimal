import React, { useState, useEffect } from 'react';
import { generateDecimalCalculationPlan, DecimalCalculationPlan, parseIndonesianInput } from '../../utils/decimalEngine';
import { VideoScene, Operation } from '../../types/math';
import { AnimatedBlackboard } from '../video/AnimatedBlackboard';
import { SubtitlesBar } from '../video/SubtitlesBar';
import { VideoControls } from '../video/VideoControls';
import { sound } from '../../utils/audio';
import { Play, Sparkles, RefreshCw, Wand2, Plus, Minus } from 'lucide-react';

interface DecimalLabProps {
  initialNum1?: number;
  initialNum2?: number;
  initialOp?: Operation;
}

export const DecimalLab: React.FC<DecimalLabProps> = ({
  initialNum1 = 25.4,
  initialNum2 = 8.75,
  initialOp = '+',
}) => {
  const [input1, setInput1] = useState<string>(initialNum1.toString().replace('.', ','));
  const [input2, setInput2] = useState<string>(initialNum2.toString().replace('.', ','));
  const [operation, setOperation] = useState<Operation>(initialOp);

  const [plan, setPlan] = useState<DecimalCalculationPlan | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  // Generate plan when inputs change or "Hitung & Buat Animasi" is clicked
  const handleGenerate = () => {
    const n1 = parseIndonesianInput(input1);
    const n2 = parseIndonesianInput(input2);

    const newPlan = generateDecimalCalculationPlan(n1, n2, operation);
    setPlan(newPlan);
    setActiveStepIndex(0);
    setIsPlaying(false);
    sound.playClick();
  };

  useEffect(() => {
    handleGenerate();
  }, [input1, input2, operation]);

  // Convert plan into a VideoScene representation for AnimatedBlackboard
  const simulatedScene: VideoScene | null = plan
    ? {
        id: 'simulator_scene',
        chapterId: 'sim',
        chapterTitle: 'Simulator Laboratorium',
        title: `${plan.num1.paddedString} ${operation} ${plan.num2.paddedString}`,
        durationSeconds: plan.steps.length * 4,
        badge: 'Kustom Guru / Siswa',
        summary: `Perhitungan bersusun langkah demi langkah untuk ${plan.num1.originalString} ${operation} ${plan.num2.originalString}`,
        narrationScript: plan.steps[activeStepIndex]?.narration || '',
        num1: plan.num1.raw,
        num2: plan.num2.raw,
        operation: plan.operation,
        visualMode: operation === '+' ? 'addition_vertical' : 'subtraction_borrow',
        steps: plan.steps,
      }
    : null;

  // Step Auto-advance during play
  useEffect(() => {
    if (!isPlaying || !plan) return;

    const currentStep = plan.steps[activeStepIndex];
    if (currentStep && isVoiceEnabled) {
      sound.speakNarration(currentStep.narration, () => {
        if (isPlaying) {
          if (activeStepIndex < plan.steps.length - 1) {
            setTimeout(() => {
              setActiveStepIndex(prev => prev + 1);
            }, 1000 / playbackSpeed);
          } else {
            if (isLooping) {
              setTimeout(() => setActiveStepIndex(0), 1500 / playbackSpeed);
            } else {
              setIsPlaying(false);
              sound.playSuccess();
            }
          }
        }
      });
    } else {
      const timer = setTimeout(() => {
        if (activeStepIndex < plan.steps.length - 1) {
          setActiveStepIndex(prev => prev + 1);
        } else {
          if (isLooping) {
            setActiveStepIndex(0);
          } else {
            setIsPlaying(false);
            sound.playSuccess();
          }
        }
      }, 3500 / playbackSpeed);
      return () => clearTimeout(timer);
    }
  }, [activeStepIndex, isPlaying, plan, isVoiceEnabled, playbackSpeed, isLooping]);

  const presets = [
    { n1: '14,75', n2: '6,8', op: '+' as Operation, label: 'Penjumlahan Koma Panjang Beda' },
    { n1: '28,9', n2: '13,45', op: '+' as Operation, label: 'Penjumlahan Menyimpan' },
    { n1: '15,2', n2: '6,85', op: '-' as Operation, label: 'Pengurangan Pinjam & Nol' },
    { n1: '30,0', n2: '14,65', op: '-' as Operation, label: 'Pengurangan Bilangan Bulat' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Input Control Studio */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Laboratorium Mandiri: Buat Animasi Soal Apapun
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Masukkan sembarang bilangan desimal. Sistem akan meratakan koma, menambahkan angka nol bayangan, dan menyusun animasinya secara otomatis!
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-slate-400 mr-1">Contoh Soal:</span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput1(p.n1);
                  setInput2(p.n2);
                  setOperation(p.op);
                }}
                className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {p.n1} {p.op} {p.n2}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Number 1 */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Bilangan Pertama (Desimal)
            </label>
            <input
              type="text"
              value={input1}
              onChange={e => setInput1(e.target.value)}
              placeholder="Contoh: 25,4"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-mono text-lg font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Operation Selector */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Operasi Hitung
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setOperation('+')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  operation === '+'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah (+)
              </button>
              <button
                type="button"
                onClick={() => setOperation('-')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  operation === '-'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                Kurang (-)
              </button>
            </div>
          </div>

          {/* Number 2 */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Bilangan Kedua (Desimal)
            </label>
            <input
              type="text"
              value={input2}
              onChange={e => setInput2(e.target.value)}
              placeholder="Contoh: 8,75"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-mono text-lg font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Refresh / Generate Button */}
          <div className="md:col-span-1">
            <button
              onClick={handleGenerate}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center"
              title="Perbarui Animasi"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Blackboard Animation Player */}
      {simulatedScene && plan && (
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-semibold text-slate-300">
                Layar Animasi Bersusun: {input1} {operation} {input2}
              </span>
            </div>
            <div className="text-xs font-mono text-emerald-400 font-bold">
              Hasil Akhir: {plan.resultString}
            </div>
          </div>

          {/* Main Visual Board */}
          <div className="p-4 sm:p-6 bg-slate-900 min-h-[460px] flex flex-col justify-center">
            <AnimatedBlackboard scene={simulatedScene} currentStepIndex={activeStepIndex} />
          </div>

          {/* Subtitle Narration */}
          <SubtitlesBar
            narrationText={plan.steps[activeStepIndex]?.narration || ''}
            isVoiceEnabled={isVoiceEnabled}
            onToggleVoice={() => {
              const next = !isVoiceEnabled;
              setIsVoiceEnabled(next);
              sound.setVoiceEnabled(next);
            }}
            onReplayAudio={() => {
              const curr = plan.steps[activeStepIndex];
              if (curr) sound.speakNarration(curr.narration);
            }}
          />

          {/* Video Controls */}
          <VideoControls
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(prev => !prev)}
            currentStepIndex={activeStepIndex}
            totalSteps={plan.steps.length}
            onPrevStep={() => {
              if (activeStepIndex > 0) setActiveStepIndex(prev => prev - 1);
            }}
            onNextStep={() => {
              if (activeStepIndex < plan.steps.length - 1) setActiveStepIndex(prev => prev + 1);
            }}
            onPrevScene={() => setActiveStepIndex(0)}
            onNextScene={() => setActiveStepIndex(plan.steps.length - 1)}
            playbackSpeed={playbackSpeed}
            onChangeSpeed={setPlaybackSpeed}
            isLooping={isLooping}
            onToggleLoop={() => setIsLooping(prev => !prev)}
            isFullscreen={false}
            onToggleFullscreen={() => {}}
            chapterTitle="Laboratorium Mandiri"
            sceneTitle={`${input1} ${operation} ${input2}`}
          />
        </div>
      )}
    </div>
  );
};
