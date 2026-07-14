import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Layers, 
  Activity, 
  HelpCircle, 
  Award, 
  Flame, 
  Sparkles, 
  FileText, 
  Search, 
  BookOpenCheck,
  ChevronRight,
  Bookmark,
  Printer
} from 'lucide-react';

// Import data
import { chaptersData } from './data/theory';
import { formulasData } from './data/formulas';
import { comparisonsData } from './data/comparisons';
import { derivationsData } from './data/derivations';
import { pyqAnalysis } from './data/pyqAnalysis';
import { revisionData } from './data/revision';

// Import interactive components
import SubnettingCalculator from './components/SubnettingCalculator';
import DelayVisualizer from './components/DelayVisualizer';
import SlidingWindowSimulator from './components/SlidingWindowSimulator';
import RoutingSimulator from './components/RoutingSimulator';
import CrcChecksumCalculator from './components/CrcChecksumCalculator';
import FlashcardGame from './components/FlashcardGame';
import MockExamEngine from './components/MockExamEngine';
import TcpCongestionVisualizer from './components/TcpCongestionVisualizer';
import NumericalGenerator from './components/NumericalGenerator';
import OsiDiagram from './components/OsiDiagram';
import HeroDashboard from './components/HeroDashboard';

const PROGRESS_TASKS = ['theory', 'formula', 'numericals', 'pyqs', 'revision'];
const TASK_LABELS = { theory: '📖 Theory', formula: '🧮 Formula', numericals: '🔢 Numericals', pyqs: '📝 PYQs', revision: '⚡ Revision' };

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedChapterId, setSelectedChapterId] = useState(1);
  const [activeSim, setActiveSim] = useState('subnetting');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedChapters, setBookmarkedChapters] = useState(new Set());

  // ── Reading Progress (persisted to localStorage) ──────────────────────
  const [chapterProgress, setChapterProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cn_chapter_progress') || '{}'); }
    catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('cn_chapter_progress', JSON.stringify(chapterProgress));
  }, [chapterProgress]);

  const toggleTask = (chapterId, task) => {
    setChapterProgress(prev => {
      const chap = prev[chapterId] || {};
      return { ...prev, [chapterId]: { ...chap, [task]: !chap[task] } };
    });
  };

  const getProgress = (chapterId) => {
    const chap = chapterProgress[chapterId] || {};
    const done = PROGRESS_TASKS.filter(t => chap[t]).length;
    return Math.round((done / PROGRESS_TASKS.length) * 100);
  };

  const overallProgress = Math.round(
    chaptersData.reduce((sum, ch) => sum + getProgress(ch.id), 0) / chaptersData.length
  );

  useEffect(() => {
    let timer;
    const typeset = () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise().catch(err => console.error(err));
      } else {
        timer = setTimeout(typeset, 100);
      }
    };
    typeset();
    return () => clearTimeout(timer);
  }, [activeTab, selectedChapterId, activeSim, searchQuery]);

  // Global search implementation
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleBookmark = (id) => {
    setBookmarkedChapters(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleQuickLink = (tabName, simName = '') => {
    setActiveTab(tabName);
    if (simName) setActiveSim(simName);
    setSearchQuery('');
  };

  // Filter theory chapters based on search query
  const filteredChapters = chaptersData.filter(ch => 
    ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.sections.some(sec => sec.heading.toLowerCase().includes(searchQuery.toLowerCase()) || sec.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedChapter = chaptersData.find(ch => ch.id === selectedChapterId) || chaptersData[0];

  return (
    <div className="app-container min-h-screen bg-[#090d16] text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0c1222] border-b md:border-b-0 md:border-r border-slate-900 flex flex-col shrink-0 select-none">
        
        {/* Logo and Brand */}
        <div className="p-6 border-b border-slate-900 flex flex-col gap-1.5 relative overflow-hidden">
          <div className="absolute w-28 h-28 bg-sky-500/10 rounded-full blur-3xl -top-10 -left-10"></div>
          <div className="absolute w-28 h-28 bg-indigo-500/10 rounded-full blur-3xl -bottom-10 -right-10"></div>
          
          <h1 className="text-base font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 uppercase flex items-center gap-2">
            <Flame className="w-5 h-5 text-indigo-400 animate-pulse" />
            CN Survival Kit
          </h1>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
            Premium Student Edition
          </span>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-slate-900">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search concepts or ports..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-slate-950 border border-slate-900 rounded-lg py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition font-mono"
            />
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin">
          <button
            onClick={() => handleQuickLink('home')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              activeTab === 'home'
                ? 'bg-purple-500/10 border-l-2 border-purple-400 text-purple-300 font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4" /> Dashboard
            </span>
          </button>

          <button
            onClick={() => handleQuickLink('theory')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              activeTab === 'theory' 
                ? 'bg-sky-500/10 border-l-2 border-sky-400 text-sky-300 font-bold' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4" /> Complete Theory Notes
            </span>
          </button>

          <button
            onClick={() => handleQuickLink('formulas')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              activeTab === 'formulas' 
                ? 'bg-indigo-500/10 border-l-2 border-indigo-400 text-indigo-300 font-bold' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" /> Formula Bible
            </span>
          </button>

          <button
            onClick={() => handleQuickLink('derivations')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              activeTab === 'derivations' 
                ? 'bg-purple-500/10 border-l-2 border-purple-400 text-purple-300 font-bold' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <BookOpenCheck className="w-4 h-4" /> Crucial Derivations
            </span>
          </button>

          <button
            onClick={() => handleQuickLink('simulators')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              activeTab === 'simulators' 
                ? 'bg-rose-500/10 border-l-2 border-rose-400 text-rose-300 font-bold' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Activity className="w-4 h-4" /> Interactive Simulators
            </span>
          </button>

          <button
            onClick={() => handleQuickLink('comparisons')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              activeTab === 'comparisons' 
                ? 'bg-pink-500/10 border-l-2 border-pink-400 text-pink-300 font-bold' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" /> Comparison Tables
            </span>
          </button>

          <button
            onClick={() => handleQuickLink('viva')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              activeTab === 'viva' 
                ? 'bg-amber-500/10 border-l-2 border-amber-400 text-amber-300 font-bold' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4" /> Viva & Flashcards
            </span>
          </button>

          <button
            onClick={() => handleQuickLink('pyq')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              activeTab === 'pyq' 
                ? 'bg-emerald-500/10 border-l-2 border-emerald-400 text-emerald-300 font-bold' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Award className="w-4 h-4" /> PYQ Analysis
            </span>
          </button>

          <button
            onClick={() => handleQuickLink('mocks')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              activeTab === 'mocks' 
                ? 'bg-teal-500/10 border-l-2 border-teal-400 text-teal-300 font-bold' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" /> Mock Exam Papers
            </span>
          </button>

          <button
            onClick={() => handleQuickLink('revision')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
              activeTab === 'revision' 
                ? 'bg-orange-500/10 border-l-2 border-orange-400 text-orange-300 font-bold' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4" /> Last Night Revision
            </span>
          </button>
        </nav>

        {/* Sidebar Footer Quick Link */}
        <div className="p-4 border-t border-slate-900">
          <button 
            onClick={() => handleQuickLink('revision')}
            className="w-full bg-[#1b233a] hover:bg-[#252f4c] text-orange-400 hover:text-orange-300 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-[0_0_8px_rgba(249,115,22,0.1)] active:scale-98"
          >
            🚀 10-Minute revision
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#090d16] overflow-y-auto">
        
        {/* Header bar */}
        <header className="h-16 border-b border-slate-900 flex justify-between items-center px-6 md:px-8 select-none bg-[#090d16]/80 backdrop-blur-md sticky top-0 z-30">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
              Mode: STUDY & PRACTICE
            </span>
            <h2 className="text-sm font-bold text-slate-300 flex items-center gap-1.5 capitalize">
              {activeTab === 'theory' ? `Chapter ${selectedChapter.id}: ${selectedChapter.title}` : activeTab}
            </h2>
          </div>

          <div className="flex gap-4 items-center">
            {activeTab === 'theory' && (
              <button 
                onClick={() => toggleBookmark(selectedChapter.id)}
                className={`p-2 rounded-lg border transition ${
                  bookmarkedChapters.has(selectedChapter.id)
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                    : 'border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
                title="Bookmark this chapter"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}

            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              Exam Target: 90%+
            </span>
          </div>
        </header>

        {/* Tab contents router */}
        <div key={activeTab} className="tab-content-enter p-6 md:p-8 flex-1 max-w-5xl mx-auto w-full">
          
          {/* SEARCH TRIGGER */}
          {searchQuery && (
            <div className="mb-6 bg-slate-900/50 border border-slate-850 p-4 rounded-xl">
              <h3 className="text-xs uppercase font-bold text-slate-500 mb-2 font-mono flex items-center gap-1.5">
                🔎 Search matches for: "{searchQuery}"
              </h3>
              <div className="space-y-2 text-xs">
                {filteredChapters.length === 0 && formulasData.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                  <div className="text-slate-500 italic">No matches found in chapters or formulas.</div>
                ) : (
                  <>
                    {/* Chapter Matches */}
                    {filteredChapters.map(ch => (
                      <button
                        key={ch.id}
                        onClick={() => { setSelectedChapterId(ch.id); handleQuickLink('theory'); }}
                        className="w-full text-left p-2.5 rounded bg-slate-950 border border-slate-900 hover:border-sky-500/30 text-slate-300 transition flex justify-between items-center"
                      >
                        <span>📖 Chapter {ch.id}: {ch.title}</span>
                        <ChevronRight className="w-3 h-3 text-slate-500" />
                      </button>
                    ))}
                    {/* Formula Matches */}
                    {formulasData.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.topic.toLowerCase().includes(searchQuery.toLowerCase())).map(f => (
                      <button
                        key={f.id}
                        onClick={() => handleQuickLink('formulas')}
                        className="w-full text-left p-2.5 rounded bg-slate-950 border border-slate-900 hover:border-indigo-500/30 text-slate-300 transition flex justify-between items-center"
                      >
                        <span>🧮 Formula: {f.title} ({f.topic})</span>
                        <ChevronRight className="w-3 h-3 text-slate-500" />
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB: HOME DASHBOARD */}
          {activeTab === 'home' && (
            <HeroDashboard
              onNavigate={(tab) => handleQuickLink(tab)}
              chapterProgress={chapterProgress}
              chaptersData={chaptersData}
            />
          )}

          {/* TAB: THEORY */}
          {activeTab === 'theory' && !searchQuery && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Chapter Sidebar selector */}
              <div className="lg:col-span-1 bg-[#0c1222] border border-slate-900 rounded-2xl p-4 space-y-1.5 select-none sticky top-24">
                {/* Overall progress bar */}
                <div className="px-2 mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Overall Progress</span>
                    <span className="text-[10px] font-black font-mono" style={{ color: overallProgress >= 80 ? '#4ade80' : overallProgress >= 40 ? '#fbbf24' : '#60a5fa' }}>{overallProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${overallProgress}%`,
                        background: overallProgress >= 80 ? 'linear-gradient(90deg,#10b981,#4ade80)' : overallProgress >= 40 ? 'linear-gradient(90deg,#d97706,#fbbf24)' : 'linear-gradient(90deg,#2563eb,#60a5fa)'
                      }}
                    />
                  </div>
                </div>

                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono px-2">Chapters</span>
                <div className="max-h-[55vh] overflow-y-auto space-y-1 scrollbar-thin">
                  {chaptersData.map((ch) => {
                    const pct = getProgress(ch.id);
                    return (
                      <button
                        key={ch.id}
                        onClick={() => setSelectedChapterId(ch.id)}
                        className={`w-full text-left py-2 px-3 rounded-lg text-xs font-medium transition ${
                          selectedChapterId === ch.id
                            ? 'bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold'
                            : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="truncate pr-1">Ch {ch.id}. {ch.title.split(' ').slice(0, 3).join(' ')}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            {bookmarkedChapters.has(ch.id) && <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400" />}
                            {pct === 100 && <span className="text-emerald-400 text-[10px]">✓</span>}
                          </div>
                        </div>
                        {/* Per-chapter mini progress bar */}
                        <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: pct === 100 ? '#10b981' : pct > 0 ? '#3b82f6' : 'transparent'
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Chapter Content */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Introduction & Analogy */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 shadow-xl space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider font-mono bg-sky-950/40 border border-sky-900 px-2.5 py-1 rounded-full">
                      Chapter {selectedChapter.id} Overview
                    </span>
                    {/* Chapter completion checkboxes */}
                    <div className="flex flex-wrap gap-2">
                      {PROGRESS_TASKS.map(task => {
                        const done = !!(chapterProgress[selectedChapter.id] || {})[task];
                        return (
                          <button
                            key={task}
                            onClick={() => toggleTask(selectedChapter.id, task)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer"
                            style={{
                              background: done ? 'rgba(16,185,129,0.15)' : 'rgba(15,23,42,0.6)',
                              border: `1px solid ${done ? '#10b981' : '#1e293b'}`,
                              color: done ? '#4ade80' : '#64748b',
                            }}
                          >
                            <span>{done ? '☑' : '☐'}</span>
                            {TASK_LABELS[task]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-100">{selectedChapter.title}</h3>
                  
                  {/* Learning Objectives */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900/80">
                    <h4 className="text-xs uppercase font-bold text-slate-400 mb-2.5 flex items-center gap-1.5">
                      ⭐ Learning Objectives
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                      {selectedChapter.objectives.map((obj, idx) => (
                        <li key={idx} className="flex gap-1.5 items-start">
                          <span className="text-sky-500 shrink-0 font-bold">✓</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Real-World Analogy */}
                  <div className="border-l-4 border-indigo-500 bg-indigo-950/20 p-4 rounded-r-xl">
                    <h4 className="text-xs uppercase font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                      💡 Real-World Analogy
                    </h4>
                    <p className="text-xs md:text-sm text-indigo-200 leading-relaxed italic">
                      "{selectedChapter.analogy}"
                    </p>
                  </div>
                </div>

                {/* Main Theory Sections */}
                <div className="space-y-4">
                  {selectedChapter.sections.map((section, sIdx) => (
                    <div key={sIdx} className="glass-panel p-6 rounded-2xl border border-slate-850/80 shadow-md">
                      <h4 className="text-base font-bold text-sky-400 mb-3 border-b border-slate-800 pb-2">
                        {section.heading}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Common Exam Traps */}
                {selectedChapter.traps && selectedChapter.traps.length > 0 && (
                  <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-6">
                    <h4 className="text-rose-400 font-bold text-sm mb-3 flex items-center gap-2">
                      ⚠️ Common Exam Traps & Misconceptions
                    </h4>
                    {selectedChapter.traps.map((trap, idx) => (
                      <div key={idx} className="text-xs leading-relaxed text-slate-300">
                        <strong className="text-rose-300 block mb-1">Concept: {trap.concept}</strong>
                        {trap.trap}
                      </div>
                    ))}
                  </div>
                )}

                {/* Memory Tricks & Mnemonics */}
                {selectedChapter.memoryTrick && (
                  <div className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-6">
                    <h4 className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-2">
                      🧠 Memory Trick / Mnemonic
                    </h4>
                    <p className="text-xs text-slate-300 italic">
                      {selectedChapter.memoryTrick}
                    </p>
                  </div>
                )}

                {/* Chapter Viva / Interview Practice */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-850/80 shadow-md">
                  <h4 className="text-sm uppercase font-bold text-slate-400 tracking-wider mb-4 border-b border-slate-800 pb-2">
                    🎯 Chapter Viva Drill
                  </h4>
                  <div className="space-y-4">
                    {selectedChapter.viva.map((v, idx) => (
                      <div key={idx} className="space-y-1.5 text-xs">
                        <div className="font-semibold text-sky-300">Q: {v.q}</div>
                        <div className="text-slate-400 pl-3 border-l border-slate-800 leading-relaxed">
                          <strong>A:</strong> {v.a}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB: FORMULAS (Formula Bible) */}
          {activeTab === 'formulas' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-indigo-400">
                  📚 Computer Networks Formula Bible
                </h3>
                <p className="text-slate-400 text-sm">
                  Complete cheat sheet containing mathematical parameters, units, assumptions, common traps, and detailed step-by-step solved examples.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formulasData.map((f) => (
                  <div key={f.id} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider font-mono bg-indigo-950/40 border border-indigo-900/60 px-2 py-0.5 rounded">
                          {f.topic}
                        </span>
                      </div>
                      
                      <h4 className="text-base font-bold text-slate-200 mb-2">{f.title}</h4>
                      
                      {/* Formula Box */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-center mb-4 text-sm md:text-base font-sans font-extrabold text-emerald-400">
                        {`$$${f.formula}$$`}
                      </div>

                      {/* Variables list */}
                      <div className="mb-4">
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                          Variables & Symbols
                        </span>
                        <ul className="text-xs space-y-1.5 text-slate-400">
                          {f.variables.map((v, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span><strong className="text-slate-300 font-mono">{v.symbol}</strong>: {v.meaning}</span>
                              <span className="font-mono text-[10px] text-slate-500">[{v.unit}]</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Trap & Memory */}
                      <div className="space-y-2 border-t border-slate-850 pt-3 text-xs leading-relaxed">
                        <div className="text-slate-400">
                          <strong className="text-rose-400">Exam Trap:</strong> {f.trap}
                        </div>
                        <div className="text-slate-400">
                          <strong className="text-amber-400">Mnemonic:</strong> {f.trick}
                        </div>
                      </div>
                    </div>

                    {/* Solved Example */}
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-900/60 text-xs mt-4">
                      <strong className="text-indigo-400 block mb-1">Example Numerical:</strong>
                      <p className="text-slate-400 italic mb-2">"{f.example.q}"</p>
                      <strong className="text-emerald-400 block mb-1 font-sans">Step-by-step Solution:</strong>
                      <p className="text-slate-300 font-sans leading-relaxed whitespace-pre-wrap bg-slate-950 p-2.5 rounded-xl border border-slate-900/40 overflow-x-auto scrollbar-thin">
                        {f.example.sol}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CRUCIAL DERIVATIONS */}
          {activeTab === 'derivations' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-purple-400">
                  📐 Complete Proofs & Derivations
                </h3>
                <p className="text-slate-400 text-sm">
                  Step-by-step mathematical proofs required by professors in university exams. No skipped algebraic steps.
                </p>
              </div>

              <div className="space-y-6">
                {derivationsData.map((d) => (
                  <div key={d.id} className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <h4 className="text-lg font-bold text-slate-100 mb-4 pb-2 border-b border-slate-800 flex justify-between">
                      <span>{d.title}</span>
                      <span className="text-xs text-purple-400 uppercase font-mono tracking-wider">Exam Proof</span>
                    </h4>

                    <div className="space-y-4">
                      {d.steps.map((step, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-850/80 items-center">
                          <div className="md:col-span-3">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">
                              Step {idx + 1}
                            </span>
                            <span className="font-bold text-slate-200 text-xs md:text-sm">
                              {step.title}
                            </span>
                          </div>

                          <div className="md:col-span-5 bg-slate-950 py-3 px-4 rounded-lg border border-slate-900 text-center font-sans text-xs md:text-sm text-emerald-400 font-extrabold overflow-x-auto scrollbar-thin">
                            {`$$${step.math}$$`}
                          </div>

                          <div className="md:col-span-4 text-slate-400 text-xs leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-purple-500/40">
                            {step.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: INTERACTIVE SIMULATORS */}
          {activeTab === 'simulators' && (
            <div className="space-y-6">
              {/* Selector secondary navbar */}
              <div className="bg-[#0c1222] border border-slate-900 rounded-2xl p-2.5 flex flex-wrap gap-2 select-none justify-center">
                <button
                  onClick={() => setActiveSim('subnetting')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                    activeSim === 'subnetting'
                      ? 'bg-sky-500 text-slate-950 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  🌐 IP Subnetting
                </button>
                <button
                  onClick={() => setActiveSim('delay')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                    activeSim === 'delay'
                      ? 'bg-indigo-600 text-white shadow-[0_0_8px_rgba(99,102,241,0.3)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  ⚡ Path Delays
                </button>
                <button
                  onClick={() => setActiveSim('window')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                    activeSim === 'window'
                      ? 'bg-rose-600 text-white shadow-[0_0_8px_rgba(225,29,72,0.3)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  🎚️ Sliding Window
                </button>
                <button
                  onClick={() => setActiveSim('routing')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                    activeSim === 'routing'
                      ? 'bg-sky-600 text-white shadow-[0_0_8px_rgba(2,132,199,0.3)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  🗺️ Shortest Path
                </button>
                <button
                  onClick={() => setActiveSim('crc')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                    activeSim === 'crc'
                      ? 'bg-teal-600 text-white shadow-[0_0_8px_rgba(13,148,136,0.3)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  🔑 CRC Checksum
                </button>
                <button
                  onClick={() => setActiveSim('tcp_congestion')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                    activeSim === 'tcp_congestion'
                      ? 'bg-indigo-600 text-white shadow-[0_0_8px_rgba(99,102,241,0.3)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  📈 TCP Congestion
                </button>
                <button
                  onClick={() => setActiveSim('numerical_gen')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                    activeSim === 'numerical_gen'
                      ? 'bg-sky-500 text-slate-950 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  🎲 Numerical Gen
                </button>
                <button
                  onClick={() => setActiveSim('osi_diagram')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                    activeSim === 'osi_diagram'
                      ? 'bg-sky-500 text-slate-950 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  🌐 OSI Model
                </button>
              </div>

              {/* Renders Selected Simulator */}
              <div className="transition-all duration-300">
                {activeSim === 'subnetting' && <SubnettingCalculator />}
                {activeSim === 'delay' && <DelayVisualizer />}
                {activeSim === 'window' && <SlidingWindowSimulator />}
                {activeSim === 'routing' && <RoutingSimulator />}
                {activeSim === 'crc' && <CrcChecksumCalculator />}
                {activeSim === 'tcp_congestion' && <TcpCongestionVisualizer />}
                {activeSim === 'numerical_gen' && <NumericalGenerator />}
                {activeSim === 'osi_diagram' && <OsiDiagram />}
              </div>
            </div>
          )}

          {/* TAB: COMPARISON TABLES */}
          {activeTab === 'comparisons' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-pink-400">
                  📊 Protocol & Hardware Comparison Matrix
                </h3>
                <p className="text-slate-400 text-sm">
                  Quick lookup comparisons for models, layers, switching methods, algorithms, and media.
                </p>
              </div>

              <div className="space-y-8">
                {comparisonsData.map((comp) => (
                  <div key={comp.id} className="glass-panel p-6 rounded-2xl border border-slate-800/80 shadow-md">
                    <h4 className="text-base font-bold text-pink-400 mb-4 pb-1.5 border-b border-slate-800">
                      {comp.title}
                    </h4>
                    
                    <div className="overflow-x-auto rounded-lg border border-slate-900">
                      <table className="w-full text-xs md:text-sm text-left text-slate-300">
                        <thead>
                          <tr className="bg-slate-950 text-slate-400 border-b border-slate-900">
                            {comp.headers.map((h, idx) => (
                              <th key={idx} className="py-3 px-4 font-bold uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {comp.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-slate-900/50 hover:bg-slate-900/20">
                              {row.map((cell, cIdx) => (
                                <td 
                                  key={cIdx} 
                                  className={`py-3 px-4 leading-relaxed ${
                                    cIdx === 0 ? 'font-semibold text-slate-200' : 'text-slate-400'
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: VIVA FLASHCARDS */}
          {activeTab === 'viva' && <FlashcardGame />}

          {/* TAB: PYQ ANALYSIS */}
          {activeTab === 'pyq' && (
            <div className="space-y-6">
              
              {/* Strategy Panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.keys(pyqAnalysis.examBreakdown).map((key) => {
                  const data = pyqAnalysis.examBreakdown[key];
                  
                  let accentColor = 'border-slate-800';
                  if (key === 'mte') accentColor = 'border-sky-500/20 bg-sky-950/10';
                  if (key === 'ete') accentColor = 'border-emerald-500/20 bg-emerald-950/10';
                  if (key === 'supplemental') accentColor = 'border-amber-500/20 bg-amber-950/10 shadow-[0_0_8px_rgba(245,158,11,0.05)]';

                  return (
                    <div key={key} className={`glass-panel p-6 rounded-2xl border p-5 ${accentColor}`}>
                      <h4 className="text-sm font-bold text-slate-100 mb-2">{data.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">{data.focus}</p>
                      
                      {data.numericalWeight && (
                        <div className="text-[11px] space-y-1 font-mono text-slate-300">
                          <div>• Numerical weight: {data.numericalWeight}</div>
                          <div>• Theory weight: {data.theoryWeight}</div>
                        </div>
                      )}
                      
                      {key === 'supplemental' && (
                        <div className="text-[11px] leading-relaxed text-amber-300 border-t border-amber-900/40 pt-3">
                          💡 <strong>Advice:</strong> {data.advice}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Frequency Table */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 shadow-md">
                <h4 className="text-base font-bold text-emerald-400 mb-4 pb-1.5 border-b border-slate-800">
                  📈 High-Frequency Repeating Topics
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead>
                      <tr className="bg-slate-950 text-slate-500 border-b border-slate-900">
                        <th className="py-2.5 px-4">Topic</th>
                        <th className="py-2.5 px-4">Exam Frequency</th>
                        <th className="py-2.5 px-4">Question Type</th>
                        <th className="py-2.5 px-4">Operating Layer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pyqAnalysis.frequencyTable.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-900/60 hover:bg-slate-900/10">
                          <td className="py-3 px-4 font-semibold text-slate-200">{item.topic}</td>
                          <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{item.frequency}</td>
                          <td className="py-3 px-4 text-slate-400">{item.type}</td>
                          <td className="py-3 px-4 text-slate-400">
                            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                              {item.layer}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Professor's Favorite Questions */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-850/80 shadow-md">
                <h4 className="text-sm uppercase font-bold text-slate-400 tracking-wider mb-4 border-b border-slate-800 pb-2">
                  🧑‍🏫 Professor's Favorites (Frequent MTE/ETE)
                </h4>
                <ol className="list-decimal list-inside space-y-3 text-xs md:text-sm text-slate-300 pl-2">
                  {pyqAnalysis.favoriteQuestions.map((q, idx) => (
                    <li key={idx} className="leading-relaxed">
                      "{q}"
                    </li>
                  ))}
                </ol>
              </div>

            </div>
          )}

          {/* TAB: MOCK PAPERS */}
          {activeTab === 'mocks' && <MockExamEngine />}

          {/* TAB: LAST NIGHT REVISION */}
          {activeTab === 'revision' && (
            <div className="space-y-6">
              
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-orange-400">
                  🚀 10-Minute Last-Night Revision Booklet
                </h3>
                <p className="text-slate-400 text-sm">
                  The ultimate cram sheet for the 24 hours leading up to your exam. Focus on port numbers, layer headers, and avoiding typical mistakes.
                </p>
              </div>

              {/* Ports and Layer Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Port Numbers */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-850/80 shadow-md flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm uppercase font-bold text-orange-400 tracking-wider mb-4 border-b border-slate-800 pb-2">
                      🔌 Key Ports & Protocols
                    </h4>
                    <div className="max-h-[300px] overflow-y-auto pr-1 scrollbar-thin text-xs space-y-2">
                      {revisionData.portNumbers.map((p) => (
                        <div key={p.port} className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg border border-slate-850">
                          <div>
                            <span className="font-bold text-slate-200">{p.protocol}</span>
                            <span className="text-[10px] text-slate-500 ml-2">({p.type})</span>
                            <p className="text-[10px] text-slate-500 mt-0.5">{p.desc}</p>
                          </div>
                          <span className="font-mono text-orange-400 font-bold bg-orange-950/20 border border-orange-900/40 px-2 py-0.5 rounded">
                            {p.port}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Common Exam Mistakes */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-850/80 shadow-md flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm uppercase font-bold text-rose-400 tracking-wider mb-4 border-b border-slate-800 pb-2">
                      ❌ Typical Marks Losers (Common Mistakes)
                    </h4>
                    <div className="space-y-3.5 text-xs">
                      {revisionData.commonMistakes.map((m, idx) => (
                        <div key={idx} className="bg-rose-950/10 border border-rose-900/20 p-3.5 rounded-xl">
                          <strong className="text-rose-300 block mb-1">🚨 {m.title}</strong>
                          <p className="text-slate-350 leading-relaxed text-[11px]">{m.mistake}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Layer Summary Sheet */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-850/80 shadow-md">
                <h4 className="text-sm uppercase font-bold text-slate-400 tracking-wider mb-4 border-b border-slate-800 pb-2">
                  📚 Layer-by-Layer Cheat Sheet
                </h4>
                <div className="space-y-4">
                  {revisionData.layerCheatSheet.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-slate-900/45 p-3 rounded-xl border border-slate-850">
                      <div className="font-bold text-sky-400 text-xs md:text-sm">{item.layer}</div>
                      <div className="text-slate-400 font-mono text-[10px] md:text-xs">PDU: <span className="text-slate-300">{item.pdu}</span></div>
                      <div className="text-slate-400 font-mono text-[10px] md:text-xs">Devices: <span className="text-slate-300">{item.devices}</span></div>
                      <div className="text-slate-350 text-[11px] leading-relaxed md:col-span-1">{item.responsibilities}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Global Footer */}
        <footer className="py-8 px-6 text-center text-[10px] text-slate-600 border-t border-slate-900/60 font-mono bg-[#070b13] select-none mt-auto">
          COMPUTER NETWORKS STUDY KIT • PREMIUM STUDY EDITION
          <br />
          Made by Rishit Kapoor with the help of Antigravity © 2026
        </footer>

      </main>

    </div>
  );
}
