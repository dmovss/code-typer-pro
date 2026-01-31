import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, RotateCcw } from 'lucide-react';
import { useTypingStore } from '../hooks/useTypingStore';

export const StatusBar: React.FC = () => {
  const stats = useTypingStore((state) => state.stats);
  const selectedSnippet = useTypingStore((state) => state.selectedSnippet);
  const currentIndex = useTypingStore((state) => state.currentIndex);
  const resetTyping = useTypingStore((state) => state.resetTyping);
  
  return (
    <div className="h-6 bg-[#007acc] flex items-center justify-between px-3 text-xs text-white">
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1.5"
        >
          <Zap size={11} />
          <span className="font-semibold tabular-nums">{stats.wpm}</span>
          <span className="opacity-80">WPM</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-1.5"
        >
          <Target size={11} />
          <span className="font-semibold tabular-nums">{stats.accuracy}%</span>
          <span className="opacity-80">Accuracy</span>
        </motion.div>
        
        {stats.errors > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 text-[#f48771]"
          >
            <span className="font-semibold tabular-nums">{stats.errors}</span>
            <span className="opacity-90">Errors</span>
          </motion.div>
        )}
      </div>
      
      <div className="hidden md:flex items-center gap-3">
        <div className="opacity-90 text-[11px]">
          {currentIndex} / {selectedSnippet.code.length}
        </div>
        
        {stats.startTime && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTyping}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 transition-all text-[11px] font-medium"
          >
            <RotateCcw size={10} />
            <span>Reset</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};
