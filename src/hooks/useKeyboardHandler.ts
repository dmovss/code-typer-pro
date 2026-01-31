import { useEffect } from 'react';
import { useTypingStore } from './useTypingStore';

export const useKeyboardHandler = () => {
  const handleKeyPress = useTypingStore((state) => state.handleKeyPress);
  const handleBackspace = useTypingStore((state) => state.handleBackspace);
  const isCompleted = useTypingStore((state) => state.stats.isCompleted);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if completed
      if (isCompleted) return;
      
      // Handle backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
      }
      
      // Ignore special keys
      if (e.key.length !== 1) return;
      
      // Ignore ctrl/cmd/alt combinations
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      e.preventDefault();
      handleKeyPress(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, handleBackspace, isCompleted]);
};
