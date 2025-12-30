import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { FloatingLeaves } from "../components/FloatingLeaves";
import { StatsBar } from "../components/StatsBar";
import { Leaf, Zap, TrendingUp, CloudSun, Database } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Floating animation */}
      <FloatingLeaves />

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <Header />

        <StatsBar />

        {/* 🚀 DATABASE SAVING BADGE */}
        <div className="text-center mb-12 p-6 bg-gradient-to-r from-emerald-100 to-green-100 border-4 border-emerald-300 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Database className="w-8 h-8 text-emerald-600" />
            <h2 className="text-2xl font-bold text-emerald-800">
              ✅ ALL DATA SAVED TO CLOUD DATABASE
            </h2>
          </div>
          <p className="text-lg text-emerald-700 font-semibold">
            Your calculations are automatically stored in Railway MySQL 🚀
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-12">
          {/* Module 1: Waste AI */}
          <div
            onClick={() => handleNavigate("/waste-ai")}
            className="group glass-card p-8 rounded-3xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 border-2 border-emerald-200 hover:border-emerald-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-emerald-500/20 group-hover:bg-emerald-500/40 rounded-2xl flex items-center justify-center p-4 transition-all duration-300">
                <Leaf className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-800 group-hover:text-emerald-700 mb-2">
                  AI Waste Classifier
                </h3>
                <p className="text-green-700 font-semibold text-lg flex items-center gap-1">
                  Module 1 <Database className="w-4 h-4 text-emerald-500" />
                </p>
              </div>
            </div>
            <p className="text-green-700 leading-relaxed group-hover:text-emerald-800">
              Upload waste images → Instant classification (Organic/Recyclable/Hazardous) + composting guide with NPK nutrients
            </p>
          </div>

          {/* Module 2: Carbon Footprint */}
          <div
            onClick={() => handleNavigate("/Carbon-footprint")}
            className="group glass-card p-8 rounded-3xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 border-2 border-orange-200 hover:border-orange-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-orange-500/20 group-hover:bg-orange-500/40 rounded-2xl flex items-center justify-center p-4 transition-all duration-300">
                <Zap className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-orange-800 group-hover:text-orange-700 mb-2">
                  Carbon Calculator
                </h3>
                <p className="text-orange-700 font-semibold text-lg flex items-center gap-1">
                  Module 2 <Database className="w-4 h-4 text-orange-500" />
                </p>
              </div>
            </div>
            <p className="text-orange-700 leading-relaxed group-hover:text-orange-800">
              Calculate CO₂ emissions from fertilizer, diesel, electricity → Get reduction tips + emission status
            </p>
          </div>

          {/* Module 3: Profit Estimator */}
          <div
            onClick={() => handleNavigate("/profit-estimator")}
            className="group glass-card p-8 rounded-3xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-500/20 group-hover:bg-blue-500/40 rounded-2xl flex items-center justify-center p-4 transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-800 group-hover:text-blue-700 mb-2">
                  Profit Calculator
                </h3>
                <p className="text-blue-700 font-semibold text-lg flex items-center gap-1">
                  Module 3 <Database className="w-4 h-4 text-blue-500" />
                </p>
              </div>
            </div>
            <p className="text-blue-700 leading-relaxed group-hover:text-blue-800">
              Seeds + Labor + Fertilizer costs vs expected income → Exact profit/loss before planting
            </p>
          </div>

          {/* Module 4: Crop Recommendation */}
          <div
            onClick={() => handleNavigate("/crop-recommendation")}
            className="group glass-card p-8 rounded-3xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-purple-500/20 group-hover:bg-purple-500/40 rounded-2xl flex items-center justify-center p-4 transition-all duration-300">
                <CloudSun className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-800 group-hover:text-purple-700 mb-2">
                  Smart Crops
                </h3>
                <p className="text-purple-700 font-semibold text-lg flex items-center gap-1">
                  Module 4 <Database className="w-4 h-4 text-purple-500" />
                </p>
              </div>
            </div>
            <p className="text-purple-700 leading-relaxed group-hover:text-purple-800">
              Location + Soil + Season + Live weather → Perfect crop recommendations with explanations
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Ready to Start Farming Smarter? 🚜
          </h2>
          <p className="text-xl text-green-700 mb-8 max-w-2xl mx-auto">
            Choose any module above to optimize your farm operations today! All data automatically saved to cloud database 📊
          </p>
        </div>
      </main>
    </div>
  );
}
