import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Switch } from '../themeComponents/switch';

const ThemeToggle = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <div className="flex items-center">
            <Switch checked={theme === 'dark'} onChange={toggleTheme} />
            <span className="ml-2">Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
        </div>
    );
};

export default ThemeToggle;
