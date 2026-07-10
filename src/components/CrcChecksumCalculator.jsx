import React, { useState } from 'react';

export default function CrcChecksumCalculator() {
  const [dataBits, setDataBits] = useState('1101001');
  const [generator, setGenerator] = useState('1011');
  const [rxCodeword, setRxCodeword] = useState('');
  const [activeTab, setActiveTab] = useState('crc'); // crc or checksum

  // Checksum specific state
  const [checksumData, setChecksumData] = useState('10110011 11010011 01011100');

  // Math Helper: Modulo-2 Division (XOR division)
  const performCrcDivision = (data, div) => {
    const dataLen = data.length;
    const divLen = div.length;
    const degree = divLen - 1;
    
    // Append degree zeros to data
    const appended = data + '0'.repeat(degree);
    const bits = appended.split('').map(Number);
    const divisor = div.split('').map(Number);
    
    const steps = [];
    
    // Copy bits to mutate during division
    const temp = [...bits];
    
    for (let i = 0; i <= dataLen - 1; i++) {
      if (temp[i] === 1) {
        // Record current step state before XOR
        const beforeXor = temp.slice(i, i + divLen).join('');
        
        // XOR division
        for (let j = 0; j < divLen; j++) {
          temp[i + j] = temp[i + j] ^ divisor[j];
        }
        
        const afterXor = temp.slice(i, i + divLen).join('');
        steps.push({
          position: i,
          dividendChunk: beforeXor,
          divisor: div,
          result: afterXor,
          fullTemp: temp.join('')
        });
      }
    }
    
    const remainder = temp.slice(dataLen).join('');
    const codeword = data + remainder;
    
    return {
      appended,
      steps,
      remainder,
      codeword
    };
  };

  // Perform division on received codeword (no zero appending)
  const verifyCrcCodeword = (received, div) => {
    const divLen = div.length;
    const bits = received.split('').map(Number);
    const divisor = div.split('').map(Number);
    
    const temp = [...bits];
    const steps = [];
    
    for (let i = 0; i <= received.length - divLen; i++) {
      if (temp[i] === 1) {
        for (let j = 0; j < divLen; j++) {
          temp[i + j] = temp[i + j] ^ divisor[j];
        }
      }
    }
    
    const remainder = temp.slice(received.length - divLen + 1).join('');
    const isValid = parseInt(remainder, 2) === 0;
    
    return {
      remainder,
      isValid
    };
  };

  // Internet Checksum 1's Complement Summation
  const calculateInternetChecksum = (dataStr) => {
    // Parse input blocks (clean spaces)
    const blocks = dataStr.replace(/\s+/g, '').match(/.{1,8}/g) || [];
    if (blocks.length === 0) return null;
    
    let sum = 0;
    const steps = [];
    
    blocks.forEach((block, idx) => {
      const val = parseInt(block.padEnd(8, '0'), 2);
      const prevSum = sum;
      sum += val;
      
      let carryMsg = '';
      // Wrap carry if exceeds 8 bits (since we are doing 8-bit checksum for easier visualization)
      if (sum > 255) {
        const carry = Math.floor(sum / 256);
        sum = (sum % 256) + carry;
        carryMsg = `(Carry ${carry} wrapped around)`;
      }
      
      steps.push({
        block: block.padEnd(8, '0'),
        blockVal: val,
        runningSum: sum.toString(2).padStart(8, '0'),
        message: `Add Block ${idx + 1}: ${block.padEnd(8, '0')} (${val}). Running Sum = ${sum.toString(2).padStart(8, '0')} ${carryMsg}`
      });
    });
    
    // Complement the final sum
    const finalSumBinary = sum.toString(2).padStart(8, '0');
    const checksumVal = sum ^ 255;
    const checksumBinary = checksumVal.toString(2).padStart(8, '0');
    
    return {
      blocks,
      steps,
      finalSumBinary,
      checksumBinary
    };
  };

  // Calculations for CRC
  const crcResult = performCrcDivision(dataBits, generator);
  
  // Set received codeword if not already customized
  const handleSetRxDefault = () => {
    setRxCodeword(crcResult.codeword);
  };
  
  const activeRx = rxCodeword || crcResult.codeword;
  const rxResult = verifyCrcCodeword(activeRx, generator);

  // Toggle single bit in the receiver codeword
  const toggleRxBit = (idx) => {
    const bitArr = activeRx.split('');
    bitArr[idx] = bitArr[idx] === '1' ? '0' : '1';
    setRxCodeword(bitArr.join(''));
  };

  // Checksum calculation
  const checksumResult = calculateInternetChecksum(checksumData);

  return (
    <div className="crc-calculator-card glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Tab Selectors */}
      <div className="flex gap-2 mb-6 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('crc')}
          className={`pb-2 px-4 font-bold text-sm border-b-2 transition ${
            activeTab === 'crc' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🔑 Cyclic Redundancy Check (CRC)
        </button>
        <button
          onClick={() => setActiveTab('checksum')}
          className={`pb-2 px-4 font-bold text-sm border-b-2 transition ${
            activeTab === 'checksum' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          ➕ Internet Checksum
        </button>
      </div>

      {activeTab === 'crc' ? (
        <div>
          <p className="text-slate-400 text-sm mb-6">
            Practice polynomial modulo-2 XOR division. Enter the message bit string and the generator bit string. The calculator shows the step-by-step polynomial division and provides an interactive bit-flipper to test receiver checking.
          </p>

          {/* CRC Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Message Data Bits</label>
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-sky-500 font-mono transition"
                value={dataBits}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^01]/g, '');
                  setDataBits(cleaned);
                  setRxCodeword(''); // clear customized rx
                }}
                placeholder="e.g. 1101001"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Generator Divisor (degree r={generator.length - 1})</label>
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-sky-500 font-mono transition"
                value={generator}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^01]/g, '');
                  if (cleaned.startsWith('1')) {
                    setGenerator(cleaned);
                    setRxCodeword('');
                  }
                }}
                placeholder="e.g. 1011"
              />
            </div>
          </div>

          {/* CRC Result Details */}
          <div className="space-y-6">
            {/* Step-by-step Division layout */}
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 font-mono text-xs md:text-sm">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 font-sans">
                Sender XOR Modulo-2 Division Steps
              </h4>
              <div className="overflow-x-auto space-y-1">
                <div>Generator Divisor: <span className="text-indigo-400 font-bold">{generator}</span></div>
                <div>Dividend (Appended Zeros): <span className="text-slate-300 font-bold">{crcResult.appended}</span></div>
                <div className="border-b border-slate-800 my-2"></div>
                <div className="space-y-3 font-mono leading-none mt-2">
                  {crcResult.steps.map((step, idx) => (
                    <div key={idx} className="bg-slate-900/40 p-2.5 rounded border border-slate-800/80">
                      <div><span className="text-slate-500">Align:</span> {step.fullTemp.substring(0, step.position)}<span className="text-sky-300 font-bold">{step.dividendChunk}</span>{step.fullTemp.substring(step.position + generator.length)}</div>
                      <div><span className="text-slate-500">XOR:</span>   {' '.repeat(step.position)}<span className="text-indigo-400">{step.divisor}</span></div>
                      <div><span className="text-slate-500">Res:</span>   {' '.repeat(step.position)}<span className="text-emerald-400 font-bold">{step.result}</span></div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-800 my-2 pt-2">
                  <span className="text-slate-400 font-sans">Calculated Remainder (CRC checksum): </span>
                  <span className="text-emerald-400 font-bold text-sm bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded">
                    {crcResult.remainder}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">Final Codeword Transmitted: </span>
                  <span className="text-sky-400 font-bold text-sm">
                    {dataBits}<span className="text-emerald-400">{crcResult.remainder}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Receiver verification block */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
                🎛️ Interactive Receiver Validation Block
              </h4>
              <p className="text-slate-400 text-xs mb-4">
                Below is the codeword received by the recipient. <strong>Click on any bit to toggle (flip) it</strong> and see if the receiver's division flags a transmission error!
              </p>

              {/* Bit toggles */}
              <div className="flex gap-1.5 mb-6 justify-center flex-wrap">
                {activeRx.split('').map((bit, idx) => {
                  const isCrcPart = idx >= dataBits.length;
                  const originalBit = crcResult.codeword[idx];
                  const hasError = bit !== originalBit;
                  
                  let color = isCrcPart ? 'border-emerald-700 bg-emerald-950/30 text-emerald-300' : 'border-slate-700 bg-slate-900 text-slate-300';
                  if (hasError) {
                    color = 'border-rose-600 bg-rose-950/80 text-rose-300 font-bold animate-pulse';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => toggleRxBit(idx)}
                      className={`w-9 h-11 border rounded-lg flex flex-col items-center justify-between py-1 transition cursor-pointer select-none ${color}`}
                    >
                      <span className="text-[7px] text-slate-500 uppercase leading-none">B{idx}</span>
                      <span className="text-sm font-mono leading-none">{bit}</span>
                    </button>
                  );
                })}
              </div>

              {/* Validation Status */}
              <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div>
                  <span className="block text-slate-500 text-xs">Receiver Remainder (must be 0):</span>
                  <span className="font-mono text-sm font-bold text-slate-300">{rxResult.remainder || '0'}</span>
                </div>
                
                <div className="text-right">
                  {rxResult.isValid ? (
                    <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5">
                      ✅ Frame OK (No Errors)
                    </span>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-rose-400 bg-rose-950/40 border border-rose-900 px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5">
                        🚨 Frame Corrupted (Error Detected!)
                      </span>
                      <button
                        onClick={handleSetRxDefault}
                        className="text-[10px] text-sky-400 hover:underline cursor-pointer"
                      >
                        Reset to original error-free codeword
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-slate-400 text-sm mb-6">
            Enter 8-bit binary blocks separated by spaces. The simulator adds the values using 1's complement arithmetic (carrying bit wraps back to the LSB) and complements the final sum to generate the Internet Checksum.
          </p>

          {/* Checksum Input */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Binary Blocks (8-bit, space-separated)</label>
            <input
              type="text"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono transition"
              value={checksumData}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^01\s]/g, '');
                setChecksumData(cleaned);
              }}
              placeholder="e.g. 10110011 11010011 01011100"
            />
          </div>

          {checksumResult && (
            <div className="space-y-6">
              {/* Checksum Steps */}
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 font-mono text-xs md:text-sm">
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 font-sans">
                  Checksum Addition & Carry Wrap steps
                </h4>
                <div className="space-y-2">
                  {checksumResult.steps.map((step, idx) => (
                    <div key={idx} className="bg-slate-900/60 p-2.5 rounded border border-slate-850">
                      <div className="text-slate-400 text-[10px] uppercase font-bold font-sans mb-1">Step {idx + 1}</div>
                      <div className="text-slate-200">{step.message}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-850 my-3 pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Sum of all blocks:</span>
                    <span className="text-slate-200 font-bold">{checksumResult.finalSumBinary}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-400 font-sans font-bold">Complemented Checksum (Transmitted):</span>
                    <span className="text-indigo-300 font-bold font-mono bg-indigo-950/40 border border-indigo-900 px-2 py-0.5 rounded">
                      {checksumResult.checksumBinary}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
