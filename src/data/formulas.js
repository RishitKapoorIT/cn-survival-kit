export const formulasData = [
  {
    id: "nyquist",
    title: "Nyquist Bit Rate Theorem",
    formula: "\\text{Capacity} = 2 \\times B \\times \\log_2(L)",
    topic: "Signals & Data Limits",
    variables: [
      { symbol: "Capacity", meaning: "Maximum bit rate in bits per second (bps)", unit: "bps" },
      { symbol: "B", meaning: "Bandwidth of the channel in Hertz", unit: "Hz" },
      { symbol: "L", meaning: "Number of discrete signal levels used", unit: "dimensionless" }
    ],
    assumptions: "Applies to noiseless channels only.",
    trap: "Examiners often mix Nyquist and Shannon. If a channel has noise, Nyquist gives the potential rate for L levels, but Shannon gives the absolute limit. Also, log is base 2, not base 10!",
    trick: "Nyquist uses 'L' levels. Double the bandwidth multiplied by log-base-2 of the levels.",
    example: {
      q: "Calculate the maximum bit rate for a noiseless channel with a bandwidth of 3000 Hz transmitting a signal with 4 signal levels.",
      sol: "$$\\text{Capacity} = 2 \\times 3000 \\times \\log_2(4) = 6000 \\times 2 = 12000\\text{ bps} = 12\\text{ kbps}$$"
    }
  },
  {
    id: "shannon",
    title: "Shannon Channel Capacity Theorem",
    formula: "\\text{Capacity} = B \\times \\log_2(1 + \\text{SNR})",
    topic: "Signals & Data Limits",
    variables: [
      { symbol: "Capacity", meaning: "Maximum channel capacity", unit: "bps" },
      { symbol: "B", meaning: "Bandwidth of the channel", unit: "Hz" },
      { symbol: "SNR", meaning: "Signal-to-Noise Ratio (linear scale)", unit: "dimensionless" }
    ],
    assumptions: "Applies to noisy channels with white Gaussian noise.",
    trap: "You MUST convert SNR from decibels (dB) to its linear ratio before using it here. SNR(linear) = 10^(SNR_dB / 10). +1 inside the log represents the addition of noise power.",
    trick: "Shannon SNR has noise, so it has '+ 1'. Capacity is Bandwidth * log2(1 + linear SNR).",
    example: {
      q: "A channel has 1 MHz bandwidth and an SNR of 30 dB. Find the maximum theoretical channel capacity.",
      sol: "1. Convert SNR from dB to linear:\n$$\\text{SNR} = 10^{\\frac{30}{10}} = 10^3 = 1000$$\n2. Apply formula:\n$$\\text{Capacity} = 1,000,000 \\times \\log_2(1 + 1000) = 1,000,000 \\times \\log_2(1001)$$\n3. Since $\\log_2(1024) = 10$, $\\log_2(1001)$ is approx $9.97$.\n4. Capacity:\n$$\\text{Capacity} \\approx 1,000,000 \\times 9.97 \\approx 9.97\\text{ Mbps}$$"
    }
  },
  {
    id: "trans_delay",
    title: "Transmission Delay (Serialization)",
    formula: "T_{\\text{trans}} = \\frac{L}{R}",
    topic: "Network Delays",
    variables: [
      { symbol: "T_trans", meaning: "Time taken to push all packet bits onto the link", unit: "seconds" },
      { symbol: "L", meaning: "Packet size (Length of packet in bits)", unit: "bits" },
      { symbol: "R", meaning: "Transmission rate / Bandwidth", unit: "bps" }
    ],
    assumptions: "Independent of distance.",
    trap: "Ensure packet size is in BITS, not BYTES. Multiply Bytes by 8. Ensure bandwidth is in bps (not Mbps or Kbps without multiplying by 10^6 or 10^3).",
    trick: "Length / Rate. Larger packets take longer to push; faster pipes push them quicker.",
    example: {
      q: "Find the transmission delay for a 1 KB packet over a 1 Mbps link.",
      sol: "1. Convert 1 KB to bits:\n$$L = 1 \\times 1024 \\times 8 = 8192\\text{ bits} \\quad (\\text{or } 1000 \\times 8 = 8000\\text{ bits for decimal scaling})$$\n2. Convert 1 Mbps to rate:\n$$R = 10^6\\text{ bps}$$\n3. Calculate delay:\n$$T_{\\text{trans}} = \\frac{8192}{1,000,000} = 0.008192\\text{ seconds} = 8.192\\text{ ms}$$"
    }
  },
  {
    id: "prop_delay",
    title: "Propagation Delay",
    formula: "T_{\\text{prop}} = \\frac{d}{s}",
    topic: "Network Delays",
    variables: [
      { symbol: "T_prop", meaning: "Time taken for a single bit to travel from sender to receiver", unit: "seconds" },
      { symbol: "d", meaning: "Distance between sender and receiver", unit: "meters" },
      { symbol: "s", meaning: "Propagation speed of the signal in the medium", unit: "m/s" }
    ],
    assumptions: "Usually speed of light in copper/fiber is approx 2 * 10^8 m/s.",
    trap: "Independent of packet size! A 1-bit packet and 1-GB packet take the same time to travel the physical distance. Check unit matching (km vs meters).",
    trick: "Distance / Speed. Just like standard travel time.",
    example: {
      q: "Calculate the propagation delay between two cities 2000 km apart if the speed of signal in the fiber is 2 * 10^8 m/s.",
      sol: "1. Convert 2000 km to meters:\n$$d = 2000 \\times 10^3 = 2,000,000\\text{ m}$$\n2. Wave speed:\n$$s = 2 \\times 10^8\\text{ m/s}$$\n3. Calculate delay:\n$$T_{\\text{prop}} = \\frac{2,000,000}{2 \\times 10^8} = 0.01\\text{ seconds} = 10\\text{ ms}$$"
    }
  },
  {
    id: "bdp",
    title: "Bandwidth-Delay Product (BDP)",
    formula: "\\text{BDP} = B \\times T_{\\text{prop}}",
    topic: "Network Delays",
    variables: [
      { symbol: "BDP", meaning: "Volume of bits that can fill the transmission pipe", unit: "bits" },
      { symbol: "B", meaning: "Data rate of the link (R)", unit: "bps" },
      { symbol: "T_prop", meaning: "Propagation delay", unit: "seconds" }
    ],
    assumptions: "Represents the maximum amount of unacknowledged data in transit.",
    trap: "Make sure to use the one-way propagation delay, unless the question explicitly asks for the Round Trip Time (RTT) volume, in which case use RTT * Bandwidth.",
    trick: "Pipe Volume = Cross Section Area (Bandwidth) * Length of Pipe (Propagation Time).",
    example: {
      q: "A link has a bandwidth of 10 Mbps and a one-way propagation delay of 20 ms. Find the BDP.",
      sol: "$$\\text{BDP} = (10 \\times 10^6\\text{ bps}) \\times (20 \\times 10^{-3}\\text{ s}) = 200,000\\text{ bits} \\approx 25\\text{ KB}$$"
    }
  },
  {
    id: "efficiency_sw",
    title: "Stop-and-Wait Efficiency (Link Utilization)",
    formula: "\\eta = \\frac{1}{1 + 2a}",
    topic: "Flow Control",
    variables: [
      { symbol: "eta", meaning: "Fraction of time the sender is actively transmitting data", unit: "fraction" },
      { symbol: "a", meaning: "Ratio of propagation delay to transmission delay (T_prop / T_trans)", unit: "dimensionless" }
    ],
    assumptions: "No error, error-free channel.",
    trap: "Note the factor of 2: it represents the round-trip propagation time (frame goes there, ACK comes back).",
    trick: "Total time for one cycle is T_trans + 2 * T_prop. We spend T_trans sending. So efficiency = T_trans / (T_trans + 2 * T_prop). Divide top and bottom by T_trans to get 1 / (1 + 2a).",
    example: {
      q: "Find the efficiency of Stop-and-Wait if transmission delay is 1 ms and propagation delay is 9 ms.",
      sol: "1. Calculate a: $$a = \\frac{T_{\\text{prop}}}{T_{\\text{trans}}} = \\frac{9}{1} = 9.$$\n2. Calculate efficiency: $$\\eta = \\frac{1}{1 + 2 \\times 9} = \\frac{1}{19} \\approx 0.0526 = 5.26\\%$$"
    }
  },
  {
    id: "efficiency_sliding",
    title: "Sliding Window Protocol Efficiency",
    formula: "\\eta = \\frac{W}{1 + 2a}",
    topic: "Flow Control",
    variables: [
      { symbol: "eta", meaning: "Protocol efficiency", unit: "fraction" },
      { symbol: "W", meaning: "Sender Window Size", unit: "dimensionless" },
      { symbol: "a", meaning: "Ratio T_prop / T_trans", unit: "dimensionless" }
    ],
    assumptions: "Error-free channel. Note that efficiency cannot exceed 1 (100%). If W >= 1 + 2a, efficiency is 1.0 (100%).",
    trap: "If calculation gives efficiency > 1 (e.g. 1.25), the answer is 1.0. A sender cannot transmit at more than 100% capacity.",
    trick: "Sender can send W packets instead of 1 before waiting. So efficiency is W times Stop-and-Wait, capped at 1.",
    example: {
      q: "A sliding window protocol uses a window size of 8. The transmission delay is 2 ms and propagation delay is 7 ms. What is the efficiency?",
      sol: "1. Calculate a: $$a = \\frac{T_{\\text{prop}}}{T_{\\text{trans}}} = \\frac{7}{2} = 3.5.$$\n2. Calculate efficiency: $$\\eta = \\frac{8}{1 + 2 \\times 3.5} = \\frac{8}{8} = 1.0 = 100\\%$$"
    }
  },
  {
    id: "subnet_hosts",
    title: "Subnet Usable Hosts",
    formula: "\\text{Usable Hosts} = 2^H - 2",
    topic: "IP Subnetting",
    variables: [
      { symbol: "Usable Hosts", meaning: "Number of host IP addresses that can be assigned to devices", unit: "dimensionless" },
      { symbol: "H", meaning: "Number of host bits (32 - Netmask prefix)", unit: "bits" }
    ],
    assumptions: "For standard IPv4 subnets.",
    trap: "Always subtract 2. The first address (host bits all 0) is the network address. The last address (host bits all 1) is the broadcast address.",
    trick: "Power of 2 hosts minus 2 special addresses.",
    example: {
      q: "For a /27 subnet mask, how many usable host addresses are available?",
      sol: "1. Netmask is 27 bits, so host bits H = 32 - 27 = 5.\n2. Calculate hosts: $$\\text{Usable Hosts} = 2^5 - 2 = 32 - 2 = 30$$"
    }
  }
];
