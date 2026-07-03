'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';

const amounts = [
  20, 50, 80, 400, 150, 200, 500,
  300, 350, 400, 450, 500, 550, 600,
  80, 1000, 20, 50, 500, 150, 200,
  900, 700, 1000, 800, 1500, 900, 1000,
  250, 300, 350, 400, 450, 500, 550,
  600, 1000, 700, 1000, 800, 700, 400,
  900, 1500, 250, 1500, 700, 1000, 100,
  100, 2000, 600
];

export default function SavingChallenge() {
  const [savedBoxes, setSavedBoxes] = useState<number[]>([]);
  const [totalSaved, setTotalSaved] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('savedBoxes');
    if (saved) {
      setSavedBoxes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    let total = 0;
    savedBoxes.forEach(index => {
      total += amounts[index];
    });
    setTotalSaved(total);
  }, [savedBoxes]);

  const toggleBox = (index: number) => {
    const newSavedBoxes = [...savedBoxes];
    const boxIndex = newSavedBoxes.indexOf(index);
    
    if (boxIndex > -1) {
      newSavedBoxes.splice(boxIndex, 1);
    } else {
      newSavedBoxes.push(index);
    }
    
    setSavedBoxes(newSavedBoxes);
    localStorage.setItem('savedBoxes', JSON.stringify(newSavedBoxes));
  };

  const resetChallenge = () => {
    if (confirm('Apakah Anda yakin ingin mereset challenge ini?')) {
      setSavedBoxes([]);
      localStorage.removeItem('savedBoxes');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-2xl">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold mb-6 transition-colors"
        >
          <FaHome />
          <span>Home</span>
        </Link>
        
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            BIG ALPHA<sup className="text-cyan-500 text-lg">®</sup>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-blue-700 my-4" style={{ textShadow: '3px 3px 0px rgba(21, 101, 192, 0.2)' }}>
            Saving<br />Challenge
          </h1>
          <p className="text-2xl text-gray-800">Rp30 juta dalam 52 minggu</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-8">
          {amounts.map((amount, index) => (
            <button
              key={index}
              onClick={() => toggleBox(index)}
              className={`
                relative border-2 rounded-xl p-6 text-center cursor-pointer transition-all
                flex items-center justify-center min-h-[80px]
                hover:-translate-y-1 hover:shadow-lg
                ${savedBoxes.includes(index) 
                  ? 'bg-yellow-400 border-yellow-600' 
                  : 'bg-white border-blue-700'
                }
              `}
            >
              <div className={`
                absolute top-0 left-0 text-[10px] font-bold text-white px-2 py-1 rounded-br
                ${savedBoxes.includes(index) ? 'bg-yellow-600' : 'bg-blue-700'}
              `}>
                {String(index + 1).padStart(2, '0')}
              </div>
              
              {savedBoxes.includes(index) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-6 border-r-4 border-b-4 border-red-700 transform rotate-45 -mt-2"></div>
                </div>
              )}
              
              <div className="text-xl font-bold text-gray-800">
                {amount.toLocaleString('id-ID')}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-yellow-400 rounded-2xl p-6 text-center mb-5">
          <div className="text-3xl font-bold text-gray-800">SAVED Rp30 juta</div>
          <div className="text-2xl text-red-700 mt-2">
            Total Tersimpan: Rp{totalSaved.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={resetChallenge}
            className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Reset Challenge
          </button>
        </div>

        <div className="text-center text-gray-600 text-sm mt-5">(*) dalam ribuan</div>
      </div>

      <div className="text-center text-white text-sm mt-5 p-4">
        Made with ❤️ by <a href="https://x.com/ahfasxp" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-yellow-400 hover:underline transition-colors">Ahfas</a>
      </div>
    </div>
  );
}
