export interface CodeSnippet {
  id: string;
  filename: string;
  language: string;
  code: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  startTime: number | null;
  currentIndex: number;
  isCompleted: boolean;
}

export interface CharacterState {
  char: string;
  isTyped: boolean;
  isError: boolean;
  isCurrent: boolean;
}
