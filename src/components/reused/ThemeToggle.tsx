
import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import Switch from '../themeComponents/switch';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="flex items-center">
            <Switch checked={theme === 'dark'} onChange={toggleTheme} />
            <span className="ml-2">Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
        </div>
    );
};

export default ThemeToggle;
