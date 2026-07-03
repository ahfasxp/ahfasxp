'use client';

import { useState, useEffect } from 'react';

interface TradingPlan {
  id: number;
  date: string;
  entryMin: string;
  entryMax: string;
  takeProfit: string;
  protection: string;
  notes: string;
  archived?: boolean;
  hitTarget?: string;
}

export default function TradingPlan() {
  const [entryMin, setEntryMin] = useState('');
  const [entryMax, setEntryMax] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [protection, setProtection] = useState('');
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<TradingPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'archive'>('active');

  useEffect(() => {
    loadCurrentPlan();
    loadHistory();
  }, []);

  const saveCurrentPlan = () => {
    const currentPlan = {
      entryMin,
      entryMax,
      takeProfit,
      protection,
      notes
    };
    localStorage.setItem('currentPlan', JSON.stringify(currentPlan));
  };

  useEffect(() => {
    saveCurrentPlan();
  }, [entryMin, entryMax, takeProfit, protection, notes]);

  const loadCurrentPlan = () => {
    const saved = localStorage.getItem('currentPlan');
    if (saved) {
      const plan = JSON.parse(saved);
      setEntryMin(plan.entryMin || '');
      setEntryMax(plan.entryMax || '');
      setTakeProfit(plan.takeProfit || '');
      setProtection(plan.protection || '');
      setNotes(plan.notes || '');
    }
  };

  const loadHistory = () => {
    const saved = localStorage.getItem('tradingHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  };

  const formatCurrency = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    return num.toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  const calculatePercentage = (entry: number, target: number): string => {
    if (!entry || !target) return '0.00';
    const percentage = ((target - entry) / entry) * 100;
    return percentage.toFixed(2);
  };

  const savePlanToHistory = () => {
    if (!entryMin || !entryMax || !takeProfit) {
      alert('Mohon isi data trading plan terlebih dahulu!');
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const plan: TradingPlan = {
      id: Date.now(),
      date: `${dateStr}, ${timeStr}`,
      entryMin,
      entryMax,
      takeProfit,
      protection,
      notes
    };

    let newHistory = [plan, ...history];
    if (newHistory.length > 10) {
      newHistory = newHistory.slice(0, 10);
    }

    setHistory(newHistory);
    localStorage.setItem('tradingHistory', JSON.stringify(newHistory));
    alert('Trading plan berhasil disimpan!');
  };

  const hitPlan = (id: number, type: string) => {
    const newHistory = history.map(p =>
      p.id === id ? { ...p, archived: true, hitTarget: type } : p
    );
    setHistory(newHistory);
    localStorage.setItem('tradingHistory', JSON.stringify(newHistory));
  };

  const deletePlan = (id: number) => {
    if (confirm('Hapus trading plan ini?')) {
      const newHistory = history.filter(p => p.id !== id);
      setHistory(newHistory);
      localStorage.setItem('tradingHistory', JSON.stringify(newHistory));
    }
  };

  const deleteAll = () => {
    if (confirm('Hapus SEMUA trading plan? Tindakan ini tidak bisa dibatalkan!')) {
      setHistory([]);
      localStorage.removeItem('tradingHistory');
    }
  };

  const resetForm = () => {
    if (confirm('Reset semua input?')) {
      setEntryMin('');
      setEntryMax('');
      setTakeProfit('');
      setProtection('');
      setNotes('');
      localStorage.removeItem('currentPlan');
    }
  };

  const activePlans = history.filter(p => !p.archived);
  const archivedPlans = history.filter(p => p.archived);

  const renderPlanItem = (plan: TradingPlan, isArchived: boolean) => {
    const avgEntry = (parseFloat(plan.entryMin) + parseFloat(plan.entryMax)) / 2;
    const tpList = plan.takeProfit.split(',').map(tp => parseFloat(tp.trim())).filter(tp => !isNaN(tp));
    const avgTP = tpList.reduce((a, b) => a + b, 0) / tpList.length;

    let stopLoss: number | null = null;
    let riskPerUnit = 0;
    if (plan.protection) {
      const ratio = parseFloat(plan.protection);
      const potentialProfit = avgTP - avgEntry;
      riskPerUnit = potentialProfit / ratio;
      stopLoss = avgEntry - riskPerUnit;
    }

    let hitMessage = '';
    if (isArchived && plan.hitTarget) {
      if (plan.hitTarget === 'sl') {
        hitMessage = '🎯 Stop Loss Hit';
      } else if (plan.hitTarget === 'manual') {
        hitMessage = '📁 Manual Archive';
      } else {
        const tpNum = plan.hitTarget.replace('tp', '');
        hitMessage = `🎯 TP${tpNum} Hit`;
      }
    }

    return (
      <div key={plan.id} className="bg-gray-800 rounded-lg p-5 mb-4 border border-gray-700 hover:border-blue-500 transition-all">
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-400 text-sm font-mono">
            📅 {plan.date}
            {hitMessage && <span className="text-green-400 ml-3 font-semibold">{hitMessage}</span>}
          </div>
          <div className="flex gap-2">
            {!isArchived && (
              <button
                onClick={() => hitPlan(plan.id, 'manual')}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
              >
                Archive
              </button>
            )}
            <button
              onClick={() => deletePlan(plan.id)}
              className="px-3 py-1 bg-red-900 hover:bg-red-800 text-white text-xs rounded transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-5 border-l-4 border-green-400">
          <div className="mb-5">
            <h3 className="text-green-400 font-mono text-lg mb-3 flex items-center gap-2">
              <span className="text-blue-400">▸</span>Entry Buy Zone
            </h3>
            <div className="text-white font-mono text-xl mb-1">
              {formatCurrency(plan.entryMin)} - {formatCurrency(plan.entryMax)}
            </div>
            <div className="text-gray-400 text-sm">
              Harga Entry Ideal: {formatCurrency(avgEntry)}
            </div>
          </div>

          <div className="mb-5">
            <h3 className="text-green-400 font-mono text-lg mb-3 flex items-center gap-2">
              <span className="text-blue-400">▸</span>Take Profit Targets
            </h3>
            <div className="space-y-2">
              {tpList.map((tp, index) => {
                const percentage = calculatePercentage(avgEntry, tp);
                return (
                  <div key={index} className="bg-gray-800 p-3 rounded border border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-green-400 text-xl">●</span>
                      <span className="font-mono text-white">TP{index + 1}: {formatCurrency(tp)}</span>
                      <span className="text-green-400 font-semibold text-sm">+{percentage}%</span>
                    </div>
                    {!isArchived && (
                      <button
                        onClick={() => hitPlan(plan.id, `tp${index + 1}`)}
                        className="px-3 py-1 bg-green-900 hover:bg-green-800 text-white text-xs rounded transition-colors"
                      >
                        Hit
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {tpList.length > 1 && (
              <div className="text-gray-400 text-sm mt-2">
                Average Take Profit: {formatCurrency(avgTP)} (+{calculatePercentage(avgEntry, avgTP)}%)
              </div>
            )}
          </div>

          {plan.protection && stopLoss !== null && (
            <div className="mb-5">
              <h3 className="text-green-400 font-mono text-lg mb-3 flex items-center gap-2">
                <span className="text-blue-400">▸</span>Proteksi
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-red-400 font-mono text-xl mb-1">
                    {formatCurrency(stopLoss)} <span className="text-sm">({calculatePercentage(avgEntry, stopLoss)}%)</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Risk/Reward Ratio: 1:{plan.protection} | Risk per unit: {formatCurrency(riskPerUnit)}
                  </div>
                  <div className="text-gray-500 text-xs mt-2 italic">
                    {tpList.length > 1
                      ? `*Dihitung dari Avg Entry (${formatCurrency(avgEntry)}) dan Avg TP (${formatCurrency(avgTP)})`
                      : `*Dihitung dari Avg Entry (${formatCurrency(avgEntry)}) dan TP (${formatCurrency(tpList[0])})`
                    }
                  </div>
                </div>
                {!isArchived && (
                  <button
                    onClick={() => hitPlan(plan.id, 'sl')}
                    className="px-3 py-1 bg-red-900 hover:bg-red-800 text-white text-xs rounded transition-colors"
                  >
                    Hit
                  </button>
                )}
              </div>
            </div>
          )}

          {plan.notes && (
            <div>
              <h3 className="text-green-400 font-mono text-lg mb-3 flex items-center gap-2">
                <span className="text-blue-400">▸</span>Catatan
              </h3>
              <div className="text-gray-400 text-sm whitespace-pre-wrap leading-relaxed">
                {plan.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-5" style={{
      backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(0, 255, 136, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)'
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold font-mono mb-3 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            My Trading Plan
          </h1>
          <p className="text-gray-400 text-lg">Rencana Trading yang Terstruktur</p>
        </div>

        <div className="grid gap-8 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-mono font-semibold mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Input Trading Plan
            </h2>

            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-medium">
                  Entry Min
                </label>
                <input
                  type="number"
                  value={entryMin}
                  onChange={(e) => setEntryMin(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-medium">
                  Entry Max
                </label>
                <input
                  type="number"
                  value={entryMax}
                  onChange={(e) => setEntryMax(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-medium">
                Take Profit (pisahkan dengan koma untuk multiple TP)
              </label>
              <input
                type="text"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all"
                placeholder="100, 120, 150"
              />
            </div>

            <div className="mb-5">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-medium">
                Proteksi (Risk/Reward Ratio, contoh: 2 untuk 1:2)
              </label>
              <input
                type="number"
                value={protection}
                onChange={(e) => setProtection(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all"
                placeholder="2"
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-medium">
                Catatan
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-y min-h-[100px] focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all"
                placeholder="Analisa teknikal, fundamental, sentiment..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={savePlanToHistory}
                className="flex-1 px-6 py-4 bg-green-400 hover:bg-green-500 text-gray-950 font-mono font-bold rounded-lg uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-green-400/30 hover:-translate-y-0.5"
              >
                Save Plan
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-blue-400 hover:text-blue-400 font-mono font-semibold rounded-lg uppercase tracking-wider transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-mono font-semibold flex items-center gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                History
              </h2>
              <button
                onClick={deleteAll}
                className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white text-sm rounded-lg transition-colors"
              >
                Hapus semua
              </button>
            </div>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 px-4 py-2 rounded-lg font-mono font-semibold transition-all ${
                  activeTab === 'active'
                    ? 'bg-green-400 text-gray-950'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Active ({activePlans.length})
              </button>
              <button
                onClick={() => setActiveTab('archive')}
                className={`flex-1 px-4 py-2 rounded-lg font-mono font-semibold transition-all ${
                  activeTab === 'archive'
                    ? 'bg-green-400 text-gray-950'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Archive ({archivedPlans.length})
              </button>
            </div>

            <div>
              {activeTab === 'active' ? (
                activePlans.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    Belum ada rencana trading yang disimpan
                  </div>
                ) : (
                  activePlans.map(plan => renderPlanItem(plan, false))
                )
              ) : (
                archivedPlans.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    Belum ada rencana trading di archive
                  </div>
                ) : (
                  archivedPlans.map(plan => renderPlanItem(plan, true))
                )
              )}
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Made with <span className="text-red-400">❤</span> by{' '}
            <a
              href="https://x.com/ahfasxp"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-400 hover:text-green-400 transition-colors"
            >
              Ahfas
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
