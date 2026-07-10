# 📘 Computer Networks Study Kit (Premium Study Edition)

A high-performance, responsive, and content-rich Single Page Application (SPA) designed to serve as the ultimate self-study guide, reference, and interactive exam practice kit for Computer Networks. This kit packs the depth of a **120–180 page resource book** into a sleek, premium digital cockpit.

---

## 🚀 Key Modules & Features

### 1. Complete Theory Notes
*   **Depth & Detail**: In-depth explanations covering everything from Layer 1 (Physical) to Layer 7 (Application) of the OSI and TCP/IP reference models.
*   **Structure**: Each unit incorporates clear definitions, real-world analogies, conceptual diagrams, advantages/disadvantages, exam-focus tips, and viva questions.

### 2. Formula Bible & Derivations
*   **Mathematical Spans**: Curated directory of network mathematical formulas (e.g., propagation vs. transmission delay, sliding window efficiencies, IPv4 subnetting ranges).
*   **Step-by-Step Proofs**: Interactive derivations explaining the efficiency calculations ($\eta$) for protocols like Stop-and-Wait, Go-Back-N, and Selective Repeat under error-free and error-prone conditions.

### 3. Interactive Subnetting Calculator & Simulators
*   **Subnetting Engine**: A reactive calculator that takes an IP address and CIDR prefix (e.g., `/26`), immediately outputting:
    *   Subnet Mask in Dotted-Decimal form.
    *   Network ID & Broadcast Address.
    *   Usable IP Range.
    *   Total Usable Hosts.
*   **TCP Congestion Control Visualizer**: A Reno-style congestion control simulator that charts slow start, congestion avoidance, timeout events, and fast recovery with a custom-rendered SVG graph and detailed event log.
*   **Dynamic Numerical Practice Generator**: A randomized mathematical generator producing network subnetting, channel capacity (Shannon/Nyquist), CRC bitwise XOR division, and sliding window efficiency problems with complete step-by-step LaTeX solutions.
*   **Reactive Safeguards**: Hardened state-validation loop to prevent render crash locks.

### 4. Interactive Mock Exam Engine
*   **Graded Section A**: Multiple-Choice Questions (MCQs) featuring instant feedback, auto-grading, and comprehensive explanations of correct answers.
*   **Descriptive Sections B & C**: Real-world simulated questions covering subnet allocations, Dijkstra's algorithm iterations, sliding window numericals, and CRC divisions.
*   **Marking Schemes**: Step-by-step revealable solutions that respect line breaks, margins, and standard mathematical layouts for absolute clarity.

### 5. Interactive Viva & Flashcards
*   **250+ Flashcards**: Standard university-level viva questions categorized by protocol, layer, and functionality.
*   **Mastery Tracking**: Interactive stats dashboard showing cards marked as "Mastered" vs. "Needs Work".
*   **Visual Pill Filters**: Category filters styled as single-line pill-shaped buttons that dynamically scroll horizontally without breaking layout grids.

### 6. Last-Night Revision booklet
*   **Key Ports Registry**: Interactive lookup table for system port mappings (e.g., SSH, FTP, DNS, HTTP, HTTPS, DHCP).
*   **Typical Marks Losers (Common Mistakes)**: Specialized panels highlighting typical mistakes students make (e.g., metrics vs. binary prefixes, subtracting host bits) styled with comfortable paddings.
*   **Layer-by-Layer Cheat Sheet**: Quick grid summarizing PDU names, physical devices, and primary layer responsibilities.

---

## 🎨 Premium Visual Theme

The application features a modern, bespoke user interface built with:
*   **Aesthetics**: Glassmorphism panel system overlaying a curated deep slate-blue background.
*   **Typography**: Clean font scaling using modern web typefaces (`Inter` and `Outfit`).
*   **Tailored UI Utilities**: Hand-crafted CSS resets, responsive grid structures, and interactive animations (flip animations for flashcards, hover scale transforms for interactive elements).
*   **SEO Optimization**: Fully generic, production-ready headers and tags optimized for general academic usage.

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
