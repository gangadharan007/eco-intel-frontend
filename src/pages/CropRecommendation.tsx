import { useState } from "react";
import { FloatingLeaves } from "../components/FloatingLeaves";
import { Header } from "../components/Header";
import { Search, ThermometerSun } from "lucide-react";

interface CropResult {
  temperature: number;
  rainfall: number;
  humidity: number;
  weather_icon: string;
  weather_desc: string;
  recommended_crops: string[];
  explanation: string[];
}

export default function CropRecommendation() {
  const [location, setLocation] = useState("");
  const [soil, setSoil] = useState("");
  const [season, setSeason] = useState("");
  const [result, setResult] = useState<CropResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);

  // ✅ FIXED: Direct Vercel backend URL (Railway DB integration)
  const API_BASE = "https://eco-intel-backend-e0cgnfxpj-gangadharans-projects-b991475d.vercel.app";

  /* 📍 MULTIPLE LOCATION OPTIONS */
  const detectLocation = async () => {
    setDetecting(true);

    // Option 1: Try IP-based location first (no permission needed)
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      
      if (data.city) {
        setLocation(data.city);
        alert(`📍 Detected: ${data.city}, ${data.region}`);
        setDetecting(false);
        return;
      }
    } catch {
      // Fallback to browser geolocation
    }

    // Option 2: Browser geolocation
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      setDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        
        // Use free Nominatim API (no key needed)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          
          const city = data.address?.city || 
                      data.address?.town || 
                      data.address?.village || 
                      data.display_name.split(',')[0];
          
          setLocation(city || "Your City");
        } catch {
          setLocation("Your City");
        } finally {
          setDetecting(false);
        }
      },
      () => {
        alert("Location access denied. Enter city manually.");
        setDetecting(false);
      }
    );
  };

  /* 🌾 FETCH CROPS - ✅ FIXED WITH VERCEL BACKEND + RAILWAY DB */
  const fetchCrops = async () => {
    if (!location.trim() || !soil || !season) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // ✅ FIXED: Correct Vercel endpoint + saves to Railway DB
      const res = await fetch(`${API_BASE}/api/crop-recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          location: location.trim(), 
          soil, 
          season 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch recommendation");
      }

      const data: CropResult = await res.json();
      setResult(data);
      
      // ✅ SUCCESS: Data saved to Railway DB automatically
      console.log("✅ Crop recommendation saved to Railway DB:", data);
      
    } catch (err: unknown) {
      console.error("Crop API Error:", err);
      if (err instanceof Error) {
        alert(`Failed: ${err.message}`);
      } else {
        alert("Network error - check backend is running");
      }
    } finally {
      setLoading(false);
    }
  };

  // Popular Indian cities for quick selection
  const popularCities = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", 
    "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Patna"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden px-4 py-10">
      <FloatingLeaves />
      <div className="fixed inset-0 pattern-dots opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <Header />

        <div className="glass-card rounded-3xl p-8 mt-8 eco-shadow-lg animate-fade-up">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
            🌾 Weather-Based Crop Recommendation
          </h2>

          {/* 📍 Location Section */}
          <div className="space-y-3 mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-200">
            <label className="text-lg font-semibold text-blue-800 block text-center">
              📍 Enter Your Location
            </label>
            
            {/* Location Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Chennai, Mumbai, Bangalore"
                className="w-full pl-10 p-3 rounded-xl border border-border focus:ring-2 focus:ring-blue-400 outline-none bg-white/80"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={detectLocation}
                disabled={detecting}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
              >
                {detecting ? "🔍 Detecting..." : "📍 Auto Detect"}
              </button>
              
              <select 
                onChange={(e) => setLocation(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Popular Cities</option>
                {popularCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Soil Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-green-700 block">
              🏞️ Soil Type
            </label>
            <select
              value={soil}
              onChange={(e) => setSoil(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-white/80 focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select soil type</option>
              <option value="loamy">🌾 Loamy (Most crops)</option>
              <option value="sandy">🏜️ Sandy (Groundnut, Millets)</option>
              <option value="clay">💧 Clay (Rice, Sugarcane)</option>
            </select>
          </div>

          {/* Season */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-orange-700 block">
              📅 Season
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-white/80 focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Select season</option>
              <option value="kharif">🌧️ Kharif (Jun-Oct, Rainy)</option>
              <option value="rabi">❄️ Rabi (Nov-Apr, Winter)</option>
              <option value="summer">☀️ Summer (Mar-May)</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            onClick={fetchCrops}
            disabled={loading || !location || !soil || !season}
            className="
              w-full mt-6
              bg-gradient-to-r from-green-700 to-emerald-600
              text-white py-4 rounded-xl
              text-lg font-semibold shadow-lg
              hover:scale-[1.02] hover:shadow-2xl transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "🌤️ Analyzing Weather & Saving..." : "🚀 Get Crop Recommendations"}
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <div className="mt-8 glass-card rounded-3xl p-8 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={`https://openweathermap.org/img/wn/${result.weather_icon}@2x.png`}
                  alt="weather"
                  className="w-20 h-20 shadow-lg"
                />
                <div>
                  <p className="font-bold text-xl capitalize">{result.weather_desc}</p>
                  <p className="text-2xl font-black text-green-700">
                    🌡 {result.temperature}°C
                  </p>
                  <p className="text-lg">
                    🌧️ {result.rainfall}mm | 💧 {result.humidity}%
                  </p>
                </div>
              </div>
              <ThermometerSun className="w-12 h-12 text-orange-500" />
            </div>

            <div className="text-center mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-2xl">
              <p className="text-xl font-bold text-green-800">
                ✅ SAVED TO RAILWAY DATABASE
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-xl mb-4 text-green-800 flex items-center gap-2">
                  🌾 Recommended Crops
                </h4>
                <div className="space-y-2">
                  {result.recommended_crops.map((crop, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-green-100/50 rounded-xl border-l-4 border-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="font-semibold">{crop}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xl mb-4 text-blue-800 flex items-center gap-2">
                  ❓ Why These Crops?
                </h4>
                <div className="space-y-2">
                  {result.explanation.map((reason, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl border-l-4 border-blue-400">
                      <span className="font-mono text-sm bg-blue-200 px-2 py-1 rounded-full text-blue-800">#{i+1}</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 🗺️ MAP */}
            <div className="mt-8 rounded-2xl overflow-hidden border-2 border-green-200 shadow-2xl">
              <iframe
                title="location map"
                width="100%"
                height="300"
                src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
