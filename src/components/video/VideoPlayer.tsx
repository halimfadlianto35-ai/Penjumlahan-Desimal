import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VideoScene } from '../../types/math';
import { AnimatedBlackboard } from './AnimatedBlackboard';
import { StoryScene } from './StoryScene';
import { GridVisualizer } from './GridVisualizer';
import { SubtitlesBar } from './SubtitlesBar';
import { VideoControls } from './VideoControls';
import { sound } from '../../utils/audio';
import { BookOpen, ListVideo, LayoutGrid, Sparkles } from 'lucide-react';

interface VideoPlayerProps {
  scenes: VideoScene[];
  currentSceneIndex: number;
  onSelectScene: (idx: number) => void;
  onOpenSimulatorWithNumbers?: (n1: number, n2: number, op: '+' | '-') => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  scenes,
  currentSceneIndex,
  onSelectScene,
  onOpenSimulatorWithNumbers,
}) => {
  const currentScene = scenes[currentSceneIndex] || scenes[0];
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [showGridModel, setShowGridModel] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset step index when scene changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    sound.stopNarration();
  }, [currentSceneIndex]);

  // Handle current narration speech
  const playCurrentStepNarration = useCallback((stepIdx: number) => {
    const step = currentScene.steps[stepIdx];
    if (!step) return;

    sound.playClick();
    if (step.highlightCommas) {
      sound.playLaserAlign();
    }
    if (step.carryOrBorrow?.type === 'carry') {
      sound.playBubblePop();
    }

    if (isVoiceEnabled) {
      sound.speakNarration(step.narration, () => {
        // If playing, advance after speech finishes + brief buffer
        if (isPlaying) {
          if (stepIdx < currentScene.steps.length - 1) {
            stepTimerRef.current = setTimeout(() => {
              setCurrentStepIndex(prev => prev + 1);
            }, 1000 / playbackSpeed);
          } else {
            // End of scene
            if (isLooping) {
              stepTimerRef.current = setTimeout(() => {
                setCurrentStepIndex(0);
              }, 1500 / playbackSpeed);
            } else if (currentSceneIndex < scenes.length - 1) {
              // Move to next chapter
              stepTimerRef.current = setTimeout(() => {
                onSelectScene(currentSceneIndex + 1);
              }, 1500 / playbackSpeed);
            } else {
              setIsPlaying(false);
              sound.playSuccess();
            }
          }
        }
      });
    } else {
      // If voice disabled, advance based on fixed time
      if (isPlaying) {
        const stepDuration = 3500 / playbackSpeed;
        stepTimerRef.current = setTimeout(() => {
          if (stepIdx < currentScene.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
          } else {
            if (isLooping) {
              setCurrentStepIndex(0);
            } else if (currentSceneIndex < scenes.length - 1) {
              onSelectScene(currentSceneIndex + 1);
            } else {
              setIsPlaying(false);
              sound.playSuccess();
            }
          }
        }, stepDuration);
      }
    }
  }, [currentScene, isVoiceEnabled, isPlaying, playbackSpeed, isLooping, currentSceneIndex, scenes.length, onSelectScene]);

  // Effect to trigger narration and timers when currentStepIndex or isPlaying changes
  useEffect(() => {
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
      stepTimerRef.current = null;
    }

    if (isPlaying) {
      playCurrentStepNarration(currentStepIndex);
    }

    return () => {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
      }
      sound.stopNarration();
    };
  }, [currentStepIndex, isPlaying, playCurrentStepNarration]);

  // Step Forward
  const handleNextStep = () => {
    if (currentStepIndex < currentScene.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      sound.playClick();
    }
  };

  // Step Back
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      sound.playClick();
    }
  };

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (!nextState) {
      sound.stopNarration();
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    }
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const currentStep = currentScene.steps[currentStepIndex] || currentScene.steps[0];

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Top Theater Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Badge & Scene Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {currentScene.chapterTitle}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs font-bold text-slate-200 truncate">
            {currentScene.title}
          </span>
        </div>

        {/* Right: Toggle Visual Models */}
        <div className="flex items-center gap-2 shrink-0">
          {currentScene.visualMode !== 'place_value_intro' && (
            <button
              onClick={() => setShowGridModel(prev => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                showGridModel
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Tampilkan Model Blok Petak Desimal (10x10)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Model Petak 100</span>
            </button>
          )}

          {onOpenSimulatorWithNumbers && (
            <button
              onClick={() => onOpenSimulatorWithNumbers(currentScene.num1, currentScene.num2, currentScene.operation)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/50 transition-colors"
              title="Buka Soal ini di Laboratorium Mandiri"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Coba di Simulator</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Screen Theater Viewport */}
      <div className="relative w-full min-h-[460px] lg:min-h-[500px] flex-1 bg-slate-900 p-3 sm:p-5 flex flex-col justify-center">
        {currentScene.visualMode === 'story_problem' ? (
          <StoryScene scene={currentScene} currentStepIndex={currentStepIndex} />
        ) : (
          <AnimatedBlackboard scene={currentScene} currentStepIndex={currentStepIndex} />
        )}

        {/* Floating Modal for 10x10 Grid representation if toggled */}
        {showGridModel && (
          <div className="absolute top-4 right-4 z-30 max-w-xs shadow-2xl">
            <GridVisualizer
              num1={currentScene.num1}
              num2={currentScene.num2}
              operation={currentScene.operation}
              currentStepIndex={currentStepIndex}
            />
          </div>
        )}
      </div>

      {/* Synchronized Subtitles / Narration Bar */}
      <SubtitlesBar
        narrationText={currentStep.narration}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={() => {
          const next = !isVoiceEnabled;
          setIsVoiceEnabled(next);
          sound.setVoiceEnabled(next);
        }}
        onReplayAudio={() => playCurrentStepNarration(currentStepIndex)}
      />

      {/* Bottom Professional Player Controls */}
      <VideoControls
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        currentStepIndex={currentStepIndex}
        totalSteps={currentScene.steps.length}
        onPrevStep={handlePrevStep}
        onNextStep={handleNextStep}
        onPrevScene={() => {
          if (currentSceneIndex > 0) onSelectScene(currentSceneIndex - 1);
        }}
        onNextScene={() => {
          if (currentSceneIndex < scenes.length - 1) onSelectScene(currentSceneIndex + 1);
        }}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={setPlaybackSpeed}
        isLooping={isLooping}
        onToggleLoop={() => setIsLooping(prev => !prev)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        chapterTitle={currentScene.chapterTitle}
        sceneTitle={currentScene.title}
      />
    </div>
  );
};
