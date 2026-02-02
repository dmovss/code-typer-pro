import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Sun, Moon, Type, Globe } from 'lucide-react';
import { useTypingStore } from '../hooks/useTypingStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const settings = useTypingStore(state => state.settings);
  const updateSettings = useTypingStore(state => state.updateSettings);
  
  if (!settings) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#252526] border border-[#3e3e42] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#cccccc]">Settings</h2>
              <button
                onClick={onClose}
                className="text-[#858585] hover:text-[#cccccc] transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Settings Groups */}
            <div className="space-y-6">
              {/* Appearance */}
              <div>
                <h3 className="text-lg font-semibold text-[#cccccc] mb-4 flex items-center gap-2">
                  {settings.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                  Appearance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[#cccccc]">Theme</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateSettings({ theme: 'dark' })}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          settings.theme === 'dark'
                            ? 'bg-[#007acc] text-white'
                            : 'bg-[#1e1e1e] text-[#858585] hover:text-[#cccccc]'
                        }`}
                      >
                        <Moon size={16} />
                      </button>
                      <button
                        onClick={() => updateSettings({ theme: 'light' })}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          settings.theme === 'light'
                            ? 'bg-[#007acc] text-white'
                            : 'bg-[#1e1e1e] text-[#858585] hover:text-[#cccccc]'
                        }`}
                      >
                        <Sun size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-[#cccccc]">Show Line Numbers</label>
                    <button
                      onClick={() => updateSettings({ showLineNumbers: !settings.showLineNumbers })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.showLineNumbers ? 'bg-[#007acc]' : 'bg-[#3e3e42]'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.showLineNumbers ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-[#cccccc] flex items-center gap-2">
                      <Type size={16} />
                      Font Size
                    </label>
                    <select
                      value={settings.fontSize}
                      onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                      className="bg-[#1e1e1e] text-[#cccccc] border border-[#3e3e42] rounded-lg px-3 py-2"
                    >
                      <option value={12}>12px</option>
                      <option value={13}>13px</option>
                      <option value={14}>14px</option>
                      <option value={16}>16px</option>
                      <option value={18}>18px</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Audio */}
              <div>
                <h3 className="text-lg font-semibold text-[#cccccc] mb-4 flex items-center gap-2">
                  {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  Audio
                </h3>
                <div className="flex items-center justify-between">
                  <label className="text-[#cccccc]">Sound Effects</label>
                  <button
                    onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.soundEnabled ? 'bg-[#007acc]' : 'bg-[#3e3e42]'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.soundEnabled ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              {/* Difficulty */}
              <div>
                <h3 className="text-lg font-semibold text-[#cccccc] mb-4">Difficulty Filter</h3>
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => updateSettings({ difficulty: diff })}
                      className={`px-4 py-2 rounded-lg capitalize transition-all ${
                        settings.difficulty === diff
                          ? 'bg-[#007acc] text-white'
                          : 'bg-[#1e1e1e] text-[#858585] hover:text-[#cccccc]'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Language */}
              <div>
                <h3 className="text-lg font-semibold text-[#cccccc] mb-4 flex items-center gap-2">
                  <Globe size={18} />
                  Language
                </h3>
                <select
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value as 'en' | 'ru' })}
                  className="bg-[#1e1e1e] text-[#cccccc] border border-[#3e3e42] rounded-lg px-3 py-2 w-full"
                >
                  <option value="en">English</option>
                  <option value="ru">Русский</option>
                </select>
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-[#3e3e42]">
              <button
                onClick={onClose}
                className="w-full bg-[#007acc] hover:bg-[#005a9e] text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Save & Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
