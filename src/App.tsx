import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index"; // Module 1 page
import CarbonFootprint from "./pages/CarbonFootprint";
import ProfitEstimator from "./pages/ProfitEstimator";
import CropRecommendation from "./pages/CropRecommendation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/waste-ai" element={<Index />} />
        <Route path="/carbon-footprint" element={<CarbonFootprint />} />
        <Route path="/profit-estimator" element={<ProfitEstimator />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />} />
<Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
