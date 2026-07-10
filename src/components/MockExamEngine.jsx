import React, { useState, useEffect } from 'react';
import { mockPapers } from '../data/mockPapers';

export default function MockExamEngine() {
  const [selectedPaperId, setSelectedPaperId] = useState(mockPapers[0].id);
  const [mcqAnswers, setMcqAnswers] = useState({}); // questionIdx -> selectedOption
  const [showMcqResults, setShowMcqResults] = useState(false);
  const [showSolutions, setShowSolutions] = useState({}); // sectionIdx-questionIdx -> bool

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
  }, [selectedPaperId, showSolutions]);

  const activePaper = mockPapers.find(p => p.id === selectedPaperId);

  const handleSelectOption = (qIdx, opt) => {
    if (showMcqResults) return; // cannot edit once graded
    setMcqAnswers(prev => ({ ...prev, [qIdx]: opt }));
  };

  const handleGradeMcq = () => {
    setShowMcqResults(true);
  };

  const handleResetMcq = () => {
    setMcqAnswers({});
    setShowMcqResults(false);
  };

  const toggleSolution = (secIdx, qIdx) => {
    const key = `${secIdx}-${qIdx}`;
    setShowSolutions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectPaper = (id) => {
    setSelectedPaperId(id);
    setMcqAnswers({});
    setShowMcqResults(false);
    setShowSolutions({});
  };

  if (!activePaper) return <div>No paper found.</div>;

  // Calculate MCQ score
  const mcqSection = activePaper.sections[0];
  let mcqCorrectCount = 0;
  if (mcqSection && mcqSection.questions) {
    mcqSection.questions.forEach((q, idx) => {
      if (mcqAnswers[idx] === q.ans) mcqCorrectCount++;
    });
  }

  return (
    <div className="mock-exam-card glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
            📝 Interactive Mock Exam Engine
          </h3>
          <p className="text-slate-400 text-sm">
            Attempt simulated computer networks papers. Solve multiple-choice questions interactively, and check your descriptive/numerical answers against official marking schemes.
          </p>
        </div>

        {/* Paper Selector dropdown */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Select Practice Paper</label>
          <select
            className="bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500 transition"
            value={selectedPaperId}
            onChange={(e) => selectPaper(Number(e.target.value))}
          >
            {mockPapers.map(p => (
              <option key={p.id} value={p.id}>{p.title} ({p.difficulty})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="border border-slate-800/80 bg-slate-950/60 rounded-xl p-4 mb-6 text-xs text-slate-400 flex flex-wrap gap-x-6 gap-y-2">
        <div>Difficulty: <strong className="text-slate-200 font-bold">{activePaper.difficulty}</strong></div>
        <div>Time Allotted: <strong className="text-slate-200 font-bold">3 Hours</strong></div>
        <div>Rules: <span className="italic text-slate-300">{activePaper.instructions}</span></div>
      </div>

      {/* Main Sections */}
      <div className="space-y-8">
        {activePaper.sections.map((section, sIdx) => {
          const isMcq = sIdx === 0;

          return (
            <div key={sIdx} className="border-t border-slate-800/80 pt-6">
              <h4 className="text-sm uppercase font-bold tracking-wider text-slate-300 mb-4 pb-1.5 border-b border-slate-800 flex justify-between">
                <span>{section.name}</span>
                <span className="text-xs text-slate-500 font-mono normal-case">
                  {isMcq ? 'Interactive Grader' : 'Revealable Solutions'}
                </span>
              </h4>

              {isMcq ? (
                /* SECTION A: MCQs */
                <div className="space-y-6">
                  {section.questions.map((q, qIdx) => {
                    const selected = mcqAnswers[qIdx];
                    const isCorrect = selected === q.ans;

                    return (
                      <div key={qIdx} className="bg-slate-900/40 p-4 rounded-xl border border-slate-850">
                        <div className="font-semibold text-slate-200 text-xs md:text-sm mb-3">
                          Q{qIdx + 1}. {q.q}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt) => {
                            const isOptSelected = selected === opt;
                            let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300';
                            
                            if (isOptSelected) {
                              btnStyle = 'bg-indigo-950/50 border-indigo-500 text-indigo-300';
                            }
                            
                            if (showMcqResults) {
                              if (opt === q.ans) {
                                btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold';
                              } else if (isOptSelected) {
                                btnStyle = 'bg-rose-950/50 border-rose-500 text-rose-300 line-through';
                              } else {
                                btnStyle = 'bg-slate-950 opacity-40 border-slate-900 text-slate-500';
                              }
                            }

                            return (
                              <button
                                key={opt}
                                disabled={showMcqResults}
                                onClick={() => handleSelectOption(qIdx, opt)}
                                className={`text-left py-2.5 px-3 rounded-lg border transition cursor-pointer ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {showMcqResults && (
                          <div className="mt-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-850/80 leading-relaxed text-slate-400">
                            <span className="font-bold text-emerald-400 block mb-1">
                              {isCorrect ? '✅ Correct' : `❌ Incorrect (Correct: ${q.ans})`}
                            </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* MCQ Grading Controls */}
                  <div className="flex gap-2">
                    {!showMcqResults ? (
                      <button
                        onClick={handleGradeMcq}
                        disabled={Object.keys(mcqAnswers).length < section.questions.length}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Submit & Grade Section A
                      </button>
                    ) : (
                      <div className="flex items-center justify-between w-full bg-slate-950 border border-slate-850 p-4 rounded-xl">
                        <span className="font-mono text-xs text-slate-300">
                          Score: <strong className="text-emerald-400 text-sm">{mcqCorrectCount}</strong> / {section.questions.length}
                        </span>
                        <button
                          onClick={handleResetMcq}
                          className="bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold py-1.5 px-3 rounded-lg text-xs transition border border-slate-800"
                        >
                          🔄 Retry Quiz
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* SECTION B & C: Descriptive / Numericals */
                <div className="space-y-6">
                  {section.questions.map((q, qIdx) => {
                    const solKey = `${sIdx}-${qIdx}`;
                    const showSol = showSolutions[solKey];

                    return (
                      <div key={qIdx} className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <span className="font-semibold text-slate-200 text-xs md:text-sm">
                            Q{qIdx + 1}. {q.q}
                          </span>
                          <button
                            onClick={() => toggleSolution(sIdx, qIdx)}
                            className="bg-slate-950 border border-slate-800 text-[10px] text-sky-400 font-bold px-2 py-1 rounded hover:border-slate-700 transition cursor-pointer shrink-0"
                          >
                            {showSol ? '🙈 Hide Solution' : '👁️ Show Solution'}
                          </button>
                        </div>

                        {showSol && (
                          <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap mt-2">
                            <span className="text-emerald-400 font-bold font-sans block mb-2">⭐ Step-by-Step Marking Scheme Solution:</span>
                            {q.solution}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
