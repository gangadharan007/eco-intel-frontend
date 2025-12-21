import { useState } from "react";
import { Header } from "../components/Header";
import { FloatingLeaves } from "../components/FloatingLeaves";

interface ProfitResult {
  total_cost: number;
  total_income: number;
  profit: number;
  status: string;
}

export default function ProfitEstimator() {
  const [seedCost, setSeedCost] = useState<number>(0);
  const [fertilizerCost, setFertilizerCost] = useState<number>(0);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [waterCost, setWaterCost] = useState<number>(0);
  const [expectedIncome, setExpectedIncome] = useState<number>(0);

  const [result, setResult] = useState<ProfitResult | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ FIXED: Direct Vercel backend URL (Railway DB integration)
  const API_BASE = "https://eco-intel-backend-e0cgnfxpj-gangadharans-projects-b991475d.vercel.app";

  const calculateProfit = async () => {
    if (!seedCost && !fertilizerCost && !laborCost && !waterCost && !expectedIncome) {
      alert("Please enter some values");
      return;
    }

    setLoading(true);

    try {
      // ✅ FIXED: Correct Vercel endpoint + saves to Railway DB
      const res = await fetch(`${API_BASE}/api/profit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seedCost,
          fertilizerCost,
          laborCost,
          waterCost,
          expectedIncome,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to calculate profit");
      }

      const data: ProfitResult = await res.json();
      setResult(data);
      
      // ✅ SUCCESS: Data saved to Railway DB automatically
      console.log("✅ Profit analysis saved to Railway DB:", data);
      
    } catch (err: unknown) {
      console.error("Profit API Error:", err);
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background pattern */}
      <div className="fixed inset-0 pattern-dots opacity-40 z-0" />

      {/* Floating leaves */}
      <FloatingLeaves />

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        <Header />

        {/* Main Card */}
        <section className="glass-card rounded-3xl p-10 mt-10 space-y-6">
          <h2 className="text-3xl font-bold text-green-800 text-center">
            🌾 Farmer Cost & Profit Estimator
          </h2>

          <p className="text-center text-green-700/70">
            Enter your farming expenses and expected income to estimate profit or loss
          </p>

          {/* INPUT GRID WITH CLEAR PLACEHOLDERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {/* SEED COST */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-green-700 block mb-1">
                🌱 Seed Cost
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 5000 (₹ per acre)"
                className="input-box p-3 rounded-xl border border-border bg-white/80 focus:ring-2 focus:ring-green-400 outline-none w-full"
                value={seedCost}
                onChange={(e) => setSeedCost(Number(e.target.value) || 0)}
              />
              <p className="text-xs text-green-600 mt-1">Typical: ₹3,000 - ₹10,000/acre</p>
            </div>

            {/* FERTILIZER COST */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-green-700 block mb-1">
                🧪 Fertilizer Cost
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 3000 (₹ total)"
                className="input-box p-3 rounded-xl border border-border bg-white/80 focus:ring-2 focus:ring-green-400 outline-none w-full"
                value={fertilizerCost}
                onChange={(e) => setFertilizerCost(Number(e.target.value) || 0)}
              />
              <p className="text-xs text-green-600 mt-1">Typical: ₹2,000 - ₹8,000/season</p>
            </div>

            {/* LABOR COST */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-green-700 block mb-1">
                👷 Labor Cost
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 15000 (₹ total wages)"
                className="input-box p-3 rounded-xl border border-border bg-white/80 focus:ring-2 focus:ring-green-400 outline-none w-full"
                value={laborCost}
                onChange={(e) => setLaborCost(Number(e.target.value) || 0)}
              />
              <p className="text-xs text-green-600 mt-1">Typical: ₹10,000 - ₹30,000/season</p>
            </div>

            {/* WATER COST */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-green-700 block mb-1">
                💧 Water/Irrigation
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 2500 (₹ pump/electricity)"
                className="input-box p-3 rounded-xl border border-border bg-white/80 focus:ring-2 focus:ring-green-400 outline-none w-full"
                value={waterCost}
                onChange={(e) => setWaterCost(Number(e.target.value) || 0)}
              />
              <p className="text-xs text-green-600 mt-1">Typical: ₹1,500 - ₹5,000/season</p>
            </div>

            {/* EXPECTED INCOME */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-semibold text-emerald-700 block mb-1">
                💰 Expected Income
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 35000 (₹ total harvest sale)"
                className="input-box p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 focus:ring-2 focus:ring-emerald-400 outline-none w-full"
                value={expectedIncome}
                onChange={(e) => setExpectedIncome(Number(e.target.value) || 0)}
              />
              <p className="text-xs text-emerald-600 mt-1">
                Total expected revenue from crop sale (₹ per acre/season)
              </p>
            </div>
          </div>

          {/* BUTTON */}
          <div className="text-center pt-6">
            <button
              onClick={calculateProfit}
              disabled={loading}
              className="
                bg-gradient-to-r from-green-700 to-emerald-600
                hover:from-green-800 hover:to-emerald-700
                transition-all duration-200
                text-white px-10 py-3 rounded-xl text-lg font-semibold shadow-lg
                hover:scale-[1.02] hover:shadow-eco-lg
                disabled:opacity-60 disabled:cursor-not-allowed
                disabled:hover:scale-100
              "
            >
              {loading ? "📊 Calculating & Saving..." : "💰 Calculate Profit"}
            </button>
          </div>

          {/* RESULT */}
          {result && (
            <div className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-eco-lg animate-fade-up">
              {/* ✅ SAVED TO DB Badge */}
              <div className="text-center mb-6 p-4 bg-emerald-100 border-2 border-emerald-200 rounded-2xl">
                <p className="text-lg font-bold text-emerald-800">
                  ✅ PROFIT ANALYSIS SAVED TO RAILWAY DATABASE
                </p>
              </div>

              <div className="text-center mb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                  result.profit >= 0 
                    ? "bg-green-100 text-green-800 border-2 border-green-300" 
                    : "bg-red-100 text-red-800 border-2 border-red-300"
                }`}>
                  {result.profit >= 0 ? "✅ PROFIT" : "❌ LOSS"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <p className="text-2xl font-bold text-green-700">₹{result.total_cost.toLocaleString()}</p>
                  <p className="text-sm text-green-600 uppercase tracking-wide">Total Cost</p>
                </div>

                <div className="p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <p className="text-2xl font-bold text-emerald-700">₹{result.total_income.toLocaleString()}</p>
                  <p className="text-sm text-emerald-600 uppercase tracking-wide">Total Income</p>
                </div>

                <div className={`p-4 rounded-xl backdrop-blur-sm ${
                  result.profit >= 0 
                    ? "bg-green-100/80 border-2 border-green-300" 
                    : "bg-red-100/80 border-2 border-red-300"
                }`}>
                  <p className={`text-2xl font-bold ${
                    result.profit >= 0 ? "text-green-700" : "text-red-600"
                  }`}>
                    ₹{result.profit.toLocaleString()}
                  </p>
                  <p className="text-sm uppercase tracking-wide font-semibold">
                    {result.status}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
