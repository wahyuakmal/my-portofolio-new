import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import Lightning from '../components/ui/Lightning';
import { ParticleTextEffect } from '../components/ui/particle-text-effect';

const LoadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 4000; 
    const interval = 40; 
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, Math.round((currentStep / steps) * 100));
      setProgress(newProgress);
      if (currentStep >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-64 sm:w-80 mx-auto flex flex-col items-center gap-4">
      {/* Percentage Text */}
      <div className="text-white font-mono text-sm sm:text-base font-bold tracking-widest flex items-center justify-between w-full px-1">
        <span>Loading</span>
        <span>{progress}%</span>
      </div>
      
      {/* Progress Bar Container */}
      <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden relative">
        {/* Glow effect */}
        <div className="absolute top-0 bottom-0 left-0 bg-white/50 blur-[2px] w-full" 
             style={{ transform: `translateX(${progress - 100}%)`, transition: 'transform 0.1s linear' }} />
        {/* Main Bar */}
        <div 
          className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
          style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
        />
      </div>
    </div>
  );
};





const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 1000);
    }, 4500); // Increased from 3400 to 4500 to give users time to read the text
    
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  const containerVariants = {
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit="exit"
          variants={containerVariants}
        >

          {/* ── Lightning full-screen layer ── */}
          <div className="absolute inset-0 z-[1] pointer-events-none">
            <Lightning
              hue={220}
              xOffset={0}
              speed={1.6}
              intensity={1.2}
              size={2}
            />
          </div>

          {/* ── Content ── */}
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-4xl mx-auto">

              {/* Welcome Text Animation */}
              <motion.div
                className="text-center mb-6 sm:mb-8 md:mb-12 w-full h-[150px] sm:h-[200px] flex justify-center"
                variants={childVariants}
              >
                <ParticleTextEffect />
              </motion.div>

              {/* Website Link */}
              <motion.div
                className="text-center"
                variants={childVariants}
                data-aos="fade-up"
                data-aos-delay="1200"
              >
                <LoadingProgress />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;