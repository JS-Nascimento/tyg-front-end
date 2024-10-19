// ThemeContext.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define o tipo para o contexto do tema
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Cria o contexto do tema
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provedor do contexto do tema
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Verifica o tema inicial com base na classe 'dark' do <html>
    return document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar o contexto de tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
