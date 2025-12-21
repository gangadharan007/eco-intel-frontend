import { AlertTriangle } from "lucide-react";

interface Props {
  confidence: number;
}

export const LowConfidenceWarning = ({ confidence }: Props) => {
  if (confidence >= 60) return null;

  return (
    <div className="glass-card border border-red-400/40 rounded-xl p-4 flex items-center gap-3">
      <AlertTriangle className="text-red-600 w-5 h-5" />
      <p className="text-sm text-red-700">
        Prediction confidence is low ({confidence}%).  
        Please upload a clearer image for better accuracy.
      </p>
    </div>
  );
};
