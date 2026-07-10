export const mockPapers = [
  {
    id: 1,
    title: "Mock Paper 1 — Comprehensive Practice",
    difficulty: "Medium",
    instructions: "Answer all sections. Time allowed: 3 hours. Total marks: 100.",
    sections: [
      {
        name: "Section A: Multiple Choice Questions (10 Marks)",
        questions: [
          {
            q: "Which layer of the OSI model is responsible for compression and encryption?",
            options: ["Application", "Presentation", "Transport", "Session"],
            ans: "Presentation",
            explanation: "Presentation layer deals with syntax and semantics of the data, which includes data representation formatting, compression, and encryption."
          },
          {
            q: "In a /26 subnetting network, what is the subnet mask in dotted-decimal form?",
            options: ["255.255.255.0", "255.255.255.128", "255.255.255.192", "255.255.255.224"],
            ans: "255.255.255.192",
            explanation: "/26 prefix has 26 bits set to 1. In the last octet, 2 bits are 1, which corresponds to 128 + 64 = 192. Thus, 255.255.255.192."
          }
        ]
      },
      {
        name: "Section B: Short Answer Questions (40 Marks)",
        questions: [
          {
            q: "Differentiate between physical address, logical address, and port address. Mention which OSI layer uses each.",
            solution: "1. Physical (MAC) Address: 48-bit hex address hardcoded into the NIC. Used by the Data Link layer for hop-to-hop communication.\n2. Logical (IP) Address: 32-bit (IPv4) or 128-bit (IPv6) software address. Used by the Network layer for global host-to-host routing.\n3. Port Address: 16-bit identifier (0 to 65535). Used by the Transport layer to identify a specific application process on a host."
          },
          {
            q: "What is a 'Jam Signal' in CSMA/CD and what is its significance?",
            solution: "A Jam Signal is a 32-bit to 48-bit frame broadcasted by a station as soon as it detects a collision during transmission. The jam signal guarantees that all other stations on the shared wire detect the collision and abort their current transmissions, clearing the bus."
          }
        ]
      },
      {
        name: "Section C: Long Answers & Solved Numericals (50 Marks)",
        questions: [
          {
            q: "A network has a bandwidth of 10 Mbps and a round-trip time (RTT) of 80 ms. We are using sliding window protocol with packet sizes of 1000 Bytes. Determine the minimum window size required to achieve 100% link utilization.",
            solution: "1. Identify variables:\n- Bandwidth (R) = 10 Mbps = 10,000,000 bps.\n- RTT = 2 * T_prop = 80 ms = 0.08 seconds.\n- Packet size (L) = 1000 Bytes = 1000 * 8 = 8000 bits.\n2. Calculate Transmission Delay (T_trans):\n- T_trans = L / R = 8000 bits / 10^7 bps = 0.0008 seconds = 0.8 ms.\n3. Formula for link utilization efficiency (eta):\n- eta = W_s * T_trans / (T_trans + RTT)\n- To achieve 100% utilization (eta = 1.0):\n- W_s * T_trans >= T_trans + RTT\n- W_s >= 1 + (RTT / T_trans)\n- W_s >= 1 + (80 ms / 0.8 ms) = 1 + 100 = 101.\n4. Conclusion:\n- The minimum sender window size required is 101 packets."
          },
          {
            q: "Apply Dijkstra's algorithm to find the shortest path from node A to all other nodes in a network with nodes A, B, C, D, E and edges:\nA-B (2), A-C (4), B-C (1), B-D (7), C-E (3), D-E (2), D-C (2).\nShow step-by-step path table.",
            solution: "Initialization: Distance to A = 0. All other nodes = infinity.\nStep 1: Smallest distance is A (0). Visited = {A}.\n- Update neighbors of A:\n  - B: dist = 0 + 2 = 2. Path: A->B\n  - C: dist = 0 + 4 = 4. Path: A->C\nStep 2: Smallest unvisited is B (2). Visited = {A, B}.\n- Update neighbors of B:\n  - C: dist = min(4, 2 + 1) = 3. Path: A->B->C (shorter than A->C)\n  - D: dist = min(inf, 2 + 7) = 9. Path: A->B->D\nStep 3: Smallest unvisited is C (3). Visited = {A, B, C}.\n- Update neighbors of C:\n  - D: dist = min(9, 3 + 2) = 5. Path: A->B->C->D\n  - E: dist = min(inf, 3 + 3) = 6. Path: A->B->C->E\nStep 4: Smallest unvisited is D (5). Visited = {A, B, C, D}.\n- Update neighbors of D:\n  - E: dist = min(6, 5 + 2) = 6. Path: A->B->C->E (remains 6)\nStep 5: Visited E (6).\nFinal Table:\n- B: Dist = 2, Path = A-B\n- C: Dist = 3, Path = A-B-C\n- D: Dist = 5, Path = A-B-C-D\n- E: Dist = 6, Path = A-B-C-E"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Mock Paper 2 — Numerical Heavyweight",
    difficulty: "Hard",
    instructions: "Focus on exact steps and units. Show all formula substitutions.",
    sections: [
      {
        name: "Section A: Multiple Choice Questions (10 Marks)",
        questions: [
          {
            q: "For a noisy channel, what is the physical consequence of increasing bandwidth according to Shannon's formula?",
            options: ["Capacity increases linearly", "Capacity decreases logarithmically", "Capacity increases, but noise power also increases in practice", "Capacity remains constant due to noise limit"],
            ans: "Capacity increases, but noise power also increases in practice",
            explanation: "While Shannon's formula Capacity = B log2(1 + S/N) shows linear scaling with B, in real physics, wider bandwidth collects more noise power, meaning SNR goes down, leading to diminishing returns."
          }
        ]
      },
      {
        name: "Section B: Long Answers & Solved Numericals (90 Marks)",
        questions: [
          {
            q: "An ISP allocates you the block 195.12.100.0/24. You need to divide this block into 4 subnets with equal number of hosts. Determine:\n1. The subnet mask for the new subnets.\n2. The range of host IPs in each subnet.\n3. The broadcast address for each subnet.",
            solution: "1. Determine Subnet Bits:\n- Original mask is /24. To create 4 subnets, we need log2(4) = 2 bits.\n- New mask = 24 + 2 = /26. In dotted-decimal: 255.255.255.192.\n2. Calculate host space:\n- Host bits = 32 - 26 = 6 bits. Usable hosts per subnet = 2^6 - 2 = 62 hosts.\n3. Identify range and broadcast for each subnet (block increments by 2^6 = 64):\n- Subnet 1: Network ID = 195.12.100.0/26\n  - Usable Range: 195.12.100.1 to 195.12.100.62\n  - Broadcast: 195.12.100.63\n- Subnet 2: Network ID = 195.12.100.64/26\n  - Usable Range: 195.12.100.65 to 195.12.100.126\n  - Broadcast: 195.12.100.127\n- Subnet 3: Network ID = 195.12.100.128/26\n  - Usable Range: 195.12.100.129 to 195.12.100.190\n  - Broadcast: 195.12.100.191\n- Subnet 4: Network ID = 195.12.100.192/26\n  - Usable Range: 195.12.100.193 to 195.12.100.254\n  - Broadcast: 195.12.100.255"
          },
          {
            q: "A data frame of bits '1101011011' is to be transmitted using CRC. The generator polynomial is G(X) = X^4 + X + 1.\n1. Find the transmitted codeword.\n2. Suppose a 1-bit error occurs during transmission, turning the received frame into '11011110110010'. Show how the receiver detects the error.",
            solution: "1. Determine generator bits:\n- G(X) = X^4 + X^1 + 1 -> divisor is binary '10011' (length 5, degree r = 4).\n2. Append r = 4 zeros to data:\n- Appended data = '11010110110000'.\n3. Perform Modulo-2 division (XOR):\n- Divident: 11010110110000 | Divisor: 10011\n- XOR division steps:\n  - 11010 XOR 10011 = 1001\n  - Bring down 1 -> 10011 XOR 10011 = 00000\n  - Bring down next bits till we get a leading 1...\n  - 10110 XOR 10011 = 0101\n  - Bring down 0 -> 10100 XOR 10011 = 0111\n  - Bring down 0 -> 11100 XOR 10011 = 1111\n  - Bring down 0 -> 11110 XOR 10011 = 1101\n  - Bring down 0 -> 11010 XOR 10011 = 1001\n  - Remainder = '1001'. (CRC checksum)\n4. Form Transmitted Codeword:\n- Replace appended zeros: '11010110111001'.\n5. Receiver division on error frame:\n- Received frame: 11011110110010 (with error).\n- Divide by 10011. Since an error has occurred, the remainder will be non-zero (e.g. 1010), flagging a corruption."
          }
        ]
      }
    ]
  }
];
