import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, TrendingUp, Award, Calendar } from 'lucide-react';
import { useTypingStore } from '../hooks/useTypingStore';
import { ACHIEVEMENTS } from '../utils/achievements';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const Dashboard: React.FC = () => {
  const userStats = useTypingStore(state => state.userStats);
  
  if (!userStats) {
    return <div className="text-white">Loading...</div>;
  }
  
  // Mock data for chart (you'd track this over time)
  const progressData = [
    { day: 'Mon', wpm: 45 },
    { day: 'Tue', wpm: 52 },
    { day: 'Wed', wpm: 48 },
    { day: 'Thu', wpm: 61 },
    { day: 'Fri', wpm: 58 },
    { day: 'Sat', wpm: 67 },
    { day: 'Sun', wpm: userStats.totalWPM },
  ];
  
  const unlockedAchievements = ACHIEVEMENTS.filter(a => 
    userStats.achievements.includes(a.id)
  );
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#cccccc] mb-2">Dashboard</h1>
        <p className="text-[#858585]">Track your typing progress and achievements</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#007acc]/20 flex items-center justify-center">
              <Trophy size={20} className="text-[#007acc]" />
            </div>
            <div>
              <p className="text-[#858585] text-sm">Level</p>
              <p className="text-2xl font-bold text-[#cccccc]">{userStats.level}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[#858585] mb-1">
              <span>XP</span>
              <span>{userStats.xp} / {Math.floor(100 * Math.pow(1.5, userStats.level))}</span>
            </div>
            <div className="w-full bg-[#1e1e1e] rounded-full h-2">
              <div 
                className="bg-[#007acc] h-2 rounded-full transition-all"
                style={{ 
                  width: `${(userStats.xp / Math.floor(100 * Math.pow(1.5, userStats.level))) * 100}%` 
                }}
              />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#dcdcaa]/20 flex items-center justify-center">
              <Zap size={20} className="text-[#dcdcaa]" />
            </div>
            <div>
              <p className="text-[#858585] text-sm">Best WPM</p>
              <p className="text-2xl font-bold text-[#cccccc]">{userStats.totalWPM}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4ec9b0]/20 flex items-center justify-center">
              <Target size={20} className="text-[#4ec9b0]" />
            </div>
            <div>
              <p className="text-[#858585] text-sm">Accuracy</p>
              <p className="text-2xl font-bold text-[#cccccc]">{userStats.totalAccuracy}%</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f48771]/20 flex items-center justify-center">
              <Calendar size={20} className="text-[#f48771]" />
            </div>
            <div>
              <p className="text-[#858585] text-sm">Streak</p>
              <p className="text-2xl font-bold text-[#cccccc]">{userStats.streakDays} days</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold text-[#cccccc] mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-[#007acc]" />
          WPM Progress
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3e3e42" />
            <XAxis dataKey="day" stroke="#858585" />
            <YAxis stroke="#858585" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e1e1e',
                border: '1px solid #3e3e42',
                borderRadius: '8px',
                color: '#cccccc'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="wpm" 
              stroke="#007acc" 
              strokeWidth={2}
              dot={{ fill: '#007acc', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      
      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold text-[#cccccc] mb-4 flex items-center gap-2">
          <Award size={20} className="text-[#dcdcaa]" />
          Recent Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {unlockedAchievements.slice(0, 4).map((achievement) => (
            <div
              key={achievement.id}
              className="bg-[#1e1e1e] border border-[#3e3e42] rounded-lg p-4 text-center"
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <p className="text-sm font-medium text-[#cccccc]">{achievement.title}</p>
              <p className="text-xs text-[#858585] mt-1">{achievement.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
