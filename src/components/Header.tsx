import { Leaf, Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <header className="text-center mb-14 animate-fade-up">
      
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 rounded-full bg-green-600/10 backdrop-blur-sm border border-green-500/30">
        <Leaf className="w-5 h-5 text-green-600 animate-pulse-soft" />
        <span className="text-sm font-medium text-green-700 tracking-wide">
          AI-Powered Environmental Intelligence
        </span>
        <Sparkles className="w-4 h-4 text-emerald-500" />
      </div>

      {/* Title */}
      <h1 className="font-display font-bold leading-tight mb-4">
        <span className="block text-5xl sm:text-6xl lg:text-7xl text-green-900">
          Eco-Intel
        </span>
        <span className="block text-6xl sm:text-7xl lg:text-8xl gradient-text">
          AI
        </span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-3xl mx-auto text-lg sm:text-xl text-green-900/70 leading-relaxed">
        Upload agricultural waste images and receive
        <span className="text-green-700 font-semibold">
          {" "}instant AI-based insights{" "}
        </span>
        with composting guidance, sustainability rules, and farmer-focused recommendations.
      </p>

      {/* Decorative Divider */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-green-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse-soft" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-green-500/50" />
      </div>
    </header>
  );
};
