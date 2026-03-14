'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowRightLeft, Loader2, Coins, IndianRupee, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const fetcher = (url) => fetch(url).then(r => r.json());

export default function ConvertPage() {
    const router = useRouter();
    const { data: authData, error: authError, mutate: mutateAuth } = useSWR('/api/auth/me', fetcher);

    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('INR');
    const [amount, setAmount] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Default estimated rate before API fetch
    const [rate, setRate] = useState(88.5);
    const [liveRateLoading, setLiveRateLoading] = useState(true);

    useEffect(() => {
        // Fetch live USD to INR rate for preview purposes
        const fetchRate = async () => {
            try {
                const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const data = await res.json();
                if (data && data.rates && data.rates.INR) {
                    setRate(data.rates.INR + 2); // adding standard premium
                }
            } catch (error) {
                console.error("Could not fetch live rate:", error);
            } finally {
                setLiveRateLoading(false);
            }
        };
        fetchRate();
    }, []);

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setAmount('');
        setMessage({ type: '', text: '' });
    };

    const handleConvert = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || amount <= 0) return;

        setIsConverting(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/wallet/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fromCurrency, toCurrency, amount: parseFloat(amount) })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Conversion failed');

            setMessage({ type: 'success', text: `Successfully converted ${fromCurrency === 'USD' ? '$' : '₹'}${parseFloat(amount).toLocaleString()} to ${toCurrency === 'USD' ? '$' : '₹'}${data.convertedAmount.toLocaleString()}` });
            setAmount('');
            mutateAuth(); // refresh balances

            // Auto hide success message after 5 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsConverting(false);
        }
    };

    if (authError) return <div className="text-red-500 font-bold p-8">Error loading user data</div>;
    if (!authData) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af35]" />
        </div>
    );

    const user = authData.user;

    // Compute max balance available
    const maxBalance = fromCurrency === 'USD' ? user.usdWallet : user.inrWallet;

    // Compute estimated receive amount
    let estimatedReceive = 0;
    if (amount && !isNaN(amount)) {
        estimatedReceive = fromCurrency === 'USD' ? parseFloat(amount) * rate : parseFloat(amount) / rate;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 relative pb-20">
            {/* Header Section */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-3">
                        <RefreshCw className="w-8 h-8 text-[#d4af35]" /> Assets Conversion
                    </h1>
                    <p className="text-[#d4af35]/70 font-medium">Instantly convert balance between USDT and INR.</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-[#0A0A0A] border border-[#d4af35]/30 rounded-2xl p-4 shadow-inner min-w-[140px]">
                        <p className="text-[10px] uppercase font-black tracking-widest text-[#d4af35]/60 mb-1">USD Balance</p>
                        <p className="text-xl font-black text-white flex items-center gap-1.5"><Coins className="w-4 h-4 text-[#d4af35]" /> ${user.usdWallet?.toLocaleString('en-US') || '0.00'}</p>
                    </div>
                    <div className="bg-[#0A0A0A] border border-[#d4af35]/30 rounded-2xl p-4 shadow-inner min-w-[140px]">
                        <p className="text-[10px] uppercase font-black tracking-widest text-[#d4af35]/60 mb-1">INR Balance</p>
                        <p className="text-xl font-black text-white flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-[#d4af35]" /> ₹{user.inrWallet?.toLocaleString('en-IN') || '0.00'}</p>
                    </div>
                </div>
            </div>

            {/* Main Converter Card */}
            <div className="bg-[#0A0A0A] rounded-3xl p-6 md:p-10 border border-[#d4af35]/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af35]/5 rounded-full blur-[80px] pointer-events-none -mt-32 -mr-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d4af35]/5 rounded-full blur-[60px] pointer-events-none -mb-32 -ml-32" />

                <AnimatePresence>
                    {message.text && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className={`p-4 rounded-xl font-black text-sm mb-8 flex items-center gap-3 shadow-inner border backdrop-blur-sm relative z-10 ${message.type === 'success' ? 'bg-[#32e512]/10 text-[#32e512] border-[#32e512]/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleConvert} className="relative z-10 max-w-2xl mx-auto">

                    {/* From Section */}
                    <div className="bg-[#121212] rounded-2xl p-5 md:p-6 border border-white/5 shadow-inner hover:border-[#d4af35]/30 transition-all group">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-xs font-black text-[#d4af35]/80 uppercase tracking-widest">Convert From</label>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                                Available: {fromCurrency} {maxBalance?.toLocaleString(fromCurrency === 'USD' ? 'en-US' : 'en-IN')}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-[#0A0A0A] border border-[#d4af35]/30 rounded-xl px-4 py-3 flex items-center gap-3 w-1/3 shadow-inner">
                                {fromCurrency === 'USD' ? <Coins className="w-5 h-5 text-[#d4af35]" /> : <IndianRupee className="w-5 h-5 text-[#d4af35]" />}
                                <span className="font-black text-white text-lg tracking-wide">{fromCurrency}</span>
                            </div>
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#d4af35] font-black text-xl">
                                    {fromCurrency === 'USD' ? '$' : '₹'}
                                </div>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    max={maxBalance}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-transparent border-none text-right text-3xl md:text-4xl text-white font-black focus:outline-none focus:ring-0 placeholder-white/10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={() => setAmount(maxBalance)} className="text-[10px] font-black text-[#d4af35] hover:text-white uppercase tracking-widest bg-[#d4af35]/10 px-3 py-1.5 rounded-lg border border-[#d4af35]/20 hover:bg-[#d4af35]/30 transition-all shadow-sm">
                                Max Limit
                            </button>
                        </div>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center -my-4 relative z-20">
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSwap}
                            className="bg-[#d4af35] p-3 rounded-full shadow-[0_4px_20px_rgba(212,175,53,0.4)] border-4 border-[#0A0A0A] hover:bg-[#f8d76d] transition-colors"
                        >
                            <ArrowRightLeft className="w-5 h-5 text-[#0A0A0A]" />
                        </motion.button>
                    </div>

                    {/* To Section */}
                    <div className="bg-[#121212] rounded-2xl p-5 md:p-6 border border-white/5 shadow-inner hover:border-[#d4af35]/30 transition-all group">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-xs font-black text-[#d4af35]/80 uppercase tracking-widest">Convert To</label>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                                Current: {toCurrency} {(toCurrency === 'USD' ? user.usdWallet : user.inrWallet)?.toLocaleString(toCurrency === 'USD' ? 'en-US' : 'en-IN')}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-[#0A0A0A] border border-[#d4af35]/30 rounded-xl px-4 py-3 flex items-center gap-3 w-1/3 shadow-inner">
                                {toCurrency === 'USD' ? <Coins className="w-5 h-5 text-[#d4af35]" /> : <IndianRupee className="w-5 h-5 text-[#d4af35]" />}
                                <span className="font-black text-white text-lg tracking-wide">{toCurrency}</span>
                            </div>
                            <div className="relative flex-1 text-right">
                                <span className="text-3xl md:text-4xl text-white font-black truncate max-w-full block">
                                    {estimatedReceive > 0 ? (
                                        <>{toCurrency === 'USD' ? '$' : '₹'}{estimatedReceive.toLocaleString(toCurrency === 'USD' ? 'en-US' : 'en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
                                    ) : (
                                        <span className="text-white/20">0.00</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Rate Summary Info */}
                    <div className="mt-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#d4af35]/5 rounded-2xl p-5 border border-[#d4af35]/20 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 w-1 h-full bg-[#d4af35]" />

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-[#d4af35]/30 flex items-center justify-center flex-shrink-0">
                                {liveRateLoading ? <Loader2 className="w-4 h-4 text-[#d4af35] animate-spin" /> : <RefreshCw className="w-4 h-4 text-[#d4af35]" />}
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-[#d4af35]/70">Estimated Rate</p>
                                <p className="text-sm font-bold text-white tracking-wide">1 USDT ≈ ₹{rate.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="hidden md:block w-px h-10 bg-[#d4af35]/20" />

                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest font-black text-[#d4af35]/70">Processing Fee</p>
                            <p className="text-sm font-bold text-[#32e512] tracking-wide">0.00 (Free)</p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={isConverting || !amount || amount <= 0 || amount > maxBalance}
                        className="w-full bg-gradient-to-r from-[#d4af35] to-[#f8d76d] text-[#0A0A0A] font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(212,175,53,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,53,0.4)] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
                    >
                        {isConverting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>Confirm Conversion <ArrowRightLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </motion.button>
                </form>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-inner">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0 border border-amber-500/30">
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                    <h3 className="text-amber-500 font-black text-sm uppercase tracking-widest mb-1">Important Notice</h3>
                    <p className="text-amber-500/80 text-xs font-bold leading-relaxed">
                        Conversions between USDT and INR are subject to real-time market fluctuations. The rate shown is an estimate and may vary slightly at the time of execution. Once confirmed, conversions are irreversible.
                    </p>
                </div>
            </div>
        </div>
    );
}
