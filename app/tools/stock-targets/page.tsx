'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';

interface StockResult {
  timestamp: string;
  tanggal: string;
  dateDisplay: string;
  emiten: string;
  broker: string;
  buyLot: number;
  buyAvg: number;
  bidTerendah: number;
  offerTertinggi: number;
  totalBid: number;
  totalOffer: number;
  jumlahPapan: number;
  rataPerPapan: number;
  papanCountHigh: number;
  papanCountLow: number;
  tick: number;
  fivePercent: number;
  targetHigh: number;
  targetLow: number;
  percentLow: number;
  percentHigh: number;
}

export default function StockTargets() {
  const [tanggal, setTanggal] = useState('');
  const [emiten, setEmiten] = useState('');
  const [broker, setBroker] = useState('');
  const [buyLot, setBuyLot] = useState('');
  const [buyAvg, setBuyAvg] = useState('');
  const [bidTerendah, setBidTerendah] = useState('');
  const [offerTertinggi, setOfferTertinggi] = useState('');
  const [totalBid, setTotalBid] = useState('');
  const [totalOffer, setTotalOffer] = useState('');
  const [tickSize, setTickSize] = useState('');
  const [jumlahPapan, setJumlahPapan] = useState('');
  
  const [history, setHistory] = useState<StockResult[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setTanggal(new Date().toISOString().split('T')[0]);
    loadHistory();
  }, []);

  useEffect(() => {
    const avg = parseFloat(buyAvg);
    if (avg) {
      setTickSize(`${getTickSize(avg)} poin`);
    } else {
      setTickSize('');
    }
    updateJumlahPapan();
  }, [buyAvg, offerTertinggi, bidTerendah]);

  const getTickSize = (price: number): number => {
    const p = Number(price) || 0;
    if (p <= 200) return 1;
    if (p <= 500) return 2;
    if (p <= 2000) return 5;
    if (p <= 5000) return 10;
    return 25;
  };

  const formatNumber = (num: number): string => {
    if (isNaN(num) || num === null) return '0';
    const rounded = Math.round(num * 100) / 100;
    return Number(rounded).toLocaleString('id-ID', {
      minimumFractionDigits: rounded === Math.floor(rounded) ? 0 : 2,
      maximumFractionDigits: 2
    });
  };

  const round2 = (num: number): number => {
    return Math.round(num * 100) / 100;
  };

  const updateJumlahPapan = () => {
    const avg = parseFloat(buyAvg) || 0;
    const offer = parseFloat(offerTertinggi) || 0;
    const bid = parseFloat(bidTerendah) || 0;

    if (avg && offer && bid && offer > bid) {
      const tick = getTickSize(avg);
      const papan = ((offer - bid) / tick) + 1;
      setJumlahPapan(formatNumber(papan));
    } else {
      setJumlahPapan('');
    }
  };

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('calc_history');
      const historyData = stored ? JSON.parse(stored) : [];
      historyData.sort((a: StockResult, b: StockResult) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setHistory(historyData);
    } catch (e) {
      console.error('Error loading history:', e);
      setHistory([]);
    }
  };

  const handleCalculate = () => {
    if (!tanggal) {
      alert('Tanggal harus diisi');
      return;
    }
    if (!emiten.trim()) {
      alert('Emiten harus diisi');
      return;
    }
    if (!broker.trim()) {
      alert('Broker harus diisi');
      return;
    }
    
    const lot = Number(buyLot) || 0;
    const avg = Number(buyAvg) || 0;
    const bid = Number(bidTerendah) || 0;
    const offer = Number(offerTertinggi) || 0;
    
    if (!lot || lot <= 0) {
      alert('Buy Lot harus diisi dengan nilai yang valid');
      return;
    }
    if (!avg || avg <= 0) {
      alert('Buy Avg harus diisi dengan nilai yang valid');
      return;
    }
    if (!bid || bid <= 0) {
      alert('Bid Terendah harus diisi dengan nilai yang valid');
      return;
    }
    if (!offer || offer <= 0) {
      alert('Offer Tertinggi harus diisi dengan nilai yang valid');
      return;
    }
    if (offer <= bid) {
      alert('Offer Tertinggi harus lebih besar dari Bid Terendah');
      return;
    }

    const tick = getTickSize(avg);
    const papanCount = ((offer - bid) / tick) + 1;
    const tBid = Number(totalBid) || 0;
    const tOffer = Number(totalOffer) || 0;
    const rataPerPapan = (tBid + tOffer) / papanCount;
    const papanHigh = rataPerPapan > 0 ? (lot / rataPerPapan) : 0;
    const papanLow = papanHigh / 2;
    const fivePercent = avg * 0.05;

    const targetHigh = avg + fivePercent + (papanHigh * tick);
    const targetLow = avg + fivePercent + (papanLow * tick);

    const percentLow = ((targetLow - avg) / avg) * 100;
    const percentHigh = ((targetHigh - avg) / avg) * 100;

    const result: StockResult = {
      timestamp: new Date().toISOString(),
      tanggal,
      dateDisplay: new Date(tanggal + 'T00:00:00').toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      emiten: emiten.trim(),
      broker: broker.trim(),
      buyLot: round2(lot),
      buyAvg: round2(avg),
      bidTerendah: round2(bid),
      offerTertinggi: round2(offer),
      totalBid: round2(tBid),
      totalOffer: round2(tOffer),
      jumlahPapan: round2(papanCount),
      rataPerPapan: round2(rataPerPapan),
      papanCountHigh: round2(papanHigh),
      papanCountLow: round2(papanLow),
      tick,
      fivePercent: round2(fivePercent),
      targetHigh: round2(targetHigh),
      targetLow: round2(targetLow),
      percentLow: round2(percentLow),
      percentHigh: round2(percentHigh)
    };

    saveToHistory(result);
  };

  const saveToHistory = (result: StockResult) => {
    try {
      const newHistory = [result, ...history];
      setHistory(newHistory);
      localStorage.setItem('calc_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history:', e);
      alert('Gagal menyimpan ke history: ' + e);
    }
  };

  const handleReset = () => {
    setTanggal(new Date().toISOString().split('T')[0]);
    setEmiten('');
    setBroker('');
    setBuyLot('');
    setBuyAvg('');
    setBidTerendah('');
    setOfferTertinggi('');
    setTotalBid('');
    setTotalOffer('');
    setTickSize('');
    setJumlahPapan('');
  };

  const toggleExpand = (timestamp: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [timestamp]: !prev[timestamp]
    }));
  };

  const handleCopy = async (timestamp: string) => {
    const result = history.find(r => r.timestamp === timestamp);
    if (!result) return;

    const text = `TARGET REALISTIS SAHAM ${result.emiten}
${result.dateDisplay} | Broker ${result.broker}

🎯 TARGET LOW: Rp ${formatNumber(result.targetLow)} (+${formatNumber(result.percentLow)}%)
🚀 TARGET HIGH: Rp ${formatNumber(result.targetHigh)} (+${formatNumber(result.percentHigh)}%)

DATA:
- Buy Avg: Rp ${formatNumber(result.buyAvg)}
- Buy Lot: ${formatNumber(result.buyLot)} lot
- Bid: Rp ${formatNumber(result.bidTerendah)} | Offer: Rp ${formatNumber(result.offerTertinggi)}
- Total Bid: ${formatNumber(result.totalBid)} lot | Total Offer: ${formatNumber(result.totalOffer)} lot
- Tick Size: ${result.tick} poin

PERHITUNGAN:
1. Jumlah Papan = ${formatNumber(result.jumlahPapan)} papan
2. Rata per Papan = ${formatNumber(result.rataPerPapan)} lot
3. Papan Terdorong: HIGH ${formatNumber(result.papanCountHigh)} | LOW ${formatNumber(result.papanCountLow)}
4. Baseline (5%) = ${formatNumber(result.fivePercent)} poin

RUMUS:
Target = Buy Avg + Baseline + (Papan Terdorong × Tick)
LOW = ${formatNumber(result.buyAvg)} + ${formatNumber(result.fivePercent)} + (${formatNumber(result.papanCountLow)} × ${result.tick}) = Rp ${formatNumber(result.targetLow)}
HIGH = ${formatNumber(result.buyAvg)} + ${formatNumber(result.fivePercent)} + (${formatNumber(result.papanCountHigh)} × ${result.tick}) = Rp ${formatNumber(result.targetHigh)}

Formula: adimollogy & buruhIHSG | Dev: Ahfas`;

    await navigator.clipboard.writeText(text);
    alert('Disalin ke clipboard!');
  };

  const handleDeleteHistory = (timestamp: string) => {
    try {
      const newHistory = history.filter(item => item.timestamp !== timestamp);
      setHistory(newHistory);
      localStorage.setItem('calc_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to delete history item:', e);
    }
  };

  const handleClearAllHistory = () => {
    if (!confirm('Hapus semua history?')) return;

    try {
      localStorage.removeItem('calc_history');
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold mb-6 transition-colors"
        >
          <FaHome />
          <span>Home</span>
        </Link>
        
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Target Realistis Saham
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emiten <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={emiten}
                onChange={(e) => setEmiten(e.target.value.toUpperCase())}
                placeholder="BBCA"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Broker <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={broker}
                onChange={(e) => setBroker(e.target.value.toUpperCase())}
                placeholder="AS"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buy Lot <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={buyLot}
                onChange={(e) => setBuyLot(e.target.value)}
                placeholder="100000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buy Avg <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={buyAvg}
                onChange={(e) => setBuyAvg(e.target.value)}
                placeholder="216.4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tick Size
              </label>
              <input
                type="text"
                value={tickSize}
                disabled
                placeholder="Auto"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bid Terendah <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={bidTerendah}
                onChange={(e) => setBidTerendah(e.target.value)}
                placeholder="200"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Tertinggi <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={offerTertinggi}
                onChange={(e) => setOfferTertinggi(e.target.value)}
                placeholder="250"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Papan
            </label>
            <input
              type="text"
              value={jumlahPapan}
              disabled
              placeholder="Auto"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Bid (lot)
              </label>
              <input
                type="number"
                value={totalBid}
                onChange={(e) => setTotalBid(e.target.value)}
                placeholder="85000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Offer (lot)
              </label>
              <input
                type="number"
                value={totalOffer}
                onChange={(e) => setTotalOffer(e.target.value)}
                placeholder="65000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleCalculate}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Hitung
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            <span className="text-red-500">*</span> Wajib diisi
          </p>
        </div>

        {history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-gray-800">Hasil Perhitungan</h2>
              <button
                onClick={handleClearAllHistory}
                className="text-sm bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                Hapus semua
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Riwayat perhitungan tersimpan otomatis
            </p>

            <div className="space-y-4">
              {history.map((result) => (
                <div
                  key={result.timestamp}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all bg-white"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4 gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-800 truncate">
                          {result.emiten}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {result.dateDisplay} • Broker {result.broker}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleCopy(result.timestamp)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Salin detail"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteHistory(result.timestamp)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">🎯 Target LOW</p>
                        <p className="text-xl font-bold text-green-600">
                          Rp {formatNumber(result.targetLow)}
                        </p>
                        <p className="text-sm font-semibold text-green-600 mt-1">
                          +{formatNumber(result.percentLow)}%
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">🚀 Target HIGH</p>
                        <p className="text-xl font-bold text-blue-600">
                          Rp {formatNumber(result.targetHigh)}
                        </p>
                        <p className="text-sm font-semibold text-blue-600 mt-1">
                          +{formatNumber(result.percentHigh)}%
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(result.timestamp)}
                      className="w-full text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 font-medium flex items-center justify-center gap-2 py-3 border-t border-gray-200 transition-colors"
                    >
                      <span>{expandedItems[result.timestamp] ? 'Sembunyikan' : 'Lihat'} detail perhitungan</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`transition-transform ${expandedItems[result.timestamp] ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                  </div>

                  {expandedItems[result.timestamp] && (
                    <div className="bg-gray-50 border-t border-gray-200 p-5 space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Data Input</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between"><span className="text-gray-600">Buy Average:</span><span className="font-medium">Rp {formatNumber(result.buyAvg)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Buy Lot:</span><span className="font-medium">{formatNumber(result.buyLot)} lot</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Bid Terendah:</span><span className="font-medium">Rp {formatNumber(result.bidTerendah)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Offer Tertinggi:</span><span className="font-medium">Rp {formatNumber(result.offerTertinggi)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Total Bid:</span><span className="font-medium">{formatNumber(result.totalBid)} lot</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Total Offer:</span><span className="font-medium">{formatNumber(result.totalOffer)} lot</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Tick Size:</span><span className="font-medium">{result.tick} poin</span></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-sm text-gray-600 pb-4">
          <p className="mb-2">
            Formula by{' '}
            <a
              href="https://x.com/adisucippto"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              adimollogy
            </a>
            {' '}&{' '}
            <span className="font-medium">buruhIHSG</span>
          </p>
          <p className="text-gray-500">
            Made with <span className="text-red-500">❤</span> by{' '}
            <a
              href="https://x.com/ahfasxp"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Ahfas
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
