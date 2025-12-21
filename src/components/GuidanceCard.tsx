import {
  Leaf,
  Clock,
  Droplet,
  Sprout,
} from "lucide-react";

interface Guidance {
  waste_name: string;
  compost_method: string;
  preparation_time: string;
  nutrients: string;
  suitable_crops: string;
}

interface GuidanceCardProps {
  guidance: Guidance[];
}

export const GuidanceCard = ({ guidance }: GuidanceCardProps) => {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-display font-semibold text-green-900 mb-6">
        🌱 Organic Manure Guidance
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        {guidance.map((item, index) => (
          <div
            key={index}
            className="
              group relative overflow-hidden
              rounded-2xl p-6
              bg-white/75 backdrop-blur-md
              border border-green-300/40
              transition-all duration-500
              hover:-translate-y-1
              hover:shadow-[0_12px_30px_rgba(34,197,94,0.25)]
            "
          >
            {/* Soft gradient glow */}
            <div className="
              absolute inset-0 opacity-0 group-hover:opacity-100
              bg-gradient-to-br from-green-200/30 to-green-500/10
              transition-opacity duration-500
            " />

            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                {item.waste_name}
              </h3>

              <div className="space-y-3 text-sm text-green-900/80">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span>
                    <strong>Method:</strong> {item.compost_method}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span>
                    <strong>Time:</strong> {item.preparation_time}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-green-600" />
                  <span>
                    <strong>Nutrients:</strong> {item.nutrients}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-green-600" />
                  <span>
                    <strong>Suitable Crops:</strong> {item.suitable_crops}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
