import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Code, Settings as SettingsIcon } from 'lucide-react';
import { WindowControls } from './components/WindowControls';
import { FileExplorer } from './components/FileExplorer';
import { CodeEditor } from './components/CodeEditor';
import { StatusBar } from './components/StatusBar';
import { CompletionModal } from './components/CompletionModal';
import { Dashboard } from './components/Dashboard';
import { SettingsModal } from './components/SettingsModal';
import { useKeyboardHandler } from './hooks/useKeyboardHandler';
import { useTypingStore } from './hooks/useTypingStore';

type Tab = 'practice' | 'dashboard';

function App() {
  useKeyboardHandler();
  const [activeTab, setActiveTab] = useState<Tab>('practice');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const loadUserData = useTypingStore(state => state.loadUserData);
  
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);
  
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#252526',
            color: '#cccccc',
            border: '1px solid #3e3e42',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#4ec9b0',
              secondary: '#252526',
            },
          },
          error: {
            iconTheme: {
              primary: '#f48771',
              secondary: '#252526',
            },
          },
        }}
      />
      
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
            <div className="flex-1 flex items-center justify-center gap-6">
              <button
                onClick={() => setActiveTab('practice')}
                className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
                  activeTab === 'practice'
                    ? 'bg-[#007acc] text-white'
                    : 'text-[#cccccc] hover:text-white'
                }`}
              >
                <Code size={14} />
                <span className="text-xs md:text-sm font-medium">Practice</span>
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-[#007acc] text-white'
                    : 'text-[#cccccc] hover:text-white'
                }`}
              >
                <LayoutDashboard size={14} />
                <span className="text-xs md:text-sm font-medium">Dashboard</span>
              </button>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="text-[#cccccc] hover:text-white transition-colors"
              aria-label="Settings"
            >
              <SettingsIcon size={16} />
            </button>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'practice' ? (
                <motion.div
                  key="practice"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col md:flex-row"
                >
                  <FileExplorer />
                  <CodeEditor />
                </motion.div>
              ) : (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-auto"
                >
                  <Dashboard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Status Bar - only show in practice mode */}
          {activeTab === 'practice' && <StatusBar />}
        </motion.div>
        
        {/* Modals */}
        <CompletionModal />
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </>
  );
}

export default App;
