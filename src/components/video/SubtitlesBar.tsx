import React from 'react';
import { Volume2, VolumeX, RotateCcw, MessageSquareQuote } from 'lucide-react';
import { sound } from '../../utils/audio';

interface SubtitlesBarProps {
  narrationText: string;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
  onReplayAudio: () => void;
}

export const SubtitlesBar: React.FC<SubtitlesBarProps> = ({
  narrationText,
  isVoiceEnabled,
  onToggleVoice,
  onReplayAudio,
}) => {
  return (
    <div className="w-full bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center justify-between gap-4 text-white">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-indigo-300 shrink-0">
          <MessageSquareQuote className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <span>Narasi Guru</span>
            {isVoiceEnabled && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Suara Aktif (Bahasa Indonesia)
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 italic font-medium mt-0.5">
            "{narrationText}"
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onReplayAudio}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Ulangi Suara Narasi"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleVoice}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            isVoiceEnabled
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
          }`}
          title={isVoiceEnabled ? 'Matikan Suara Narasi' : 'Aktifkan Suara Narasi'}
        >
          {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isVoiceEnabled ? 'Suara ON' : 'Mute'}</span>
        </button>
      </div>
    </div>
  );
};
