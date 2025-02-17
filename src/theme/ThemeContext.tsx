import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
  };
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const theme = {
  light: {
    background: '#f8f9fa',
    text: '#2d3436',
    primary: '#228B22', // Forest Green
    secondary: '#8A9A5B' // Moss Green
  },
  dark: {
    background: '#1a1a1a',
    text: '#e9ecef',
    primary: '#228B22', // Forest Green
    secondary: '#8A9A5B' // Moss Green
  }
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: theme.light,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeState, setThemeState] = useState<Theme>(Cookies.get('theme') as Theme || 'light');

  useEffect(() => {
    Cookies.set('theme', themeState); // Set the cookie whenever the theme changes
  }, [themeState]);

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const colors = theme[themeState];

  return (
    <ThemeContext.Provider value={{ theme: themeState, colors, toggleTheme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
