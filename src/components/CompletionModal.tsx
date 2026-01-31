import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Target, X } from 'lucide-react';
import { useTypingStore } from '../hooks/useTypingStore';

export const CompletionModal: React.FC = () => {
  const stats = useTypingStore((state) => state.stats);
  const selectedSnippet = useTypingStore((state) => state.selectedSnippet);
  const resetTyping = useTypingStore((state) => state.resetTyping);
  
  const getPerformanceMessage = () => {
    if (stats.wpm >= 80 && stats.accuracy >= 95) {
      return '🔥 Outstanding!';
    } else if (stats.wpm >= 60 && stats.accuracy >= 90) {
      return '⭐ Excellent!';
    } else if (stats.wpm >= 40 && stats.accuracy >= 85) {
      return '👍 Good Job!';
    } else {
      return '💪 Keep Going!';
    }
  };
  
  const getGrade = () => {
    const score = (stats.wpm * 0.6) + (stats.accuracy * 0.4);
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };
  
  return (
    <AnimatePresence>
      {stats.isCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={resetTyping}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-[#252526] border border-[#3e3e42] rounded-xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#007acc] to-[#005a9e] flex items-center justify-center shadow-lg">
                  <Trophy className="text-white" size={22} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#cccccc]">
                    Challenge Complete!
                  </h2>
                  <p className="text-[#858585] text-xs md:text-sm">{selectedSnippet.filename}</p>
                </div>
              </div>
              <button
                onClick={resetTyping}
                className="text-[#858585] hover:text-[#cccccc] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="text-center py-4 px-6 rounded-lg bg-gradient-to-br from-[#007acc]/20 to-[#005a9e]/20 border border-[#007acc]/30">
                <p className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {getPerformanceMessage()}
                </p>
                <p className="text-4xl font-bold text-[#007acc] mt-2">
                  Grade: {getGrade()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#1e1e1e] rounded-lg p-4 border border-[#3e3e42]">
                <div className="flex items-center gap-2 text-[#dcdcaa] mb-2">
                  <Zap size={14} />
                  <span className="text-xs text-[#858585]">Speed</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-[#cccccc] tabular-nums">
                  {stats.wpm}
                </div>
                <div className="text-xs text-[#858585]">WPM</div>
              </div>
              
              <div className="bg-[#1e1e1e] rounded-lg p-4 border border-[#3e3e42]">
                <div className="flex items-center gap-2 text-[#4ec9b0] mb-2">
                  <Target size={14} />
                  <span className="text-xs text-[#858585]">Accuracy</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-[#cccccc] tabular-nums">
                  {stats.accuracy}%
                </div>
                <div className="text-xs text-[#858585]">Precision</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetTyping}
                className="flex-1 py-2.5 md:py-3 px-4 rounded-lg bg-[#007acc] text-white font-semibold hover:bg-[#005a9e] transition-all text-sm md:text-base"
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
