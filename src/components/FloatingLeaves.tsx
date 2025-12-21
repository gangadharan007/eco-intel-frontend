import { useState } from "react";

interface Leaf {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

const generateLeaves = (): Leaf[] =>
  Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10,
    size: 16 + Math.random() * 24,
    rotation: Math.random() * 360,
  }));

export const FloatingLeaves = () => {
  // ✅ Lazy initialization (runs once, safe)
  const [leaves] = useState<Leaf[]>(() => generateLeaves());

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute animate-leaf text-[hsl(var(--eco-leaf))]/20"
          style={{
            left: `${leaf.x}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            fontSize: `${leaf.size}px`,
            transform: `rotate(${leaf.rotation}deg)`,
          }}
        >
          🍃
        </div>
      ))}
    </div>
  );
};
