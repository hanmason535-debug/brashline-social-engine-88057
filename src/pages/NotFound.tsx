/**
 * File overview: src/pages/NotFound.tsx
 *
 * React component `NotFound` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FlowButton } from "@/components/ui/flow-button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only log in development
    if (import.meta.env.DEV) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <AnimatePresence mode="wait">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-12">
            <motion.span 
              className="text-[80px] md:text-[120px] font-bold text-foreground/70 select-none"
              initial={{ opacity: 0, x: -40, y: 15, rotate: -5 }}
              animate={{ opacity: 0.7, x: 0, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              4
            </motion.span>
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 15, rotate: -5 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: [0, -5, 5],
                rotate: 0
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.2,
                y: {
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
              whileHover={{ 
                scale: 1.1, 
                y: -10,
                rotate: [0, -5, 5, -5, 0],
                transition: { duration: 0.8 }
              }}
            >
              <img
                src="https://xubohuah.github.io/xubohua.top/Group.png"
                alt="Ghost"
                className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] object-contain select-none"
                draggable="false"
              />
            </motion.div>
            <motion.span 
              className="text-[80px] md:text-[120px] font-bold text-foreground/70 select-none"
              initial={{ opacity: 0, x: 40, y: 15, rotate: 5 }}
              animate={{ opacity: 0.7, x: 0, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              4
            </motion.span>
          </div>
          
          <motion.h1 
            className="text-3xl md:text-5xl font-bold text-foreground/70 mb-4 md:mb-6 select-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            Boo! Page missing!
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 select-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            Whoops! This page must be a ghost - it&apos;s not here!
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="flex justify-center"
          >
            <FlowButton text="Find shelter" onClick={handleGoBack} />
          </motion.div>

          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          >
            <a
              href="https://en.wikipedia.org/wiki/HTTP_404"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors underline select-none"
            >
              What means 404?
            </a>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default NotFound;
