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

// Real ML imports (MobileNet inference)
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

  minerals?: string[];
  manure_guidance?: ManureGuidance[];
}

// ✅ FIX: type-only union (removes unused runtime const, fixes eslint warning) [web:606]
type SupportedWasteType = "organic" | "recyclable" | "hazardous";

const ORGANIC_MINERALS = [
  "N (Nitrogen)",
  "P (Phosphorus)",
  "K (Potassium)",
  "Ca (Calcium)",
  "Mg (Magnesium)",
  "S (Sulfur)",
  "Fe (Iron)",
  "Zn (Zinc)",
  "Mn (Manganese)",
  "Cu (Copper)",
];

// Global model cache
let mobilenetModel: mobilenet.MobileNet | null = null;
let mobilenetModelPromise: Promise<mobilenet.MobileNet> | null = null;

async function getMobileNetModel(): Promise<mobilenet.MobileNet> {
  if (mobilenetModel) return mobilenetModel;

  if (!mobilenetModelPromise) {
    mobilenetModelPromise = (async () => {
      await tf.ready();
      const m = await mobilenet.load();
      mobilenetModel = m;
      return m;
    })();
  }

  return mobilenetModelPromise;
}

function containsKeyword(label: string, keywords: string[]) {
  const lower = label.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

const ORGANIC_KEYWORDS = [
  "banana",
  "apple",
  "orange",
  "lemon",
  "potato",
  "carrot",
  "tomato",
  "vegetable",
  "fruit",
  "leaf",
  "plant",
  "food",
  "peel",
  "bread",
  "rice",
];

const HAZARDOUS_KEYWORDS = [
  "battery",
  "chemical",
  "medicine",
  "pill",
  "syringe",
  "needle",
  "paint",
  "pesticide",
  "herbicide",
  "solvent",
];

/**
 * Force exactly one of: organic | recyclable | hazardous
 * Uses top-5 mobilenet predictions
 */
function decideWasteType(
  preds: Array<{ className: string; probability: number }>
): { type: SupportedWasteType; confidence: number; reason: string } {
  const top = preds[0];

  const organicScore = preds
    .filter((p) => p.probability >= 0.08 && containsKeyword(p.className, ORGANIC_KEYWORDS))
    .reduce((sum, p) => sum + p.probability, 0);

  const hazardousScore = preds
    .filter((p) => p.probability >= 0.08 && containsKeyword(p.className, HAZARDOUS_KEYWORDS))
    .reduce((sum, p) => sum + p.probability, 0);

  if (hazardousScore >= 0.12) {
    return {
      type: "hazardous",
      confidence: Math.min(1, 0.6 * hazardousScore + 0.4 * top.probability),
      reason: "Matched hazardous keywords in top predictions.",
    };
  }

  if (organicScore >= 0.12) {
    return {
      type: "organic",
      confidence: Math.min(1, 0.6 * organicScore + 0.4 * top.probability),
      reason: "Matched organic keywords in top predictions.",
    };
  }

  return {
    type: "recyclable",
    confidence: Math.min(1, 0.7 * top.probability + 0.3 * 0.5),
    reason: "No organic/hazardous signal → classified as recyclable.",
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

async function classifyWaste(
  fileParam: File
): Promise<{
  top1: { class: SupportedWasteType; confidence: number }; // 0..1
  explanations: string[];
  status: string;
  message: string;
  organic: boolean;
  minerals?: string[];
  manure: ManureGuidance;
}> {
  const model = await getMobileNetModel();
  const canvas = await fileToCanvas(fileParam);

  const preds = await model.classify(canvas, 5);
  if (preds.length === 0) throw new Error("No predictions returned by model");

  const decided = decideWasteType(preds);
  const isOrganic = decided.type === "organic";

  const confidencePct = Math.round(decided.confidence * 100 * 10) / 10;

  const status = isOrganic ? "compostable" : decided.type;

  const message =
    decided.type === "organic"
      ? `ORGANIC waste detected. Minerals after composting: ${ORGANIC_MINERALS.join(", ")}.`
      : decided.type === "hazardous"
      ? "HAZARDOUS waste detected. Do not compost; dispose safely."
      : "RECYCLABLE waste detected. Segregate and send to recycling.";

  const explanations: string[] = [
    `Waste type: ${decided.type} (${confidencePct}%)`,
    `Decision: ${decided.reason}`,
    `Top-3 model guesses: ${preds
      .slice(0, 3)
      .map((p) => `${p.className} (${Math.round(p.probability * 100)}%)`)
      .join(" | ")}`,
  ];

  return {
    top1: { class: decided.type, confidence: decided.confidence },
    explanations,
    status,
    message,
    organic: isOrganic,
    minerals: isOrganic ? ORGANIC_MINERALS : undefined,
    manure: {
      waste_name: "Kitchen/Garden Organic Waste",
      compost_method: "Aerated pile or vermicomposting",
      preparation_time: "45–60 days",
      nutrients: "NPK + secondary and micronutrients (varies by waste).",
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
        predicted_waste_type: predictions.top1.class,
        confidence: Math.round(predictions.top1.confidence * 100 * 10) / 10,
        explanation: predictions.explanations,
        status: predictions.status,
        message: predictions.message,
        minerals: predictions.minerals,
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
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
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
              <p className="text-sm text-gray-500 mt-1">First run may take longer (model download).</p>
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
                <h3 className="font-bold text-xl text-red-800 mb-2">Analysis Failed</h3>
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
            <ResultCard wasteType={result.predicted_waste_type} confidence={result.confidence} />
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

              <p className="mt-3 text-lg font-semibold text-gray-700">{result.message}</p>

              {result.predicted_waste_type === "organic" && result.minerals && (
                <p className="mt-2 text-sm text-gray-600">
                  Minerals/nutrients after composting: {result.minerals.join(", ")}
                </p>
              )}
            </div>

            {result.explanation.length > 0 && <ExplanationCard explanation={result.explanation} />}

            {result.predicted_waste_type === "organic" && result.manure_guidance && (
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
