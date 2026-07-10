import React, { useState, useEffect } from 'react';

export default function DelayVisualizer() {
  const [packetSize, setPacketSize] = useState(100); // in KB
  const [bandwidth, setBandwidth] = useState(10); // in Mbps
  const [distance, setDistance] = useState(3000); // in km
  const [propSpeed, setPropSpeed] = useState(200000); // in km/s (standard speed in copper/fiber)
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Calculations
  const sizeBits = packetSize * 1024 * 8;
  const rateBps = bandwidth * 1000000;
  
  // T_trans = L / R (in seconds) -> multiply by 1000 for ms
  const tTrans = (sizeBits / rateBps) * 1000;
  
  // T_prop = d / s (in seconds) -> multiply by 1000 for ms
  const tProp = (distance / propSpeed) * 1000;

  const tQueue = 2.0; // Assume constant 2ms queueing delay
  const tProc = 0.5;  // Assume constant 0.5ms processing delay
  const tTotal = tTrans + tProp + tQueue + tProc;

  // Animation controller
  useEffect(() => {
    let intervalId;
    if (isAnimating) {
      setAnimationProgress(0);
      const duration = 2500; // Animation duration in ms
      const steps = 100;
      const stepTime = duration / steps;
      let currentStep = 0;

      intervalId = setInterval(() => {
        currentStep++;
        setAnimationProgress(currentStep);
        if (currentStep >= steps) {
          clearInterval(intervalId);
          setIsAnimating(false);
        }
      }, stepTime);
    }
    return () => clearInterval(intervalId);
  }, [isAnimating]);

  const maxVal = Math.max(tTrans, tProp, tQueue, tProc);
  const getPct = (val) => (val / maxVal) * 100;

  return (
    <div className="delay-visualizer-card glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400">
        ⚡ Interactive Network Delay Visualizer
      </h3>
      <p className="text-slate-400 text-sm mb-6">
        Simulate packets traveling over a physical network. Observe how packet size, distance, and bandwidth dictate the relationship between <strong>Transmission Delay</strong> (pushed on the link) and <strong>Propagation Delay</strong> (traveling across space).
      </p>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Packet Size */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span className="uppercase">Packet Size (L)</span>
            <span className="text-indigo-400 font-mono font-bold">{packetSize} KB</span>
          </div>
          <input
            type="range"
            min="1"
            max="1000"
            className="w-full accent-indigo-500 cursor-pointer"
            value={packetSize}
            onChange={(e) => setPacketSize(Number(e.target.value))}
          />
        </div>

        {/* Link Bandwidth */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span className="uppercase">Bandwidth (R)</span>
            <span className="text-indigo-400 font-mono font-bold">{bandwidth} Mbps</span>
          </div>
          <input
            type="range"
            min="1"
            max="1000"
            className="w-full accent-indigo-500 cursor-pointer"
            value={bandwidth}
            onChange={(e) => setBandwidth(Number(e.target.value))}
          />
        </div>

        {/* Physical Distance */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span className="uppercase">Distance (d)</span>
            <span className="text-indigo-400 font-mono font-bold">{distance} km</span>
          </div>
          <input
            type="range"
            min="100"
            max="20000"
            step="100"
            className="w-full accent-indigo-500 cursor-pointer"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
          />
        </div>

        {/* Propagation Speed */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span className="uppercase">Medium Speed (s)</span>
            <span className="text-indigo-400 font-mono font-bold">{propSpeed.toLocaleString()} km/s</span>
          </div>
          <select
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition"
            value={propSpeed}
            onChange={(e) => setPropSpeed(Number(e.target.value))}
          >
            <option value={200000}>Optical Fiber / Copper (~200,000 km/s)</option>
            <option value={300000}>Air / Vacuum (Radio waves - ~300,000 km/s)</option>
            <option value={36000}>Satellite Orbit / Speed (~36,000 km/s equivalent delay)</option>
          </select>
        </div>
      </div>

      {/* Path Animation Area */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 mb-6 relative overflow-hidden">
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="bg-slate-900 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-center">
            <span className="block text-[10px] text-slate-400 uppercase font-bold">Node A</span>
            <span className="text-xs text-indigo-400 font-mono">SENDER</span>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setIsAnimating(true)}
              disabled={isAnimating}
              className={`px-4 py-1.5 rounded-full font-bold text-xs shadow-md transition ${
                isAnimating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer active:scale-95'
              }`}
            >
              {isAnimating ? 'Sending...' : '⚡ Send Packet'}
            </button>
          </div>

          <div className="bg-slate-900 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-center">
            <span className="block text-[10px] text-slate-400 uppercase font-bold">Node B</span>
            <span className="text-xs text-emerald-400 font-mono">RECEIVER</span>
          </div>
        </div>

        {/* Physical Line */}
        <div className="h-1.5 bg-slate-800 rounded-full relative mb-4">
          <div
            className="absolute h-full bg-indigo-500 shadow-[0_0_8px_#6366f1] transition-all duration-75"
            style={{ width: `${animationProgress}%` }}
          ></div>
          {isAnimating && (
            <div
              className="absolute w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_12px_#818cf8] -top-1.5 transform -translate-x-1/2"
              style={{ left: `${animationProgress}%` }}
            ></div>
          )}
        </div>
        
        <div className="text-center font-mono text-[11px] text-slate-500">
          {isAnimating ? `Packet in transit... ${animationProgress}%` : 'Link idle. Press Send Packet.'}
        </div>
      </div>

      {/* Delay Analysis Graph */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Relative Bars */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">Delay Components</h4>
          
          {/* Transmission Delay */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Transmission Delay (T_trans = L / R)</span>
              <span className="font-mono text-indigo-400">{tTrans.toFixed(3)} ms</span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${getPct(tTrans)}%` }}></div>
            </div>
          </div>

          {/* Propagation Delay */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Propagation Delay (T_prop = d / s)</span>
              <span className="font-mono text-sky-400">{tProp.toFixed(3)} ms</span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-sky-400" style={{ width: `${getPct(tProp)}%` }}></div>
            </div>
          </div>

          {/* Queueing Delay */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Queueing Delay (T_queue) - Simulated</span>
              <span className="font-mono text-amber-400">{tQueue.toFixed(3)} ms</span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${getPct(tQueue)}%` }}></div>
            </div>
          </div>

          {/* Processing Delay */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Processing Delay (T_proc) - Simulated</span>
              <span className="font-mono text-slate-300">{tProc.toFixed(3)} ms</span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-slate-400" style={{ width: `${getPct(tProc)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Total & Summary Box */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">Total Latency Breakdown</h4>
            <div className="font-mono text-3xl font-extrabold text-emerald-400 mb-3">
              {tTotal.toFixed(3)} <span className="text-sm font-normal text-slate-400">ms</span>
            </div>
            
            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              {tTrans > tProp ? (
                <span>
                  🔴 <strong>Bandwidth Limited</strong>: Transmission delay ({tTrans.toFixed(1)}ms) is greater than propagation delay ({tProp.toFixed(1)}ms). Pushing the bits on the line takes the most time. Increasing link bandwidth (R) will yield the biggest latency reduction.
                </span>
              ) : (
                <span>
                  🔵 <strong>Propagation Limited</strong>: Propagation delay ({tProp.toFixed(1)}ms) is greater than transmission delay ({tTrans.toFixed(1)}ms). The time in transit dominates. Increasing bandwidth won't speed up the connection much because physics (distance and signal speed) is the bottleneck.
                </span>
              )}
            </p>
          </div>

          <div className="border-t border-slate-800/80 pt-3 text-[11px] text-slate-500 font-mono">
            Formulas applied:
            <br />
            T_trans = ({packetSize} KB * 8192 bits/KB) / ({bandwidth} Mbps) = {tTrans.toFixed(2)} ms
            <br />
            T_prop = {distance} km / {propSpeed} km/s = {tProp.toFixed(2)} ms
          </div>
        </div>
      </div>
    </div>
  );
}
