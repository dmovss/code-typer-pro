import { create } from 'zustand';
import { CodeSnippet, TypingStats, UserStats, GameSettings } from '../types';
import { codeSnippets } from '../data/snippets';
import { db } from '../utils/db';
import { soundManager } from '../utils/sounds';
import { checkAchievements, calculatePoints, calculateLevel } from '../utils/achievements';
import toast from 'react-hot-toast';

interface TypingStore {
  // Current state
  selectedSnippet: CodeSnippet;
  currentIndex: number;
  typedChars: string[];
  errors: Set<number>;
  stats: TypingStats;
  userStats: UserStats | null;
  settings: GameSettings | null;
  combo: number;
  
  // Actions
  setSelectedSnippet: (snippet: CodeSnippet) => void;
  handleKeyPress: (key: string) => void;
  handleBackspace: () => void;
  resetTyping: () => void;
  calculateStats: () => void;
  completeChallenge: () => Promise<void>;
  loadUserData: () => Promise<void>;
  updateSettings: (settings: Partial<GameSettings>) => Promise<void>;
}

// Skip comments and auto-indent
const shouldSkipChar = (code: string, index: number): boolean => {
  if (index === 0 || code[index - 1] === '\n') {
    if (code[index] === ' ' || code[index] === '\t') {
      return true;
    }
    if (code[index] === '/' && code[index + 1] === '/') {
      return true;
    }
  }
  
  let lineStart = index;
  while (lineStart > 0 && code[lineStart - 1] !== '\n') {
    lineStart--;
  }
  
  let checkIndex = lineStart;
  while (checkIndex < index && (code[checkIndex] === ' ' || code[checkIndex] === '\t')) {
    checkIndex++;
  }
  
  if (code[checkIndex] === '/' && code[checkIndex + 1] === '/') {
    return code[index] !== '\n';
  }
  
  return false;
};

export const useTypingStore = create<TypingStore>((set, get) => ({
  selectedSnippet: codeSnippets[0],
  currentIndex: 0,
  typedChars: [],
  errors: new Set(),
  combo: 0,
  stats: {
    wpm: 0,
    accuracy: 100,
    errors: 0,
    startTime: null,
    currentIndex: 0,
    isCompleted: false,
    timeElapsed: 0,
  },
  userStats: null,
  settings: null,
  
  loadUserData: async () => {
    try {
      const stats = await db.userStats.toArray();
      const settings = await db.settings.toArray();
      
      if (stats.length > 0) {
        set({ userStats: stats[0] });
      }
      
      if (settings.length > 0) {
        set({ settings: settings[0] });
        soundManager.setEnabled(settings[0].soundEnabled);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  },
  
  updateSettings: async (newSettings) => {
    const current = get().settings;
    if (!current) return;
    
    const updated = { ...current, ...newSettings };
    set({ settings: updated });
    
    try {
      await db.settings.update(1, updated);
      
      if (newSettings.soundEnabled !== undefined) {
        soundManager.setEnabled(newSettings.soundEnabled);
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  },
  
  setSelectedSnippet: (snippet) => {
    set({
      selectedSnippet: snippet,
      currentIndex: 0,
      typedChars: [],
      errors: new Set(),
      combo: 0,
      stats: {
        wpm: 0,
        accuracy: 100,
        errors: 0,
        startTime: null,
        currentIndex: 0,
        isCompleted: false,
        timeElapsed: 0,
      },
    });
  },
  
  handleKeyPress: (key) => {
    const state = get();
    const { selectedSnippet, currentIndex, typedChars, errors, stats, combo } = state;
    const code = selectedSnippet.code;
    
    // Start timer on first keystroke
    if (!stats.startTime) {
      set({
        stats: { ...stats, startTime: Date.now() }
      });
    }
    
    // Skip auto-typed characters
    let skipIndex = currentIndex;
    while (skipIndex < code.length && shouldSkipChar(code, skipIndex)) {
      skipIndex++;
    }
    
    if (skipIndex >= code.length) {
      get().completeChallenge();
      return;
    }
    
    const targetChar = code[skipIndex];
    const newErrors = new Set(errors);
    const newTypedChars = [...typedChars];
    
    if (key === targetChar) {
      // Correct keystroke
      newTypedChars.push(targetChar);
      const newCombo = combo + 1;
      
      set({
        currentIndex: skipIndex + 1,
        typedChars: newTypedChars,
        combo: newCombo,
      });
      
      // Play sound and show combo toast
      soundManager.playCorrect();
      
      if (newCombo > 0 && newCombo % 50 === 0) {
        toast.success(`🔥 ${newCombo} character streak!`, {
          duration: 2000,
          position: 'top-center',
        });
      }
    } else {
      // Error
      newErrors.add(skipIndex);
      newTypedChars.push(key);
      
      set({
        currentIndex: skipIndex + 1,
        typedChars: newTypedChars,
        errors: newErrors,
        combo: 0, // Reset combo on error
      });
      
      soundManager.playError();
    }
    
    // Calculate stats
    setTimeout(() => get().calculateStats(), 0);
    
    // Check completion
    let nextIndex = skipIndex + 1;
    while (nextIndex < code.length && shouldSkipChar(code, nextIndex)) {
      nextIndex++;
    }
    
    if (nextIndex >= code.length) {
      get().completeChallenge();
    }
  },
  
  handleBackspace: () => {
    const state = get();
    const { currentIndex, typedChars, errors, selectedSnippet } = state;
    const code = selectedSnippet.code;
    
    if (currentIndex > 0) {
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
      combo: 0,
      stats: {
        wpm: 0,
        accuracy: 100,
        errors: 0,
        startTime: null,
        currentIndex: 0,
        isCompleted: false,
        timeElapsed: 0,
      },
    });
  },
  
  calculateStats: () => {
    const state = get();
    const { typedChars, errors, stats } = state;
    
    if (stats.startTime && typedChars.length > 0) {
      const timeElapsed = (Date.now() - stats.startTime) / 1000 / 60; // minutes
      const wordsTyped = typedChars.length / 5;
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
          timeElapsed: Math.round((Date.now() - stats.startTime) / 1000),
        },
      });
    }
  },
  
  completeChallenge: async () => {
    const state = get();
    const { stats, selectedSnippet, userStats } = state;
    
    if (!userStats) return;
    
    // Mark as completed
    set({
      stats: { ...stats, isCompleted: true }
    });
    
    // Play completion sound
    soundManager.playComplete();
    
    // Calculate points
    const points = calculatePoints(stats.wpm, stats.accuracy, selectedSnippet.difficulty);
    const xpGained = Math.floor(points * 0.5);
    
    // Update user stats
    const newXP = userStats.xp + xpGained;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > userStats.level;
    
    // Update high score
    const currentHighScore = userStats.highScores[selectedSnippet.id];
    const newHighScore = !currentHighScore || stats.wpm > currentHighScore.wpm;
    
    const updatedHighScores = {
      ...userStats.highScores,
      ...(newHighScore ? {
        [selectedSnippet.id]: {
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          date: Date.now(),
        }
      } : {}),
    };
    
    // Check streak
    const today = new Date().toDateString();
    const lastPlayed = userStats.lastPlayedDate;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let newStreak = userStats.streakDays;
    if (lastPlayed === yesterday) {
      newStreak++;
    } else if (lastPlayed !== today) {
      newStreak = 1;
    }
    
    // Add completed snippet
    const completedSnippets = userStats.completedSnippets.includes(selectedSnippet.id)
      ? userStats.completedSnippets
      : [...userStats.completedSnippets, selectedSnippet.id];
    
    const newUserStats: UserStats = {
      ...userStats,
      totalWPM: Math.max(userStats.totalWPM, stats.wpm),
      totalAccuracy: Math.round((userStats.totalAccuracy * userStats.totalChallenges + stats.accuracy) / (userStats.totalChallenges + 1)),
      totalChallenges: userStats.totalChallenges + 1,
      totalPoints: userStats.totalPoints + points,
      level: newLevel,
      xp: newXP,
      streakDays: newStreak,
      lastPlayedDate: today,
      completedSnippets,
      highScores: updatedHighScores,
    };
    
    // Check achievements
    const newAchievements = checkAchievements(newUserStats);
    
    if (newAchievements.length > 0) {
      newUserStats.achievements = [...newUserStats.achievements, ...newAchievements];
    }
    
    // Save to DB
    try {
      await db.userStats.update(1, newUserStats);
      set({ userStats: newUserStats });
      
      // Show notifications
      toast.success(`+${points} points! +${xpGained} XP`, {
        icon: '🎯',
        duration: 3000,
      });
      
      if (newHighScore) {
        toast.success(`🏆 New high score: ${stats.wpm} WPM!`, {
          duration: 4000,
        });
      }
      
      if (leveledUp) {
        soundManager.playLevelUp();
        toast.success(`🎊 Level Up! You're now level ${newLevel}!`, {
          duration: 5000,
        });
      }
      
      newAchievements.forEach((achId) => {
        const achievement = require('../utils/achievements').ACHIEVEMENTS.find((a: any) => a.id === achId);
        if (achievement) {
          toast.success(`${achievement.icon} Achievement Unlocked: ${achievement.title}!`, {
            duration: 6000,
          });
        }
      });
      
    } catch (error) {
      console.error('Failed to save stats:', error);
      toast.error('Failed to save progress');
    }
  },
}));
