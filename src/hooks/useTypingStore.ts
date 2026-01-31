import { create } from 'zustand';
import { CodeSnippet, TypingStats } from '../types';
import { codeSnippets } from '../data/snippets';

interface TypingStore {
  // Current state
  selectedSnippet: CodeSnippet;
  currentIndex: number;
  typedChars: string[];
  errors: Set<number>;
  stats: TypingStats;
  
  // Actions
  setSelectedSnippet: (snippet: CodeSnippet) => void;
  handleKeyPress: (key: string) => void;
  handleBackspace: () => void;
  resetTyping: () => void;
  calculateStats: () => void;
}

// Skip comments - user doesn't type them
const shouldSkipChar = (code: string, index: number): boolean => {
  // Check if we're at the start of a line
  if (index === 0 || code[index - 1] === '\n') {
    // Skip leading whitespace
    if (code[index] === ' ' || code[index] === '\t') {
      return true;
    }
    // Skip if line starts with //
    if (code[index] === '/' && code[index + 1] === '/') {
      return true;
    }
  }
  
  // Skip if we're inside a comment line
  let lineStart = index;
  while (lineStart > 0 && code[lineStart - 1] !== '\n') {
    lineStart--;
  }
  
  // Check if this line starts with a comment
  let checkIndex = lineStart;
  while (checkIndex < index && (code[checkIndex] === ' ' || code[checkIndex] === '\t')) {
    checkIndex++;
  }
  
  if (code[checkIndex] === '/' && code[checkIndex + 1] === '/') {
    // We're in a comment line, skip until newline
    return code[index] !== '\n';
  }
  
  return false;
};

export const useTypingStore = create<TypingStore>((set, get) => ({
  selectedSnippet: codeSnippets[0],
  currentIndex: 0,
  typedChars: [],
  errors: new Set(),
  stats: {
    wpm: 0,
    accuracy: 100,
    errors: 0,
    startTime: null,
    currentIndex: 0,
    isCompleted: false,
  },
  
  setSelectedSnippet: (snippet) => {
    set({
      selectedSnippet: snippet,
      currentIndex: 0,
      typedChars: [],
      errors: new Set(),
      stats: {
        wpm: 0,
        accuracy: 100,
        errors: 0,
        startTime: null,
        currentIndex: 0,
        isCompleted: false,
      },
    });
  },
  
  handleKeyPress: (key) => {
    const state = get();
    const { selectedSnippet, currentIndex, typedChars, errors, stats } = state;
    const code = selectedSnippet.code;
    
    // Start timer on first keystroke
    if (!stats.startTime) {
      set({
        stats: { ...stats, startTime: Date.now() }
      });
    }
    
    // Skip characters that shouldn't be typed
    let skipIndex = currentIndex;
    while (skipIndex < code.length && shouldSkipChar(code, skipIndex)) {
      skipIndex++;
    }
    
    if (skipIndex >= code.length) {
      // Completed
      set({
        stats: { ...get().stats, isCompleted: true }
      });
      return;
    }
    
    const targetChar = code[skipIndex];
    const newErrors = new Set(errors);
    const newTypedChars = [...typedChars];
    
    if (key === targetChar) {
      // Correct keystroke
      newTypedChars.push(targetChar);
      set({
        currentIndex: skipIndex + 1,
        typedChars: newTypedChars,
      });
    } else {
      // Error
      newErrors.add(skipIndex);
      newTypedChars.push(key);
      set({
        currentIndex: skipIndex + 1,
        typedChars: newTypedChars,
        errors: newErrors,
      });
    }
    
    // Calculate stats after update
    setTimeout(() => get().calculateStats(), 0);
    
    // Check completion
    let nextIndex = skipIndex + 1;
    while (nextIndex < code.length && shouldSkipChar(code, nextIndex)) {
      nextIndex++;
    }
    
    if (nextIndex >= code.length) {
      set({
        stats: { ...get().stats, isCompleted: true }
      });
    }
  },
  
  handleBackspace: () => {
    const state = get();
    const { currentIndex, typedChars, errors, selectedSnippet } = state;
    const code = selectedSnippet.code;
    
    if (currentIndex > 0) {
      // Find the previous non-skipped index
      let newIndex = currentIndex - 1;
      while (newIndex > 0 && shouldSkipChar(code, newIndex)) {
        newIndex--;
      }
      
      const newErrors = new Set(errors);
      newErrors.delete(newIndex);
      
      const newTypedChars = [...typedChars];
      newTypedChars.pop();
      
      set({
        currentIndex: newIndex,
        typedChars: newTypedChars,
        errors: newErrors,
      });
      
      setTimeout(() => get().calculateStats(), 0);
    }
  },
  
  resetTyping: () => {
    set({
      currentIndex: 0,
      typedChars: [],
      errors: new Set(),
      stats: {
        wpm: 0,
        accuracy: 100,
        errors: 0,
        startTime: null,
        currentIndex: 0,
        isCompleted: false,
      },
    });
  },
  
  calculateStats: () => {
    const state = get();
    const { typedChars, errors, stats } = state;
    
    if (stats.startTime && typedChars.length > 0) {
      const timeElapsed = (Date.now() - stats.startTime) / 1000 / 60; // minutes
      const wordsTyped = typedChars.length / 5; // standard: 5 chars = 1 word
      const wpm = Math.round(wordsTyped / timeElapsed) || 0;
      
      const correctChars = typedChars.length - errors.size;
      const accuracy = Math.round((correctChars / typedChars.length) * 100) || 100;
      
      set({
        stats: {
          ...stats,
          wpm,
          accuracy,
          errors: errors.size,
          currentIndex: state.currentIndex,
        },
      });
    }
  },
}));
