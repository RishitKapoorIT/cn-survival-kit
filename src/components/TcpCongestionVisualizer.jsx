import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, AlertCircle, SkipForward, Gauge } from 'lucide-react';

export default function TcpCongestionVisualizer() {
  const [cwnd, setCwnd] = useState(1);
  const [ssthresh, setSsthresh] = useState(16);
  const [rtt, setRtt] = useState(1);
  const [phase, setPhase] = useState('Slow Start');
  const [history, setHistory] = useState([
    { rtt: 1, cwnd: 1, ssthresh: 16, phase: 'Slow Start', event: 'Initial' }
  ]);
  const [log, setLog] = useState(['Connection initialized. cwnd = 1 MSS, ssthresh = 16 MSS.']);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800); // ms per RTT
  const [animatingPoint, setAnimatingPoint] = useState(null); // index of latest point for pulse

  // Use refs so the interval callback always sees fresh state
  const stateRef = useRef({ cwnd, ssthresh, rtt, phase, history, log });
  useEffect(() => {
    stateRef.current = { cwnd, ssthresh, rtt, phase, history, log };
  }, [cwnd, ssthresh, rtt, phase, history, log]);

  const intervalRef = useRef(null);

  // Reno step logic — pure function that returns next state
  const computeNextRtt = useCallback((cur) => {
    const { cwnd, ssthresh, rtt, phase } = cur;
    let nextCwnd = cwnd;
    let nextPhase = phase;
    const nextRtt = rtt + 1;
    let logMessage = '';

    if (phase === 'Slow Start') {
      nextCwnd = cwnd * 2;
      logMessage = `RTT #${nextRtt} — Slow Start: cwnd doubled ${cwnd} → ${nextCwnd} MSS.`;
      if (nextCwnd >= ssthresh) {
        nextCwnd = ssthresh;
        nextPhase = 'Congestion Avoidance';
        logMessage += ` Reached ssthresh (${ssthresh}). → Congestion Avoidance.`;
      }
    } else if (phase === 'Congestion Avoidance') {
      nextCwnd = cwnd + 1;
      logMessage = `RTT #${nextRtt} — Congestion Avoidance: cwnd +1 → ${nextCwnd} MSS.`;
    } else if (phase === 'Fast Recovery') {
      nextCwnd = ssthresh + 1;
      nextPhase = 'Congestion Avoidance';
      logMessage = `RTT #${nextRtt} — Exiting Fast Recovery. cwnd → ssthresh+1 (${nextCwnd}). → Congestion Avoidance.`;
    }

    return { nextCwnd, nextSsthresh: ssthresh, nextPhase, nextRtt, logMessage, event: 'Normal' };
  }, []);

  const applyStep = useCallback((stepResult) => {
    const { nextCwnd, nextSsthresh, nextPhase, nextRtt, logMessage, event } = stepResult;
    setCwnd(nextCwnd);
    setSsthresh(nextSsthresh);
    setPhase(nextPhase);
    setRtt(nextRtt);
    setLog(l => [logMessage, ...l]);
    setHistory(prev => {
      const newHistory = [...prev, { rtt: nextRtt, cwnd: nextCwnd, ssthresh: nextSsthresh, phase: nextPhase, event }];
      setAnimatingPoint(newHistory.length - 1);
      setTimeout(() => setAnimatingPoint(null), 600);
      return newHistory;
    });
  }, []);

  const handleNextRtt = useCallback(() => {
    const cur = stateRef.current;
    const result = computeNextRtt(cur);
    applyStep(result);
  }, [computeNextRtt, applyStep]);

  // Auto-play interval
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        handleNextRtt();
      }, speed);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, handleNextRtt]);

  const handleTimeout = () => {
    setIsPlaying(false);
    const cur = stateRef.current;
    const nextSsthresh = Math.max(2, Math.floor(cur.cwnd / 2));
    const nextCwnd = 1;
    const nextPhase = 'Slow Start';
    const nextRtt = cur.rtt + 1;
    const logMessage = `⚠️ TIMEOUT — ssthresh → cwnd/2 (${nextSsthresh} MSS), cwnd reset to 1 MSS. Back to Slow Start.`;
    setCwnd(nextCwnd); setSsthresh(nextSsthresh); setPhase(nextPhase); setRtt(nextRtt);
    setLog(l => [logMessage, ...l]);
    setHistory(prev => {
      const newHistory = [...prev, { rtt: nextRtt, cwnd: nextCwnd, ssthresh: nextSsthresh, phase: nextPhase, event: 'Timeout' }];
      setAnimatingPoint(newHistory.length - 1);
      setTimeout(() => setAnimatingPoint(null), 600);
      return newHistory;
    });
  };

  const handleDupAck = () => {
    setIsPlaying(false);
    const cur = stateRef.current;
    const nextSsthresh = Math.max(2, Math.floor(cur.cwnd / 2));
    const nextCwnd = nextSsthresh;
    const nextPhase = 'Congestion Avoidance';
    const nextRtt = cur.rtt + 1;
    const logMessage = `🚨 3 DUP ACKs — Fast Retransmit. ssthresh → cwnd/2 (${nextSsthresh} MSS), cwnd → ssthresh (${nextCwnd} MSS). → Congestion Avoidance.`;
    setCwnd(nextCwnd); setSsthresh(nextSsthresh); setPhase(nextPhase); setRtt(nextRtt);
    setLog(l => [logMessage, ...l]);
    setHistory(prev => {
      const newHistory = [...prev, { rtt: nextRtt, cwnd: nextCwnd, ssthresh: nextSsthresh, phase: nextPhase, event: 'DupACK' }];
      setAnimatingPoint(newHistory.length - 1);
      setTimeout(() => setAnimatingPoint(null), 600);
      return newHistory;
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    clearInterval(intervalRef.current);
    setCwnd(1); setSsthresh(16); setRtt(1); setPhase('Slow Start');
    setHistory([{ rtt: 1, cwnd: 1, ssthresh: 16, phase: 'Slow Start', event: 'Initial' }]);
    setLog(['Connection reset. cwnd = 1 MSS, ssthresh = 16 MSS.']);
    setAnimatingPoint(null);
  };

  // SVG dimensions
  const padding = 40;
  const width = 640;
  const height = 280;
  const maxRtt = Math.max(12, ...history.map(d => d.rtt));
  const maxCwndVal = Math.max(24, ...history.map(d => Math.max(d.cwnd, d.ssthresh)));
  const getX = (r) => padding + ((r - 1) * (width - 2 * padding)) / Math.max(maxRtt - 1, 1);
  const getY = (c) => height - padding - (c * (height - 2 * padding)) / maxCwndVal;
  const pathD = history.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.rtt).toFixed(1)} ${getY(pt.cwnd).toFixed(1)}`).join(' ');

  const phaseColor = {
    'Slow Start': { bg: 'bg-sky-950/40', border: 'border-sky-900', text: 'text-sky-400' },
    'Congestion Avoidance': { bg: 'bg-emerald-950/40', border: 'border-emerald-900', text: 'text-emerald-400' },
    'Fast Recovery': { bg: 'bg-amber-950/40', border: 'border-amber-900', text: 'text-amber-400' },
  };
  const pc = phaseColor[phase] || phaseColor['Slow Start'];

  const speedLabels = { 1200: 'Slow', 800: 'Normal', 400: 'Fast', 150: 'Turbo' };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
            📈 TCP Congestion Control Simulator (Reno)
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Watch TCP adapt its congestion window in real time. Use <strong className="text-slate-300">Play</strong> to auto-step, or trigger events manually.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold py-1.5 px-3 rounded-xl text-xs transition self-start cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">cwnd</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{cwnd} <span className="text-xs text-slate-500 font-normal">MSS</span></span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">ssthresh</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{ssthresh} <span className="text-xs text-slate-500 font-normal">MSS</span></span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center flex flex-col items-center justify-center">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Phase</span>
          <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${pc.bg} ${pc.border} ${pc.text}`}>
            {phase}
          </span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">RTT</span>
          <span className="text-2xl font-black text-indigo-400 font-mono">#{rtt}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-5 items-center justify-center">
        {/* Play / Pause */}
        <button
          onClick={() => setIsPlaying(p => !p)}
          className={`flex items-center gap-1.5 font-bold py-2.5 px-5 rounded-xl text-sm shadow-md transition cursor-pointer ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isPlaying ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4 fill-white" /> Play</>}
        </button>

        {/* Step once */}
        <button
          onClick={() => { setIsPlaying(false); handleNextRtt(); }}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
        >
          <SkipForward className="w-3.5 h-3.5" /> Next RTT
        </button>

        {/* Speed selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
          <Gauge className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mr-1">Speed:</span>
          {Object.entries(speedLabels).map(([ms, label]) => (
            <button
              key={ms}
              onClick={() => setSpeed(Number(ms))}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                speed === Number(ms)
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-800 hidden md:block" />

        {/* Event triggers */}
        <button
          onClick={handleTimeout}
          className="flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold py-2 px-3 rounded-xl text-xs transition cursor-pointer"
        >
          <AlertCircle className="w-3.5 h-3.5" /> Timeout
        </button>
        <button
          onClick={handleDupAck}
          className="flex items-center gap-1.5 bg-amber-950/40 hover:bg-amber-900 border border-amber-800 text-amber-300 font-bold py-2 px-3 rounded-xl text-xs transition cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5" /> 3 Dup ACKs
        </button>
      </div>

      {/* SVG Graph */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 overflow-x-auto scrollbar-thin">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[520px] h-auto">
          <defs>
            <linearGradient id="cwndGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow-green">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-red">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const val = Math.round((maxCwndVal / 4) * i);
            return (
              <g key={i}>
                <line x1={padding} y1={getY(val)} x2={width - padding} y2={getY(val)} stroke="#1e293b" strokeDasharray="4" />
                <text x={padding - 8} y={getY(val) + 4} textAnchor="end" className="fill-slate-600 font-mono" fontSize="9" fontWeight="bold">{val}</text>
              </g>
            );
          })}

          {/* RTT axis labels */}
          {Array.from({ length: maxRtt }).map((_, i) => {
            const r = i + 1;
            return (
              <g key={i}>
                <line x1={getX(r)} y1={padding} x2={getX(r)} y2={height - padding} stroke="#1e293b" strokeDasharray="4" />
                <text x={getX(r)} y={height - padding + 14} textAnchor="middle" className="fill-slate-600 font-mono" fontSize="9" fontWeight="bold">R{r}</text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text x={padding - 30} y={height / 2} textAnchor="middle" fill="#475569" fontSize="9" fontWeight="bold" transform={`rotate(-90, ${padding - 30}, ${height / 2})`}>cwnd (MSS)</text>
          <text x={width / 2} y={height - 4} textAnchor="middle" fill="#475569" fontSize="9" fontWeight="bold">Round Trip Time (RTT)</text>

          {/* ssthresh dashed line */}
          {history.length > 0 && (
            <path
              d={history.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.rtt).toFixed(1)} ${getY(pt.ssthresh).toFixed(1)}`).join(' ')}
              fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.7"
            />
          )}

          {/* cwnd area fill */}
          {history.length > 1 && (
            <path
              d={`${pathD} L ${getX(history[history.length - 1].rtt).toFixed(1)} ${height - padding} L ${getX(history[0].rtt).toFixed(1)} ${height - padding} Z`}
              fill="url(#cwndGrad2)"
            />
          )}

          {/* cwnd line — animated stroke */}
          {history.length > 1 && (
            <path
              d={pathD}
              fill="none" stroke="#10b981" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          )}

          {/* Data points */}
          {history.map((pt, idx) => {
            let fill = '#10b981';
            let r = 4;
            let filterAttr = '';
            if (pt.event === 'Timeout') { fill = '#ef4444'; r = 7; filterAttr = 'url(#glow-red)'; }
            else if (pt.event === 'DupACK') { fill = '#f59e0b'; r = 7; filterAttr = 'url(#glow-red)'; }
            else if (pt.event === 'Initial') { fill = '#6366f1'; }

            const isAnimating = animatingPoint === idx;

            return (
              <g key={idx} className="group cursor-pointer">
                {/* Pulse ring for newly added point */}
                {isAnimating && (
                  <circle
                    cx={getX(pt.rtt)} cy={getY(pt.cwnd)} r={r + 8}
                    fill="none" stroke={fill} strokeWidth="1.5" opacity="0.5"
                    style={{ animation: 'tcp-pulse 0.6s ease-out forwards' }}
                  />
                )}
                <circle
                  cx={getX(pt.rtt)} cy={getY(pt.cwnd)} r={isAnimating ? r + 2 : r}
                  fill={fill} stroke="#020617" strokeWidth="1.5"
                  filter={filterAttr}
                  style={{ transition: 'r 0.3s ease' }}
                />
                {/* Tooltip */}
                <text x={getX(pt.rtt)} y={getY(pt.cwnd) - 12} textAnchor="middle"
                  className="fill-slate-300 font-mono opacity-0 group-hover:opacity-100 transition"
                  fontSize="9" fontWeight="bold">
                  {pt.cwnd} MSS
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-5 mt-2 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> cwnd</div>
          <div className="flex items-center gap-1.5"><span className="w-4 h-0 border-t-2 border-dashed border-amber-500 inline-block" /> ssthresh</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Timeout</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> 3 Dup ACKs</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Start</div>
        </div>
      </div>

      {/* Event Log */}
      <div className="mt-5 border-t border-slate-800 pt-4">
        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">📊 Transmission Event Log</h4>
        <div className="bg-slate-950 rounded-xl border border-slate-900 p-4 max-h-[130px] overflow-y-auto scrollbar-thin space-y-1.5 text-xs font-mono">
          {log.map((entry, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 ${idx === 0 ? 'tcp-log-new' : ''}`}
              style={idx === 0 ? { animation: 'fadeSlideIn 0.35s ease-out' } : {}}
            >
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
