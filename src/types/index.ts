export interface CodeSnippet {
  id: string;
  filename: string;
  language: string;
  code: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  points?: number;
  locked?: boolean;
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  startTime: number | null;
  currentIndex: number;
  isCompleted: boolean;
  timeElapsed?: number;
}

export interface CharacterState {
  char: string;
  isTyped: boolean;
  isError: boolean;
  isCurrent: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalWPM: number;
  totalAccuracy: number;
  totalChallenges: number;
  totalPoints: number;
  level: number;
  xp: number;
  streakDays: number;
  lastPlayedDate: string | null;
  achievements: string[];
  completedSnippets: string[];
  highScores: Record<string, { wpm: number; accuracy: number; date: number }>;
}

export interface GameSettings {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  showLineNumbers: boolean;
  fontSize: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'all';
  language: 'en' | 'ru';
}

export interface DailyChallenge {
  date: string;
  snippet: CodeSnippet;
  completed: boolean;
  bonusPoints: number;
}
