
import React from 'react';
import { useTheme } from '../../theme/ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button onClick={handleToggle} className={`bg-gray-800 text-white p-2 rounded ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'}`}> 
      {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
};

export default ThemeToggle;
