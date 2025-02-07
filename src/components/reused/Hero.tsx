// Hero component displays the hero section of the application.
import React, { useContext } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { motion } from "framer-motion";

/**
 * Hero component is the main entry point of the application.
 * It displays a hero section with a heading, paragraph, and call-to-action buttons.
 * The component uses Framer Motion for animations.
 */
const Hero = () => {
  const { theme } = useTheme();

  return (
    /**
     * The motion.div element is used to animate the hero section.
     * The initial state is set to opacity 0 and y position 20, and the animate state is set to opacity 1 and y position 0.
     * The transition duration is set to 0.6 seconds.
     */
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col items-center justify-center min-h-[80vh] px-4 text-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
    >
      /**
       * The heading displays the main title of the application.
       */
      <h1 className={`text-4xl md:text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-6`}>
        Welcome to Your New Project
      </h1>
      /**
       * The paragraph provides a brief description of the application.
       */
      <p className={`text-lg md:text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'} max-w-2xl mb-8`}>
        Start building something amazing with this clean, modern foundation. Your journey to creating an exceptional web application begins here.
      </p>
      /**
       * The call-to-action buttons allow users to interact with the application.
       */
      <div className="space-x-4">
        /**
         * The "Get Started" button is the primary call-to-action.
         */
        <button className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
          Get Started
        </button>
        /**
         * The "Learn More" button is the secondary call-to-action.
         */
        <button className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
          Learn More
        </button>
      </div>
    </motion.div>
  );
};

export default Hero;
