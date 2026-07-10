export const chaptersData = [
  {
    id: 1,
    title: "Introduction to Computer Networks",
    objectives: [
      "Define what a computer network is and its goals",
      "Differentiate between LAN, MAN, WAN, and PAN",
      "Understand Client-Server vs Peer-to-Peer architectures",
      "Identify the core network performance criteria: Scalability, Reliability, Security"
    ],
    analogy: "Think of a computer network like a global postal service. Individual houses (nodes) have unique addresses. Roads, highways, and flight routes (transmission media) connect them. Postal offices and sorting facilities (routers/switches) direct the letters (packets) to ensure they arrive at the correct address safely and efficiently.",
    sections: [
      {
        heading: "What is a Computer Network?",
        content: "A computer network is a collection of autonomous computers interconnected by a single technology. Two computers are said to be interconnected if they are able to exchange information. The connection can be established using copper wires, fiber optics, microwaves, infrared, or communication satellites."
      },
      {
        heading: "Need, Goals & Advantages",
        content: "1. Resource Sharing: Making programs, data, and hardware (like printers) available to anyone on the network.\n2. High Reliability: Having alternative sources of supply (multiple servers, redundant paths).\n3. Cost Reduction: Personal computers have a better price/performance ratio than mainframes.\n4. Scalability: Ability to increase system performance gradually by adding more processors/servers.\n5. Communication Medium: Providing a fast and reliable channel for collaboration (e-mail, file transfers, video conferencing)."
      },
      {
        heading: "Types of Networks by Scale",
        content: "• PAN (Personal Area Network): Centered around a person, range up to 10 meters (e.g., Bluetooth connecting phone and headphones).\n• LAN (Local Area Network): Privately owned networks within a single building or campus, up to a few kilometers. High speed (100 Mbps to 10 Gbps) and low error rates.\n• MAN (Metropolitan Area Network): Covers a city (e.g., cable television network). Can be private or public.\n• WAN (Wide Area Network): Spans a large geographical area, often a country or continent. Uses subnetworks of routers to forward data packets."
      },
      {
        heading: "Client-Server vs Peer-to-Peer (P2P)",
        content: "• Client-Server: A centralized architecture. Dedicated machines called 'Servers' manage resources and respond to requests. Clients are user machines that consume services. Easier to manage and secure but has a single point of failure (the server).\n• Peer-to-Peer (P2P): Decentralized architecture. Every machine (peer) acts as both a client and a server. Highly scalable and fault-tolerant, but extremely difficult to secure and manage."
      },
      {
        heading: "Core Network Criteria",
        content: "• Performance: Measured by transit time and response time. Depends on the number of users, type of transmission medium, and hardware.\n• Reliability: Measured by frequency of failure, recovery time from failure, and robustness in a catastrophe.\n• Security: Protecting data from unauthorized access, damage, and modification."
      }
    ],
    traps: [
      {
        concept: "Intranet vs Extranet vs Internet",
        trap: "Students confuse Extranet and Internet. An Intranet is strictly internal (only employees). An Extranet allows controlled access to authorized outsiders (like partners/suppliers). The Internet is globally public."
      }
    ],
    viva: [
      {
        q: "What is the primary difference between a Point-to-Point link and a Broadcast link?",
        a: "Point-to-point link has exactly one sender and one receiver. A broadcast link has a shared channel where messages sent by any machine are received by all machines on the network (routers/nodes filter them out based on address)."
      },
      {
        q: "Why is a star topology preferred over a bus topology in LANs?",
        a: "In a bus topology, a cable break brings down the entire network. In a star topology, if a node's cable breaks, only that node is disconnected; the rest of the network continues to function normally through the central switch."
      }
    ],
    memoryTrick: "Types of Networks from smallest to largest: Please Let Me Win -> PAN, LAN, MAN, WAN."
  },
  {
    id: 2,
    title: "Network Models (OSI & TCP/IP)",
    objectives: [
      "Memorize the 7 layers of the OSI model and their main functions",
      "Understand the TCP/IP model layers and how they map to OSI",
      "Identify the Protocol Data Unit (PDU) at each layer",
      "Explain the encapsulation and decapsulation processes"
    ],
    analogy: "Think of the OSI model like shipping a fragile gift internationally. Layer 7 (Application) is deciding what gift to send. Layer 6 (Presentation) is wrapping it and translating the instructions. Layer 5 (Session) is calling the courier to schedule pickup. Layer 4 (Transport) is breaking the gift into smaller packages and numbering them. Layer 3 (Network) is writing the sender/receiver addresses. Layer 2 (Data Link) is putting each package in a cargo truck. Layer 1 (Physical) is the truck actually driving on the asphalt road.",
    sections: [
      {
        heading: "The 7-Layer OSI Model",
        content: "The Open Systems Interconnection model is a conceptual framework that standardizes network communication into 7 distinct layers:\n\n1. Physical: Transmission of raw bits over a physical medium. Mechanical/electrical interfaces.\n2. Data Link: Reliable transmission of frames over a physical link. Error control, flow control, and MAC addressing.\n3. Network: Routing of packets from source to destination across multiple networks. Logical addressing (IP).\n4. Transport: End-to-end reliability, flow control, congestion control, and segmentation. (TCP/UDP, port numbers).\n5. Session: Managing sessions/dialogues between applications (synchronization, checkpointing).\n6. Presentation: Data translation, encryption, compression, and formatting.\n7. Application: User interface and network services (HTTP, DNS, SMTP)."
      },
      {
        heading: "PDUs & Addressing by Layer",
        content: "• Application / Presentation / Session: PDU = Data (or Message). No network addressing (uses process IDs).\n• Transport Layer: PDU = Segment (TCP) / Datagram (UDP). Addressing = Port Numbers (16-bit).\n• Network Layer: PDU = Packet. Addressing = IP Addresses (32-bit for IPv4, 128-bit for IPv6).\n• Data Link Layer: PDU = Frame. Addressing = MAC Addresses (48-bit physical address).\n• Physical Layer: PDU = Bits. No addressing (electrical signals/pulses)."
      },
      {
        heading: "TCP/IP Model & Mapping to OSI",
        content: "The TCP/IP model consists of 4 (or 5) layers. The 4-layer model includes:\n1. Application Layer (Maps to OSI Application, Presentation, Session layers).\n2. Transport Layer (Maps to OSI Transport layer).\n3. Internet Layer (Maps to OSI Network layer).\n4. Network Access Layer (Maps to OSI Data Link and Physical layers)."
      },
      {
        heading: "Encapsulation vs Decapsulation",
        content: "• Encapsulation: As data moves down the sender's stack, each layer wraps the payload with its own control headers (and sometimes trailers, like Data Link trailer for CRC).\n• Decapsulation: As data moves up the receiver's stack, each layer strips off its corresponding header and processes the payload, passing it up to the next layer."
      }
    ],
    traps: [
      {
        concept: "Where do Switched vs Routed devices operate?",
        trap: "Hubs operate at Layer 1 (Physical). Switches operate at Layer 2 (Data Link) using MAC addresses. Routers operate at Layer 3 (Network) using IP addresses."
      }
    ],
    viva: [
      {
        q: "Why does the Data Link layer contain a trailer while others only have headers?",
        a: "The trailer contains the Frame Check Sequence (FCS), which is a CRC checksum. It must be placed at the end so the receiver can compute the checksum as bits arrive and compare it instantly."
      },
      {
        q: "What is the difference between Port-to-Port, Host-to-Host, and Hop-to-Hop transmission?",
        a: "Hop-to-hop is handled by the Data Link layer (node-to-node). Host-to-host is handled by the Network layer (end-to-end IP routing). Port-to-port (Process-to-process) is handled by the Transport layer (TCP/UDP ports)."
      }
    ],
    memoryTrick: "OSI Layers bottom-to-top: Please Do Not Throw Sausage Pizza Away -> Physical, Data Link, Network, Transport, Session, Presentation, Application."
  },
  {
    id: 3,
    title: "Physical Layer & Transmission Media",
    objectives: [
      "Classify transmission media into Guided and Unguided",
      "Compare UTP, Coaxial, and Fiber Optic cables",
      "Explain wireless transmission modes: Radio waves, Microwaves, Infrared",
      "Identify the physics and advantages of Optical Fiber"
    ],
    analogy: "Guided media are like train tracks—data is physically constrained to follow the path of the wire. Unguided media are like airplanes flying in open airspace—data is broadcast through the air in all directions, and anyone with the right antenna can tune in.",
    sections: [
      {
        heading: "Guided Media: Wired Transmission",
        content: "• Twisted Pair: Pairs of copper wires twisted together to reduce electromagnetic interference (crosstalk). Categorized into UTP (Unshielded) and STP (Shielded). UTP is cheap, easy to install, but prone to noise.\n• Coaxial Cable: Central copper conductor surrounded by insulating layer, braided metal shield, and outer cover. Better shielding than UTP, used in cable TV and high-bandwidth applications.\n• Fiber Optic Cable: Uses light signals travelling through glass or plastic core. Uses Total Internal Reflection. Extremely high bandwidth, immune to electromagnetic interference, very low attenuation over long distances. High cost and difficult to splice."
      },
      {
        heading: "Unguided Media: Wireless Transmission",
        content: "• Radio Waves: 3 kHz to 1 GHz. Omnidirectional (propagate in all directions). Penetrate walls easily. Prone to interference.\n• Microwaves: 1 GHz to 300 GHz. Unidirectional (narrow beam, line-of-sight propagation). Do not penetrate obstacles. Used for cellular, satellite, and point-to-point links.\n• Infrared: 300 GHz to 400 THz. Short range, line-of-sight. Cannot penetrate walls (which provides excellent security from eavesdropping, e.g., TV remotes)."
      },
      {
        heading: "Fiber Optic: Single-mode vs Multi-mode",
        content: "• Single-mode: Extremely thin core (approx. 9 microns). Light travels along a single path without reflection. Uses laser source. Long distances, expensive.\n• Multi-mode: Thicker core (50-62.5 microns). Light bounces down the fiber at multiple angles. Uses LED source. Short distances, cheaper."
      }
    ],
    traps: [
      {
        concept: "Why are twisted pairs twisted?",
        trap: "Twisting does not speed up the signals. It reduces crosstalk and external electromagnetic noise by ensuring both wires receive similar interference, which cancels out at the receiver (differential signaling)."
      }
    ],
    viva: [
      {
        q: "What physical principle allows light to travel through optical fiber without escaping?",
        a: "Total Internal Reflection. The light is launched into the core at an angle greater than the critical angle, and the cladding has a lower refractive index than the core, causing the light to reflect back inside."
      },
      {
        q: "Which transmission medium is immune to electromagnetic interference (EMI)?",
        a: "Fiber optic cables. Since they transmit light (photons) rather than electrical current, they do not emit or absorb electromagnetic radiation."
      }
    ],
    memoryTrick: "Total Internal Reflection rule: Core index must be higher than Cladding. Core is COZY (higher index), Cladding is COLD (lower index)."
  },
  {
    id: 4,
    title: "Signals & Data Limits",
    objectives: [
      "Differentiate between Analog, Digital, Periodic, and Non-periodic signals",
      "Master the physical parameters: Amplitude, Frequency, Phase, Wavelength",
      "Distinguish between Bit Rate and Baud Rate",
      "Apply Nyquist and Shannon limits to calculate channel capacities"
    ],
    analogy: "Imagine a highway. The speed limit (Nyquist limit) is the maximum number of cars per second you can send under perfect conditions. The potholes and weather conditions (Noise/Shannon limit) represent the absolute limit of what you can safely transport once real-world friction is introduced.",
    sections: [
      {
        heading: "Signal Fundamentals",
        content: "• Analog signals have infinitely many levels over time. Digital signals have discrete, defined levels.\n• Periodic signals repeat a pattern over a constant time interval. $T = 1/f$ (Time period is inverse of frequency).\n• Phase: The position of the wave relative to time 0 (measured in degrees or radians).\n• Wavelength: Distance a simple signal travels in one period. $\\lambda = v / f$ (where $v$ is propagation speed)."
      },
      {
        heading: "Bit Rate vs Baud Rate",
        content: "• Bit Rate: Number of bits sent per second (bps).\n• Baud (Symbol) Rate: Number of signal changes per second.\n• Relationship: $\\text{Bit Rate} = \\text{Baud Rate} \\times \\log_2(L)$ where $L$ is the number of signal levels. If we use 4 levels, each symbol carries $\\log_2(4) = 2$ bits, so the bit rate is double the baud rate."
      },
      {
        heading: "Nyquist Bit Rate (Noiseless Channel)",
        content: "Formulated by Harry Nyquist for noise-free channels:\n$$\\text{Capacity} = 2 \\times B \\times \\log_2(L)$$\nWhere:\n• $B$ = Bandwidth in Hz\n• $L$ = Number of signal levels used to represent data.\nThis shows that data rate is directly proportional to bandwidth."
      },
      {
        heading: "Shannon Capacity (Noisy Channel)",
        content: "Formulated by Claude Shannon for realistic, noisy channels:\n$$\\text{Capacity} = B \\times \\log_2(1 + \\text{SNR})$$\nWhere:\n• $B$ = Bandwidth in Hz\n• $\\text{SNR}$ = Signal-to-Noise Ratio (linear value: $\\text{Signal Power} / \\text{Noise Power}$).\nNote: $\\text{SNR}_{\\text{dB}} = 10 \\log_{10}(\\text{SNR})$. You MUST convert dB to linear before plugging into Shannon's formula!"
      }
    ],
    traps: [
      {
        concept: "Using dB in Shannon's Formula",
        trap: "Never put the decibel (dB) value directly into Shannon's formula! If $\\text{SNR}_{\\text{dB}} = 30$ dB, the linear $\\text{SNR}$ is $10^{(30/10)} = 1000$. The calculation is $B \\log_2(1 + 1000)$, NOT $B \\log_2(1 + 30)$."
      }
    ],
    viva: [
      {
        q: "What is the physical meaning of Shannon's limit?",
        a: "It represents the absolute theoretical maximum data rate that can be transmitted over a noisy channel with an error rate approaching zero, regardless of how many signal levels ($L$) you attempt to use."
      },
      {
        q: "Can you increase the capacity of a noisy channel indefinitely by increasing the signal levels?",
        a: "No. In a noisy channel, if you add too many signal levels, the levels become so close together that the noise easily corrupts one level into another, causing errors. Only Shannon's limit dictates the capacity."
      }
    ],
    memoryTrick: "Shannon has an 'S' and 'N' for Signal and Noise. Nyquist is 'N' for Noiseless."
  },
  {
    id: 5,
    title: "Transmission Impairments",
    objectives: [
      "Explain the three main impairments: Attenuation, Distortion, and Noise",
      "Calculate decibel gains/losses along a transmission path",
      "Understand the causes of thermal, induced, crosstalk, and impulse noise",
      "Define Bit Error Rate (BER) and its impact"
    ],
    analogy: "Imagine speaking to a friend across a stadium. As you get further away, your voice gets softer (Attenuation). The echoing off the concrete walls alters the shape of your voice (Distortion). The crowd screaming around you covers up what you are saying (Noise). And if it takes time for your voice to reach them, that's Delay.",
    sections: [
      {
        heading: "Attenuation & Decibels",
        content: "• Attenuation: Loss of energy as a signal propagates through a medium due to resistance. To compensate, amplifiers are placed at intervals.\n• Decibel (dB) measures relative strengths: $\\text{dB} = 10 \\log_{10}(P_2 / P_1)$. A negative value means attenuation (loss), positive means amplification (gain)."
      },
      {
        heading: "Distortion",
        content: "Distortion means the signal changes its shape or form. This occurs in a composite signal (made of many harmonic frequencies) because different frequency components travel at different speeds through a medium, arriving at different times (delay distortion)."
      },
      {
        heading: "Types of Noise",
        content: "• Thermal Noise: Random motion of electrons in wire. Proportional to temperature.\n• Induced Noise: From external sources like motors, appliances.\n• Crosstalk: Electromagnetic coupling between adjacent wire pairs.\n• Impulse Noise: Sudden spike of high energy (lightning, power surges). Primary cause of bit errors in digital communication."
      }
    ],
    traps: [
      {
        concept: "Decibel Addition",
        trap: "When a signal passes through consecutive components with gains/losses of $-3$ dB, $+10$ dB, and $-2$ dB, you can simply add them mathematically: $-3 + 10 - 2 = +5$ dB overall. You do not need to multiply them."
      }
    ],
    viva: [
      {
        q: "What is crosstalk and how can it be prevented?",
        a: "Crosstalk is the unwanted transfer of signals between communication channels (e.g. hearing another phone call). It is prevented by shielding cables (STP) and twisting wire pairs."
      },
      {
        q: "Why is impulse noise more destructive to digital data than analog signals?",
        a: "An impulse spike might just cause a brief click or static in analog audio, but in digital data, a millisecond spike can corrupt hundreds of consecutive bits, destroying entire data frames."
      }
    ],
    memoryTrick: "ADN - Attenuation (weakening), Distortion (warping), Noise (intruding)."
  },
  {
    id: 6,
    title: "Switching",
    objectives: [
      "Understand why switching is necessary in large networks",
      "Contrast Circuit Switching and Packet Switching",
      "Differentiate between Datagram networks and Virtual Circuit networks",
      "Compare the delay characteristics of switching techniques"
    ],
    analogy: "Circuit switching is like making a phone call in 1950—a physical copper path is reserved just for you and your partner, and nobody else can use it until you hang up. Packet switching is like sending a 100-page book by tearing out the pages, putting each in an envelope, writing the address on each, and sending them via the mail. They travel separately, might arrive out of order, but the mail carriers can route millions of letters at once.",
    sections: [
      {
        heading: "Circuit Switching",
        content: "Provides a dedicated physical path between two nodes. Consists of three phases: Circuit establishment (Setup), Data transfer, and Circuit teardown.\n• Pros: Guaranteed bandwidth, constant delay, no packet overhead.\n• Cons: Highly inefficient (resources reserved even during silence), long setup delay."
      },
      {
        heading: "Packet Switching",
        content: "Data is broken down into small packets. Each packet contains header information (addresses, sequence numbers) and is routed independently through the network. Uses Store-and-Forward transmission.\n• Pros: Highly efficient resource utilization (statistical multiplexing), robust against node failures.\n• Cons: Variable delay (jitter), queueing delays, potential packet loss."
      },
      {
        heading: "Datagram vs Virtual Circuit",
        content: "• Datagram (Connectionless): Each packet is routed completely independently. Packets may arrive out of order, and router must inspect full destination address of every packet (e.g., the Internet IP routing).\n• Virtual Circuit (Connection-oriented): A logical path is set up before data is sent. Packets carry a short Virtual Circuit Identifier (VCI) instead of full address, and follow the same pre-established path in order."
      }
    ],
    traps: [
      {
        concept: "Bandwidth Reservation",
        trap: "In circuit switching, if a dedicated line has a capacity of 1 Mbps and you transmit nothing, that 1 Mbps remains idle and cannot be used by others. In packet switching, bandwidth is shared dynamically based on demand."
      }
    ],
    viva: [
      {
        q: "What is 'Store-and-Forward' transmission in packet switching?",
        a: "A router cannot forward a packet as soon as the first bits arrive. It must receive, store, and verify the entire packet (checking for errors via CRC) before it can begin transmitting it to the next hop."
      },
      {
        q: "Why does packet switching have variable delay (jitter)?",
        a: "Packets might take different paths, and they experience variable queueing delays at routers depending on the background traffic density."
      }
    ],
    memoryTrick: "Packet = Pages in separate envelopes. Circuit = Dedicated copper pipeline."
  },
  {
    id: 7,
    title: "Data Link Layer & Flow Control",
    objectives: [
      "Explain the fundamental design issues: Framing, Flow Control, and Error Control",
      "Contrast Character Count, Byte Stuffing, and Bit Stuffing methods",
      "Analyze Stop-and-Wait, Go-Back-N, and Selective Repeat protocols",
      "Calculate efficiency and link utilization for sliding window protocols"
    ],
    analogy: "Imagine a teacher speaking to a room. Flow control is the student saying 'Slow down, I can't write this fast!' Stop-and-Wait is the teacher writing one sentence, waiting for every student to nod (ACK), then writing the next. Go-Back-N is the teacher reading 5 sentences, and if a student misses sentence 3, they make the teacher repeat sentences 3, 4, and 5. Selective Repeat is the teacher repeating ONLY sentence 3.",
    sections: [
      {
        heading: "Framing Methods",
        content: "• Character Count: Header contains frame length. If a count gets corrupted, all subsequent frames are misaligned.\n• Byte Stuffing (Character Stuffing): Framing flags (`ESC`, `FLAG`) mark start/end. If a flag appears in data, an escape character (`ESC`) is stuffed before it.\n• Bit Stuffing: Flag is `01111110`. The sender automatically stuffs a `0` after five consecutive `1`s in the data. The receiver destuffs any `0` that follows five consecutive `1`s."
      },
      {
        heading: "Flow Control: Stop-and-Wait",
        content: "Sender transmits one frame, starts a timer, and stops. It waits for an ACK before sending the next. If the timer expires, it retransmits.\n• Efficiency: $\\eta = 1 / (1 + 2a)$ where $a = T_{prop} / T_{trans}$.\nIf propagation delay is high (like satellite links), efficiency is extremely low because the sender spends most of its time waiting."
      },
      {
        heading: "Sliding Window: Go-Back-N (GBN)",
        content: "Sender can transmit up to $N$ frames before waiting for an ACK. Uses Cumulative ACKs (e.g., ACK 5 means all frames up to 5 received). If a frame is lost, sender retransmits that frame and ALL subsequent frames in the window.\n• Sender Window: $W_s = 2^m - 1$ (for $m$ sequence bits).\n• Receiver Window: $W_r = 1$."
      },
      {
        heading: "Sliding Window: Selective Repeat (SR)",
        content: "Sender can transmit up to $N$ frames. Receiver buffers out-of-order frames and sends individual ACKs. When a frame is lost, the sender retransmits ONLY that specific frame.\n• Sender Window: $W_s = 2^{m-1}$.\n• Receiver Window: $W_r = 2^{m-1}$ (Sender and receiver window sizes are equal)."
      }
    ],
    traps: [
      {
        concept: "Window Size and Sequence Bits",
        trap: "In GBN, with 3 bits, window size is $2^3 - 1 = 7$. In SR, with 3 bits, window size is $2^{3-1} = 4$. If you make the window larger, sequence numbers will overlap, causing the receiver to confuse new frames with duplicate retransmissions."
      }
    ],
    viva: [
      {
        q: "What is piggybacking?",
        a: "It is the technique of temporarily delaying an outgoing ACK so it can be hooked onto the next outgoing data frame (in the payload header) instead of sending a separate control frame, saving bandwidth."
      },
      {
        q: "Why is the receiver window size in Go-Back-N equal to 1?",
        a: "Because GBN does not buffer out-of-order frames. It only accepts frames in strict sequential order. If frame $i$ is missing, it discards frame $i+1$ even if it arrives correctly."
      }
    ],
    memoryTrick: "Selective Repeat divides the sequence space exactly in half ($2^{m-1}$ for both sender/receiver)."
  },
  {
    id: 8,
    title: "Error Detection & Correction",
    objectives: [
      "Distinguish between single-bit errors and burst errors",
      "Apply Simple Parity, LRC, and Checksum mechanisms",
      "Perform Cyclic Redundancy Check (CRC) using polynomial division",
      "Understand Hamming code concept for error correction"
    ],
    analogy: "A checksum is like adding up the prices on a receipt. If the cashier tells you the total is $45, but you add the prices and get $43, you know there is an error. CRC is a more complex mathematical checksum—like dividing the receipt total by a prime number and checking the remainder. It is incredibly hard to cheat or accidentally match.",
    sections: [
      {
        heading: "Parity Checks & LRC",
        content: "• Single Parity: Add an extra bit to make the count of 1s even (Even Parity) or odd (Odd Parity). Detects single-bit errors. Fails if two bits flip.\n• Longitudinal Redundancy Check (LRC): Organize bits in a grid; calculate parity for each row and column. Can detect burst errors but fails on symmetric pattern flips."
      },
      {
        heading: "Internet Checksum",
        content: "Used in IP, TCP, and UDP. Data is divided into 16-bit blocks. The blocks are added using 1's complement arithmetic (carries are added back to the LSB). The final sum is complemented. The receiver performs the same addition; the result must be all 1s (or all 0s depending on implementation)."
      },
      {
        heading: "Cyclic Redundancy Check (CRC)",
        content: "A powerful mathematical method based on binary division:\n1. Let data word have $k$ bits, generator polynomial $G(X)$ have degree $r$ (which corresponds to $r+1$ bits).\n2. Append $r$ zeros to the data word.\n3. Divide the appended data by the divisor (generator bits) using Modulo-2 (XOR) division.\n4. The remainder of this division (which has $r$ bits) is the CRC checksum.\n5. Replace the appended zeros with this remainder to form the transmitted codeword.\n6. Receiver divides the received codeword by the same generator. If remainder is 0, no error."
      }
    ],
    traps: [
      {
        concept: "Degree of Generator vs Appended Zeros",
        trap: "If the generator polynomial is $G(X) = X^3 + X + 1$, the degree is 3, which means we append 3 zeros, and the divisor is binary `1011` (length 4). Do not append 4 zeros!"
      }
    ],
    viva: [
      {
        q: "Why is modulo-2 division used in CRC instead of standard binary division?",
        a: "Modulo-2 arithmetic is equivalent to the logical XOR operation and does not require carries or borrows. This makes it extremely fast and easy to implement in hardware shift registers."
      },
      {
        q: "What types of errors can CRC detect?",
        a: "CRC can detect all single-bit errors, all double-bit errors (if generator satisfies certain conditions), any odd number of errors, and burst errors of length up to the degree of the polynomial."
      }
    ],
    memoryTrick: "XOR Rule: Same is 0, Different is 1. (0 XOR 0 = 0, 1 XOR 1 = 0, 1 XOR 0 = 1, 0 XOR 1 = 1)."
  },
  {
    id: 9,
    title: "Medium Access Control (MAC)",
    objectives: [
      "Compare Random Access protocols: ALOHA, CSMA, CSMA/CD, CSMA/CA",
      "Calculate efficiency of Pure ALOHA vs Slotted ALOHA",
      "Explain the collision detection mechanism in Ethernet (CSMA/CD)",
      "Illustrate the Hidden and Exposed Terminal Problems in wireless networks"
    ],
    analogy: "Pure ALOHA is like people in a room shouting whenever they have a thought—lots of collisions. Slotted ALOHA is like speaking only at the start of a minute chime—fewer collisions. CSMA is listening to see if someone is speaking before you talk. CSMA/CD is listening, and if you start speaking at the same time as someone else, you both stop, yell 'Collision!', wait a random amount of time, and try again.",
    sections: [
      {
        heading: "ALOHA Protocols",
        content: "• Pure ALOHA: Nodes transmit immediately. If collision occurs, wait a random time and retransmit.\n  - Max Efficiency: $1 / (2e) \\approx 18.4\\%$.\n• Slotted ALOHA: Time is divided into slots. Nodes can only transmit at the beginning of a slot.\n  - Max Efficiency: $1/e \\approx 36.8\\%$ (double the efficiency of Pure ALOHA)."
      },
      {
        heading: "CSMA (Carrier Sense Multiple Access)",
        content: "'Listen before you talk'. Nodes sense the channel carrier first:\n• 1-persistent: If idle, transmit immediately with probability 1. If busy, keep listening.\n• Non-persistent: If idle, transmit. If busy, wait a random time and check again.\n• p-persistent: If idle, transmit with probability $p$; with probability $1-p$, wait for next slot."
      },
      {
        heading: "CSMA/CD (Collision Detection)",
        content: "Used in wired Ethernet. Node senses carrier, transmits, and monitors the channel while transmitting. If collision is detected, it aborts transmission, sends a Jam Signal, and uses Exponential Backoff to schedule retransmission. Minimum frame size is required: $T_{trans} \\ge 2 \\times T_{prop}$."
      },
      {
        heading: "CSMA/CA & Hidden/Exposed Terminals",
        content: "Used in Wi-Fi (wireless). Collision detection is impossible in wireless because the transmitter's own signal overpowers any incoming signal. CSMA/CA uses Collision Avoidance (IFS, Contention Window, and RTS/CTS handshake).\n• Hidden Terminal: A transmits to B. C cannot hear A, senses medium idle, and transmits to B, colliding with A's frame. Solved by RTS/CTS.\n• Exposed Terminal: B is transmitting to A. C wants to transmit to D. C hears B, thinks medium is busy, and waits unnecessarily, even though transmitting to D wouldn't interfere with A."
      }
    ],
    traps: [
      {
        concept: "CSMA/CD vs CSMA/CA",
        trap: "Ethernet uses CD (Detection - aborts transmission mid-way). Wireless Wi-Fi uses CA (Avoidance - tries to prevent collisions before sending via random backoffs and RTS/CTS)."
      }
    ],
    viva: [
      {
        q: "Why is there a minimum frame length requirement in CSMA/CD?",
        a: "To ensure a station does not finish sending its frame before the collision signal has time to propagate back to it. The transmission time of the frame must be at least twice the worst-case propagation delay ($2 T_{prop}$)."
      },
      {
        q: "How does the RTS/CTS mechanism solve the Hidden Terminal problem?",
        a: "Sender transmits a Request to Send (RTS). The receiver responds with a Clear to Send (CTS). All nodes in the range of the receiver hear the CTS and defer their transmissions, protecting the sender's transmission."
      }
    ],
    memoryTrick: "Pure ALOHA vulnerable time is $2 T_p$. Slotted ALOHA vulnerable time is $T_p$. (Cut in half = double the throughput)."
  },
  {
    id: 10,
    title: "Network Layer & Routing",
    objectives: [
      "Compare IPv4 and IPv6 headers and addressing",
      "Perform CIDR subnetting calculations",
      "Explain routing concepts: Link State (Dijkstra) vs Distance Vector (Bellman-Ford)",
      "Understand Network Address Translation (NAT) operation"
    ],
    analogy: "Routing is like navigating a road trip. Distance Vector routing is like asking locals at each intersection: 'Which way to Chicago?' and they point you to the next town. You don't have the whole map. Link State routing is like opening Google Maps—you download the entire country's roadmap (Topology database) and calculate the absolute shortest path yourself using Dijkstra's algorithm.",
    sections: [
      {
        heading: "IPv4 vs IPv6 Addressing",
        content: "• IPv4: 32-bit addresses, written in dotted-decimal (e.g., `192.168.1.1`). Total address space $\\approx 4.3 \\times 10^9$. Header size is variable (20-60 bytes).\n• IPv6: 128-bit addresses, written in hexadecimal colon-separated (e.g., `2001:db8::ff00:42:8329`). Total space $\\approx 3.4 \\times 10^{38}$. Fixed 40-byte header (faster routing processing, no fragmentation at intermediate routers)."
      },
      {
        heading: "Classful vs Classless (CIDR) Addressing",
        content: "• Classful: Divided into Class A (/8), B (/16), C (/24), D (Multicast), E (Experimental). Highly wasteful.\n• CIDR (Classless Inter-Domain Routing): Uses variable length subnet masks (VLSM). Written as `IP/Prefix` (e.g. `192.168.1.0/26`). The `/26` means first 26 bits are network bits, leaving $32-26 = 6$ bits for hosts ($2^6 - 2 = 62$ usable host IPs)."
      },
      {
        heading: "Routing Algorithms",
        content: "• Distance Vector: Each router maintains a table of distances to all destinations and shares it periodically with its neighbors. Uses Bellman-Ford equation. Prone to 'Count-to-Infinity' problem (solved by split horizon, poison reverse).\n• Link State: Each router broadcasts the state of its links to all routers in the network (LSP flooding). Every router builds a complete topology map and runs Dijkstra's algorithm locally to find the shortest path."
      },
      {
        heading: "NAT (Network Address Translation)",
        content: "Allows a whole private network (e.g., using `192.168.x.x` ranges) to share a single public IP address. The NAT router translates internal private IP + Port to its public IP + a unique temporary Port, maintaining a translation table."
      }
    ],
    traps: [
      {
        concept: "Usable Host Addresses",
        trap: "In any subnet, the number of usable host addresses is $2^H - 2$. You must subtract 2 because the first address is the Network Address (all host bits 0) and the last is the Broadcast Address (all host bits 1). They cannot be assigned to hosts!"
      }
    ],
    viva: [
      {
        q: "What is the Count-to-Infinity problem in Distance Vector routing?",
        a: "It occurs when a link breaks, and two routers keep incrementing their distance metrics to that destination based on each other's outdated information, slowly counting up to infinity before realizing the path is dead."
      },
      {
        q: "Why is IPv6 header processing faster than IPv4?",
        a: "IPv6 has a fixed header size (40 bytes), removes the checksum field (relying on upper/lower layers, saving computation at each hop), and prohibits fragmentation at intermediate routers (source host must discover Path MTU)."
      }
    ],
    memoryTrick: "IPv4 is 4 bytes (32 bits), IPv6 is 16 bytes (128 bits). 4 to the power of 2 is 16!"
  },
  {
    id: 11,
    title: "Transport Layer & Congestion Control",
    objectives: [
      "Contrast TCP (connection-oriented, reliable) and UDP (connectionless, fast)",
      "Explain the 3-Way Handshake (setup) and 4-Way Handshake (teardown)",
      "Analyze Sliding Window Flow Control in TCP",
      "Deconstruct TCP Congestion Control: Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery"
    ],
    analogy: "TCP is like registered mail where you receive a confirmation receipt for every envelope, and if one is lost, it's sent again. The mailman also monitors if your letterbox is getting full (Flow Control) and if the highways are jammed (Congestion Control). UDP is like postcard mail—throw it in the mailbox, it's cheap, super fast, but if it gets lost, it's gone.",
    sections: [
      {
        heading: "TCP vs UDP",
        content: "• TCP (Transmission Control Protocol): Connection-oriented, reliable (acks, retransmissions), byte-stream, slow, guarantees order. Header size 20-60 bytes.\n• UDP (User Datagram Protocol): Connectionless, unreliable, message-oriented, very fast, no overhead. Header size fixed 8 bytes. Used in DNS, streaming, gaming."
      },
      {
        heading: "TCP Connection Management",
        content: "• Establishment (3-Way Handshake):\n  1. Client sends `SYN` (seq = x)\n  2. Server responds with `SYN-ACK` (seq = y, ack = x+1)\n  3. Client sends `ACK` (seq = x+1, ack = y+1)\n• Termination (4-Way Handshake):\n  1. Client sends `FIN` (active close)\n  2. Server sends `ACK` (half-closed state, can still send data)\n  3. Server sends `FIN` (when done sending)\n  4. Client sends `ACK` and enters `TIME_WAIT` (waits $2 \\times \\text{MSL}$ before closing)."
      },
      {
        heading: "TCP Congestion Control",
        content: "Governed by the Congestion Window (`cwnd`):\n• Slow Start: Starts with `cwnd = 1 MSS`. Double `cwnd` every RTT (exponential growth) until it reaches `ssthresh`.\n• Congestion Avoidance: Once `cwnd >= ssthresh`, increase `cwnd` by 1 MSS per RTT (linear growth).\n• Packet Loss Detection:\n  - Timeout: Set `ssthresh = cwnd / 2`, reset `cwnd = 1`, re-enter Slow Start.\n  - 3 Duplicate ACKs (Fast Retransmit): Set `ssthresh = cwnd / 2`, set `cwnd = ssthresh + 3`, enter Fast Recovery (retransmit missing segment immediately without waiting for timeout)."
      }
    ],
    traps: [
      {
        concept: "Flow Control vs Congestion Control",
        trap: "Flow control prevents the sender from overwhelming the *receiver* (uses Receiver Window `rwnd`). Congestion control prevents the sender from overwhelming the *network* (uses Congestion Window `cwnd`). The actual sending window is $\\min(rwnd, cwnd)$."
      }
    ],
    viva: [
      {
        q: "Why does the client wait in TIME_WAIT state after sending the final ACK in TCP teardown?",
        a: "To ensure the final ACK is received by the server (if it was lost, the server would retransmit the FIN, and the client must be alive to ACK it) and to allow old duplicate packets in the network to die out."
      },
      {
        q: "What is the purpose of the 3-Way Handshake?",
        a: "It allows both sender and receiver to synchronize their initial sequence numbers (ISNs) and allocate buffers and resources for the connection."
      }
    ],
    memoryTrick: "TCP Congestion Control growth phases: Double-up in Slow Start (exponential) until you hit the threshold, then step-by-step in Avoidance (linear)."
  },
  {
    id: 12,
    title: "Application Layer & Protocols",
    objectives: [
      "Understand Client-Server communication via HTTP/HTTPS",
      "Explain the DNS resolution process and hierarchy",
      "Differentiate between email protocols: SMTP, POP3, and IMAP",
      "Map common Application layer protocols to their default port numbers"
    ],
    analogy: "DNS is like the phonebook of the internet. You don't know the exact GPS coordinates of the pizza shop; you just look up the name 'Pizza Hut' and the phonebook gives you their phone number (IP address).",
    sections: [
      {
        heading: "Web Protocols: HTTP & HTTPS",
        content: "• HTTP (Hypertext Transfer Protocol): Stateless protocol for web transfer. Runs on TCP port 80. Uses request-response cycles.\n• HTTPS: Secure version. Runs on TCP port 443. Uses SSL/TLS encryption for privacy, integrity, and authentication."
      },
      {
        heading: "DNS (Domain Name System)",
        content: "Translates human-readable domain names (e.g., `google.com`) to IP addresses. Hierarchy:\n1. Root DNS Servers (`.`)\n2. Top-Level Domain (TLD) Servers (`.com`, `.org`, `.in`)\n3. Authoritative DNS Servers (holds actual IP records).\nResolution can be Recursive (server queries on behalf of client) or Iterative (server returns next server's IP to client to query)."
      },
      {
        heading: "Email Protocols",
        content: "• SMTP (Simple Mail Transfer Protocol): Push protocol, used to send mail from client to server, and between servers. TCP port 25.\n• POP3 (Post Office Protocol v3): Pull protocol, downloads emails from server to local client and deletes them from the server by default. TCP port 110.\n• IMAP (Internet Message Access Protocol): Pull protocol, syncs email headers and folders, leaving messages on the server. TCP port 143."
      },
      {
        heading: "DHCP (Dynamic Host Configuration Protocol)",
        content: "Automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to hosts when they join a network. Uses UDP ports 67 (server) and 68 (client). Steps: DISCOVER -> OFFER -> REQUEST -> ACK."
      }
    ],
    traps: [
      {
        concept: "SMTP vs POP/IMAP",
        trap: "SMTP is only for *sending* mail. You cannot retrieve or read mail from your mailbox using SMTP; you must use POP3 or IMAP for retrieving mail."
      }
    ],
    viva: [
      {
        q: "What is the difference between a persistent and a non-persistent HTTP connection?",
        a: "Non-persistent HTTP opens a new TCP connection for every single object (image, CSS, text) requested. Persistent HTTP keeps the TCP connection open for multiple requests/responses, saving handshake overhead."
      },
      {
        q: "Why does DNS use UDP port 53 instead of TCP for queries?",
        a: "Because DNS queries are small, single-packet requests. UDP avoids the overhead of connection setup (3-way handshake) and teardown, making name resolution extremely fast."
      }
    ],
    memoryTrick: "DHCP Handshake Mnemonic: DORA - Discover, Offer, Request, Acknowledge."
  }
];
