import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, AlertCircle } from 'lucide-react';

export default function TcpCongestionVisualizer() {
  const [cwnd, setCwnd] = useState(1);
  const [ssthresh, setSsthresh] = useState(16);
  const [rtt, setRtt] = useState(1);
  const [phase, setPhase] = useState('Slow Start'); // 'Slow Start', 'Congestion Avoidance', 'Fast Recovery'
  const [history, setHistory] = useState([
    { rtt: 1, cwnd: 1, ssthresh: 16, phase: 'Slow Start', event: 'Initial' }
  ]);
  const [log, setLog] = useState(['Connection initialized. cwnd = 1 MSS, ssthresh = 16 MSS.']);

  // Reno-style rules
  const handleNextRtt = () => {
    setHistory(prev => {
      let nextCwnd = cwnd;
      let nextPhase = phase;
      let nextRtt = rtt + 1;
      let logMessage = '';

      if (phase === 'Slow Start') {
        nextCwnd = cwnd * 2;
        logMessage = `Slow Start: cwnd doubled from ${cwnd} to ${nextCwnd} MSS.`;
        if (nextCwnd >= ssthresh) {
          nextCwnd = ssthresh;
          nextPhase = 'Congestion Avoidance';
          logMessage += ` Reached ssthresh (${ssthresh}). Transitioned to Congestion Avoidance.`;
        }
      } else if (phase === 'Congestion Avoidance') {
        nextCwnd = cwnd + 1;
        logMessage = `Congestion Avoidance: cwnd increased linearly from ${cwnd} to ${nextCwnd} MSS.`;
      } else if (phase === 'Fast Recovery') {
        // After fast recovery, enter congestion avoidance
        nextCwnd = ssthresh + 1;
        nextPhase = 'Congestion Avoidance';
        logMessage = `Exiting Fast Recovery. cwnd set to ssthresh + 1 (${nextCwnd}) and entering Congestion Avoidance.`;
      }

      setCwnd(nextCwnd);
      setPhase(nextPhase);
      setRtt(nextRtt);
      setLog(l => [logMessage, ...l]);

      return [...prev, { rtt: nextRtt, cwnd: nextCwnd, ssthresh, phase: nextPhase, event: 'Normal' }];
    });
  };

  const handleTimeout = () => {
    const nextSsthresh = Math.max(2, Math.floor(cwnd / 2));
    const nextCwnd = 1;
    const nextPhase = 'Slow Start';
    const nextRtt = rtt + 1;
    const logMessage = `⚠️ Timeout detected! Retransmitting segment. ssthresh set to cwnd/2 (${nextSsthresh} MSS), cwnd reset to 1 MSS. Re-entering Slow Start.`;

    setCwnd(nextCwnd);
    setSsthresh(nextSsthresh);
    setPhase(nextPhase);
    setRtt(nextRtt);
    setLog(l => [logMessage, ...l]);
    setHistory(prev => [...prev, { rtt: nextRtt, cwnd: nextCwnd, ssthresh: nextSsthresh, phase: nextPhase, event: 'Timeout' }]);
  };

  const handleDupAck = () => {
    const nextSsthresh = Math.max(2, Math.floor(cwnd / 2));
    const nextCwnd = nextSsthresh; // TCP Reno fast recovery shortcut
    const nextPhase = 'Congestion Avoidance';
    const nextRtt = rtt + 1;
    const logMessage = `🚨 3 Duplicate ACKs received! Fast Retransmit triggered. ssthresh set to cwnd/2 (${nextSsthresh} MSS), cwnd set to ssthresh (${nextCwnd} MSS). Transitioned directly to Congestion Avoidance.`;

    setCwnd(nextCwnd);
    setSsthresh(nextSsthresh);
    setPhase(nextPhase);
    setRtt(nextRtt);
    setLog(l => [logMessage, ...l]);
    setHistory(prev => [...prev, { rtt: nextRtt, cwnd: nextCwnd, ssthresh: nextSsthresh, phase: nextPhase, event: 'DupACK' }]);
  };

  const handleReset = () => {
    setCwnd(1);
    setSsthresh(16);
    setRtt(1);
    setPhase('Slow Start');
    setHistory([{ rtt: 1, cwnd: 1, ssthresh: 16, phase: 'Slow Start', event: 'Initial' }]);
    setLog(['Connection reset. cwnd = 1 MSS, ssthresh = 16 MSS.']);
  };

  // Dimensions for SVG plotting
  const padding = 40;
  const width = 640;
  const height = 280;

  // Maximum values to scale coordinates
  const maxRtt = Math.max(12, ...history.map(d => d.rtt));
  const maxCwndVal = Math.max(24, ...history.map(d => Math.max(d.cwnd, d.ssthresh)));

  const getX = (r) => padding + ((r - 1) * (width - 2 * padding)) / (maxRtt - 1);
  const getY = (c) => height - padding - (c * (height - 2 * padding)) / maxCwndVal;

  // Create path coordinates
  const pathD = history.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.rtt)} ${getY(pt.cwnd)}`).join(' ');

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
            📈 TCP Congestion Control Simulator (Reno)
          </h3>
          <p className="text-slate-400 text-sm">
            Step through Transmission Rounds (RTTs) and trigger packet loss anomalies to see how TCP adapts its Congestion Window size dynamically.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-300 font-bold py-1.5 px-3 rounded-xl text-xs transition self-start cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Graph
        </button>
      </div>

      {/* Grid Status Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-center">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">
            Congestion Window (cwnd)
          </span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{cwnd} <span className="text-xs text-slate-500 font-normal">MSS</span></span>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-center">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">
            Threshold (ssthresh)
          </span>
          <span className="text-2xl font-black text-amber-400 font-mono">{ssthresh} <span className="text-xs text-slate-500 font-normal">MSS</span></span>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-center">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">
            Current Phase
          </span>
          <span className={`text-xs font-bold px-2.5 py-1.5 rounded-full inline-block mt-1 ${
            phase === 'Slow Start' 
              ? 'bg-sky-950/40 border border-sky-850 text-sky-400' 
              : 'bg-emerald-950/40 border border-emerald-850 text-emerald-400'
          }`}>
            {phase}
          </span>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-center">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">
            Transmission RTT
          </span>
          <span className="text-2xl font-black text-indigo-400 font-mono">#{rtt}</span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap gap-2.5 mb-6 justify-center">
        <button
          onClick={handleNextRtt}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" /> Next RTT
        </button>
        <button
          onClick={handleTimeout}
          className="flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
        >
          <AlertCircle className="w-3.5 h-3.5" /> Trigger Timeout (L3 Loss)
        </button>
        <button
          onClick={handleDupAck}
          className="flex items-center gap-1.5 bg-amber-950/40 hover:bg-amber-900 border border-amber-800 text-amber-300 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Trigger 3 Duplicate ACKs
        </button>
      </div>

      {/* Custom SVG Line Graph */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 overflow-x-auto scrollbar-thin">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full min-w-[580px] h-auto text-slate-600"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="cwndGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"/>
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const val = Math.round((maxCwndVal / 4) * i);
            return (
              <g key={i}>
                <line 
                  x1={padding} 
                  y1={getY(val)} 
                  x2={width - padding} 
                  y2={getY(val)} 
                  stroke="#1e293b" 
                  strokeDasharray="4"
                />
                <text 
                  x={padding - 10} 
                  y={getY(val) + 4} 
                  textAnchor="end" 
                  className="fill-slate-500 font-mono text-[9px] font-bold"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* RTT Labels */}
          {Array.from({ length: maxRtt }).map((_, i) => {
            const r = i + 1;
            return (
              <g key={i}>
                <line 
                  x1={getX(r)} 
                  y1={padding} 
                  x2={getX(r)} 
                  y2={height - padding} 
                  stroke="#1e293b" 
                  strokeDasharray="4"
                />
                <text 
                  x={getX(r)} 
                  y={height - padding + 15} 
                  textAnchor="middle" 
                  className="fill-slate-500 font-mono text-[9px] font-bold"
                >
                  R{r}
                </text>
              </g>
            );
          })}

          {/* Threshold (ssthresh) dashed guide line */}
          {history.length > 0 && (
            <path
              d={history.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.rtt)} ${getY(pt.ssthresh)}`).join(' ')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.6"
            />
          )}

          {/* cwnd Gradient Shading Area */}
          {history.length > 1 && (
            <path
              d={`${pathD} L ${getX(history[history.length - 1].rtt)} ${height - padding} L ${getX(history[0].rtt)} ${height - padding} Z`}
              fill="url(#cwndGrad)"
            />
          )}

          {/* cwnd Line Path */}
          {history.length > 1 && (
            <path
              d={pathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {history.map((pt, idx) => {
            let fill = '#10b981';
            let r = 4;
            if (pt.event === 'Timeout') {
              fill = '#ef4444';
              r = 6;
            } else if (pt.event === 'DupACK') {
              fill = '#f59e0b';
              r = 6;
            } else if (pt.event === 'Initial') {
              fill = '#6366f1';
            }

            return (
              <g key={idx} className="group cursor-pointer">
                <circle 
                  cx={getX(pt.rtt)} 
                  cy={getY(pt.cwnd)} 
                  r={r} 
                  fill={fill} 
                  stroke="#020617" 
                  strokeWidth="1.5"
                />
                {/* Micro tooltip label */}
                <text 
                  x={getX(pt.rtt)} 
                  y={getY(pt.cwnd) - 10} 
                  textAnchor="middle" 
                  className="fill-slate-300 font-mono text-[8px] font-bold opacity-0 group-hover:opacity-100 transition duration-200"
                >
                  {pt.cwnd} MSS
                </text>
              </g>
            );
          })}
        </svg>
        <div className="flex justify-center gap-6 mt-1 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> cwnd Size
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 border-t-2 border-dashed border-amber-500 inline-block"></span> ssthresh Line
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Timeout Event
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> 3 Dup ACKs Event
          </div>
        </div>
      </div>

      {/* Event Logs */}
      <div className="mt-6 border-t border-slate-850 pt-4">
        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
          📊 Transmission Event Log
        </h4>
        <div className="bg-slate-950 rounded-xl border border-slate-900 p-4 max-h-[140px] overflow-y-auto scrollbar-thin space-y-2 text-xs font-mono">
          {log.map((entry, idx) => (
            <div key={idx} className="text-slate-400 flex items-start gap-2">
              <span className="text-slate-600 font-bold shrink-0">[{log.length - idx}]</span>
              <span className={entry.includes('⚠️') ? 'text-rose-300' : entry.includes('🚨') ? 'text-amber-300' : 'text-slate-300'}>
                {entry}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
