export const vivaQuestions = [
  {
    id: 1,
    category: "General & Models",
    q: "Why is the OSI model called a 'reference' model?",
    a: "Because it was created as a theoretical framework to guide the standardization of networking protocols. In the real world, most systems are built on the TCP/IP protocol suite rather than the strict OSI architecture."
  },
  {
    id: 2,
    category: "General & Models",
    q: "What is the key difference between Half-Duplex and Full-Duplex communication?",
    a: "In half-duplex (e.g. Walkie-Talkies), both stations can transmit and receive, but not at the same time. In full-duplex (e.g. mobile phones), both stations can transmit and receive simultaneously."
  },
  {
    id: 3,
    category: "Physical Layer",
    q: "Why do we use light in optical fiber instead of electricity?",
    a: "Light travels faster in fiber core, operates at much higher frequencies (higher bandwidth), is immune to electromagnetic interference, and suffers significantly less attenuation over long distances compared to copper wires."
  },
  {
    id: 4,
    category: "Physical Layer",
    q: "Explain the term 'crosstalk'.",
    a: "Crosstalk is the leakage of electrical or electromagnetic signals from one communication line/wire to an adjacent wire, causing interference. It is minimized by twisting wires together (UTP) or shielding them (STP)."
  },
  {
    id: 5,
    category: "Signals",
    q: "What is the difference between Bit Rate and Baud Rate?",
    a: "Bit rate is the number of bits transmitted per second. Baud rate is the number of signal units (symbols) transmitted per second. Bit Rate = Baud Rate * log2(L), where L is the number of signal levels."
  },
  {
    id: 6,
    category: "Signals",
    q: "What is the physical meaning of Shannon's Noisy Capacity Limit?",
    a: "It establishes the absolute upper boundary of data rate that can be transmitted error-free over a channel with a given bandwidth and signal-to-noise ratio, regardless of how complex the encoding/modulation is."
  },
  {
    id: 7,
    category: "Transmission Impairments",
    q: "Define Latency and list its four components.",
    a: "Latency is the total time it takes for a message to travel from sender to receiver. Its components are: Transmission Delay (L/R), Propagation Delay (d/s), Queueing Delay (waiting at routers), and Processing Delay (packet header parsing)."
  },
  {
    id: 8,
    category: "Switching",
    q: "Why is packet switching more cost-effective than circuit switching?",
    a: "Packet switching uses statistical multiplexing. Multiple users share the same transmission link dynamically. If a user is silent, other users use the channel. Circuit switching leaves the line reserved and idle, wasting bandwidth."
  },
  {
    id: 9,
    category: "Data Link Layer",
    q: "What is the main purpose of bit stuffing?",
    a: "To prevent the flags (which mark frame boundaries, e.g., 01111110) from appearing inside the actual data payload. The sender inserts a '0' after five consecutive '1's, and the receiver strips it out."
  },
  {
    id: 10,
    category: "Data Link Layer",
    q: "Why is piggybacking used?",
    a: "It combines an ACK code with an outgoing data frame going in the same direction, reducing overhead by avoiding the need to send dedicated, standalone ACK packets."
  },
  {
    id: 11,
    category: "Error Control",
    q: "How does CRC handle error detection?",
    a: "It treats the data bit string as a polynomial, divides it by a pre-agreed generator polynomial using XOR division, appends the remainder to the data, and transmits it. The receiver divides the message; if the remainder is not 0, an error occurred."
  },
  {
    id: 12,
    category: "MAC Sublayer",
    q: "Why is CSMA/CD not used in wireless (Wi-Fi) networks?",
    a: "Wireless nodes cannot detect collisions because their own high-power transmissions drown out any weak incoming signals. Instead, they use CSMA/CA (Collision Avoidance) to coordinate transmission."
  },
  {
    id: 13,
    category: "MAC Sublayer",
    q: "What are the Hidden and Exposed Terminal problems?",
    a: "The Hidden Terminal problem occurs when two nodes (A & C) cannot hear each other but try to transmit to the same intermediate node (B) at once, causing collisions. The Exposed Terminal problem occurs when a node unnecessarily waits to transmit to a separate destination because it hears a neighbor transmitting."
  },
  {
    id: 14,
    category: "Network Layer",
    q: "What is CIDR and why was it introduced?",
    a: "Classless Inter-Domain Routing (CIDR) replaced classful addressing (A, B, C). It allows variable-length subnet masks (/N), which allocate IP addresses more efficiently, preventing the rapid exhaustion of IPv4 addresses."
  },
  {
    id: 15,
    category: "Network Layer",
    q: "Differentiate between Distance Vector and Link State routing.",
    a: "Distance Vector routers only know distances to neighbors and periodically exchange full tables (uses Bellman-Ford). Link State routers flood link states, build the entire network topology map, and run Dijkstra locally."
  },
  {
    id: 16,
    category: "Transport Layer",
    q: "What is a Socket in computer networking?",
    a: "A Socket is the logical endpoint of a network connection, uniquely identified by the combination of an IP Address and a Port Number (e.g., 192.168.1.1:80)."
  },
  {
    id: 17,
    category: "Transport Layer",
    q: "How does TCP Congestion Control differ from TCP Flow Control?",
    a: "Flow Control protects the receiver's buffer from overflowing (uses rwnd). Congestion Control protects the intermediate network routers/switches from getting congested (uses cwnd). The actual sender window size is min(rwnd, cwnd)."
  },
  {
    id: 18,
    category: "Application Layer",
    q: "Why does DNS use UDP for queries, but TCP is used for Zone Transfers?",
    a: "DNS queries are small, single-packet interactions that require high speed, so UDP is ideal. Zone transfers involve copying large database files between primary and secondary DNS servers, requiring the reliability of TCP."
  },
  {
    id: 19,
    category: "Application Layer",
    q: "What is the difference between persistent and non-persistent HTTP?",
    a: "Non-persistent HTTP closes the TCP connection after sending a single object, requiring a new 3-way handshake for every file. Persistent HTTP keeps the connection open for multiple object requests, saving time and RTTs."
  },
  {
    id: 20,
    category: "Application Layer",
    q: "Describe the DORA process in DHCP.",
    a: "Discover: client broadcasts to find DHCP servers. Offer: server responds with IP/lease offer. Request: client requests the offered IP. Acknowledge: server acknowledges and reserves the IP for the client."
  }
];
