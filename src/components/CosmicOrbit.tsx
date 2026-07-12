import React from "react";
import { motion } from "motion/react";
import { 
  User, 
  Target, 
  Briefcase, 
  Coins, 
  Heart, 
  Leaf, 
  HeartPulse, 
  Star,
  Activity
} from "lucide-react";

interface CosmicOrbitProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  interactive?: boolean;
}

export default function CosmicOrbit({ activeCategory, onSelectCategory, interactive = true }: CosmicOrbitProps) {
  // 8 key nodes corresponding to the Evolve categories
  const nodes = [
    { id: "personality", label: "Personality", icon: User, angle: 0, color: "from-purple-500 to-indigo-500" },
    { id: "purpose", label: "Purpose", icon: Target, angle: 45, color: "from-amber-400 to-yellow-600" },
    { id: "career", label: "Career", icon: Briefcase, angle: 90, color: "from-blue-500 to-cyan-500" },
    { id: "money", label: "Money", icon: Coins, angle: 135, color: "from-emerald-500 to-teal-500" },
    { id: "relationships", label: "Relationships", icon: Heart, angle: 180, color: "from-rose-500 to-pink-500" },
    { id: "growth", label: "Growth", icon: Leaf, angle: 225, color: "from-green-400 to-emerald-600" },
    { id: "health", label: "Wellness", icon: HeartPulse, angle: 270, color: "from-violet-500 to-purple-600" },
    { id: "potential", label: "Potential", icon: Star, angle: 315, color: "from-amber-500 to-orange-500" },
  ];

  const radius = 175; // Orbit radius in pixels for desktop layout

  return (
    <div id="cosmic-orbit-container" className="relative w-full aspect-square max-w-[450px] mx-auto flex items-center justify-center p-4">
      {/* Background Stars/Nebula Ambient glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent rounded-full animate-pulse-slow pointer-events-none" />
      
      {/* Inner Glowing Star */}
      <div className="absolute w-72 h-72 rounded-full border border-white/5 animate-spin-slow pointer-events-none" />
      <div className="absolute w-[360px] h-[360px] rounded-full border border-gold/5 animate-spin-slow pointer-events-none" style={{ animationDirection: "reverse" }} />
      
      {/* Dotted Orbit Rings */}
      <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 450 450">
        {/* Outer Orbit Circle */}
        <circle 
          cx="225" 
          cy="225" 
          r={radius} 
          fill="none" 
          stroke="url(#goldGradient)" 
          strokeWidth="1.5" 
          strokeDasharray="4 6" 
          className="opacity-40"
        />
        <circle 
          cx="225" 
          cy="225" 
          r="100" 
          fill="none" 
          stroke="rgba(212, 175, 55, 0.15)" 
          strokeWidth="1" 
          strokeDasharray="3 4" 
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5A93C" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#fbe3ab" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#b87b1c" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
      {/* Central Figure (Meditating silhouette + sacred geometry) */}
      <div className="absolute flex flex-col items-center justify-center pointer-events-none select-none z-10">
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Pulsating back glow */}
          <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full animate-pulse-slow" />
          
          {/* Sacred geometry vector lines */}
          <svg className="absolute w-full h-full animate-spin-slow text-gold/25" viewBox="0 0 100 100">
            <polygon points="50,5 95,80 5,80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <polygon points="50,95 95,20 5,20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>

          {/* Meditating Silhouette SVG */}
          <svg className="w-24 h-24 text-gold/80 drop-shadow-[0_0_15px_rgba(229,169,60,0.4)] animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 4C13.1046 4 14 3.10457 14 2C14 0.89543 13.1046 0 12 0C10.8954 0 10 0.89543 10 2C10 3.10457 10.8954 4 12 4Z" fill="currentColor" />
            <path d="M12 5C8 5 6.5 7.5 6.5 10C6.5 12 8 13.5 8 14.5C8 15.5 6.5 16 5 16.5C3.5 17 2 18.5 2 20.5C2 22 4 24 12 24C20 24 22 22 22 20.5C22 18.5 20.5 17 19 16.5C17.5 16 16 15.5 16 14.5C16 13.5 17.5 12 17.5 10C17.5 7.5 16 5 12 5ZM12 8C12.5523 8 13 8.44772 13 9C13 9.55228 12.5523 10 12 10C11.4477 10 11 9.55228 11 9C11 8.44772 11.4477 8 12 8ZM12 11.5C13.3807 11.5 14.5 12.6193 14.5 14C14.5 15.3807 13.3807 16.5 12 16.5C10.6193 16.5 9.5 15.3807 9.5 14C9.5 12.6193 10.6193 11.5 12 11.5Z" />
          </svg>
        </div>
      </div>

      {/* Orbiting Nodes */}
      {nodes.map((node, i) => {
        // Compute x and y offsets using trigonometry based on angle
        const angleRad = (node.angle - 90) * (Math.PI / 180);
        const x = radius * Math.cos(angleRad);
        const y = radius * Math.sin(angleRad);
        
        const Icon = node.icon;
        const isActive = activeCategory === node.id;

        return (
          <motion.button
            key={node.id}
            id={`node-${node.id}`}
            onClick={() => interactive && onSelectCategory(node.id)}
            disabled={!interactive}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: 1, 
              scale: isActive ? 1.25 : 1, 
              x: x, 
              y: y 
            }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 15,
              delay: i * 0.08
            }}
            style={{ 
              left: "calc(50% - 22px)",
              top: "calc(50% - 22px)",
            }}
            className={`absolute w-11 h-11 rounded-full flex items-center justify-center z-20 transition-all duration-300 group ${
              interactive ? "cursor-pointer" : "cursor-default"
            } ${
              isActive 
                ? "bg-gradient-to-br from-gold-light via-gold to-gold-dark text-cosmic-bg ring-4 ring-amber-500/40 glow-gold" 
                : "bg-neutral-950/90 border border-white/10 text-gold-light/80 hover:text-white hover:border-gold hover:scale-110"
            }`}
            whileHover={interactive ? { scale: isActive ? 1.3 : 1.15 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            title={node.label}
          >
            {/* Pulsating border for active node */}
            {isActive && (
              <span className="absolute inset-0 rounded-full border border-amber-400 animate-ping opacity-75" />
            )}
            
            <Icon size={18} className="transition-all" />

            {/* Glowing Label Tooltip */}
            <span className={`absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full whitespace-nowrap transition-all ${
              isActive 
                ? "bg-amber-500/20 text-gold border border-amber-500/30 font-semibold" 
                : "bg-neutral-900/80 text-slate-400 border border-white/5 opacity-60 group-hover:opacity-100"
            }`}>
              {node.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
