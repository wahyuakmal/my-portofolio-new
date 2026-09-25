import React from "react";

export default function AnimatedSphere() {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center" style={{ perspective: '1000px' }}>
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px]" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(15deg)' }}>
          
          <div className="absolute inset-0 rounded-full bg-gradient-radial shadow-[0_0_80px_rgba(148,163,184,0.3)] animate-[spin_30s_linear_infinite]" 
               style={{ 
                 background: 'radial-gradient(circle at 35% 35%, #94a3b8 0%, #64748b 30%, #475569 60%, #334155 100%)',
                 boxShadow: 'inset -30px -30px 60px rgba(0,0,0,0.5), inset 20px 20px 40px rgba(255,255,255,0.1), 0 0 100px rgba(148,163,184,0.2)'
               }}>
            
            <div className="absolute top-[15%] left-[25%] w-8 h-8 rounded-full bg-slate-600/40 blur-md"></div>
            <div className="absolute top-[40%] left-[60%] w-6 h-6 rounded-full bg-slate-500/30 blur-sm"></div>
            <div className="absolute bottom-[30%] right-[35%] w-10 h-10 rounded-full bg-slate-700/30 blur-lg"></div>
            <div className="absolute top-[60%] left-[20%] w-5 h-5 rounded-full bg-slate-600/25 blur-sm"></div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[60px] rounded-[50%] animate-[spin_25s_linear_infinite_reverse]"
               style={{
                 background: 'linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.15) 20%, rgba(203,213,225,0.3) 35%, rgba(148,163,184,0.35) 50%, rgba(203,213,225,0.3) 65%, rgba(148,163,184,0.15) 80%, transparent 100%)',
                 boxShadow: '0 2px 30px rgba(203,213,225,0.2), 0 -2px 30px rgba(203,213,225,0.1)',
                 transform: 'translateX(-50%) translateY(-50%) rotateX(75deg)',
                 transformOrigin: 'center',
               }}>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[185%] h-[65px] rounded-[50%] animate-[spin_25s_linear_infinite_reverse] opacity-50"
               style={{
                 background: 'linear-gradient(90deg, transparent 0%, rgba(100,116,139,0.1) 25%, rgba(148,163,184,0.2) 50%, rgba(100,116,139,0.1) 75%, transparent 100%)',
                 transform: 'translateX(-50%) translateY(-50%) rotateX(75deg)',
                 transformOrigin: 'center',
                 filter: 'blur(3px)',
               }}>
          </div>

          {[...Array(150)].map((_, i) => {
            const angle = (i / 150) * 360;
            const radiusVariation = Math.random() * 20;
            const radius = 200 + radiusVariation;
            const size = Math.random() * 2 + 0.5;
            const opacity = Math.random() * 0.4 + 0.3;
            const delay = (Math.random() * 3).toFixed(2);
            
            return (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * radius}px)`,
                  top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * (radius * 0.35)}px)`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: `rgba(203, 213, 225, ${opacity})`,
                  animationDelay: `${delay}s`,
                  boxShadow: `0 0 ${size * 3}px rgba(203, 213, 225, ${opacity * 0.8})`,
                }}
              ></div>
            );
          })}

          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-40 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
