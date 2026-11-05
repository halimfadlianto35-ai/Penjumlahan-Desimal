import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Gauge,
  Repeat,
} from 'lucide-react';

interface VideoControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentStepIndex: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  onPrevScene: () => void;
  onNextScene: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  chapterTitle: string;
  sceneTitle: string;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  onTogglePlay,
  currentStepIndex,
  totalSteps,
  onPrevStep,
  onNextStep,
  onPrevScene,
  onNextScene,
  playbackSpeed,
  onChangeSpeed,
  isLooping,
  onToggleLoop,
  isFullscreen,
  onToggleFullscreen,
  chapterTitle,
  sceneTitle,
}) => {
  const speeds = [0.5, 0.75, 1, 1.25, 1.5];

  return (
    <div className="w-full bg-slate-950 border-t border-slate-800 px-4 py-3 select-none text-white">
      {/* Timeline scrubber track */}
      <div className="relative mb-3 flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className="flex-1 h-2 rounded-full cursor-pointer transition-all duration-300 relative group"
              onClick={() => {
                if (idx < currentStepIndex) {
                  for (let i = 0; i < currentStepIndex - idx; i++) onPrevStep();
                } else if (idx > currentStepIndex) {
                  for (let i = 0; i < idx - currentStepIndex; i++) onNextStep();
                }
              }}
            >
              <div
                className={`h-full rounded-full transition-colors ${
                  isCurrent
                    ? 'bg-amber-400 ring-2 ring-amber-400/50 shadow-md'
                    : isCompleted
                    ? 'bg-indigo-500'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              />
              {/* Tooltip */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-800 text-[10px] text-slate-200 px-1.5 py-0.5 rounded shadow whitespace-nowrap z-30">
                Langkah {idx + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Playback controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Prev Chapter */}
          <button
            onClick={onPrevScene}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Bab Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Prev Step */}
          <button
            onClick={onPrevStep}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
            title="Langkah Mundur"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Primary Big Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            title={isPlaying ? 'Jeda Animasi (Spasi)' : 'Putar Video Animasi (Spasi)'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span className="text-xs font-semibold">Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white ml-0.5" />
                <span className="text-xs font-semibold">Putar</span>
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            onClick={onNextStep}
            disabled={currentStepIndex === totalSteps - 1}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
            title="Langkah Maju"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Next Chapter */}
          <button
            onClick={onNextScene}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Bab Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Current Step Tracker */}
          <div className="text-xs font-mono text-slate-400 pl-2">
            <span className="text-amber-400 font-bold">{currentStepIndex + 1}</span>
            <span className="text-slate-600">/</span>
            <span>{totalSteps}</span>
          </div>
        </div>

        {/* Center: Current Chapter Title */}
        <div className="hidden lg:block text-xs font-medium text-slate-400 truncate max-w-sm">
          <span className="text-slate-200">{chapterTitle}</span>
          <span className="mx-1.5 text-slate-600">·</span>
          <span>{sceneTitle}</span>
        </div>

        {/* Right: Speed, Loop, Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Speed Selector */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            {speeds.map(s => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-1.5 sm:px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                  playbackSpeed === s
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Kecepatan Putar ${s}x`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Repeat Toggle */}
          <button
            onClick={onToggleLoop}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLooping
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-transparent'
            }`}
            title={isLooping ? 'Ulangi Otomatis (ON)' : 'Ulangi Otomatis (OFF)'}
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
