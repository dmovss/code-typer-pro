import Dexie, { Table } from 'dexie';
import { UserStats, GameSettings, DailyChallenge } from '../types';

// Database schema
export class CodeTyperDB extends Dexie {
  userStats!: Table<UserStats, number>;
  settings!: Table<GameSettings, number>;
  dailyChallenges!: Table<DailyChallenge, string>;

  constructor() {
    super('CodeTyperProDB');
    
    this.version(1).stores({
      userStats: '++id',
      settings: '++id',
      dailyChallenges: 'date',
    });
  }
}

export const db = new CodeTyperDB();

// Initialize default data
export const initializeDB = async () => {
  const statsCount = await db.userStats.count();
  
  if (statsCount === 0) {
    await db.userStats.add({
      totalWPM: 0,
      totalAccuracy: 100,
      totalChallenges: 0,
      totalPoints: 0,
      level: 1,
      xp: 0,
      streakDays: 0,
      lastPlayedDate: null,
      achievements: [],
      completedSnippets: [],
      highScores: {},
    });
  }
  
  const settingsCount = await db.settings.count();
  
  if (settingsCount === 0) {
    await db.settings.add({
      theme: 'dark',
      soundEnabled: true,
      showLineNumbers: true,
      fontSize: 14,
      difficulty: 'all',
      language: 'en',
    });
  }
};
