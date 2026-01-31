import React from 'react';
import { motion } from 'framer-motion';
import { WindowControls } from './components/WindowControls';
import { FileExplorer } from './components/FileExplorer';
import { CodeEditor } from './components/CodeEditor';
import { StatusBar } from './components/StatusBar';
import { CompletionModal } from './components/CompletionModal';
import { useKeyboardHandler } from './hooks/useKeyboardHandler';

function App() {
  useKeyboardHandler();
  
  return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center p-2 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-7xl h-[98vh] md:h-[92vh] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl glass flex flex-col"
      >
        {/* Title Bar */}
        <div className="h-10 md:h-11 bg-[#323233] border-b border-[#3e3e42] flex items-center px-3 md:px-4">
          <WindowControls />
          <div className="flex-1 text-center text-[#cccccc] text-xs md:text-sm font-medium tracking-wide">
            CodeTyper Pro
          </div>
          <div className="w-14 md:w-16"></div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <FileExplorer />
          <CodeEditor />
        </div>
        
        {/* Status Bar */}
        <StatusBar />
      </motion.div>
      
      {/* Completion Modal */}
      <CompletionModal />
    </div>
  );
}

export default App;
