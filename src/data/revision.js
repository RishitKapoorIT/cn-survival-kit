export const revisionData = {
  portNumbers: [
    { port: 20, protocol: "FTP Data", type: "TCP", desc: "File Transfer Protocol (Data channel)" },
    { port: 21, protocol: "FTP Control", type: "TCP", desc: "File Transfer Protocol (Control channel/commands)" },
    { port: 22, protocol: "SSH / SFTP", type: "TCP", desc: "Secure Shell / Secure FTP (Remote secure access)" },
    { port: 23, protocol: "TELNET", type: "TCP", desc: "Unencrypted remote terminal access (Highly insecure)" },
    { port: 25, protocol: "SMTP", type: "TCP", desc: "Simple Mail Transfer Protocol (Sending emails)" },
    { port: 53, protocol: "DNS", type: "UDP / TCP", desc: "Domain Name System resolution (TCP for zone transfers)" },
    { port: 67, protocol: "DHCP Server", type: "UDP", desc: "Dynamic Host Configuration Protocol (Server listening)" },
    { port: 68, protocol: "DHCP Client", type: "UDP", desc: "Dynamic Host Configuration Protocol (Client listening)" },
    { port: 80, protocol: "HTTP", type: "TCP", desc: "Hypertext Transfer Protocol (Web traffic)" },
    { port: 110, protocol: "POP3", type: "TCP", desc: "Post Office Protocol v3 (Downloading and removing emails)" },
    { port: 143, protocol: "IMAP", type: "TCP", desc: "Internet Message Access Protocol (Syncing emails on server)" },
    { port: 443, protocol: "HTTPS", type: "TCP", desc: "Hypertext Transfer Protocol Secure (Encrypted web traffic)" }
  ],
  layerCheatSheet: [
    { layer: "Application (Layer 7)", pdu: "Data / Message", devices: "Gateways, PC, Mobile", responsibilities: "Provides user interface, manages application level communication." },
    { layer: "Presentation (Layer 6)", pdu: "Data", devices: "Gateways, Software converters", responsibilities: "Translation, Encryption, Compression, Syntax-matching." },
    { layer: "Session (Layer 5)", pdu: "Data", devices: "Gateways, Software session APIs", responsibilities: "Session dialogue control, Synchronization, Checkpointing." },
    { layer: "Transport (Layer 4)", pdu: "Segment (TCP) / Datagram (UDP)", devices: "Gateways, Load balancers", responsibilities: "Process-to-process delivery, flow control, congestion control, connection management." },
    { layer: "Network (Layer 3)", pdu: "Packet", devices: "Routers, Layer 3 switches", responsibilities: "Host-to-host routing, logical IP addressing, packet forwarding." },
    { layer: "Data Link (Layer 2)", pdu: "Frame", devices: "Switches, Bridges, NIC", responsibilities: "Hop-to-hop reliable transmission, framing, error control (CRC), flow control, MAC addressing." },
    { layer: "Physical (Layer 1)", pdu: "Bits", devices: "Hubs, Repeaters, Cables, Modems", responsibilities: "Bit synchronization, line configuration, physical topology representation, signal propagation." }
  ],
  commonMistakes: [
    { title: "Binary vs Metric Prefixes", mistake: "Calculating Transmission Delay with packet sizes in Bytes and rates in bits. Always multiply Byte sizes by 8 to get bits first." },
    { title: "Subtracting 2 for Hosts", mistake: "Forgetting to subtract 2 from total host addresses (2^H - 2) when finding usable IPs in a subnet. You MUST exclude network and broadcast addresses." },
    { title: "Shannon SNR linear conversion", mistake: "Plugging the decibel (dB) value directly into log2(1 + SNR). E.g. using SNR = 30 instead of converting it to 1000 first." },
    { title: "Window size limits in sliding window", mistake: "Using window size 2^m for Selective Repeat or Go-Back-N. Standard GBN limit is (2^m - 1) and SR limit is 2^(m-1)." }
  ]
};
