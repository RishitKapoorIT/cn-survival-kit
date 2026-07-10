import React, { useState, useEffect } from 'react';

// Default Graph Node Coordinates for SVG layout
const defaultNodes = [
  { id: 'A', x: 80, y: 120 },
  { id: 'B', x: 220, y: 50 },
  { id: 'C', x: 220, y: 190 },
  { id: 'D', x: 380, y: 50 },
  { id: 'E', x: 380, y: 190 },
];

const defaultEdges = [
  { id: 'AB', u: 'A', v: 'B', weight: 4 },
  { id: 'AC', u: 'A', v: 'C', weight: 2 },
  { id: 'BC', u: 'B', v: 'C', weight: 1 },
  { id: 'BD', u: 'B', v: 'D', weight: 5 },
  { id: 'CD', u: 'C', v: 'D', weight: 8 },
  { id: 'CE', u: 'C', v: 'E', weight: 10 },
  { id: 'DE', u: 'D', v: 'E', weight: 2 },
];

export default function RoutingSimulator() {
  const [source, setSource] = useState('A');
  const [target, setTarget] = useState('E');
  const [edges, setEdges] = useState(defaultEdges);
  const [activeStep, setActiveStep] = useState(0);
  const [history, setHistory] = useState([]);
  const [algorithmFinished, setAlgorithmFinished] = useState(false);

  // Initialize/Run Dijkstra and record steps
  const runDijkstraSteps = () => {
    const steps = [];
    const dist = {};
    const prev = {};
    const visited = new Set();
    const allNodes = defaultNodes.map(n => n.id);

    allNodes.forEach(node => {
      dist[node] = Infinity;
      prev[node] = null;
    });
    dist[source] = 0;

    // Record initial step
    steps.push({
      visited: new Set(visited),
      dist: { ...dist },
      prev: { ...prev },
      currentNode: null,
      relaxedEdge: null,
      message: `Initialize: Set distance to source node ${source} to 0, all other nodes to ∞.`
    });

    while (visited.size < allNodes.length) {
      // Find unvisited node with smallest distance
      let u = null;
      let minDist = Infinity;
      allNodes.forEach(node => {
        if (!visited.has(node) && dist[node] < minDist) {
          minDist = dist[node];
          u = node;
        }
      });

      if (u === null || minDist === Infinity) break; // All reachable nodes visited

      visited.add(u);
      steps.push({
        visited: new Set(visited),
        dist: { ...dist },
        prev: { ...prev },
        currentNode: u,
        relaxedEdge: null,
        message: `Select unvisited node ${u} with minimum distance (${minDist}) and mark as visited.`
      });

      // Relax neighbors of u
      const adjacentEdges = edges.filter(e => e.u === u || e.v === u);
      adjacentEdges.forEach(edge => {
        const neighbor = edge.u === u ? edge.v : edge.u;
        if (!visited.has(neighbor)) {
          const alt = dist[u] + edge.weight;
          if (alt < dist[neighbor]) {
            dist[neighbor] = alt;
            prev[neighbor] = u;
            steps.push({
              visited: new Set(visited),
              dist: { ...dist },
              prev: { ...prev },
              currentNode: u,
              relaxedEdge: edge.id,
              message: `Relax edge ${edge.u}-${edge.v}: Distance to ${neighbor} via ${u} is ${alt} (shorter than current ${dist[neighbor] === Infinity ? '∞' : dist[neighbor]}). Update path.`
            });
          } else {
            steps.push({
              visited: new Set(visited),
              dist: { ...dist },
              prev: { ...prev },
              currentNode: u,
              relaxedEdge: edge.id,
              message: `Check edge ${edge.u}-${edge.v}: Distance to ${neighbor} via ${u} is ${alt} (not shorter than current ${dist[neighbor]}). No update.`
            });
          }
        }
      });
    }

    // Determine final path to target
    const finalPathNodes = [];
    let curr = target;
    const currentPrev = steps[steps.length - 1]?.prev || prev;
    const currentDist = steps[steps.length - 1]?.dist || dist;
    
    if (currentDist[target] !== Infinity) {
      while (curr !== null) {
        finalPathNodes.unshift(curr);
        curr = currentPrev[curr];
      }
    }

    steps.push({
      visited: new Set(visited),
      dist: { ...dist },
      prev: { ...prev },
      currentNode: null,
      relaxedEdge: null,
      finalPath: finalPathNodes,
      message: `Completed! Shortest path from ${source} to ${target} is ${finalPathNodes.join(' → ')} with cost ${dist[target]}.`
    });

    setHistory(steps);
    setActiveStep(0);
    setAlgorithmFinished(false);
  };

  useEffect(() => {
    runDijkstraSteps();
  }, [source, target, edges]);

  const handleNextStep = () => {
    if (activeStep < history.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      setAlgorithmFinished(true);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
      setAlgorithmFinished(false);
    }
  };

  const updateEdgeWeight = (edgeId, weight) => {
    const val = parseInt(weight);
    if (isNaN(val) || val < 1 || val > 50) return;
    setEdges(prev => prev.map(e => e.id === edgeId ? { ...e, weight: val } : e));
  };

  const currentStepData = history[activeStep] || {
    visited: new Set(),
    dist: {},
    prev: {},
    currentNode: null,
    relaxedEdge: null,
    message: ''
  };

  // Check if an edge is in the final shortest path
  const isEdgeInFinalPath = (edge) => {
    const finalPath = history[history.length - 1]?.finalPath || [];
    if (finalPath.length < 2) return false;
    for (let i = 0; i < finalPath.length - 1; i++) {
      if ((finalPath[i] === edge.u && finalPath[i+1] === edge.v) ||
          (finalPath[i] === edge.v && finalPath[i+1] === edge.u)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="routing-simulator-card glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-sky-400">
        🗺️ Dijkstra's Shortest Path Routing Simulator
      </h3>
      <p className="text-slate-400 text-sm mb-6">
        Simulate link-state routing algorithms. Adjust edge weights in the panel below, select the source/target nodes, and step through the calculations to see Dijkstra's algorithm build the routing tables.
      </p>

      {/* Selector Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Source Node</label>
          <select
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-sky-500 text-sm"
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              if (e.target.value === target) setTarget(e.target.value === 'A' ? 'E' : 'A');
            }}
          >
            {defaultNodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Destination Node</label>
          <select
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-sky-500 text-sm"
            value={target}
            onChange={(e) => {
              setTarget(e.target.value);
              if (e.target.value === source) setSource(e.target.value === 'A' ? 'E' : 'A');
            }}
          >
            {defaultNodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={handlePrevStep}
            disabled={activeStep === 0}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg font-bold text-xs transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ◀ Back
          </button>
          <button
            onClick={handleNextStep}
            disabled={activeStep === history.length - 1}
            className="flex-1 bg-sky-600 hover:bg-sky-500 text-white py-2 rounded-lg font-bold text-xs shadow-md transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next Step ▶
          </button>
        </div>
      </div>

      {/* SVG Canvas and Edge Weight Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* SVG Graph representation */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-900 rounded-xl p-4 flex items-center justify-center relative min-h-[300px]">
          <svg className="w-full h-full max-w-[480px] max-h-[250px]" viewBox="0 0 480 250">
            {/* Draw Links/Edges */}
            {edges.map((edge) => {
              const uNode = defaultNodes.find(n => n.id === edge.u);
              const vNode = defaultNodes.find(n => n.id === edge.v);
              
              const isRelaxing = currentStepData.relaxedEdge === edge.id;
              const isPathEdge = isEdgeInFinalPath(edge) && activeStep === history.length - 1;
              
              let color = '#334155'; // default slate-700
              let strokeWidth = 2;
              let filter = '';
              
              if (isRelaxing) {
                color = '#f59e0b'; // Amber-500
                strokeWidth = 3.5;
                filter = 'drop-shadow(0 0 3px #f59e0b)';
              } else if (isPathEdge) {
                color = '#10b981'; // Emerald-500
                strokeWidth = 4;
                filter = 'drop-shadow(0 0 5px #10b981)';
              }

              // Text label placement
              const midX = (uNode.x + vNode.x) / 2;
              const midY = (uNode.y + vNode.y) / 2 - 8;

              return (
                <g key={edge.id}>
                  <line
                    x1={uNode.x}
                    y1={uNode.y}
                    x2={vNode.x}
                    y2={vNode.y}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    style={{ filter, transition: 'all 0.3s ease' }}
                  />
                  {/* Background rect for text weight */}
                  <rect
                    x={midX - 10}
                    y={midY - 6}
                    width={20}
                    height={14}
                    rx={3}
                    fill="#0f172a"
                    stroke="#1e293b"
                    strokeWidth={1}
                  />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    fill={isRelaxing ? '#f59e0b' : isPathEdge ? '#10b981' : '#94a3b8'}
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {defaultNodes.map((node) => {
              const isCurrent = currentStepData.currentNode === node.id;
              const isVisited = currentStepData.visited.has(node.id);
              const isSource = node.id === source;
              const isTarget = node.id === target;
              
              let fill = '#1e293b'; // default slate-800
              let stroke = '#475569'; // default slate-600
              let strokeWidth = 2;
              let filter = '';

              if (isCurrent) {
                fill = '#78350f'; // Amber-900
                stroke = '#f59e0b'; // Amber-500
                strokeWidth = 3;
                filter = 'drop-shadow(0 0 6px #f59e0b)';
              } else if (isSource) {
                fill = '#0c4a6e'; // Sky-950
                stroke = '#0284c7'; // Sky-600
                strokeWidth = 3;
                filter = 'drop-shadow(0 0 4px #0284c7)';
              } else if (isTarget) {
                fill = '#064e3b'; // Emerald-950
                stroke = '#10b981'; // Emerald-500
                strokeWidth = 3;
                filter = 'drop-shadow(0 0 4px #10b981)';
              } else if (isVisited) {
                fill = '#0f172a';
                stroke = '#0284c7'; // Sky-500 for visited nodes
                strokeWidth = 2;
              }

              return (
                <g key={node.id} style={{ transition: 'all 0.3s ease' }}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={18}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    style={{ filter }}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill="#f1f5f9"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {node.id}
                  </text>
                  {/* Distance label floating on top of circle */}
                  <text
                    x={node.x}
                    y={node.y - 22}
                    textAnchor="middle"
                    fill={isCurrent ? '#f59e0b' : '#94a3b8'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {currentStepData.dist[node.id] === Infinity ? '∞' : `D:${currentStepData.dist[node.id]}`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Adjust Weights Panel */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              ⚙️ Customize Edge Costs
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs h-40 overflow-y-auto pr-1">
              {edges.map((edge) => (
                <div key={edge.id} className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-300 font-mono">{edge.u} ↔ {edge.v}</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="w-12 bg-slate-950 border border-slate-800 rounded text-center py-0.5 text-sky-400 font-mono font-bold focus:outline-none focus:border-sky-500"
                    value={edge.weight}
                    onChange={(e) => updateEdgeWeight(edge.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400">
            <strong>Dijkstra Explanation</strong>: At each step, we look at the unvisited nodes and pick the one with the smallest distance metric, and examine if traveling through it shortens distance to its neighbors (relaxation).
          </div>
        </div>
      </div>

      {/* Routing Table and Explanation steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dijkstra Distance Table */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-4">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">Active Routing Table (from {source})</h4>
          <table className="w-full text-xs text-left text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500">
                <th className="py-2">Node</th>
                <th className="py-2">Distance Cost</th>
                <th className="py-2">Predecessor</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {defaultNodes.map((node) => {
                const isVisited = currentStepData.visited.has(node.id);
                const isTargetNode = node.id === target;
                const isSrcNode = node.id === source;

                return (
                  <tr key={node.id} className={`border-b border-slate-800/50 ${isVisited ? 'text-slate-100 font-semibold' : 'text-slate-500'}`}>
                    <td className="py-2 font-bold">{node.id} {isSrcNode && '(Src)'} {isTargetNode && '(Dst)'}</td>
                    <td className="py-2 font-mono">
                      {currentStepData.dist[node.id] === Infinity ? 'Infinity (∞)' : currentStepData.dist[node.id]}
                    </td>
                    <td className="py-2 font-mono">{currentStepData.prev[node.id] || '-'}</td>
                    <td className="py-2 text-[10px]">
                      {isVisited ? (
                        <span className="text-sky-400 bg-sky-950/40 border border-sky-900/60 px-1.5 py-0.5 rounded">Visited</span>
                      ) : (
                        <span className="text-slate-600 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">Unvisited</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Step log box */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Step {activeStep + 1} of {history.length}</span>
            <div className="text-sm font-semibold text-slate-200 mb-4 leading-relaxed">
              {currentStepData.message}
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs">
            <span className="block font-bold text-emerald-400 mb-1">Final Shortest Path Answer:</span>
            {activeStep === history.length - 1 ? (
              <span className="font-mono text-emerald-300 font-bold text-sm">
                {currentStepData.finalPath?.join(' ➔ ')} (Cost: {currentStepData.dist[target]})
              </span>
            ) : (
              <span className="text-slate-600 italic">Step through to the last step to see final routing path.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
