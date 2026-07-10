export const pyqAnalysis = {
  examBreakdown: {
    mte: {
      title: "Mid-Term Exam (MTE) Analysis",
      focus: "Chapters 1 to 6 (Introduction, OSI/TCP models, Physical Layer, Signals, Impairments, Switching)",
      numericalWeight: "40% (Mostly Nyquist, Shannon capacity, decibel calculations, bit rate vs baud rate)",
      theoryWeight: "60% (Layer functions, guided vs unguided media, switching comparisons, OSI vs TCP/IP)"
    },
    ete: {
      title: "End-Term Exam (ETE) Analysis",
      focus: "Full Syllabus (Chapters 1 to 12), with 70% weight on Chapters 7 to 12 (Data Link, MAC, Network, Transport, Application)",
      numericalWeight: "50% (Subnetting, CIDR, Dijkstra routing, CRC/Checksum division, sliding window efficiency, TCP congestion window graphs)",
      theoryWeight: "50% (CSMA/CD protocol state machine, CSMA/CA, OSI layers, DNS resolution, TCP handshake, email protocols)"
    },
    supplemental: {
      title: "Supplemental/Re-exam Strategy (Highly Critical)",
      focus: "Typically structured to balance core conceptual questions with predictable numericals.",
      advice: "Supplemental exams often reuse standard numerical templates with different values. Master: 1) Dijkstra's algorithm, 2) CIDR subnet partitioning, 3) Stop-and-Wait/Sliding window efficiency, 4) CRC XOR division. These four guarantee at least 30-40% of the paper score."
    }
  },
  frequencyTable: [
    { topic: "CIDR & Subnetting", frequency: "Very High (Always 10-15 marks)", type: "Numerical", layer: "Network" },
    { topic: "Dijkstra Routing Algorithm", frequency: "High (Often 8-10 marks)", type: "Numerical / Flowchart", layer: "Network" },
    { topic: "CRC Error Detection & XOR Division", frequency: "High (Usually 6-8 marks)", type: "Numerical", layer: "Data Link" },
    { topic: "Sliding Window Efficiency (GBN vs SR)", frequency: "High (5-8 marks)", type: "Numerical / Proof", layer: "Data Link" },
    { topic: "OSI Layer Functions & PDU Mapping", frequency: "Medium-High (5-6 marks)", type: "Theory", layer: "General" },
    { topic: "Nyquist & Shannon Capacity", frequency: "Medium-High (5-6 marks)", type: "Numerical", layer: "Physical" },
    { topic: "TCP Congestion Control (Slow Start / Avoidance)", frequency: "Medium (5-8 marks)", type: "Graph / Theory", layer: "Transport" },
    { topic: "CSMA/CD Collision Detection (2 * T_prop)", frequency: "Medium (5 marks)", type: "Derivation / Theory", layer: "MAC" },
    { topic: "HTTP Persistent vs Non-Persistent / DORA", frequency: "Medium (4-5 marks)", type: "Theory / Analogy", layer: "Application" }
  ],
  favoriteQuestions: [
    "Explain the 'Count-to-Infinity' problem in Distance Vector routing and how Split Horizon fixes it.",
    "Draw the packet path delay timeline showing Transmission, Propagation, Queueing, and Processing delays.",
    "Why does Ethernet require a minimum frame size, and how is it related to the physical length of the cable?",
    "Show why the window size in Selective Repeat is limited to half of the sequence number space (i.e. W_s = 2^(m-1))."
  ]
};
