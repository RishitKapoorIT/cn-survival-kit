export const comparisonsData = [
  {
    id: "osi_tcp",
    title: "OSI Model vs TCP/IP Model",
    headers: ["Parameter", "OSI Model", "TCP/IP Model"],
    rows: [
      ["Full Name", "Open Systems Interconnection Reference Model", "Transmission Control Protocol / Internet Protocol"],
      ["Number of Layers", "7 Layers", "4 or 5 Layers"],
      ["Approach", "Theoretical and generic model", "Practical and implementation-oriented model"],
      ["Development", "Designed before protocols were written", "Protocols were developed first, then model was built"],
      ["Session & Presentation Layers", "Has separate Session and Presentation layers", "No separate layers; functionality is handled inside Application layer"],
      ["Reliability", "Guaranteed delivery check at Transport and Data Link layers", "Transport layer handles reliability; IP is best-effort (unreliable)"]
    ]
  },
  {
    id: "tcp_udp",
    title: "TCP vs UDP",
    headers: ["Feature", "TCP (Transmission Control Protocol)", "UDP (User Datagram Protocol)"],
    rows: [
      ["Connection Status", "Connection-oriented (handshake required)", "Connectionless (directly send data)"],
      ["Reliability", "Highly reliable (retransmission of lost packets)", "Unreliable (best-effort, no retransmission)"],
      ["Speed", "Slower (due to overhead, flow control, congestion control)", "Extremely fast (minimal overhead)"],
      ["Header Size", "Variable (20 to 60 bytes)", "Fixed 8 bytes"],
      ["PDU Name", "Segment", "Datagram"],
      ["Transmission Mode", "Byte Stream (no boundary preservation)", "Message boundaries are preserved"],
      ["Common Applications", "Web browsing (HTTP), Email (SMTP), File transfer (FTP)", "Video streaming, Online gaming, DNS, DHCP, VoIP"]
    ]
  },
  {
    id: "hub_switch",
    title: "Hub vs Switch vs Router",
    headers: ["Feature", "Hub", "Switch", "Router"],
    rows: [
      ["Layer", "Physical Layer (Layer 1)", "Data Link Layer (Layer 2)", "Network Layer (Layer 3)"],
      ["Operation", "Broadcasts signals to all ports", "Unicasts frames to specific target port", "Routes packets based on network IP path"],
      ["Addressing Used", "None", "MAC Address", "IP Address"],
      ["Collision Domains", "1 Single collision domain for all ports", "Each port is a separate collision domain", "Each port is a separate collision domain"],
      ["Broadcast Domains", "1 Single broadcast domain", "1 Single broadcast domain", "Separates broadcast domains (Routers block broadcasts)"],
      ["Intelligence", "Passive device (dumb; forwards bits)", "Active device (learns MAC addresses)", "Intelligent device (calculates optimal path)"]
    ]
  },
  {
    id: "circuit_packet",
    title: "Circuit Switching vs Packet Switching",
    headers: ["Parameter", "Circuit Switching", "Packet Switching"],
    rows: [
      ["Path Setup", "Dedicated physical path is established first", "No dedicated path; packets routed dynamically"],
      ["Bandwidth Reservation", "Yes, bandwidth is reserved and cannot be shared", "No, bandwidth is allocated dynamically (shared)"],
      ["Efficiency", "Low efficiency (idle time resources are wasted)", "High efficiency via statistical multiplexing"],
      ["Delay", "Constant delay once established", "Variable delay (queueing and propagation variations)"],
      ["Store and Forward", "No, bits flow continuously", "Yes, entire packet must be buffered before forwarding"],
      ["E.g. Application", "Traditional telephone networks (PSTN)", "The Internet, modern VoIP, cellular data"]
    ]
  },
  {
    id: "mac_collision",
    title: "CSMA/CD vs CSMA/CA",
    headers: ["Feature", "CSMA/CD", "CSMA/CA"],
    rows: [
      ["Full Name", "Carrier Sense Multiple Access with Collision Detection", "Carrier Sense Multiple Access with Collision Avoidance"],
      ["Environment", "Wired networks (Ethernet, IEEE 802.3)", "Wireless networks (Wi-Fi, IEEE 802.11)"],
      ["Action on Collision", "Detects collision, aborts transmission, sends jam signal", "Aims to prevent collision using RTS/CTS and random backoff"],
      ["Mechanism", "Senses collision by monitoring wire voltage levels", "Uses Inter-Frame Spacing (IFS) and handshake exchange"],
      ["Efficiency", "High (very quick recovery when collision occurs)", "Lower overhead (due to backoffs and handshake delay)"]
    ]
  },
  {
    id: "checksum_crc",
    title: "Checksum vs CRC",
    headers: ["Property", "Internet Checksum", "Cyclic Redundancy Check (CRC)"],
    rows: [
      ["Mathematical Basis", "1's complement addition of 16-bit blocks", "Polynomial division using modulo-2 (XOR) arithmetic"],
      ["Hardware Complexity", "Simple, easily implemented in software/CPU", "Requires shift registers; usually implemented in hardware NIC"],
      ["Detection Power", "Catches most errors, but weak against swapped blocks", "Catches all single-bit, double-bit, and large burst errors"],
      ["Common Use", "IP, TCP, and UDP headers", "Ethernet frames, Wi-Fi frames, storage devices"]
    ]
  },
  {
    id: "gbn_sr",
    title: "Go-Back-N vs Selective Repeat",
    headers: ["Feature", "Go-Back-N (GBN)", "Selective Repeat (SR)"],
    rows: [
      ["Sender Window (Ws)", "2^m - 1", "2^(m-1)"],
      ["Receiver Window (Wr)", "1 (Only accepts frames in order)", "2^(m-1) (Buffers out-of-order frames)"],
      ["ACK Type", "Cumulative ACKs", "Individual / Selective ACKs"],
      ["Action on Loss", "Retransmits lost frame AND all subsequent frames", "Retransmits ONLY the single lost frame"],
      ["Receiver Buffering", "No buffering required (discards out-of-order)", "Requires buffer to hold out-of-order frames"],
      ["Complexity", "Low complexity", "High complexity (timer per frame, sorting buffers)"]
    ]
  },
  {
    id: "ipv4_ipv6",
    title: "IPv4 vs IPv6",
    headers: ["Feature", "IPv4", "IPv6"],
    rows: [
      ["Address Size", "32-bit", "128-bit"],
      ["Notation", "Dotted-decimal (e.g. 192.168.1.1)", "Hexadecimal colon-separated (e.g. 2001:db8::1)"],
      ["Total Addresses", "2^32 ≈ 4.3 billion", "2^128 ≈ 3.4 * 10^38 (virtually unlimited)"],
      ["Header Size", "Variable (20 to 60 bytes)", "Fixed (40 bytes)"],
      ["Fragmentation", "Performed by sender and intermediate routers", "Performed ONLY by the sender (Path MTU Discovery)"],
      ["Security (IPsec)", "Optional dependency", "Built-in support (mandatory integration originally)"],
      ["Configuration", "Manually or via DHCP", "SLAAC (Stateless Auto-configuration) or DHCPv6"]
    ]
  }
];
