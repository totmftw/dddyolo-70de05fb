import React, { useContext } from 'react';
import { useTheme } from '../context/ThemeContext';

const ProductDisplay = () => {
  const { theme } = useTheme();

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}> 
      <h2 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Product Display Page</h2>
      {/* Logic to fetch and display products goes here */}
    </div>
  );
};

export default ProductDisplay;
