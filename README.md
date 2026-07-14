# 📘 Computer Networks Study Kit (Premium Study Edition)

A high-performance, responsive, and content-rich Single Page Application (SPA) designed to serve as the ultimate self-study guide, reference, and interactive exam practice kit for Computer Networks. This kit packs the depth of a **120–180 page resource book** into a sleek, premium digital cockpit.

---

## 🚀 Key Modules & Features

### 1. Interactive Hero Dashboard (New!)
*   **3D CSS Book Visualizer**: A custom-modeled 3D book that uses pure CSS transforms (`preserve-3d`) to show page-turning transitions. Auto-flips periodically or allows manual flips to explore different network topics.
*   **Animated Stat Counters**: Real-time count-up stats on loading that showcase the magnitude of the material (`120+ Theory Pages`, `100+ Numericals`, `40 Comparison Tables`, `250+ Viva Q&As`, etc.).
*   **Overall Learning Progress**: Tracks and displays your learning progress across the entire handbook with a premium reactive progress bar.
*   **Quick Access Cards**: Clean interactive entry cards with hover highlights and glows that link directly to specific study views.

### 2. Reading Progress Tracker & Chapter Checklist (New!)
*   **Chapter Milestones**: Select any chapter and mark your completion progress across five key dimensions:
    *   `📖 Theory`
    *   `🧮 Formula`
    *   `🔢 Numericals`
    *   `📝 PYQs`
    *   `⚡ Revision`
*   **Chapter Progress Bars**: Each chapter button in the sidebar shows a mini progress bar that updates reactively.
*   **Persistent Storage**: Integrates with `localStorage` so that your checkmarks, chapter progress, and overall completion rate are preserved across browser refreshes and sessions.
*   **Complete Indicator**: Chapters marked as 100% done show a green checkmark (`✓`) in the sidebar list.

### 3. Complete Theory Notes & Concept Traps
*   **Depth & Detail**: In-depth explanations covering everything from Layer 1 (Physical) to Layer 7 (Application) of the OSI and TCP/IP reference models.
*   **Structure**: Each unit incorporates clear definitions, real-world analogies, conceptual diagrams, advantages/disadvantages, exam-focus tips, and viva questions.
*   **Common Exam Traps & Misconceptions**: Highlights tricky exam topics where students often lose marks (e.g., Intranet vs. Extranet vs. Internet, subnet boundary rules).

### 4. Interactive Simulators
*   **Interactive OSI Model (New!)**: A multi-dimensional 7-layer stack visualizer. Clicking on a layer sequentially reveals:
    *   *Click 1*: Key Functions (numbered lists)
    *   *Click 2*: Core Protocols (animated badge pills)
    *   *Click 3*: Typical Devices (connector grid layout)
    *   *Click 4*: Minimizes the detail view.
*   **TCP Congestion Control Simulator (Upgraded!)**: Reno-style simulator featuring:
    *   **Auto-Play & Speed Controls**: Toggle Play/Pause to auto-advance RTTs. Choose from 4 speeds: *Slow* (1.2s), *Normal* (0.8s), *Fast* (0.4s), and *Turbo* (0.15s).
    *   **Interactive Controls**: Trigger a *Timeout* or *3 Duplicate ACKs* to watch the graph and state update in real-time.
    *   **Micro-Animations**: Features custom point expansions, pulsing rings, and sliding log notifications.
*   **Dijkstra Routing Simulator (Upgraded!)**: Step-by-step shortest-path visualization:
    *   **Weight Customization**: Adjust edge costs dynamically to recalculate routes on the fly.
    *   **Animated Packet Transmission**: Once the path is solved, click the **Send Packet** button to watch an SVG packet smoothly slide node-to-node along the calculated path using linear interpolation.
*   **Subnetting Engine**: A reactive calculator that takes an IP address and CIDR prefix (e.g., `/26`), immediately outputting subnet mask, network ID, broadcast address, usable range, and host counts.
*   **CRC Checksum Calculator**: Visualizes cyclic redundancy checks with bitwise XOR long division steps.
*   **Sliding Window Protocol Simulator**: Step through Sender/Receiver windows for Stop-and-Wait, Go-Back-N, and Selective Repeat protocols.

### 5. Formula Bible, Derivations & Numerical Practice
*   **Formula Bible**: A curated list of networking equations (Nyquist, Shannon, efficiencies, delays, Hamming rules) with clear units.
*   **Numerical Generator**: Generates infinite randomized practice questions for math units with full step-by-step LaTeX rendering solutions.
*   **Mathematical Proofs**: Interactive derivations detailing sliding window efficiencies under different packet loss assumptions.

### 6. Interactive Mock Exam Engine & Viva Cards
*   **Viva Flashcards**: Over 250 flashcards with flip animations and master tracking options to filter out known cards.
*   **Mock Exams**: Full-length exam papers featuring auto-graded multiple-choice questions and long-form descriptive solutions.

---

## 🎨 Premium Visual Theme & Micro-Animations

The application features a modern, bespoke user interface built with:
*   **Aesthetics**: Glassmorphism panel system overlaying a curated deep slate-blue background.
*   **Typography**: Clean font scaling using modern web typefaces (`Inter` and `Outfit`).
*   **Transitions**: Smooth tab switches utilizing custom CSS fade-up transforms (`tab-content-enter`).
*   **Responsive Grid**: Multi-column desktop grids that gracefully adapt to single-column phone screens.

---

## 🛠️ Technology Stack & Architecture

*   **Frontend Library**: React 18
*   **Build Pipeline**: Vite (Static site generation with modular bundle chunks)
*   **Styling**: Modern Vanilla CSS (`index.css`)
*   **Icon Assets**: Lucide React
*   **Hosting Compatibility**: Ready for zero-config deployment to Vercel, Netlify, or GitHub Pages.

---

## 📦 Getting Started

### Prerequisites
*   Node.js (version 18 or higher)
*   npm

### Installation
1.  Clone the repository.
2.  Install all dependencies:
    ```bash
    npm install
    ```

### Development Server
Run the local Vite development server:
    ```bash
    npm run dev
    ```

### Production Build
Create an optimized production bundle in the `dist/` directory:
    ```bash
    npm run build
    ```

---

## 🤝 Project Credits
*   Made by **Rishit Kapoor** with the help of **Antigravity** © 2026.
