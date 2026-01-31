import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { File } from 'lucide-react';
import { useTypingStore } from '../hooks/useTypingStore';

// VS Code color palette
const VSCodeColors = {
  keyword: '#569cd6',      // if, const, let, return, etc.
  string: '#ce9178',       // strings
  comment: '#6a9955',      // comments
  function: '#dcdcaa',     // function names
  type: '#4ec9b0',         // types, interfaces
  variable: '#9cdcfe',     // variables
  punctuation: '#d4d4d4',  // brackets, commas
  number: '#b5cea8',       // numbers
  property: '#9cdcfe',     // object properties
  operator: '#d4d4d4',     // =, +, -, etc.
};

// Simple syntax highlighter for TypeScript/React
const getColorForToken = (token: string, context: string): string => {
  // Keywords
  if (['import', 'export', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'interface', 'type', 'class', 'extends', 'async', 'await', 'try', 'catch', 'from', 'as'].includes(token)) {
    return VSCodeColors.keyword;
  }
  
  // Types
  if (['React', 'FC', 'useState', 'useEffect', 'string', 'number', 'boolean', 'void', 'any', 'null', 'undefined'].includes(token)) {
    return VSCodeColors.type;
  }
  
  // Check if it's a string
  if (token.includes("'") || token.includes('"') || token.includes('`')) {
    return VSCodeColors.string;
  }
  
  // Check if it's a number
  if (/^\d+$/.test(token)) {
    return VSCodeColors.number;
  }
  
  // Check if it's a function call (followed by parenthesis)
  if (context.includes('(')) {
    return VSCodeColors.function;
  }
  
  return VSCodeColors.variable;
};

export const CodeEditor: React.FC = () => {
  const selectedSnippet = useTypingStore((state) => state.selectedSnippet);
  const currentIndex = useTypingStore((state) => state.currentIndex);
  const errors = useTypingStore((state) => state.errors);
  const editorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-scroll to keep cursor in view
    if (editorRef.current) {
      const cursorElement = editorRef.current.querySelector('.cursor-active');
      if (cursorElement) {
        cursorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentIndex]);
  
  // Check if character should be skipped (comments and leading whitespace)
  const shouldSkipChar = (code: string, index: number): boolean => {
    if (index === 0 || code[index - 1] === '\n') {
      if (code[index] === ' ' || code[index] === '\t') {
        return true;
      }
      if (code[index] === '/' && code[index + 1] === '/') {
        return true;
      }
    }
    
    let lineStart = index;
    while (lineStart > 0 && code[lineStart - 1] !== '\n') {
      lineStart--;
    }
    
    let checkIndex = lineStart;
    while (checkIndex < index && (code[checkIndex] === ' ' || code[checkIndex] === '\t')) {
      checkIndex++;
    }
    
    if (code[checkIndex] === '/' && code[checkIndex + 1] === '/') {
      return code[index] !== '\n';
    }
    
    return false;
  };
  
  const renderCode = () => {
    const code = selectedSnippet.code;
    const lines = code.split('\n');
    
    return lines.map((line, lineIdx) => {
      let lineStartIdx = 0;
      for (let i = 0; i < lineIdx; i++) {
        lineStartIdx += lines[i].length + 1; // +1 for \n
      }
      
      const isComment = line.trim().startsWith('//');
      
      return (
        <div key={lineIdx} className="leading-relaxed">
          {line.split('').map((char, charIdx) => {
            const globalIdx = lineStartIdx + charIdx;
            const shouldSkip = shouldSkipChar(code, globalIdx);
            
            let className = 'transition-all duration-75';
            
            if (shouldSkip) {
              // Auto-typed content (comments, indentation)
              className += isComment ? ` text-[${VSCodeColors.comment}]` : ' text-[#808080]';
            } else if (globalIdx < currentIndex) {
              // User typed this
              if (errors.has(globalIdx)) {
                className += ' text-[#f48771] bg-[#f48771]/10 font-semibold';
              } else {
                className += ' text-[#d4d4d4]';
              }
            } else if (globalIdx === currentIndex) {
              // Current cursor position
              className += ' cursor-active text-[#d4d4d4] relative';
            } else {
              // Not yet typed
              className += isComment ? ` text-[${VSCodeColors.comment}]/30` : ' text-[#808080]/30';
            }
            
            return (
              <span key={charIdx} className={className}>
                {char === ' ' ? '\u00A0' : char}
                {globalIdx === currentIndex && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#007acc] animate-cursor-blink" />}
              </span>
            );
          })}
        </div>
      );
    });
  };
  
  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e]">
      {/* Editor Tab */}
      <div className="h-9 bg-[#252526] border-b border-[#3e3e42] flex items-center px-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1e1e1e] px-3 py-1 rounded-t flex items-center gap-2 border-t-2 border-[#007acc]"
        >
          <File size={13} className="text-[#007acc]" />
          <span className="text-xs text-[#d4d4d4] font-normal">
            {selectedSnippet.filename}
          </span>
        </motion.div>
      </div>
      
      {/* Code Editor */}
      <div
        ref={editorRef}
        className="flex-1 overflow-auto p-4 md:p-6 font-mono text-sm md:text-[13px] select-none"
        style={{ 
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          lineHeight: '1.6',
          letterSpacing: '0.2px'
        }}
      >
        <pre className="whitespace-pre">{renderCode()}</pre>
      </div>
    </div>
  );
};
