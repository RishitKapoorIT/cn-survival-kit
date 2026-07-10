import React, { useState, useEffect, useRef } from 'react';

export default function SlidingWindowSimulator() {
  const [protocol, setProtocol] = useState('gbn'); // sw, gbn, sr
  const [windowSize, setWindowSize] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState([]);
  const [frames, setFrames] = useState([]); // List of frame objects
  
  // State for active animation
  // Sender and receiver frames in transit
  const [transitFrames, setTransitFrames] = useState([]); // { id, seq, type: 'data'|'ack', progress: 0-100, isLost: bool }
  const [senderBuffer, setSenderBuffer] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  const [senderWindowStart, setSenderWindowStart] = useState(0);
  const [nextFrameToSend, setNextFrameToSend] = useState(0);
  
  // Receiver state
  const [expectedFrame, setExpectedFrame] = useState(0);
  const [receivedBuffer, setReceivedBuffer] = useState({}); // seq -> status ('acked' or 'buffered')

  const timerRef = useRef(null);
  const logIdRef = useRef(0);

  // Set default window sizes based on protocol
  useEffect(() => {
    if (protocol === 'sw') {
      setWindowSize(1);
    } else if (protocol === 'gbn') {
      setWindowSize(4);
    } else {
      setWindowSize(4);
    }
    resetSim();
  }, [protocol]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [
      { id: logIdRef.current++, text: message, type },
      ...prev.slice(0, 19)
    ]);
  };

  const resetSim = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTransitFrames([]);
    setSenderWindowStart(0);
    setNextFrameToSend(0);
    setExpectedFrame(0);
    setReceivedBuffer({});
    logIdRef.current = 0;
    setLogs([]);
    addLog(`Reset simulator. Protocol: ${protocol.toUpperCase()}. Window size: ${protocol === 'sw' ? 1 : windowSize}`);
  };

  // Main loop logic
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        // 1. Progress frames in transit
        setTransitFrames(prev => {
          const nextTransit = [];
          
          prev.forEach(item => {
            const nextProgress = item.progress + 4; // Move by 4%
            
            if (nextProgress < 100) {
              // Frame still in transit
              nextTransit.push({ ...item, progress: nextProgress });
            } else {
              // Frame arrived at destination
              if (item.isLost) {
                addLog(`💥 ${item.type.toUpperCase()} for Frame ${item.seq} was lost in network.`, 'error');
                return; // Drops frame
              }

              if (item.type === 'data') {
                // Data Frame Arrived
                handleDataArrival(item.seq);
              } else {
                // ACK Frame Arrived
                handleAckArrival(item.seq);
              }
            }
          });

          return nextTransit;
        });

        // 2. Automate sender sending if possible
        sendNextFramesIfPossible();

      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, transitFrames, senderWindowStart, nextFrameToSend, expectedFrame, receivedBuffer, windowSize, protocol]);

  const sendNextFramesIfPossible = () => {
    // If we have capacity in window and have packets left to send
    const windowEnd = senderWindowStart + (protocol === 'sw' ? 1 : windowSize);
    if (nextFrameToSend < windowEnd && nextFrameToSend < senderBuffer.length) {
      // Check if frame is already in flight (avoid sending duplicates unless timeout)
      const isAlreadyInTransit = transitFrames.some(f => f.seq === nextFrameToSend && f.type === 'data');
      
      if (!isAlreadyInTransit) {
        sendFrame(nextFrameToSend);
        setNextFrameToSend(prev => prev + 1);
      }
    }
  };

  const sendFrame = (seq) => {
    addLog(`✉️ Sender: Transmitting Data Frame ${seq}`, 'send');
    setTransitFrames(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        seq,
        type: 'data',
        progress: 0,
        isLost: false
      }
    ]);
  };

  const handleDataArrival = (seq) => {
    if (protocol === 'sw') {
      if (seq === expectedFrame) {
        addLog(`📥 Receiver: Frame ${seq} received correctly. Sending ACK.`, 'recv');
        setExpectedFrame(prev => prev + 1);
        sendAck(seq);
      } else {
        addLog(`📥 Receiver: Duplicate Frame ${seq} received. Re-ACKing.`, 'warn');
        sendAck(seq);
      }
    } else if (protocol === 'gbn') {
      if (seq === expectedFrame) {
        addLog(`📥 Receiver: Frame ${seq} received in-order. Sending cumulative ACK.`, 'recv');
        setExpectedFrame(prev => prev + 1);
        sendAck(seq);
      } else {
        addLog(`📥 Receiver: Out-of-order Frame ${seq} received (expected: ${expectedFrame}). Discarding!`, 'warn');
        // Send ACK for the last successfully received in-order frame
        if (expectedFrame > 0) {
          sendAck(expectedFrame - 1);
        }
      }
    } else if (protocol === 'sr') {
      // Selective Repeat: Can accept out-of-order within receiver window
      const rxWindowEnd = expectedFrame + windowSize;
      if (seq >= expectedFrame && seq < rxWindowEnd) {
        addLog(`📥 Receiver: Frame ${seq} received. Buffering and sending individual ACK ${seq}.`, 'recv');
        setReceivedBuffer(prev => ({ ...prev, [seq]: 'acked' }));
        sendAck(seq);

        // Slide expectedFrame forward if we filled holes
        let nextExpected = expectedFrame;
        const newBuffer = { ...receivedBuffer, [seq]: 'acked' };
        while (newBuffer[nextExpected] === 'acked') {
          nextExpected++;
        }
        if (nextExpected > expectedFrame) {
          setExpectedFrame(nextExpected);
        }
      } else if (seq < expectedFrame) {
        addLog(`📥 Receiver: Duplicate Frame ${seq} received. Re-ACKing.`, 'warn');
        sendAck(seq);
      } else {
        addLog(`📥 Receiver: Frame ${seq} is outside window. Discarding!`, 'warn');
      }
    }
  };

  const sendAck = (seq) => {
    setTransitFrames(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        seq,
        type: 'ack',
        progress: 0,
        isLost: false
      }
    ]);
  };

  const handleAckArrival = (seq) => {
    if (protocol === 'sw') {
      addLog(`✅ Sender: Received ACK ${seq}. Sliding window.`, 'success');
      setSenderWindowStart(seq + 1);
      setNextFrameToSend(seq + 1);
    } else if (protocol === 'gbn') {
      // Cumulative ACK: ACK n means all frames <= n received
      if (seq >= senderWindowStart) {
        addLog(`✅ Sender: Received Cumulative ACK ${seq}. Sliding window past ${seq}.`, 'success');
        setSenderWindowStart(seq + 1);
      } else {
        addLog(`ℹ️ Sender: Received old ACK ${seq}. Ignored.`, 'info');
      }
    } else if (protocol === 'sr') {
      // Individual ACK: ACK n only ACKs frame n
      addLog(`✅ Sender: Received Individual ACK ${seq}.`, 'success');
      setReceivedBuffer(prev => ({ ...prev, [seq]: 'acked' }));
      
      // Check if we can slide the window start
      let newStart = senderWindowStart;
      const updatedBuffer = { ...receivedBuffer, [seq]: 'acked' };
      while (updatedBuffer[newStart] === 'acked') {
        newStart++;
      }
      if (newStart > senderWindowStart) {
        addLog(`➡️ Sliding window start to ${newStart}`, 'info');
        setSenderWindowStart(newStart);
      }
    }
  };

  // Click on a traveling packet to toggle its lost state
  const handleTransitClick = (id) => {
    setTransitFrames(prev =>
      prev.map(f => {
        if (f.id === id) {
          const nextState = !f.isLost;
          addLog(`⚡ Frame ${f.seq} (${f.type.toUpperCase()}) set to ${nextState ? 'LOSE' : 'DELIVER'}.`, 'warn');
          return { ...f, isLost: nextState };
        }
        return f;
      })
    );
  };

  // Simulates timeout retransmissions
  const triggerTimeout = () => {
    if (protocol === 'sw') {
      addLog(`⏰ Timeout expired! Retransmitting Frame ${senderWindowStart}...`, 'error');
      sendFrame(senderWindowStart);
    } else if (protocol === 'gbn') {
      addLog(`⏰ Timeout expired! GBN Protocol: Retransmitting ALL unacknowledged frames in window: [${senderWindowStart} to ${nextFrameToSend - 1}]`, 'error');
      for (let i = senderWindowStart; i < nextFrameToSend; i++) {
        sendFrame(i);
      }
    } else if (protocol === 'sr') {
      // Find the first unacknowledged frame
      let firstUnacked = senderWindowStart;
      while (receivedBuffer[firstUnacked] === 'acked') {
        firstUnacked++;
      }
      addLog(`⏰ Timeout expired! SR Protocol: Retransmitting ONLY first unacknowledged frame ${firstUnacked}...`, 'error');
      sendFrame(firstUnacked);
    }
  };

  return (
    <div className="sliding-window-card glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-rose-400">
        🎚️ Interactive Sliding Window Simulator
      </h3>
      <p className="text-slate-400 text-sm mb-6">
        Simulate frame flow control protocols. Choose a protocol, click <strong>Play</strong>, and watch how frames and ACKs flow. 
        <span className="text-rose-400 font-semibold"> Click on any moving packet on the line to destroy it</span> and observe the error handling and timeouts!
      </p>

      {/* Settings Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Protocol</label>
          <select
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-rose-500 text-sm transition"
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
          >
            <option value="sw">Stop-and-Wait (Window Size = 1)</option>
            <option value="gbn">Go-Back-N (Cumulative ACKs)</option>
            <option value="sr">Selective Repeat (Individual ACKs)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Sender Window Size ({protocol === 'sw' ? 1 : windowSize})
          </label>
          <input
            type="range"
            min="2"
            max="7"
            disabled={protocol === 'sw'}
            className="w-full accent-rose-500 cursor-pointer disabled:opacity-50"
            value={windowSize}
            onChange={(e) => setWindowSize(Number(e.target.value))}
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs shadow-md transition text-white ${
              isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button
            onClick={resetSim}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 px-3 rounded-lg font-bold text-xs transition"
          >
            🔄 Reset
          </button>
          <button
            onClick={triggerTimeout}
            disabled={transitFrames.length === 0 && senderWindowStart === nextFrameToSend}
            className="bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-rose-300 py-2 px-3 rounded-lg font-bold text-xs transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="Force connection timeout on current window"
          >
            ⏰ Force Timeout
          </button>
        </div>
      </div>

      {/* Simulator Pipeline Visualizer */}
      <div className="bg-slate-950 border border-slate-900 rounded-xl p-6 mb-6 relative select-none">
        
        {/* SENDER LABEL & BUFFER */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-sky-400">SENDER BUFFER (Window marked by orange borders)</span>
            <span className="text-[11px] text-slate-500">Next Frame to Send: {nextFrameToSend}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {senderBuffer.map((seq) => {
              const windowEnd = senderWindowStart + (protocol === 'sw' ? 1 : windowSize);
              const inWindow = seq >= senderWindowStart && seq < windowEnd;
              const isSent = seq < nextFrameToSend;
              const isAcked = protocol === 'sr' ? receivedBuffer[seq] === 'acked' : seq < senderWindowStart;
              
              let cardBg = 'bg-slate-900 border-slate-800 text-slate-600';
              if (inWindow) {
                cardBg = 'bg-slate-900 border-amber-500 text-slate-300 shadow-[0_0_4px_rgba(245,158,11,0.2)]';
              }
              if (isSent && inWindow) {
                cardBg = 'bg-amber-950/40 border-amber-500 text-amber-300';
              }
              if (isAcked) {
                cardBg = 'bg-emerald-950/40 border-emerald-500 text-emerald-400';
              }

              return (
                <div
                  key={seq}
                  className={`w-9 h-9 border-2 flex items-center justify-center rounded-lg font-mono text-xs font-bold transition-all ${cardBg}`}
                >
                  {seq}
                </div>
              );
            })}
          </div>
        </div>

        {/* TRANSIT WIRE */}
        <div className="h-40 border-y border-slate-900 bg-slate-950/80 relative rounded-md overflow-hidden">
          
          <div className="absolute top-2 left-4 text-[10px] uppercase font-bold text-slate-600">Sender → Data Pipe → Receiver</div>
          <div className="absolute bottom-2 left-4 text-[10px] uppercase font-bold text-slate-600">Receiver ← ACK Pipe ← Sender</div>
          
          {/* Middle Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t border-dashed border-slate-800"></div>

          {/* Animating Packets */}
          {transitFrames.map((frame) => {
            const isData = frame.type === 'data';
            const progress = frame.progress;
            
            // X coordinate based on progression and direction
            const xOffset = isData ? progress : (100 - progress);
            
            // Y coordinate based on frame type
            const yOffset = isData ? 'top-[20%]' : 'bottom-[20%]';

            return (
              <div
                key={frame.id}
                onClick={() => handleTransitClick(frame.id)}
                className={`absolute ${yOffset} -translate-x-1/2 transform px-2.5 py-1.5 rounded-md font-mono text-[10px] font-bold cursor-pointer border shadow-lg transition-all hover:scale-105 active:scale-95 ${
                  frame.isLost
                    ? 'bg-rose-950/80 border-rose-500 text-rose-400 line-through decoration-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                    : isData
                    ? 'bg-indigo-900/90 border-indigo-500 text-indigo-200'
                    : 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                }`}
                style={{ left: `${xOffset}%` }}
                title={`Click to toggle loss. Frame: ${frame.seq}`}
              >
                {isData ? `DATA ${frame.seq}` : `ACK ${frame.seq}`}
                {frame.isLost && <span className="block text-[8px] font-normal leading-none mt-0.5 text-center">LOST</span>}
              </div>
            );
          })}

          {transitFrames.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-slate-700 italic">
              No packets in transit. Press Play or Force Timeout.
            </div>
          )}
        </div>

        {/* RECEIVER STATE */}
        <div className="mt-6 flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-emerald-400 block mb-1">RECEIVER WINDOW</span>
            <div className="flex gap-2 items-center">
              <span className="text-slate-400 text-xs font-mono">Expected next in-order:</span>
              <span className="w-8 h-8 bg-emerald-950/80 border border-emerald-500 text-emerald-400 font-mono font-extrabold rounded-md flex items-center justify-center text-sm shadow-[0_0_6px_rgba(16,185,129,0.3)]">
                {expectedFrame}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-slate-500 text-[10px] block font-mono">Received list:</span>
            <div className="flex gap-1 justify-end max-w-xs flex-wrap">
              {Object.keys(receivedBuffer).map(seq => (
                <span key={seq} className="bg-slate-900 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-mono">
                  Frame {seq}
                </span>
              ))}
              {Object.keys(receivedBuffer).length === 0 && <span className="text-slate-600 text-xs italic">Empty</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Event Logs */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">Live Log Console</h4>
        <div className="h-32 overflow-y-auto font-mono text-xs text-slate-300 space-y-1.5 pr-2">
          {logs.map((log) => {
            let color = 'text-slate-300';
            if (log.type === 'send') color = 'text-indigo-400';
            if (log.type === 'recv') color = 'text-sky-300';
            if (log.type === 'success') color = 'text-emerald-400';
            if (log.type === 'warn') color = 'text-amber-400 font-semibold';
            if (log.type === 'error') color = 'text-rose-400 font-bold';
            
            return (
              <div key={log.id} className={color}>
                {log.text}
              </div>
            );
          })}
          {logs.length === 0 && <div className="text-slate-600 italic">No events logged yet. Press Play.</div>}
        </div>
      </div>
    </div>
  );
}
