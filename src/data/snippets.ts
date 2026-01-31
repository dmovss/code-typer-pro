import { CodeSnippet } from '../types';

export const codeSnippets: CodeSnippet[] = [
  {
    id: '1',
    filename: 'useAuth.ts',
    language: 'typescript',
    difficulty: 'medium',
    code: `// Custom authentication hook
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  return { user, loading };
};`
  },
  {
    id: '2',
    filename: 'Button.tsx',
    language: 'typescript',
    difficulty: 'easy',
    code: `// Reusable button component
import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick
}) => {
  const baseClasses = 'rounded-lg font-medium transition-all';
  
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`
  },
  {
    id: '3',
    filename: 'dataFetching.tsx',
    language: 'typescript',
    difficulty: 'hard',
    code: `// Data fetching utilities
import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Fetch failed');
        
        const json = await response.json();
        if (!cancelled) {
          setState({ data: json, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState({ data: null, loading: false, error: err as Error });
        }
      }
    };
    
    fetchData();
    
    return () => {
      cancelled = true;
    };
  }, [url]);
  
  return state;
}`
  },
  {
    id: '4',
    filename: 'useLocalStorage.ts',
    language: 'typescript',
    difficulty: 'medium',
    code: `// Local storage hook with TypeScript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
}`
  },
  {
    id: '5',
    filename: 'TodoList.tsx',
    language: 'typescript',
    difficulty: 'easy',
    code: `// Simple Todo List Component
import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  
  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: input, completed: false }
      ]);
      setInput('');
    }
  };
  
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  return (
    <div className="p-4">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        className="border p-2 rounded"
      />
      <button onClick={addTodo} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
        Add
      </button>
      <ul className="mt-4">
        {todos.map(todo => (
          <li key={todo.id} onClick={() => toggleTodo(todo.id)}>
            <span className={todo.completed ? 'line-through' : ''}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};`
  }
];
