import { motion } from "framer-motion";

const Hero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center"
    >
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
        Welcome to Your New Project
      </h1>
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-8">
        Start building something amazing with this clean, modern foundation. Your journey to creating an exceptional web application begins here.
      </p>
      <div className="space-x-4">
        <button className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
          Get Started
        </button>
        <button className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
          Learn More
        </button>
      </div>
    </motion.div>
  );
};

export default Hero;