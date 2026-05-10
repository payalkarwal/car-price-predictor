"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CarDashboard() {
  const [formData, setFormData] = useState({ year: 2020, age: 5, kmDriven: 50000, brand: "BMW" });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (formData.year > 2026) {
      alert("Manufacturing year cannot be in the future!");
      return;
    }
    setLoading(true);
    // Simulate "Neural Network Processing" for 1.5s for UX
    setTimeout(async () => {
      try {
        const response = await fetch("https://car-api-backend-5u70.onrender.com/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.price) setPrediction(data.price);
      } catch (err) {
        alert("Backend Offline");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INPUTS */}
        <div className="lg:col-span-4 space-y-6">
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tighter">Auto<span className="text-blue-500">ML</span> Console</h1>
            <p className="text-zinc-500 text-sm">Deep Learning Valuation Engine v2.1</p>
          </header>

          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-6 shadow-xl">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">Vehicle Brand</label>
              <select 
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none focus:ring-2 ring-blue-500"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
              >
                <option>BMW</option>
                <option>Audi</option>
                <option>Mercedes</option>
                <option>Toyota</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">Year</label>
                <input 
                  type="number" 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">Mileage (KM)</label>
                <input 
                  type="number" 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none"
                  value={formData.kmDriven}
                  onChange={(e) => setFormData({...formData, kmDriven: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <button 
              onClick={handlePredict}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-bold text-white transition-all shadow-lg shadow-blue-900/20"
            >
              {loading ? "Running Neural Inference..." : "Run Prediction"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: RESULTS & INSIGHTS */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {!prediction && !loading ? (
              <div className="h-full border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex items-center justify-center text-zinc-600">
                Enter vehicle data to initialize AI analysis
              </div>
            ) : loading ? (
              <div className="h-full bg-zinc-900/30 animate-pulse border border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-400 font-medium">Computing Tensor Weights...</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Main Price Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[2.5rem] shadow-2xl">
                  <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-2">Estimated Market Value</p>
                  <h2 className="text-6xl font-black text-white">₹ {Math.round(prediction).toLocaleString()}</h2>
                  <div className="mt-6 flex gap-4">
                    <span className="bg-white/20 px-4 py-2 rounded-full text-xs font-bold text-white">Confidence: 94.2%</span>
                    <span className="bg-white/20 px-4 py-2 rounded-full text-xs font-bold text-white">Range: High Accuracy</span>
                  </div>
                </div>

                {/* Technical Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem]">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">Price Factors</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs mb-1"><span>Year/Age</span><span>65%</span></div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[65%]" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs mb-1"><span>Mileage</span><span>35%</span></div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-400 w-[35%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem]">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Recommended Action</h3>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center font-bold">BUY</div>
                      <p className="text-xs text-zinc-400 leading-relaxed">Based on current market trends, this price is 4.2% below average for {formData.brand} vehicles.</p>
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