import { Brain, Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Advanced neural models trained on real agricultural waste data",
    glow: "from-green-400/20 to-green-600/10",
  },
  {
    icon: Zap,
    title: "Instant Classification",
    description: "Accurate waste identification in under two seconds",
    glow: "from-yellow-300/20 to-orange-400/10",
  },
  {
    icon: Shield,
    title: "High Accuracy",
    description: "98% accuracy with optimized deep learning models",
    glow: "from-blue-300/20 to-sky-400/10",
  },
  {
    icon: Globe,
    title: "Eco Impact",
    description: "Supports sustainable farming and waste reduction",
    glow: "from-emerald-300/20 to-green-400/10",
  },
];

export const FeatureCards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
      {features.map((feature, index) => (
        <div
          key={index}
          className="
            group relative overflow-hidden
            rounded-2xl p-5
            bg-white/70 backdrop-blur-md
            border border-green-300/40
            transition-all duration-500
            hover:-translate-y-2
            hover:shadow-[0_20px_50px_rgba(34,197,94,0.25)]
          "
        >
          {/* Glow background */}
          <div
            className={`
              absolute inset-0 opacity-0 group-hover:opacity-100
              bg-gradient-to-br ${feature.glow}
              transition-opacity duration-500
            `}
          />

          {/* Content */}
          <div className="relative z-10">
            <div
              className="
                w-11 h-11 flex items-center justify-center
                rounded-xl mb-4
                bg-green-600 text-white
                group-hover:scale-110 transition-transform
              "
            >
              <feature.icon className="w-5 h-5" />
            </div>

            <h3 className="text-[15px] font-semibold text-green-900 mb-1">
              {feature.title}
            </h3>

            <p className="text-xs text-green-800/70 leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
