import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

// Meteors use framer-motion to correctly handle repeatDelay and diagonal movement
function Meteors() {
  const meteors = React.useMemo(() => [
    { id: 1, delay: 0,  top: "-10%", left: "20%",  repeatDelay: 12 },
    { id: 2, delay: 4,  top: "-5%",  left: "65%",  repeatDelay: 15 },
    { id: 3, delay: 8,  top: "30%",  left: "-5%",  repeatDelay: 18 },
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {meteors.map((meteor) => (
        <motion.div
          key={meteor.id}
          initial={{ top: meteor.top, left: meteor.left, opacity: 0, x: 0, y: 0, rotate: 45 }}
          animate={{ opacity: [0, 1, 1, 0], x: [0, 1200], y: [0, 1200] }}
          transition={{
            duration: 3,
            delay: meteor.delay,
            repeat: Infinity,
            repeatDelay: meteor.repeatDelay,
            ease: "linear",
          }}
          className="absolute h-[2px] w-[150px] bg-gradient-to-r from-transparent to-white rotate-[45deg]"
        >
          <div className="absolute right-0 top-1/2 h-[4px] w-[4px] -translate-y-1/2 rounded-full bg-white shadow-[0_0_15px_4px_rgba(180,210,255,0.8)]" />
        </motion.div>
      ))}
    </div>
  );
}

// Stars are generated once per mount and memoized to avoid unnecessary recalculations
function generateStars(count, starColor) {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 4000) - 2000;
    const y = Math.floor(Math.random() * 4000) - 2000;
    shadows.push(`${x}px ${y}px ${starColor}`);
  }
  return shadows.join(", ");
}

function StarLayer({
  count = 1000,
  size = 1,
  transition = { repeat: Infinity, duration: 50, ease: "linear" },
  starColor = "#fff",
  className,
  ...props
}) {
  // Memoize star generation so it runs only once per mount
  const boxShadow = React.useMemo(
    () => generateStars(count, starColor),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const starStyle = React.useMemo(
    () => ({ width: `${size}px`, height: `${size}px`, boxShadow }),
    [size, boxShadow]
  );

  return (
    <motion.div
      data-slot="star-layer"
      animate={{ y: [0, -2000] }}
      transition={transition}
      // will-change: transform offloads star animation to the GPU, eliminating repaint
      className={cn("absolute top-0 left-0 w-full h-[2000px]", className)}
      style={{ willChange: "transform" }}
      {...props}
    >
      <div className="absolute bg-transparent rounded-full" style={starStyle} />
      <div className="absolute bg-transparent rounded-full top-[2000px]" style={starStyle} />
    </motion.div>
  );
}

export default function AnimatedBackground({
  children,
  className,
  factor = 0.05,
  speed = 50,
  transition = { stiffness: 50, damping: 20 },
  starColor = "#fff",
  ...props
}) {
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  const springX = useSpring(offsetX, transition);
  const springY = useSpring(offsetY, transition);

  React.useEffect(() => {
    // throttle via requestAnimationFrame to avoid doing work on every pixel of mouse movement
    let rafId = null;
    const handlePointerMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        offsetX.set(-(e.clientX - centerX) * factor);
        offsetY.set(-(e.clientY - centerY) * factor);
        rafId = null;
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [offsetX, offsetY, factor]);

  return (
    <div
      data-slot="stars-background"
      className={cn(
        "fixed inset-0 z-0 overflow-hidden pointer-events-none",
        className,
      )}
      style={{
        background: "radial-gradient(circle at 18% 12%, rgba(37, 99, 235, .15), transparent 30%), radial-gradient(circle at 85% 90%, rgba(14, 165, 233, .1), transparent 28%), radial-gradient(ellipse at bottom, #020617 0%, #000 100%)"
      }}
      {...props}
    >
      <motion.div style={{ x: springX, y: springY }}>
        <StarLayer
          count={1000}
          size={1}
          transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
          starColor={starColor}
        />
        <StarLayer
          count={400}
          size={2}
          transition={{ repeat: Infinity, duration: speed * 2, ease: "linear" }}
          starColor={starColor}
        />
        <StarLayer
          count={200}
          size={3}
          transition={{ repeat: Infinity, duration: speed * 3, ease: "linear" }}
          starColor={starColor}
        />
      </motion.div>
      <Meteors />
      {children}
    </div>
  );
}
