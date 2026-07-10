import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function NumericalGenerator() {
  const [activeType, setActiveType] = useState('subnet'); // 'subnet', 'shannon', 'crc', 'sliding'
  const [problem, setProblem] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  // Generate a random problem based on type
  const generateProblem = (type = activeType) => {
    setShowSolution(false);
    
    if (type === 'subnet') {
      const classes = [
        { base: '192.168.', max: 254 },
        { base: '172.16.', max: 31 },
        { base: '10.', max: 254 }
      ];
      const selectedClass = classes[Math.floor(Math.random() * classes.length)];
      let ip = '';
      if (selectedClass.base === '192.168.') {
        ip = `192.168.${Math.floor(Math.random() * 255)}.0`;
      } else if (selectedClass.base === '172.16.') {
        ip = `172.${16 + Math.floor(Math.random() * 16)}.${Math.floor(Math.random() * 255)}.0`;
      } else {
        ip = `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.0`;
      }

      const prefixes = [25, 26, 27, 28, 29, 30];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      
      setProblem({
        type: 'subnet',
        ip,
        prefix
      });
    } 
    
    else if (type === 'shannon') {
      const bandwidths = [3000, 4000, 10000, 50000, 1000000, 5000000]; // in Hz
      const snrdbs = [10, 20, 30, 40, 50]; // in dB
      const levels = [2, 4, 8, 16, 32, 64];

      const b = bandwidths[Math.floor(Math.random() * bandwidths.length)];
      const snrdb = snrdbs[Math.floor(Math.random() * snrdbs.length)];
      const l = levels[Math.floor(Math.random() * levels.length)];

      setProblem({
        type: 'shannon',
        b,
        snrdb,
        l
      });
    } 
    
    else if (type === 'crc') {
      // Random 8-bit dataword
      let dataword = '';
      for (let i = 0; i < 8; i++) {
        dataword += Math.random() > 0.5 ? '1' : '0';
      }
      if (dataword[0] === '0') dataword = '1' + dataword.slice(1); // ensure leading 1

      const generators = [
        { code: '1011', poly: 'X^3 + X + 1', r: 3 },
        { code: '1101', poly: 'X^3 + X^2 + 1', r: 3 },
        { code: '10011', poly: 'X^4 + X + 1', r: 4 }
      ];
      const gen = generators[Math.floor(Math.random() * generators.length)];

      setProblem({
        type: 'crc',
        dataword,
        gen
      });
    } 
    
    else if (type === 'sliding') {
      const bandwidths = [1, 10, 100]; // in Mbps
      const distances = [100, 500, 1000, 2000]; // in km
      const frameSizes = [500, 1000, 1500]; // in Bytes
      const windows = [4, 8, 15, 31, 63];

      const r = bandwidths[Math.floor(Math.random() * bandwidths.length)];
      const d = distances[Math.floor(Math.random() * distances.length)];
      const frame = frameSizes[Math.floor(Math.random() * frameSizes.length)];
      const w = windows[Math.floor(Math.random() * windows.length)];

      setProblem({
        type: 'sliding',
        r,
        d,
        frame,
        w
      });
    }
  };

  // Generate initial problem
  useEffect(() => {
    generateProblem();
  }, [activeType]);

  // Typeset math when solution is shown or problem changes
  useEffect(() => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise().catch(err => console.error(err));
    }
  }, [problem, showSolution]);

  // Subnet calculations
  const getSubnetSolution = () => {
    if (!problem) return null;
    const { ip, prefix } = problem;
    const ipOctets = ip.split('.').map(Number);
    const subnetBits = prefix - 24;
    const hostBits = 32 - prefix;
    const totalHosts = Math.pow(2, hostBits);
    const usableHosts = totalHosts - 2;
    
    // Netmask calculation
    let lastOctet = 0;
    for (let i = 0; i < subnetBits; i++) {
      lastOctet += Math.pow(2, 7 - i);
    }
    const mask = `255.255.255.${lastOctet}`;

    // Subnets sizes & boundary
    const blockSize = 256 - lastOctet;
    
    // Solve starting IP and broadcasting for the specific block
    const baseOctet = ipOctets[3];
    const blockIndex = Math.floor(baseOctet / blockSize);
    const networkAddr = `${ipOctets[0]}.${ipOctets[1]}.${ipOctets[2]}.${blockIndex * blockSize}`;
    const broadcastAddr = `${ipOctets[0]}.${ipOctets[1]}.${ipOctets[2]}.${(blockIndex + 1) * blockSize - 1}`;
    const firstUsable = `${ipOctets[0]}.${ipOctets[1]}.${ipOctets[2]}.${blockIndex * blockSize + 1}`;
    const lastUsable = `${ipOctets[0]}.${ipOctets[1]}.${ipOctets[2]}.${(blockIndex + 1) * blockSize - 2}`;

    return {
      mask,
      networkAddr,
      broadcastAddr,
      firstUsable,
      lastUsable,
      usableHosts,
      totalHosts,
      blockSize,
      hostBits
    };
  };

  // Shannon/Nyquist calculations
  const getShannonSolution = () => {
    if (!problem) return null;
    const { b, snrdb, l } = problem;
    
    // Nyquist bit rate
    const nyquist = 2 * b * Math.log2(l);
    
    // Shannon capacity
    const snrLinear = Math.pow(10, snrdb / 10);
    const shannon = b * Math.log2(1 + snrLinear);

    return {
      nyquist: nyquist.toFixed(2),
      snrLinear: snrLinear.toFixed(2),
      shannon: shannon.toFixed(2)
    };
  };

  // CRC calculations
  const getCrcSolution = () => {
    if (!problem) return null;
    const { dataword, gen } = problem;
    const { code, r } = gen;

    // Appended bits
    const appended = dataword + '0'.repeat(r);
    
    // Perform modulo-2 division
    let divisor = code.split('').map(Number);
    let dividend = appended.split('').map(Number);
    
    let remainderSteps = [];
    let current = [...dividend];

    for (let i = 0; i <= dividend.length - code.length; i++) {
      if (current[i] === 1) {
        remainderSteps.push({
          index: i,
          val: current.slice(i, i + code.length).join(''),
          xor: current.slice(i, i + code.length).map((v, idx) => v ^ divisor[idx]).join('')
        });
        for (let j = 0; j < code.length; j++) {
          current[i + j] = current[i + j] ^ divisor[j];
        }
      }
    }

    const remainder = current.slice(dividend.length - r).join('');
    const codeword = dataword + remainder;

    return {
      appended,
      remainder,
      codeword,
      steps: remainderSteps
    };
  };

  // Sliding window calculations
  const getSlidingSolution = () => {
    if (!problem) return null;
    const { r, d, frame, w } = problem;
    
    // Speed of signal in medium (2 * 10^8 m/s)
    const s = 200000; // in km/s (2 * 10^8 m/s = 200,000 km/s)
    const tProp = d / s; // in seconds
    const tPropMs = tProp * 1000;

    // Frame size in bits
    const lBits = frame * 8;
    // Rate in bps
    const rBps = r * 1000000;
    const tTrans = lBits / rBps; // in seconds
    const tTransMs = tTrans * 1000;

    const a = tProp / tTrans;
    const effSW = 1 / (1 + 2 * a);
    const effSliding = Math.min(1.0, w / (1 + 2 * a));

    return {
      tProp: tProp.toFixed(6),
      tPropMs: tPropMs.toFixed(3),
      tTrans: tTrans.toFixed(6),
      tTransMs: tTransMs.toFixed(3),
      a: a.toFixed(4),
      effSW: (effSW * 100).toFixed(2),
      effSliding: (effSliding * 100).toFixed(2),
      requiredWindow: Math.ceil(1 + 2 * a)
    };
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-sky-400">
            🎲 Dynamic Numerical Generator
          </h3>
          <p className="text-slate-400 text-sm">
            Generate unlimited, unique exam-style network numericals with fully explained step-by-step LaTeX mathematical derivations.
          </p>
        </div>

        <button
          onClick={() => generateProblem()}
          className="flex items-center gap-1.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-extrabold py-2 px-4 rounded-xl text-xs transition cursor-pointer select-none"
        >
          <Sparkles className="w-3.5 h-3.5" /> New Problem
        </button>
      </div>

      {/* Simulator Secondary Selector Navigation */}
      <div className="bg-[#0c1222] border border-slate-900 rounded-2xl p-2.5 flex flex-wrap gap-2 select-none justify-center mb-6">
        {[
          { id: 'subnet', label: '🌐 Subnetting' },
          { id: 'shannon', label: '📊 Capacity Limits' },
          { id: 'crc', label: '🔑 CRC Division' },
          { id: 'sliding', label: '🎚️ Sliding Window' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveType(tab.id);
              generateProblem(tab.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
              activeType === tab.id
                ? 'bg-sky-500 text-slate-950 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Numerical Card */}
      {problem && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 mb-6">
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase block mb-1">
            Question Statement
          </span>
          
          {/* Question Text */}
          {problem.type === 'subnet' && (
            <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed">
              An administrator assigns the network block <strong className="text-sky-300 font-mono">{problem.ip}/{problem.prefix}</strong>. 
              Find the network mask, network address, range of usable IP addresses, broadcast address, and total usable hosts in this subnet.
            </p>
          )}

          {problem.type === 'shannon' && (
            <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed">
              A channel has a bandwidth of <strong className="text-sky-300 font-mono">{(problem.b / 1000).toFixed(1)} kHz</strong> and 
              an SNR of <strong className="text-sky-300 font-mono">{problem.snrdb} dB</strong>. 
              If the transmitter uses <strong className="text-sky-300 font-mono">{problem.l} signal levels</strong>, calculate:
              <span className="block mt-2 pl-4">1. The maximum noiseless channel capacity (Nyquist Limit).</span>
              <span className="block pl-4">2. The maximum noisy channel capacity (Shannon Limit).</span>
            </p>
          )}

          {problem.type === 'crc' && (
            <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed">
              Compute the transmitted CRC codeword for the dataword <strong className="text-sky-300 font-mono">"{problem.dataword}"</strong> 
              using the generator polynomial <strong className="text-sky-300 font-mono">G(X) = {problem.gen.poly}</strong> (binary bit divisor: <strong className="text-sky-300 font-mono">{problem.gen.code}</strong>).
            </p>
          )}

          {problem.type === 'sliding' && (
            <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed">
              A sliding window connection operates over a <strong className="text-sky-300 font-mono">{problem.d} km</strong> point-to-point fiber link. 
              The transmission rate is <strong className="text-sky-300 font-mono">{problem.r} Mbps</strong>, the frame size is <strong className="text-sky-300 font-mono">{problem.frame} Bytes</strong>, 
              and the propagation speed in the fiber is <strong className="text-sky-300 font-mono">2 * 10^8 m/s</strong>. 
              Find the efficiency of:
              <span className="block mt-2 pl-4">1. Stop-and-Wait protocol.</span>
              <span className="block pl-4">2. Sliding Window protocol with window size <strong className="text-sky-300 font-mono">W = {problem.w}</strong>.</span>
              <span className="block pl-4">3. The minimum window size required to achieve 100% link utilization.</span>
            </p>
          )}

          {/* Reveal Solution Button */}
          <div className="mt-6 flex justify-start">
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-sky-400 font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer select-none"
            >
              {showSolution ? 'Hide Solution' : '👁️ Reveal Step-by-Step Solution'}
            </button>
          </div>
        </div>
      )}

      {/* LaTeX Solution Box */}
      {showSolution && problem && (
        <div className="bg-slate-950/45 border border-slate-900 p-6 rounded-2xl space-y-6">
          <h4 className="text-xs uppercase font-mono tracking-widest text-slate-500 font-extrabold pb-2 border-b border-slate-900">
            📝 Step-by-Step Derivation & Solution
          </h4>

          {/* Subnetting solution details */}
          {problem.type === 'subnet' && (() => {
            const sol = getSubnetSolution();
            return (
              <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                <div>
                  <strong className="text-sky-400 block mb-1">1. Identify Host Bits:</strong>
                  An IPv4 address has 32 bits. The netmask uses {problem.prefix} bits for the network.
                  {String.raw`$$\text{Host bits } H = 32 - ${problem.prefix} = ${sol.hostBits}\text{ bits}$$`}
                </div>

                <div>
                  <strong className="text-sky-400 block mb-1">2. Calculate Total & Usable Hosts:</strong>
                  The network address (all host bits 0) and the broadcast address (all host bits 1) are reserved and cannot be assigned.
                  {String.raw`$$\text{Total hosts} = 2^{${sol.hostBits}} = ${sol.totalHosts}$$`}
                  {String.raw`$$\text{Usable hosts} = 2^{${sol.hostBits}} - 2 = ${sol.usableHosts}$$`}
                </div>

                <div>
                  <strong className="text-sky-400 block mb-1">3. Netmask Conversion:</strong>
                  The prefix /{problem.prefix} means the first {problem.prefix} bits are 1. In dotted-decimal:
                  {String.raw`$$\text{Mask} = 255.255.255.${256 - sol.blockSize} \quad (\text{since the last octet has } ${sol.hostBits} \text{ host bits set to 0})$$`}
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono space-y-2">
                  <div className="flex justify-between border-b border-slate-900 pb-1.5 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <span>Parameter</span>
                    <span>Computed IP Value</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subnet Mask:</span>
                    <span className="text-slate-200 font-bold">{sol.mask}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Network ID:</span>
                    <span className="text-slate-200 font-bold">{sol.networkAddr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">First Usable:</span>
                    <span className="text-emerald-400 font-bold">{sol.firstUsable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Usable:</span>
                    <span className="text-emerald-400 font-bold">{sol.lastUsable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Broadcast Address:</span>
                    <span className="text-slate-200 font-bold">{sol.broadcastAddr}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Shannon/Nyquist Solution Details */}
          {problem.type === 'shannon' && (() => {
            const sol = getShannonSolution();
            return (
              <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                <div>
                  <strong className="text-sky-400 block mb-1">1. Nyquist Limit (Noiseless capacity):</strong>
                  Using Nyquist's formula with {"$B = " + problem.b + "\\text{ Hz}$"} and {"$L = " + problem.l + "$"} levels:
                  {String.raw`$$\text{Capacity}_{\text{Nyquist}} = 2 \times B \times \log_2(L)$$`}
                  {String.raw`$$\text{Capacity}_{\text{Nyquist}} = 2 \times ${problem.b} \times \log_2(${problem.l})$$`}
                  {String.raw`$$\text{Capacity}_{\text{Nyquist}} = 2 \times ${problem.b} \times ${Math.log2(problem.l)} = ${sol.nyquist}\text{ bps} \approx ${(sol.nyquist / 1000).toFixed(2)}\text{ kbps}$$`}
                </div>

                <div>
                  <strong className="text-sky-400 block mb-1">2. Shannon Capacity (Noisy Limit):</strong>
                  First, convert the SNR from decibels (dB) to linear ratio:
                  {String.raw`$$\text{SNR}_{\text{linear}} = 10^{\frac{\text{SNR}_{\text{dB}}}{10}} = 10^{\frac{${problem.snrdb}}{10}} = ${sol.snrLinear}$$`}
                  Now, plug {"$B = " + problem.b + "\\text{ Hz}$"} and {"$\\text{SNR}_{\\text{linear}}$"} into Shannon's equation:
                  {String.raw`$$\text{Capacity}_{\text{Shannon}} = B \times \log_2(1 + \text{SNR}_{\text{linear}})$$`}
                  {String.raw`$$\text{Capacity}_{\text{Shannon}} = ${problem.b} \times \log_2(1 + ${sol.snrLinear})$$`}
                  {String.raw`$$\text{Capacity}_{\text{Shannon}} = ${problem.b} \times \log_2(${(parseFloat(sol.snrLinear) + 1).toFixed(2)}) \approx ${sol.shannon}\text{ bps} \approx ${(sol.shannon / 1000).toFixed(2)}\text{ kbps}$$`}
                </div>
              </div>
            );
          })()}

          {/* CRC Solution Details */}
          {problem.type === 'crc' && (() => {
            const sol = getCrcSolution();
            return (
              <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                <div>
                  <strong className="text-sky-400 block mb-1">1. Append Zeros:</strong>
                  The generator polynomial divisor is binary <span className="font-mono text-slate-200">"{problem.gen.code}"</span>, which has degree $r = {problem.gen.r}$.
                  We append $r = {problem.gen.r}$ zeros to the dataword:
                  {String.raw`$$\text{Appended String} = ${sol.appended}$$`}
                </div>

                <div>
                  <strong className="text-sky-400 block mb-1">2. Perform Modulo-2 Division (XOR):</strong>
                  We divide the appended bit string by the divisor using XOR subtraction:
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs overflow-x-auto scrollbar-thin text-slate-300 leading-none space-y-1">
                    <div>Divisor: {problem.gen.code}</div>
                    <div className="text-slate-600">----------------------------</div>
                    <div>Dividend: {sol.appended}</div>
                    {sol.steps.map((st, i) => (
                      <div key={i} style={{ paddingLeft: `${st.index * 8}px` }}>
                        <div className="text-slate-500">XOR: {problem.gen.code}</div>
                        <div className="text-emerald-400">Rem: {st.xor}</div>
                      </div>
                    ))}
                    <div className="text-slate-600">----------------------------</div>
                    <div className="text-amber-400 font-bold">Final Remainder (Checksum): {sol.remainder}</div>
                  </div>
                </div>

                <div>
                  <strong className="text-sky-400 block mb-1">3. Form the Codeword:</strong>
                  We replace the appended zeros with the final modulo-2 remainder:
                  {String.raw`$$\text{Codeword} = ${sol.codeword}$$`}
                </div>
              </div>
            );
          })()}

          {/* Sliding Window Solution Details */}
          {problem.type === 'sliding' && (() => {
            const sol = getSlidingSolution();
            return (
              <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                <div>
                  <strong className="text-sky-400 block mb-1">1. Calculate Propagation Delay ({"$T_{\\text{prop}}$"}):</strong>
                  Speed in fiber is {"$2 \\times 10^5\\text{ km/s}$"}. Distance is {problem.d} km.
                  {String.raw`$$T_{\text{prop}} = \frac{\text{Distance}}{\text{Speed}} = \frac{${problem.d}}{200000} = ${sol.tProp}\text{ s} = ${sol.tPropMs}\text{ ms}$$`}
                </div>

                <div>
                  <strong className="text-sky-400 block mb-1">2. Calculate Transmission Delay ({"$T_{\\text{trans}}$"}):</strong>
                  Frame size is {problem.frame} Bytes = {problem.frame * 8} bits.
                  Bandwidth is {problem.r} Mbps = {problem.r * 1000000} bps.
                  {String.raw`$$T_{\text{trans}} = \frac{\text{Frame Size (bits)}}{\text{Bandwidth (bps)}} = \frac{${problem.frame * 8}}{${problem.r * 1000000}} = ${sol.tTrans}\text{ s} = ${sol.tTransMs}\text{ ms}$$`}
                </div>

                <div>
                  <strong className="text-sky-400 block mb-1">3. Calculate Ratio '$a$':</strong>
                  {String.raw`$$a = \frac{T_{\text{prop}}}{T_{\text{trans}}} = \frac{${sol.tPropMs}}{${sol.tTransMs}} = ${sol.a}$$`}
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-1">Stop-and-Wait Efficiency</span>
                    <span className="text-slate-200 font-bold">
                      {String.raw`$$\eta = \frac{1}{1 + 2a} = \frac{1}{1 + 2 \times ${sol.a}} = ${sol.effSW}\%$$`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-1">Sliding Window Efficiency (W = {problem.w})</span>
                    <span className="text-slate-200 font-bold">
                      {String.raw`$$\eta = \min\left(1.0, \frac{W}{1 + 2a}\right) = \min\left(1.0, \frac{${problem.w}}{1 + 2 \times ${sol.a}}\right) = ${sol.effSliding}\%$$`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-1">Minimum Window for 100% Link Utilization</span>
                    <span className="text-emerald-400 font-bold">
                      {String.raw`$$W_{\text{100\%}} = \lceil 1 + 2a \rceil = \lceil 1 + 2 \times ${sol.a} \rceil = ${sol.requiredWindow}\text{ packets}$$`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      )}

    </div>
  );
}
