import React from 'react';
import { motion } from 'framer-motion';
import { File, ChevronRight } from 'lucide-react';
import { codeSnippets } from '../data/snippets';
import { useTypingStore } from '../hooks/useTypingStore';

export const FileExplorer: React.FC = () => {
  const selectedSnippet = useTypingStore((state) => state.selectedSnippet);
  const setSelectedSnippet = useTypingStore((state) => state.setSelectedSnippet);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-[#4ec9b0]';
      case 'medium':
        return 'text-[#dcdcaa]';
      case 'hard':
        return 'text-[#f48771]';
      default:
        return 'text-[#858585]';
    }
  };
  
  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) {
      return '⚛';
    } else if (filename.endsWith('.ts')) {
      return 'TS';
    }
    return '';
  };
  
  return (
    <div className="w-full md:w-56 glass-dark flex flex-col border-b md:border-b-0 md:border-r border-[#3e3e42]">
      <div className="px-3 py-2 border-b border-[#3e3e42] flex items-center">
        <ChevronRight size={14} className="text-[#cccccc] mr-1" />
        <span className="text-[11px] text-[#cccccc] uppercase tracking-wider font-semibold">
          Explorer
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-1">
        <div className="mb-1">
          <div className="px-2 py-1 flex items-center text-[11px] text-[#cccccc] uppercase tracking-wider">
            <ChevronRight size={12} className="mr-1" />
            <span>Practice Files</span>
          </div>
        </div>
        
        {codeSnippets.map((snippet) => (
          <motion.button
            key={snippet.id}
            onClick={() => setSelectedSnippet(snippet)}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 transition-all group text-sm ${
              selectedSnippet.id === snippet.id
                ? 'bg-[#37373d] text-white'
                : 'text-[#cccccc] hover:bg-[#2a2d2e]'
            }`}
          >
            <span className="text-xs opacity-80">{getFileIcon(snippet.filename)}</span>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[13px] truncate">{snippet.filename}</div>
              <div className={`text-[10px] ${getDifficultyColor(snippet.difficulty)}`}>
                {snippet.difficulty}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
