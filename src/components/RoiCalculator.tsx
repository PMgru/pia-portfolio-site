'use client';
import { useState } from 'react';
import { Calculator, ArrowRight, TrendingUp, Sparkles, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RoiCalculator() {
  const [traffic, setTraffic] = useState<number>(10000);
  const [conversion, setConversion] = useState<number>(1.5);
  const [aov, setAov] = useState<number>(50);
  const [industry, setIndustry] = useState<string>('Ecommerce');
  const [results, setResults] = useState<any>(null);

  const calculateROI = (e: React.FormEvent) => {
    e.preventDefault();

    // Math Calculations
    // Current Baseline
    const currentRevenue = traffic * (conversion / 100) * aov;

    // Projected Stats (Using Gloria Tech 340% traffic growth multiplier as default base)
    let trafficMultiplier = 3.4;
    let conversionImprovement = 0.5; // +50% relative conversion lift

    if (industry === 'SaaS') {
      trafficMultiplier = 2.8;
      conversionImprovement = 0.6;
    } else if (industry === 'LeadGen') {
      trafficMultiplier = 3.0;
      conversionImprovement = 0.4;
    }

    const projectedTraffic = Math.round(traffic * trafficMultiplier);
    const projectedConversion = Math.min(10, +(conversion * (1 + conversionImprovement)).toFixed(2));
    const projectedRevenue = projectedTraffic * (projectedConversion / 100) * aov;
    const revenueIncrease = Math.round(projectedRevenue - currentRevenue);
    
    // Estimated ROI based on Pial's typical monthly retainer (e.g. $1,500/mo over 6 months = $9,000)
    const investment = 9000;
    const roiPercentage = Math.round((revenueIncrease / investment) * 100);

    setResults({
      projectedTraffic,
      projectedConversion,
      projectedRevenue: Math.round(projectedRevenue),
      revenueIncrease,
      roiPercentage
    });

    // Fire success confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#B76E79', '#E63946', '#F4C27F']
    });
  };

  return (
    <section id="calculator" className="py-24 bg-[#0A0A0F] relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[#B76E79] opacity-[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 z-10 relative">
        
        {/* Title Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-headings mb-4">
            Calculate Your Growth Potential
          </h2>
          <p className="text-textSecondary dark:text-[#9A8F95] max-w-lg mx-auto">
            See exactly how AI-powered traffic expansion and conversion lifts translate directly into pipeline revenue.
          </p>
        </div>

        {/* Calculator layout */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Card (7 columns) */}
          <form 
            onSubmit={calculateROI}
            className="md:col-span-7 p-6 md:p-8 rounded-3xl bg-white/[0.01] border border-[#B76E79]/15 backdrop-blur-md shadow-2xl flex flex-col gap-6"
          >
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-2">
              <Calculator className="w-5 h-5 text-[#B76E79]" />
              <h3 className="text-lg font-bold font-headings text-white uppercase tracking-wider">Growth Parameters</h3>
            </div>

            {/* Grid fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Field 1: Traffic */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Current Monthly Traffic</label>
                <input 
                  type="number" 
                  value={traffic} 
                  onChange={(e) => setTraffic(Math.max(100, parseInt(e.target.value) || 0))}
                  className="px-4 py-3 rounded-xl bg-[#121218] border border-[#B76E79]/20 text-[#F4F4F9] focus:outline-none focus:border-[#B76E79] transition-all"
                  required
                />
              </div>

              {/* Field 2: Conv Rate */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Current Conversion Rate %</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={conversion} 
                  onChange={(e) => setConversion(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="px-4 py-3 rounded-xl bg-[#121218] border border-[#B76E79]/20 text-[#F4F4F9] focus:outline-none focus:border-[#B76E79] transition-all"
                  required
                />
              </div>

              {/* Field 3: Average Order Value */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Average Order Value ($)</label>
                <input 
                  type="number" 
                  value={aov} 
                  onChange={(e) => setAov(Math.max(1, parseInt(e.target.value) || 0))}
                  className="px-4 py-3 rounded-xl bg-[#121218] border border-[#B76E79]/20 text-[#F4F4F9] focus:outline-none focus:border-[#B76E79] transition-all"
                  required
                />
              </div>

              {/* Field 4: Industry */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Industry Sector</label>
                <select 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-[#121218] border border-[#B76E79]/20 text-[#F4F4F9] focus:outline-none focus:border-[#B76E79] transition-all"
                >
                  <option value="Ecommerce">E-commerce / Retail</option>
                  <option value="SaaS">SaaS / Subscriptions</option>
                  <option value="LeadGen">B2B / Lead Generation</option>
                </select>
              </div>

            </div>

            <button 
              type="submit" 
              className="w-full py-4 mt-2 rounded-xl text-white font-bold bg-gradient-to-r from-[#B76E79] to-[#E63946] shadow-lg shadow-[#B76E79]/10 hover:shadow-[#B76E79]/25 hover:scale-[1.01] active:scale-95 transition-all duration-300"
            >
              Calculate My ROI 🚀
            </button>

          </form>

          {/* Results Card (5 columns) */}
          <div className="md:col-span-5 h-full">
            {results ? (
              <div className="p-6 md:p-8 rounded-3xl bg-[#121218] border border-[#B76E79]/30 relative overflow-hidden flex flex-col gap-6 shadow-2xl rose-gold-glow animate-float-slow h-full">
                
                {/* Gold spark line */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#B76E79] via-[#E63946] to-[#F4C27F]"></div>

                <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-2">
                  <TrendingUp className="w-5 h-5 text-[#F4C27F]" />
                  <h3 className="text-lg font-bold font-headings text-[#F4C27F] uppercase tracking-wider">6-Month Projections</h3>
                </div>

                <div className="flex flex-col gap-5">
                  
                  {/* Result Item 1 */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-sm text-textSecondary uppercase tracking-wider">Projected Traffic</span>
                    <span className="text-2xl font-bold text-white font-headings">
                      {results.projectedTraffic.toLocaleString()}
                    </span>
                  </div>

                  {/* Result Item 2 */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-sm text-textSecondary uppercase tracking-wider">Projected Conversion</span>
                    <span className="text-2xl font-bold text-white font-headings">
                      {results.projectedConversion}%
                    </span>
                  </div>

                  {/* Result Item 3 */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-sm text-[#F4C27F] uppercase tracking-wider font-semibold">Projected Revenue Gain</span>
                    <span className="text-2xl font-bold text-[#F4C27F] font-headings flex items-center gap-0.5">
                      <DollarSign className="w-5 h-5 text-[#F4C27F]" /> {results.revenueIncrease.toLocaleString()}
                    </span>
                  </div>

                  {/* Result Item 4 (Estimated ROI) */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#B76E79]/20 flex flex-col gap-1 items-center justify-center text-center">
                    <span className="text-xs text-textSecondary uppercase tracking-wider">Estimated Return on Investment</span>
                    <span className="text-3xl font-bold font-headings bg-clip-text text-transparent bg-gradient-to-r from-[#B76E79] to-[#F4C27F]">
                      +{results.roiPercentage}% ROI
                    </span>
                    <span className="text-[10px] text-textSecondary mt-1 italic">Based on $9K growth retainer</span>
                  </div>

                </div>

                <a 
                  href="/#contact"
                  className="w-full py-3.5 mt-auto rounded-xl text-center text-white font-bold bg-white/5 border border-[#B76E79]/30 hover:bg-[#B76E79]/20 transition-all flex items-center justify-center gap-2"
                >
                  Let's Make This Happen <ArrowRight className="w-4 h-4" />
                </a>

              </div>
            ) : (
              <div className="p-8 rounded-3xl border border-white/5 bg-[#121218]/40 h-full flex flex-col items-center justify-center text-center text-textSecondary select-none">
                <Sparkles className="w-10 h-10 text-[#B76E79]/50 mb-3 animate-pulse" />
                <p className="text-sm font-medium tracking-wide">
                  Submit your parameters to project your revenue expansion path.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
