interface Props {
  confidence: number;
}

export const ConfidenceBar = ({ confidence }: Props) => {
  const getColor = () => {
    if (confidence >= 80) return "bg-green-600";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getLabel = () => {
    if (confidence >= 80) return "High Confidence";
    if (confidence >= 60) return "Medium Confidence";
    return "Low Confidence";
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          Prediction Confidence
        </span>
        <span className="text-sm font-semibold">
          {confidence}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-700`}
          style={{ width: `${confidence}%` }}
        />
      </div>

      {/* Label */}
      <p className="mt-2 text-sm text-muted-foreground">
        {getLabel()}
      </p>
    </div>
  );
};
