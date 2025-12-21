import { useState } from "react";
import { Header } from "../components/Header";
import { FloatingLeaves } from "../components/FloatingLeaves";
import { Leaf, Zap } from "lucide-react";
import { API_BASE } from "../config";  // ✅ FIXED: Relative import for pages/ folder

interface CarbonResult {
  total_co2: number;
  status: string;
  suggestions: string[];
  fertilizer_co2?: number;
  diesel_co2?: number;
  electricity_co2?: number;
}

export default function CarbonFootprint() {
  const [fertilizer, setFertilizer] = useState<number>(0);
  const [diesel, setDiesel] = useState<number>(0);
  const [electricity, setElectricity] = useState<number>(0);
  const [result, setResult] = useState<CarbonResult | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    // ✅ VALIDATION
    if (fertilizer === 0 && diesel === 0 && electricity === 0) {
      alert("Please enter at least one value");
      return;
    }

    try {
      setLoading(true);

      // ✅ FIXED: Uses API_BASE from config (relative path works)
      const res = await fetch(`${API_BASE}/api/carbon-footprint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fertilizer,
          diesel,
          electricity,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data: CarbonResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      console.error("Carbon API Error:", err);
      if (err instanceof Error) {
        alert(`Failed: ${err.message}`);
      } else {
        alert("Network error - check backend is running");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <FloatingLeaves />
      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        <Header />

        <section className="glass-card rounded-3xl p-8 mt-8 shadow-eco-lg">
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="text-green-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-green-700">
              Carbon Footprint Calculator
            </h2>
          </div>

          {/* ✅ LABELED INPUTS */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🧪 Fertilizer Used
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g. 50 (kg total)"
                className="w-full p-3 rounded-xl border border-border bg-white/80 focus:ring-2 focus:ring-green-400 outline-none"
                value={fertilizer}
                onChange={(e) => setFertilizer(Number(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">kg of chemical fertilizer</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ⛽ Diesel Consumed
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g. 20 (liters)"
                className="w-full p-3 rounded-xl border border-border bg-white/80 focus:ring-2 focus:ring-green-400 outline-none"
                value={diesel}
                onChange={(e) => setDiesel(Number(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">liters for tractor/pump</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ⚡ Electricity Used
              </label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 150 (kWh units)"
                className="w-full p-3 rounded-xl border border-border bg-white/80 focus:ring-2 focus:ring-green-400 outline-none"
                value={electricity}
                onChange={(e) => setElectricity(Number(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">kWh for pump/irrigation</p>
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={loading}
            className="
              mt-6 w-full flex items-center justify-center gap-2
              px-6 py-4 rounded-xl text-lg font-semibold
              bg-gradient-to-r from-green-600 to-emerald-500
              text-white hover:scale-[1.02] hover:shadow-2xl transition-all
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            <Zap className="w-5 h-5" />
            {loading ? "🌍 Calculating..." : "Calculate Carbon Footprint"}
          </button>

          {/* ✅ ENHANCED RESULTS */}
          {result && (
            <div className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 shadow-2xl">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${
                  result.status === "Low" ? "bg-green-100 text-green-800 border-2 border-green-300" :
                  result.status === "Medium" ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300" :
                  "bg-red-100 text-red-800 border-2 border-red-300"
                }`}>
                  🌍 {result.status} EMISSIONS
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white/70 rounded-xl text-center">
                  <p className="text-3xl font-black text-red-600">{result.total_co2}</p>
                  <p className="text-sm uppercase tracking-wide text-gray-600">Total CO₂</p>
                  <p className="text-xs text-red-600 font-semibold">kg emitted</p>
                </div>
                {result.fertilizer_co2 && (
                  <div className="p-4 bg-white/70 rounded-xl text-center">
                    <p className="text-xl font-bold text-green-700">{result.fertilizer_co2}</p>
                    <p className="text-xs uppercase tracking-wide text-gray-600">Fertilizer</p>
                  </div>
                )}
                {result.diesel_co2 && (
                  <div className="p-4 bg-white/70 rounded-xl text-center">
                    <p className="text-xl font-bold text-orange-700">{result.diesel_co2}</p>
                    <p className="text-xs uppercase tracking-wide text-gray-600">Diesel</p>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-800">
                    💡 Reduction Suggestions
                  </h4>
                  <ul className="space-y-2 list-none">
                    {result.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg border-l-4 border-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
