import React, { useState } from 'react';

const OSI_LAYERS = [
  {
    num: 7, name: 'Application',
    pdu: 'Data / Message',
    color: { bg: '#1a0a2e', border: '#7c3aed', accent: '#a78bfa', glow: 'rgba(124,58,237,0.35)' },
    emoji: '🌐',
    mnemonic: 'All',
    functions: [
      'Provides network services directly to end-user applications',
      'Handles resource sharing, remote file access, and network management',
      'Manages session establishment, maintenance, and termination for applications',
      'Provides user authentication and privacy',
    ],
    protocols: ['HTTP / HTTPS', 'FTP / SFTP', 'SMTP / IMAP / POP3', 'DNS', 'DHCP', 'Telnet / SSH', 'SNMP'],
    devices: ['Web Browsers', 'Email Clients', 'FTP Clients', 'DNS Servers', 'Application Gateways'],
  },
  {
    num: 6, name: 'Presentation',
    pdu: 'Data',
    color: { bg: '#0e1a30', border: '#2563eb', accent: '#60a5fa', glow: 'rgba(37,99,235,0.35)' },
    emoji: '🎨',
    mnemonic: 'People',
    functions: [
      'Translates data between application format and network format',
      'Handles data encryption and decryption (SSL/TLS)',
      'Performs data compression to reduce transmission size',
      'Ensures that data from one system can be read by another (character encoding)',
    ],
    protocols: ['SSL / TLS', 'JPEG / PNG / GIF', 'MPEG / MP4', 'ASCII / Unicode', 'XDR'],
    devices: ['Encryption/Decryption Hardware', 'Codecs', 'Format Converters'],
  },
  {
    num: 5, name: 'Session',
    pdu: 'Data',
    color: { bg: '#0e1f1a', border: '#0d9488', accent: '#2dd4bf', glow: 'rgba(13,148,136,0.35)' },
    emoji: '🤝',
    mnemonic: 'Seem',
    functions: [
      'Establishes, maintains, and terminates communication sessions',
      'Provides dialog control (half-duplex vs full-duplex)',
      'Synchronizes data exchange with checkpoints',
      'Manages token management and activity management',
    ],
    protocols: ['NetBIOS', 'RPC (Remote Procedure Call)', 'PPTP', 'SAP', 'SCP'],
    devices: ['Session Controllers', 'NetBIOS Nodes', 'RPC Servers'],
  },
  {
    num: 4, name: 'Transport',
    pdu: 'Segment (TCP) / Datagram (UDP)',
    color: { bg: '#1a1000', border: '#d97706', accent: '#fbbf24', glow: 'rgba(217,119,6,0.35)' },
    emoji: '🚚',
    mnemonic: 'To',
    functions: [
      'Provides end-to-end communication and data flow control',
      'Handles segmentation and reassembly of data',
      'Error detection, error correction, and retransmission',
      'Flow control (sliding window), congestion control',
      'Multiplexing via port numbers',
    ],
    protocols: ['TCP (Transmission Control Protocol)', 'UDP (User Datagram Protocol)', 'SCTP', 'DCCP'],
    devices: ['Firewalls (layer 4)', 'Load Balancers', 'Gateways'],
  },
  {
    num: 3, name: 'Network',
    pdu: 'Packet',
    color: { bg: '#0a1a10', border: '#16a34a', accent: '#4ade80', glow: 'rgba(22,163,74,0.35)' },
    emoji: '🗺️',
    mnemonic: 'Need',
    functions: [
      'Handles logical addressing (IP addresses)',
      'Responsible for packet routing between networks',
      'Performs fragmentation and reassembly of packets',
      'Provides inter-network communication (internetworking)',
      'Implements routing protocols to find best paths',
    ],
    protocols: ['IP (IPv4 / IPv6)', 'ICMP', 'IGMP', 'OSPF', 'BGP', 'RIP', 'ARP (conceptually)'],
    devices: ['Routers', 'Layer 3 Switches', 'Multilayer Switches'],
  },
  {
    num: 2, name: 'Data Link',
    pdu: 'Frame',
    color: { bg: '#1a0a10', border: '#e11d48', accent: '#fb7185', glow: 'rgba(225,29,72,0.35)' },
    emoji: '🔗',
    mnemonic: 'Do',
    functions: [
      'Provides reliable node-to-node data transfer (within a LAN)',
      'Handles framing: packaging raw bits into frames',
      'Physical addressing using MAC addresses',
      'Error detection via CRC (Cyclic Redundancy Check)',
      'Flow control and access control (CSMA/CD, CSMA/CA)',
    ],
    protocols: ['Ethernet (IEEE 802.3)', 'Wi-Fi (IEEE 802.11)', 'PPP', 'HDLC', 'ARP', 'VLAN (802.1Q)'],
    devices: ['Switches', 'Bridges', 'NICs (Network Interface Cards)', 'Access Points'],
  },
  {
    num: 1, name: 'Physical',
    pdu: 'Bit',
    color: { bg: '#0d1220', border: '#475569', accent: '#94a3b8', glow: 'rgba(71,85,105,0.35)' },
    emoji: '⚡',
    mnemonic: 'Please',
    functions: [
      'Transmits raw bits over the physical medium (electrical, optical, or radio)',
      'Defines hardware specifications: cables, connectors, voltages, frequencies',
      'Sets data rate (bit rate) and synchronization of bits',
      'Defines physical topology (bus, star, ring, mesh)',
    ],
    protocols: ['Ethernet (physical spec)', 'USB', 'Bluetooth', 'DSL', 'SONET/SDH', 'RS-232'],
    devices: ['Hubs', 'Repeaters', 'Cables (Coaxial, Fiber, UTP)', 'Modems', 'Antennas'],
  },
];

const LEVELS = ['functions', 'protocols', 'devices'];
const LEVEL_LABELS = {
  functions: '⚙️ Functions',
  protocols: '📡 Protocols',
  devices: '🖥️ Devices',
};

export default function OsiDiagram() {
  const [hoveredLayer, setHoveredLayer] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [revealLevel, setRevealLevel] = useState(0); // 0=nothing, 1=functions, 2=protocols, 3=devices

  const handleLayerClick = (layerNum) => {
    if (selectedLayer === layerNum) {
      // Cycle through levels, then close
      if (revealLevel < 3) {
        setRevealLevel(l => l + 1);
      } else {
        setSelectedLayer(null);
        setRevealLevel(0);
      }
    } else {
      setSelectedLayer(layerNum);
      setRevealLevel(1);
    }
  };

  const selected = OSI_LAYERS.find(l => l.num === selectedLayer);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-sky-400 flex items-center gap-2 mb-1">
          🌐 Interactive OSI Model
        </h3>
        <p className="text-slate-400 text-sm">
          <strong className="text-slate-300">Hover</strong> to highlight a layer ·{' '}
          <strong className="text-slate-300">Click</strong> to see Functions →{' '}
          <strong className="text-slate-300">Click again</strong> for Protocols →{' '}
          <strong className="text-slate-300">Click again</strong> for Devices
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Layer Stack */}
        <div className="flex flex-col gap-1.5 lg:w-72 shrink-0">
          {/* Mnemonic header */}
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-600 font-mono px-2 mb-1">
            Mnemonic: <span className="text-slate-400">"All People Seem To Need Data Processing"</span>
          </div>

          {OSI_LAYERS.map((layer) => {
            const isHovered = hoveredLayer === layer.num;
            const isSelected = selectedLayer === layer.num;
            const isDimmed = selectedLayer !== null && !isSelected;

            return (
              <button
                key={layer.num}
                onMouseEnter={() => setHoveredLayer(layer.num)}
                onMouseLeave={() => setHoveredLayer(null)}
                onClick={() => handleLayerClick(layer.num)}
                className="w-full text-left rounded-xl px-4 py-3 transition cursor-pointer select-none"
                style={{
                  background: isSelected
                    ? layer.color.bg.replace('0.45', '0.7')
                    : isHovered
                    ? layer.color.bg
                    : '#0c1222',
                  border: `1.5px solid ${isSelected || isHovered ? layer.color.border : '#1e293b'}`,
                  boxShadow: isSelected
                    ? `0 0 20px ${layer.color.glow}, inset 0 0 12px ${layer.color.glow}`
                    : isHovered
                    ? `0 0 10px ${layer.color.glow}`
                    : 'none',
                  opacity: isDimmed ? 0.45 : 1,
                  transform: isSelected ? 'scaleX(1.02)' : isHovered ? 'scaleX(1.01)' : 'scaleX(1)',
                  transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Layer number badge */}
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black font-mono shrink-0"
                      style={{ background: layer.color.border + '33', color: layer.color.accent, border: `1px solid ${layer.color.border}50` }}
                    >
                      {layer.num}
                    </span>
                    <div>
                      <div className="text-sm font-bold leading-tight" style={{ color: isSelected || isHovered ? layer.color.accent : '#cbd5e1' }}>
                        {layer.emoji} {layer.name}
                      </div>
                      <div className="text-[10px] font-mono mt-0.5" style={{ color: isSelected || isHovered ? layer.color.accent + 'aa' : '#475569' }}>
                        PDU: {layer.pdu}
                      </div>
                    </div>
                  </div>

                  {/* Click indicator */}
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span className="text-[10px] font-mono" style={{ color: layer.color.border }}>
                      {layer.mnemonic}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] text-slate-500">
                        {revealLevel}/3 ▸
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Close hint */}
          {selectedLayer && (
            <button
              onClick={() => { setSelectedLayer(null); setRevealLevel(0); }}
              className="text-[10px] text-slate-600 hover:text-slate-400 mt-1 text-center transition cursor-pointer"
            >
              ✕ Click selected layer 3× or click here to close
            </button>
          )}
        </div>

        {/* Detail Panel */}
        <div className="flex-1 min-h-[400px]">
          {!selected ? (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 border border-dashed border-slate-800 rounded-2xl p-8">
              <div className="text-5xl opacity-30">🌐</div>
              <div>
                <p className="text-slate-500 text-sm font-semibold">Select a layer to explore</p>
                <p className="text-slate-600 text-xs mt-1">Click any layer on the left to reveal its details step by step</p>
              </div>
              {/* Quick reference table */}
              <div className="w-full mt-2 border border-slate-900 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-4 bg-slate-900 text-slate-500 font-bold uppercase tracking-wider px-3 py-2">
                  <span>#</span><span>Layer</span><span>PDU</span><span>Key Device</span>
                </div>
                {OSI_LAYERS.map(l => (
                  <div key={l.num} className="grid grid-cols-4 px-3 py-1.5 border-t border-slate-900 text-slate-400 hover:bg-slate-900/40 transition">
                    <span className="font-mono font-bold" style={{ color: l.color.accent }}>{l.num}</span>
                    <span>{l.emoji} {l.name}</span>
                    <span className="font-mono text-slate-500 text-[10px] self-center">{l.pdu.split('(')[0].trim()}</span>
                    <span className="text-slate-500 text-[10px] self-center">{l.devices[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Selected layer detail */
            <div
              key={`${selected.num}-${revealLevel}`}
              className="rounded-2xl border p-5 space-y-4 h-full"
              style={{
                background: selected.color.bg,
                borderColor: selected.color.border,
                boxShadow: `0 0 30px ${selected.color.glow}`,
                animation: 'fadeSlideIn 0.25s ease-out',
              }}
            >
              {/* Layer header */}
              <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: selected.color.border + '50' }}>
                <span className="text-4xl">{selected.emoji}</span>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider" style={{ color: selected.color.accent + 'aa' }}>
                    Layer {selected.num} of 7
                  </div>
                  <h3 className="text-xl font-extrabold" style={{ color: selected.color.accent }}>
                    {selected.name} Layer
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">PDU: <span className="font-mono text-slate-400">{selected.pdu}</span></div>
                </div>
                {/* Progress dots */}
                <div className="ml-auto flex gap-1.5">
                  {[1, 2, 3].map(l => (
                    <div
                      key={l}
                      className="w-2 h-2 rounded-full transition"
                      style={{ background: revealLevel >= l ? selected.color.accent : selected.color.border + '40' }}
                    />
                  ))}
                </div>
              </div>

              {/* Functions — Level 1+ */}
              {revealLevel >= 1 && (
                <div style={{ animation: revealLevel === 1 ? 'fadeSlideIn 0.3s ease-out' : 'none' }}>
                  <h4 className="text-xs uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5" style={{ color: selected.color.accent }}>
                    ⚙️ Key Functions
                  </h4>
                  <ul className="space-y-2">
                    {selected.functions.map((fn, i) => (
                      <li
                        key={i}
                        className="flex gap-2 items-start text-sm text-slate-300"
                        style={{ animationDelay: `${i * 40}ms`, animation: revealLevel === 1 ? 'fadeSlideIn 0.3s ease-out both' : 'none' }}
                      >
                        <span className="shrink-0 w-4 h-4 rounded flex items-center justify-center text-[10px] font-black mt-0.5"
                          style={{ background: selected.color.border + '40', color: selected.color.accent }}>
                          {i + 1}
                        </span>
                        {fn}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Protocols — Level 2+ */}
              {revealLevel >= 2 && (
                <div style={{ animation: revealLevel === 2 ? 'fadeSlideIn 0.3s ease-out' : 'none' }}>
                  <h4 className="text-xs uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5" style={{ color: selected.color.accent }}>
                    📡 Protocols
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.protocols.map((p, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full text-xs font-bold font-mono"
                        style={{
                          background: selected.color.border + '25',
                          border: `1px solid ${selected.color.border}60`,
                          color: selected.color.accent,
                          animation: revealLevel === 2 ? `fadeSlideIn 0.3s ease-out ${i * 35}ms both` : 'none',
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Devices — Level 3 */}
              {revealLevel >= 3 && (
                <div style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                  <h4 className="text-xs uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5" style={{ color: selected.color.accent }}>
                    🖥️ Devices / Components
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.devices.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold"
                        style={{
                          background: selected.color.bg,
                          border: `1px solid ${selected.color.border}50`,
                          color: selected.color.accent,
                          animation: `fadeSlideIn 0.3s ease-out ${i * 40}ms both`,
                        }}
                      >
                        <span className="text-base">🔌</span>
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next step hint */}
              {revealLevel < 3 && (
                <div className="pt-2 border-t text-xs text-slate-600 italic" style={{ borderColor: selected.color.border + '30' }}>
                  Click the layer again to reveal: <span style={{ color: selected.color.accent }}>
                    {LEVEL_LABELS[LEVELS[revealLevel]]}
                  </span>
                </div>
              )}
              {revealLevel === 3 && (
                <div className="pt-2 border-t text-xs text-slate-600 italic" style={{ borderColor: selected.color.border + '30' }}>
                  All details revealed! Click the layer once more to close.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
