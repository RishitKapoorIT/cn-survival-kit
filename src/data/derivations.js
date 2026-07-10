export const derivationsData = [
  {
    id: "stop_and_wait",
    title: "Derivation of Stop-and-Wait Protocol Efficiency",
    steps: [
      {
        title: "Define the Cycle Time",
        math: "Total Cycle Time (T_total) = T_trans + T_prop + T_ack + T_prop_ack + T_proc",
        explanation: "Where:\n• T_trans = Transmission delay of data frame\n• T_prop = One-way propagation delay of data frame\n• T_ack = Transmission delay of ACK frame\n• T_prop_ack = Propagation delay of ACK frame\n• T_proc = Processing delay at sender/receiver"
      },
      {
        title: "Simplify Assumptions",
        math: "T_ack \\approx 0 \\quad \\text{and} \\quad T_proc \\approx 0 \\quad \\text{and} \\quad T_prop\\_ack = T_prop",
        explanation: "Since ACK frames are extremely small compared to data frames, their transmission time (T_ack) is negligible. Processing time (T_proc) is also minimal. The physical path distance remains identical, so propagation time for data and ACK is equal."
      },
      {
        title: "Calculate Simplified Total Cycle Time",
        math: "T_total = T_trans + 2 \\times T_prop",
        explanation: "This represents the total time elapsed from the moment the first bit of the frame is pushed onto the channel, to the moment the ACK is fully received."
      },
      {
        title: "Formulate Efficiency (eta)",
        math: "eta = \\frac{\\text{Useful Time}}{\\text{Total Cycle Time}} = \\frac{T_trans}{T_trans + 2 \\times T_prop}",
        explanation: "Efficiency is the ratio of the time spent actively transmitting actual data to the total cycle time."
      },
      {
        title: "Introduce Parameter 'a'",
        math: "Let \\quad a = \\frac{T_prop}{T_trans}",
        explanation: "We define 'a' as the ratio of propagation delay to transmission delay. This is a crucial metric determining how much link length dominates over data size."
      },
      {
        title: "Divide by T_trans to get final form",
        math: "eta = \\frac{T_trans / T_trans}{(T_trans + 2 \\times T_prop) / T_trans} = \\frac{1}{1 + 2a}",
        explanation: "Dividing numerator and denominator by T_trans yields the standard university formula. As 'a' increases (e.g. in satellite links), efficiency approaches 0."
      }
    ]
  },
  {
    id: "sliding_window",
    title: "Derivation of Sliding Window Protocol Efficiency",
    steps: [
      {
        title: "Understand the Transmission Cycle",
        math: "T_total = T_trans + 2 \\times T_prop",
        explanation: "The channel round trip time is the same. The difference is the sender does not stop after sending 1 frame."
      },
      {
        title: "Calculate Max Packets Transmitted",
        math: "N = W_s",
        explanation: "The sender can transmit up to W_s (window size) frames back-to-back before it has to stop and wait for the ACK of the first frame."
      },
      {
        title: "Formulate Total Transmission Time",
        math: "T_active = W_s \\times T_trans",
        explanation: "The sender transmits continuously for W_s * T_trans seconds."
      },
      {
        title: "Determine Full-Capacity Condition",
        math: "If \\quad W_s \\times T_trans \\ge T_trans + 2 \\times T_prop",
        explanation: "If the window is large enough that the sender is still transmitting when the first ACK arrives, the sender never stops. Thus, efficiency is 100% (1.0)."
      },
      {
        title: "Determine Under-Capacity Condition",
        math: "If \\quad W_s \\times T_trans < T_trans + 2 \\times T_prop",
        explanation: "If the window is too small, the sender runs out of frames to send and must wait. The active transmission time is W_s * T_trans out of the total cycle time."
      },
      {
        title: "Formulate General Efficiency",
        math: "eta = \\frac{W_s \\times T_trans}{T_trans + 2 \\times T_prop} = \\frac{W_s}{1 + 2a}",
        explanation: "By dividing top and bottom by T_trans, we get the standard expression, capped at 1.0."
      }
    ]
  },
  {
    id: "csma_cd_frame",
    title: "Derivation of CSMA/CD Minimum Frame Size",
    steps: [
      {
        title: "Understand the Worst-Case Collision Scenario",
        math: "Collision \\quad Time \\le 2 \\times T_prop",
        explanation: "Station A and Station B are at opposite ends of a cable. A starts transmitting a frame. Just before the frame reaches B (at time T_prop - epsilon), B senses the channel as idle and starts transmitting. B's signal collides with A's. The collision signal takes another T_prop to travel back to A. A only detects the collision at time 2 * T_prop after it started transmitting."
      },
      {
        title: "Formulate Transmission Time Constraint",
        math: "T_trans \\ge 2 \\times T_prop",
        explanation: "To ensure that Station A detects the collision *while it is still transmitting* (so it knows its own frame was corrupted), its frame transmission time (T_trans) must be at least twice the propagation delay."
      },
      {
        title: "Expand T_trans and T_prop",
        math: "\\frac{L}{R} \\ge 2 \\times \\frac{d}{s}",
        explanation: "Substitute T_trans = L / R and T_prop = d / s. Where L is frame length in bits, R is bandwidth in bps, d is cable length, and s is signal propagation speed."
      },
      {
        title: "Solve for Minimum Frame Size L",
        math: "L \\ge 2 \\times T_prop \\times R",
        explanation: "This shows that the minimum frame size L is directly proportional to both the length of the link (T_prop) and the transmission speed (R). If speed increases or cable length increases, minimum frame size must increase."
      }
    ]
  }
];
