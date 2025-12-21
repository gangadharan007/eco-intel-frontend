export type WasteType = "organic" | "recyclable" | "hazardous";

interface Props {
  wasteType: WasteType;
  confidence: number;
}

export const ResultCard = ({ wasteType, confidence }: Props) => {
  return (
    <div className="bg-card rounded-xl p-6 text-center shadow-md">
      <h2 className="text-xl font-semibold mb-2">
        Waste Type: <span className="text-primary">{wasteType}</span>
      </h2>
      <p className="text-muted-foreground">
        Confidence: {confidence}%
      </p>
    </div>
  );
};
