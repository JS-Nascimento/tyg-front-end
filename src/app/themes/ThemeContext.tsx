'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const currentTheme = isDarkMode
      ? 'styles/tailwind-dark.min.css'
      : 'styles/tailwind.min.css';

    const link = document.getElementById('theme-css') as HTMLLinkElement;
    if (link) {
      link.href = currentTheme;
    } else {
      const newLink = document.createElement('link');
      newLink.id = 'theme-css';
      newLink.rel = 'stylesheet';
      newLink.href = currentTheme;
      document.head.appendChild(newLink);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      if (!isDarkMode) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
