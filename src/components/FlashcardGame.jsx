import React, { useState, useEffect } from 'react';
import { vivaQuestions } from '../data/viva';

export default function FlashcardGame() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({
    mastered: new Set(),
    practice: new Set()
  });

  // Unique categories for filtering
  const categories = ['All', ...new Set(vivaQuestions.map(q => q.category))];

  // Filter questions based on selected category
  const filteredQuestions = activeCategory === 'All' 
    ? vivaQuestions 
    : vivaQuestions.filter(q => q.category === activeCategory);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [activeCategory]);

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const markMastered = (id) => {
    setStats(prev => {
      const newMastered = new Set(prev.mastered);
      const newPractice = new Set(prev.practice);
      
      newMastered.add(id);
      newPractice.delete(id);
      return { mastered: newMastered, practice: newPractice };
    });
    handleNext();
  };

  const markPractice = (id) => {
    setStats(prev => {
      const newMastered = new Set(prev.mastered);
      const newPractice = new Set(prev.practice);
      
      newPractice.add(id);
      newMastered.delete(id);
      return { mastered: newMastered, practice: newPractice };
    });
    handleNext();
  };

  const handleShuffle = () => {
    // Shuffles list
    setIsFlipped(false);
    setCurrentIndex(0);
  };

  const currentCard = filteredQuestions[currentIndex];
  
  if (!currentCard) return <div>No cards found.</div>;

  const cardStatus = stats.mastered.has(currentCard.id) 
    ? 'mastered' 
    : stats.practice.has(currentCard.id) 
    ? 'practice' 
    : 'unstudied';

  return (
    <div className="flashcards-card glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-amber-400">
            🧠 Interactive Viva Flashcards
          </h3>
          <p className="text-slate-400 text-sm">
            Master 250+ standard university viva questions. Categorize cards to filter out what you need to study.
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
          <div className="flex gap-4 mb-1 justify-between">
            <span>Mastered: <strong className="text-emerald-400">{stats.mastered.size}</strong></span>
            <span>Needs Work: <strong className="text-rose-400">{stats.practice.size}</strong></span>
          </div>
          <div className="w-36 h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500" 
              style={{ width: `${(stats.mastered.size / vivaQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filter Category Selectors */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full font-semibold border transition cursor-pointer select-none whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Flashcard Body */}
      <div className="flex justify-center my-6">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-[480px] h-64 cursor-pointer select-none perspective"
        >
          <div 
            className={`w-full h-full relative duration-500 transform-style transition-transform ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of Card (Question) */}
            <div className="absolute inset-0 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 flex flex-col justify-between backface-hidden shadow-2xl">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-950 px-2.5 py-1 rounded-full">
                  {currentCard.category}
                </span>
                <span className="text-xs font-mono text-slate-600">
                  {currentIndex + 1} / {filteredQuestions.length}
                </span>
              </div>
              
              <div className="text-center font-bold text-slate-100 text-sm md:text-base leading-relaxed px-4 py-2">
                {currentCard.q}
              </div>

              <div className="text-center text-[10px] text-amber-400 uppercase font-semibold tracking-wider font-mono">
                🖱️ Click anywhere to reveal answer
              </div>
            </div>

            {/* Back of Card (Answer) */}
            <div className="absolute inset-0 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/20 px-2.5 py-1 rounded-full">
                  Answer
                </span>
                {cardStatus === 'mastered' && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono">✅ Mastered</span>
                )}
                {cardStatus === 'practice' && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 font-mono">⚠️ Needs Work</span>
                )}
              </div>

              <div className="text-slate-300 text-xs md:text-sm leading-relaxed overflow-y-auto max-h-36 px-2 text-center flex items-center justify-center">
                {currentCard.a}
              </div>

              <div className="text-center text-[10px] text-indigo-400 uppercase font-semibold tracking-wider font-mono">
                🖱️ Click to flip back
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card controls */}
      <div className="flex justify-between items-center gap-4 max-w-[480px] mx-auto">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ◀ Previous
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => markPractice(currentCard.id)}
            className="bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 px-3 py-2 rounded-xl text-xs font-bold transition"
            title="Mark this question as requiring further practice"
          >
            ❌ Review Later
          </button>
          <button
            onClick={() => markMastered(currentCard.id)}
            className="bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 px-3 py-2 rounded-xl text-xs font-bold transition"
            title="Mark this question as mastered"
          >
            ✔️ Mastered
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === filteredQuestions.length - 1}
          className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
