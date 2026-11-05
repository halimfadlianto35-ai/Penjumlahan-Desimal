export type Operation = '+' | '-';

export interface PlaceValueInfo {
  label: string;
  shortLabel: string;
  value: number;
  fractionText: string;
  color: string;
  bgLight: string;
}

export interface DecimalStepDetail {
  stepIndex: number;
  title: string;
  description: string;
  narration: string;
  columnFocus?: number; // 0: units, -1: tenths, -2: hundredths, 1: tens, etc.
  carryOrBorrow?: {
    type: 'carry' | 'borrow';
    fromCol: number;
    toCol: number;
    amount: number;
    previousVal?: number;
    newVal?: number;
  };
  highlightCommas?: boolean;
  highlightGhostZero?: boolean;
  activeResultDigitIndex?: number;
}

export interface VideoScene {
  id: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  durationSeconds: number;
  badge: string;
  summary: string;
  narrationScript: string;
  num1: number;
  num2: number;
  operation: Operation;
  steps: DecimalStepDetail[];
  visualMode: 'place_value_intro' | 'alignment_rule' | 'addition_vertical' | 'subtraction_borrow' | 'grid_visual' | 'story_problem';
  storyContext?: {
    character: string;
    setting: string;
    item1: string;
    qty1: string;
    item2: string;
    qty2: string;
    question: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  num1: number;
  num2: number;
  operation: Operation;
  options: string[];
  correctAnswer: string;
  explanation: string;
  commonMistakeTrap?: string;
}
