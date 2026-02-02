import { Achievement, UserStats } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_challenge',
    title: 'First Steps',
    description: 'Complete your first challenge',
    icon: '🎯',
    unlocked: false,
    condition: (stats) => stats.totalChallenges >= 1,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Reach 100+ WPM',
    icon: '⚡',
    unlocked: false,
    condition: (stats) => stats.totalWPM >= 100,
  },
  {
    id: 'perfect_run',
    title: 'Perfect Run',
    description: 'Complete a challenge with 100% accuracy',
    icon: '💎',
    unlocked: false,
    condition: (stats) => stats.totalAccuracy === 100,
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Complete 10 challenges',
    icon: '🔥',
    unlocked: false,
    condition: (stats) => stats.totalChallenges >= 10,
  },
  {
    id: 'veteran',
    title: 'Veteran',
    description: 'Complete 50 challenges',
    icon: '🏆',
    unlocked: false,
    condition: (stats) => stats.totalChallenges >= 50,
  },
  {
    id: 'master',
    title: 'Master Typist',
    description: 'Reach level 10',
    icon: '👑',
    unlocked: false,
    condition: (stats) => stats.level >= 10,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Practice for 7 days straight',
    icon: '📅',
    unlocked: false,
    condition: (stats) => stats.streakDays >= 7,
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Practice for 30 days straight',
    icon: '🎊',
    unlocked: false,
    condition: (stats) => stats.streakDays >= 30,
  },
  {
    id: 'point_collector',
    title: 'Point Collector',
    description: 'Earn 1,000 points',
    icon: '💰',
    unlocked: false,
    condition: (stats) => stats.totalPoints >= 1000,
  },
  {
    id: 'accuracy_king',
    title: 'Accuracy King',
    description: 'Maintain 95%+ accuracy across 10 challenges',
    icon: '🎯',
    unlocked: false,
    condition: (stats) => stats.totalAccuracy >= 95 && stats.totalChallenges >= 10,
  },
];

export const checkAchievements = (stats: UserStats): string[] => {
  const newAchievements: string[] = [];
  
  ACHIEVEMENTS.forEach((achievement) => {
    if (!stats.achievements.includes(achievement.id) && achievement.condition(stats)) {
      newAchievements.push(achievement.id);
    }
  });
  
  return newAchievements;
};

export const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const calculateLevel = (xp: number): number => {
  let level = 1;
  let requiredXP = 100;
  
  while (xp >= requiredXP) {
    xp -= requiredXP;
    level++;
    requiredXP = calculateXPForLevel(level);
  }
  
  return level;
};

export const calculatePoints = (wpm: number, accuracy: number, difficulty: string): number => {
  let points = wpm;
  
  // Accuracy bonus
  if (accuracy >= 95) {
    points = Math.floor(points * 1.5);
  } else if (accuracy >= 90) {
    points = Math.floor(points * 1.2);
  }
  
  // Difficulty multiplier
  switch (difficulty) {
    case 'medium':
      points = Math.floor(points * 1.5);
      break;
    case 'hard':
      points = Math.floor(points * 2);
      break;
  }
  
  return Math.max(points, 10); // Minimum 10 points
};
