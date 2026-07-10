import React, { useState } from 'react';

export default function SubnettingCalculator() {
  const [ip, setIp] = useState('192.168.1.85');
  const [cidr, setCidr] = useState(26);
  const parseIp = (ipStr) => {
    const parts = ipStr.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      return null;
    }
    return parts;
  };

  const ipParts = parseIp(ip);
  const error = ipParts ? '' : 'Invalid IPv4 address format (must be 4 octets between 0 and 255).';

  const calculateSubnet = () => {
    if (!ipParts) {
      return null;
    }

    const hostBits = 32 - cidr;
    const totalHosts = Math.pow(2, hostBits);
    const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;

    // Subnet mask calculation
    let maskBinary = '1'.repeat(cidr) + '0'.repeat(hostBits);
    const maskParts = [];
    for (let i = 0; i < 4; i++) {
      maskParts.push(parseInt(maskBinary.substring(i * 8, (i + 1) * 8), 2));
    }
    const maskStr = maskParts.join('.');

    // Wildcard mask calculation
    const wildcardParts = maskParts.map(p => 255 - p);
    const wildcardStr = wildcardParts.join('.');

    // Network IP and Broadcast IP calculation
    const ipBinary = ipParts.map(p => p.toString(2).padStart(8, '0')).join('');
    const networkBinary = ipBinary.substring(0, cidr) + '0'.repeat(hostBits);
    const broadcastBinary = ipBinary.substring(0, cidr) + '1'.repeat(hostBits);

    const networkParts = [];
    const broadcastParts = [];
    for (let i = 0; i < 4; i++) {
      networkParts.push(parseInt(networkBinary.substring(i * 8, (i + 1) * 8), 2));
      broadcastParts.push(parseInt(broadcastBinary.substring(i * 8, (i + 1) * 8), 2));
    }
    const networkStr = networkParts.join('.');
    const broadcastStr = broadcastParts.join('.');

    // Usable range
    let usableRange = 'N/A';
    if (cidr < 31) {
      const firstUsable = [...networkParts];
      firstUsable[3] += 1;
      const lastUsable = [...broadcastParts];
      lastUsable[3] -= 1;
      usableRange = `${firstUsable.join('.')} to ${lastUsable.join('.')}`;
    }

    // IP Class detection
    let ipClass = 'Unknown';
    const firstOctet = ipParts[0];
    if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'A (Private range: 10.0.0.0/8)';
    else if (firstOctet === 127) ipClass = 'Loopback (127.0.0.0/8)';
    else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B (Private range: 172.16.0.0/12)';
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C (Private range: 192.168.0.0/16)';
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)';
    else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'E (Experimental)';

    return {
      maskStr,
      wildcardStr,
      networkStr,
      broadcastStr,
      usableRange,
      usableHosts,
      totalHosts,
      hostBits,
      ipClass,
      ipBinary,
      networkBinary,
      maskBinary
    };
  };

  const results = calculateSubnet();

  // Helper for binary color rendering
  const renderBinaryWithSplit = (binaryStr, splitIdx) => {
    const netPart = binaryStr.substring(0, splitIdx);
    const hostPart = binaryStr.substring(splitIdx);
    
    // Group into octets of 8
    const formatOctets = (str) => {
      const chunks = [];
      for (let i = 0; i < str.length; i += 8) {
        chunks.push(str.substring(i, i + 8));
      }
      return chunks;
    };

    let totalOffset = 0;
    return (
      <span className="binary-display font-mono">
        {formatOctets(binaryStr).map((octet, oIdx) => {
          return (
            <span key={oIdx} className="octet-block">
              {octet.split('').map((char, charIdx) => {
                const globalIdx = totalOffset++;
                const isNetwork = globalIdx < splitIdx;
                return (
                  <span
                    key={charIdx}
                    className={isNetwork ? 'bit-net text-sky-400' : 'bit-host text-rose-400'}
                    title={isNetwork ? 'Network Bit' : 'Host Bit'}
                  >
                    {char}
                  </span>
                );
              })}
              {oIdx < 3 && <span className="bit-dot text-slate-500">.</span>}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className="subnet-calculator-card glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-sky-400">
        🌐 Interactive Subnetting Visualizer
      </h3>
      <p className="text-slate-400 text-sm mb-6">
        Practice classless subnetting. Enter any IPv4 address and select a prefix size to see exactly how bits are allocated and how subnets are calculated step-by-step.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">IPv4 Address</label>
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-sky-500 font-mono transition"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="e.g. 192.168.1.10"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">CIDR Prefix (/{cidr})</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="32"
              className="w-full accent-sky-500 cursor-pointer"
              value={cidr}
              onChange={(e) => setCidr(Number(e.target.value))}
            />
            <span className="font-mono text-sky-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-md font-bold">
              /{cidr}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/50 border border-rose-900 text-rose-400 rounded-lg p-3 text-sm mb-6">
          ⚠️ {error}
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 text-center">
              <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Subnet Mask</span>
              <span className="font-mono font-bold text-slate-100 text-sm md:text-base">{results.maskStr}</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 text-center">
              <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Network IP</span>
              <span className="font-mono font-bold text-sky-400 text-sm md:text-base">{results.networkStr}</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 text-center">
              <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Broadcast IP</span>
              <span className="font-mono font-bold text-rose-400 text-sm md:text-base">{results.broadcastStr}</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 text-center">
              <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Usable Hosts</span>
              <span className="font-mono font-bold text-emerald-400 text-sm md:text-base">{results.usableHosts.toLocaleString()}</span>
            </div>
          </div>

          {/* Binary Visualization */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 flex justify-between items-center">
              <span>Bit Stream Analysis</span>
              <span className="flex gap-4 normal-case text-slate-500 font-normal">
                <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 bg-sky-500 rounded-sm"></span> Network bits ({cidr})</span>
                <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span> Host bits ({results.hostBits})</span>
              </span>
            </h4>
            <div className="space-y-3 font-mono text-sm md:text-base">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 border-b border-slate-800 pb-2">
                <span className="text-slate-400 text-xs w-28 uppercase font-bold">IP Address:</span>
                {renderBinaryWithSplit(results.ipBinary, cidr)}
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 border-b border-slate-800 pb-2">
                <span className="text-slate-400 text-xs w-28 uppercase font-bold">Subnet Mask:</span>
                {renderBinaryWithSplit(results.maskBinary, cidr)}
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span className="text-slate-400 text-xs w-28 uppercase font-bold">Network ID:</span>
                {renderBinaryWithSplit(results.networkBinary, cidr)}
              </div>
            </div>
          </div>

          {/* Details & Exam Formula Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60">
              <h4 className="font-bold text-sky-400 mb-3">📋 Subnet Parameters</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex justify-between"><span className="text-slate-500">IP Class:</span> <span>Class {results.ipClass}</span></li>
                <li className="flex justify-between"><span className="text-slate-500">Wildcard Mask:</span> <span className="font-mono">{results.wildcardStr}</span></li>
                <li className="flex justify-between"><span className="text-slate-500">Usable Range:</span> <span className="font-mono text-emerald-400">{results.usableRange}</span></li>
                <li className="flex justify-between"><span className="text-slate-500">Total Host IPs:</span> <span className="font-mono">{results.totalHosts}</span></li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60">
              <h4 className="font-bold text-indigo-400 mb-3">🎓 Professor's Solving Steps</h4>
              <div className="text-xs space-y-2 text-slate-400 overflow-y-auto max-h-32">
                <p>
                  <strong>Step 1:</strong> Find Host Bits. H = 32 - CIDR_Prefix = 32 - {cidr} = {results.hostBits} bits.
                </p>
                <p>
                  <strong>Step 2:</strong> Usable Hosts. Calculated as 2^H - 2 = 2^{results.hostBits} - 2 = {results.usableHosts} hosts.
                </p>
                <p>
                  <strong>Step 3:</strong> Subnet block size is 2^H = 2^{results.hostBits} = {results.totalHosts} addresses.
                </p>
                <p>
                  <strong>Step 4:</strong> The network address is found by logical AND between the IP and the mask. The increment size is {results.totalHosts}. The network address for IP {ip} falls in the increment range of {results.networkStr}.
                </p>
                <p>
                  <strong>Step 5:</strong> Broadcast address is Network Address + Block Size - 1 = {results.networkStr} + {results.totalHosts} - 1 = {results.broadcastStr}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
