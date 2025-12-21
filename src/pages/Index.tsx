import { useState } from "react";
import { Header } from "../components/Header";
import { ImageUpload } from "../components/ImageUpload";
import { ResultCard } from "../components/ResultCard";
import type { WasteType } from "../components/ResultCard";
import { GuidanceCard } from "../components/GuidanceCard";
import { FloatingLeaves } from "../components/FloatingLeaves";
import { StatsBar } from "../components/StatsBar";
import { FeatureCards } from "../components/FeatureCards";
import { ExplanationCard } from "../components/ExplanationCard";
import { ConfidenceBar } from "../components/ConfidenceBar";

import heroBg from "../assets/hero-bg.jpg";

// ✅ Real ML imports
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

interface ManureGuidance {
  waste_name: string;
  compost_method: string;
  preparation_time: string;
  nutrients: string;
  suitable_crops: string;
}

interface PredictionResult {
  predicted_waste_type: WasteType;
  confidence: number; // percentage (0-100)
  explanation: string[];
  status: string;
  message: string;
  manure_guidance?: ManureGuidance[];
}

interface WasteTypeInfo {
  keywords: string[];
  color: string;
}

/**
 * Must match ResultCard's WasteType exactly:
 * export type WasteType = "organic" | "recyclable" | "hazardous";
 */
const SUPPORTED_WASTE_TYPES = ["organic", "recyclable", "hazardous"] as const;
type SupportedWasteType = (typeof SUPPORTED_WASTE_TYPES)[number];

// ✅ Use runtime Set so SUPPORTED_WASTE_TYPES is not “type-only”
const SUPPORTED_WASTE_TYPE_SET = new Set<SupportedWasteType>(SUPPORTED_WASTE_TYPES);

const WASTE_INFO: Record<SupportedWasteType, WasteTypeInfo> = {
  organic: {
    keywords: ["food", "vegetable", "fruit", "leaf", "plant", "peel", "scraps"],
    color: "green/brown",
  },
  recyclable: {
    keywords: ["bottle", "paper", "cardboard", "can", "packaging"],
    color: "mixed",
  },
  hazardous: {
    keywords: ["battery", "chemical", "paint", "pesticide", "medical"],
    color: "labeled/colored",
  },
};

// ✅ Global model cache (loads only once)
let mobilenetModel: mobilenet.MobileNet | null = null;
let mobilenetModelPromise: Promise<mobilenet.MobileNet> | null = null;

async function getMobileNetModel(): Promise<mobilenet.MobileNet> {
  if (mobilenetModel) return mobilenetModel;

  if (!mobilenetModelPromise) {
    mobilenetModelPromise = (async () => {
      try {
        await tf.ready();
        // Optional (faster on many devices):
        // await tf.setBackend("webgl");
        const m = await mobilenet.load();
        mobilenetModel = m;
        return m;
      } catch (e) {
        // allow retry if load fails
        mobilenetModelPromise = null;
        throw e;
      }
    })();
  }

  return mobilenetModelPromise;
}

function classifyImageToWaste(
  label: string,
  probability: number
): {
  type: SupportedWasteType;
  confidence: number; // 0..1
  reason: string;
  action: string;
} {
  const lower = label.toLowerCase();

  const organicKeywords = [
    "apple",
    "banana",
    "orange",
    "lemon",
    "potato",
    "carrot",
    "tomato",
    "onion",
    "garlic",
    "pepper",
    "fruit",
    "vegetable",
    "leaf",
    "plant",
    "peel",
    "food",
    "bread",
    "rice",
    "pasta",
  ];

  const hazardousKeywords = [
    "battery",
    "chemical",
    "medicine",
    "pill",
    "syringe",
    "needle",
    "paint",
    "solvent",
    "pesticide",
    "herbicide",
  ];

  // Organic
  if (probability > 0.15 && organicKeywords.some((kw) => lower.includes(kw))) {
    return {
      type: "organic",
      confidence: Math.min(1, probability * 0.95),
      reason: "Food/plant-based material detected from ML label.",
      action: "Compost it (45–60 days).",
    };
  }

  // Hazardous
  if (probability > 0.12 && hazardousKeywords.some((kw) => lower.includes(kw))) {
    return {
      type: "hazardous",
      confidence: Math.min(1, probability * 0.92),
      reason: "Potentially hazardous object detected from ML label.",
      action: "Dispose via authorized hazardous-waste facility.",
    };
  }

  // Default -> recyclable
  return {
    type: "recyclable",
    confidence: Math.min(1, probability * 0.88),
    reason: "Not confidently organic/hazardous → treat as recyclable.",
    action: "Segregate and recycle properly.",
  };
}

async function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(file);

  try {
    const img = new Image();
    img.src = url;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = 224;
    canvas.height = 224;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    ctx.drawImage(img, 0, 0, 224, 224);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function classifyWaste(fileParam: File): Promise<{
  top1: { class: SupportedWasteType; confidence: number }; // confidence 0..1
  explanations: string[];
  status: string;
  message: string;
  organic: boolean;
  manure: ManureGuidance;
}> {
  const model = await getMobileNetModel();
  const canvas = await fileToCanvas(fileParam);

  const fileSizeKb = Math.max(1, Math.round(fileParam.size / 1024));
  const fileName = fileParam.name || "uploaded-image";

  const preds = await model.classify(canvas, 5);
  if (preds.length === 0) throw new Error("No predictions returned by model");

  const top = preds[0];
  const mapped = classifyImageToWaste(top.className, top.probability);

  // ✅ Runtime safety + uses SUPPORTED_WASTE_TYPES at runtime (no-unused-vars fixed)
  if (!SUPPORTED_WASTE_TYPE_SET.has(mapped.type)) {
    throw new Error(
      `Unsupported waste type "${mapped.type}". Supported: ${SUPPORTED_WASTE_TYPES.join(", ")}`
    );
  }

  // ✅ Use WASTE_INFO at runtime (no-unused-vars fixed)
  const info = WASTE_INFO[mapped.type];

  const isOrganic = mapped.type === "organic";
  const confidencePct = Math.round(mapped.confidence * 100 * 10) / 10;

  const explanations: string[] = [
    `File: ${fileName} (${fileSizeKb} KB)`,
    `Top label: "${top.className}" (${Math.round(top.probability * 100)}%)`,
    `Mapped waste: ${mapped.type} (${confidencePct}%)`,
    `Reason: ${mapped.reason}`,
    `Expected look: ${info.color}; hints: ${info.keywords.slice(0, 3).join(", ")}`,
  ];

  const status = isOrganic ? "compostable" : mapped.type;

  const message = isOrganic
    ? "Organic waste detected — perfect for composting."
    : `${mapped.type.toUpperCase()} waste — ${mapped.action}`;

  return {
    top1: { class: mapped.type, confidence: mapped.confidence },
    explanations,
    status,
    message,
    organic: isOrganic,
    manure: {
      waste_name: "Kitchen/Garden Organic Waste",
      compost_method: "Aerated pile or vermicomposting",
      preparation_time: "45–60 days",
      nutrients: "NPK-rich compost (approx.)",
      suitable_crops: "Tomato, Chili, Brinjal, Onion, Leafy greens",
    },
  };
}

export default function Index() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const predictions = await classifyWaste(file);

      const finalResult: PredictionResult = {
        predicted_waste_type: predictions.top1.class, // ✅ exact match
        confidence: Math.round(predictions.top1.confidence * 100 * 10) / 10,
        explanation: predictions.explanations,
        status: predictions.status,
        message: predictions.message,
        manure_guidance: predictions.organic ? [predictions.manure] : undefined,
      };

      setResult(finalResult);
    } catch (err: unknown) {
      console.error("AI Analysis Error:", err);
      setError(err instanceof Error ? err.message : "Image analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white" />
      </div>

      <FloatingLeaves />
      <div className="fixed inset-0 pattern-dots pointer-events-none z-0 opacity-40" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        <Header />
        <StatsBar />
        <FeatureCards />

        <section className="glass-card p-8 rounded-2xl mt-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              🗑️ AI Waste Classifier
            </h2>
            <p className="text-xl text-green-700 max-w-2xl mx-auto">
              Upload waste image to get instant classification + composting guidance
            </p>
          </div>

          <ImageUpload
            onImageSelect={(f) => {
              setFile(f);
              setImage(URL.createObjectURL(f));
            }}
            selectedImage={image}
            onClear={handleClear}
          />

          {image && !result && !loading && (
            <div className="text-center mt-8">
              <button
                onClick={handleAnalyze}
                disabled={!file}
                className="
                  bg-gradient-to-r from-emerald-500 to-green-600
                  hover:from-emerald-600 hover:to-green-700
                  text-white px-12 py-4 rounded-2xl text-xl font-bold
                  shadow-2xl hover:shadow-eco-lg hover:scale-[1.05]
                  transition-all duration-300 disabled:opacity-50
                  border-4 border-emerald-200
                "
              >
                🤖 Analyze Waste (AI Powered)
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center mt-8 p-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
              <p className="text-lg font-semibold text-emerald-700 mt-4">
                🤖 AI is analyzing your image...
              </p>
              <p className="text-sm text-gray-500 mt-1">
                First run may take longer (model download).
              </p>
            </div>
          )}
        </section>

        {error && !loading && (
          <div className="mt-8 p-6 rounded-2xl bg-red-50 border-2 border-red-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-red-800 mb-2">
                  Analysis Failed
                </h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={handleClear}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-12 space-y-8">
            <ResultCard
              wasteType={result.predicted_waste_type}
              confidence={result.confidence}
            />

            <ConfidenceBar confidence={result.confidence} />

            <div className="glass-card p-6 rounded-2xl text-center">
              <div
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-lg font-bold ${
                  result.status === "compostable"
                    ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-300"
                    : result.status === "recyclable"
                    ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                    : result.status === "hazardous"
                    ? "bg-red-100 text-red-800 border-2 border-red-300"
                    : "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                }`}
              >
                {result.status.toUpperCase()}
              </div>
              <p className="mt-3 text-lg font-semibold text-gray-700">
                {result.message}
              </p>
            </div>

            {result.explanation.length > 0 && (
              <ExplanationCard explanation={result.explanation} />
            )}

            {result.predicted_waste_type === "organic" &&
              result.manure_guidance && (
                <GuidanceCard guidance={result.manure_guidance} />
              )}

            <div className="flex gap-4 justify-center pt-8 border-t border-gray-200">
              <button
                onClick={handleClear}
                className="
                  px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white
                  rounded-2xl font-semibold transition-all shadow-lg
                  hover:shadow-eco-lg hover:scale-[1.02]
                "
              >
                📸 New Image
              </button>
              <button
                onClick={() => window.print()}
                className="
                  px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white
                  rounded-2xl font-semibold transition-all shadow-lg
                  hover:shadow-eco-lg hover:scale-[1.02]
                "
              >
                🖨️ Print Report
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
