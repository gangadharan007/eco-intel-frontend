import { Info, CheckCircle } from "lucide-react";

interface Props {
  explanation: string[];
}

export const ExplanationCard = ({ explanation }: Props) => {
  if (!explanation || explanation.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50 animate-fade-up">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Why this classification?
        </h3>
      </div>

      {/* Explanation Points */}
      <ul className="space-y-3 text-sm text-muted-foreground">
        {explanation.map((point, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-eco-leaf mt-0.5 flex-shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
