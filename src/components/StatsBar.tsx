import { Leaf, Recycle, TrendingUp, Users } from "lucide-react";

const stats = [
  { icon: Leaf, value: "50K+", label: "Waste Classified", color: "text-eco-leaf" },
  { icon: Recycle, value: "85%", label: "Recycling Rate", color: "text-eco-sky" },
  { icon: TrendingUp, value: "40%", label: "Less Landfill", color: "text-accent" },
  { icon: Users, value: "10K+", label: "Farmers Helped", color: "text-eco-sun" },
];

export const StatsBar = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-eco-lg hover:-translate-y-1"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
