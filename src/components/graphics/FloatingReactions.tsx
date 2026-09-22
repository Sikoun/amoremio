'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface FloatingItem {
  id: number;
  emoji: string;
  x: number; // percentage across screen 10-90%
  size: number; // size in px
  duration: number; // seconds
  delay: number; // seconds
  wobble: string;
}

interface ReactionContextType {
  triggerFloatingReaction: (emoji?: string, count?: number) => void;
}

const ReactionContext = createContext<ReactionContextType>({
  triggerFloatingReaction: () => {},
});

export const useFloatingReactions = () => useContext(ReactionContext);

export const ReactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<FloatingItem[]>([]);

  const triggerFloatingReaction = useCallback((emoji: string = '💕', count: number = 8) => {
    const newItems: FloatingItem[] = Array.from({ length: count }).map((_, i) => {
      const id = Date.now() + Math.random() + i;
      const x = 15 + Math.random() * 70; // 15% to 85% width
      const size = 20 + Math.random() * 20; // 20px - 40px
      const duration = 2.2 + Math.random() * 1.2; // 2.2s - 3.4s
      const delay = Math.random() * 0.4;
      const wobble = Math.random() > 0.5 ? 'animate-sway-left' : 'animate-sway-right';

      return { id, emoji, x, size, duration, delay, wobble };
    });

    setItems((prev) => [...prev, ...newItems]);

    // Clean up items after animation completes
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => !newItems.some((n) => n.id === item.id)));
    }, 4000);
  }, []);

  return (
    <ReactionContext.Provider value={{ triggerFloatingReaction }}>
      {children}
      {/* Screen-space floating container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="absolute bottom-6 animate-float-up opacity-0"
            style={{
              left: `${item.x}%`,
              fontSize: `${item.size}px`,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
            }}
          >
            <span className={`inline-block ${item.wobble}`}>{item.emoji}</span>
          </div>
        ))}
      </div>
    </ReactionContext.Provider>
  );
};
