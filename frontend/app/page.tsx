"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define an interface so TypeScript knows exactly what formData looks like
interface CarData {
  year: number;
  kmDriven: number;
  brand: string;
  modelType: string;
  fuelType: string;
  condition: string;
}

export default function CarDashboard() {
  const [formData, setFormData] = useState<CarData>({ 
    year: 2020, 
    kmDriven: 50000, 
    brand: "BMW",
    modelType: "Sedan",
    fuelType: "Petrol",
    condition: "Good"
  });
  
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (formData.year > 2026) {
      alert("Manufacturing year cannot be in the future!");
      return;
    }
    setLoading(true);
    
    setTimeout(async () => {
      try {
        const response = await fetch("https://car-api-backend-5u70.onrender.com/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        // Fixed Red Spot: Ensuring data.price exists before setting it
        if (data && typeof data.price === 'number') {
          setPrediction(data.price);
        }
      } catch (err) {
        alert("Backend Offline - Check Render status");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INPUTS */}
        <div className="lg:col-span-5 space-y-6">
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tighter">Auto<span className="text-blue-500">ML</span> Console</h1>
            <p className="text-zinc-500 text-sm">Enterprise Valuation Engine v3.0</p>
          </header>

          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Brand</label>
                <select 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 outline-none focus:ring-1 ring-blue-500 text-sm"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                >
                  <option>BMW</option>
                  <option>Audi</option>
                  <option>Mercedes</option>
                  <option>Toyota</option>
                  <option>Honda</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Body Type</label>
                <select 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 outline-none focus:ring-1 ring-blue-500 text-sm"
                  value={formData.modelType}
                  onChange={(e) => setFormData({...formData, modelType: e.target.value})}
                >
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>Hatchback</option>
                  <option>Luxury</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Year</label>
                <input 
                  type="number" 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 outline-none text-sm"
                  value={formData.year}
                  // Fixed Red Spot: parseFloat/parseInt for numeric inputs
                  onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">KM Driven</label>
                <input 
                  type="number" 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 outline-none text-sm"
                  value={formData.kmDriven}
                  // Fixed Red Spot: Number conversion
                  onChange={(e) => setFormData({...formData, kmDriven: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Fuel Type</label>
                <select 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 outline-none focus:ring-1 ring-blue-500 text-sm"
                  value={formData.fuelType}
                  onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                >
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>CNG</option>
                  <option>Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Condition</label>
                <select 
                  className={`w-full border rounded-xl p-3 outline-none text-sm ${formData.condition === 'Damaged' ? 'bg-red-900/20 border-red-800 text-red-200' : 'bg-zinc-800 border-zinc-700 text-white'}`}
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value})}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Damaged">Major Damage</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handlePredict}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-blue-900/20 mt-4"
            >
              {loading ? "Analyzing Parameters..." : "Calculate Valuation"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: RESULTS */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {!prediction && !loading ? (
              <div className="h-full border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex items-center justify-center text-zinc-600 italic">
                Awaiting vehicle parameters for tensor generation...
              </div>
            ) : loading ? (
              <div className="h-full bg-zinc-900/30 animate-pulse border border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-400 font-medium">Processing Data Points...</p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-2xl">
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Predicted Market Value</p>
                  <h2 className="text-5xl font-black text-white">
                    {/* Fixed Red Spot: Ensuring prediction is a number before using toLocaleString */}
                    ₹ {prediction?.toLocaleString('en-IN') ?? "0"}
                  </h2>
                  <div className="mt-4 flex gap-2">
                    <span className="bg-black/20 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter">Verified Logic</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${formData.condition === 'Damaged' ? 'bg-red-500/40' : 'bg-green-500/40'}`}>
                      {formData.condition} Status
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[1.5rem]">
                      <h4 className="text-zinc-500 text-[10px] font-bold uppercase mb-4">Valuation Factors</h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        The current estimate for this <span className="text-blue-400 font-bold">{formData.brand}</span> considers the <span className="text-blue-400">{formData.fuelType}</span> premium and <span className="text-blue-400">{formData.condition}</span> condition penalties.
                      </p>
                   </div>
                   <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[1.5rem] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-black text-blue-500">92%</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold">Accuracy Score</div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}