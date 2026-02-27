'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

const fetcher = (url) => fetch(url).then((res) => res.json());

const SCHEMES = [
    { id: '3m', name: '3-Month Plan', rate: '18%', desc: 'Short-term liquidity', amounts: [50000, 100000, 300000, 500000] },
    { id: '6m', name: '6-Month Plan', rate: '38%', desc: 'Balanced growth', amounts: [100000, 300000, 500000] },
    { id: '1y', name: '1-Year FD', rate: '80%', desc: 'High yield fixed deposit', min: 500000, isRange: false },
    { id: '5y', name: '5-Year Vision', rate: '500%', desc: 'Massive wealth generation', min: 1000000, max: 1500000, isRange: true },
];

function InvestSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div>
                <div className="h-9 bg-slate-100 rounded-lg w-52 mb-2" />
                <div className="h-5 bg-slate-100 rounded-lg w-72" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-2xl" />)}
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-8">
                <div className="h-8 bg-slate-100 rounded-lg w-64 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="grid grid-cols-2 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-lg" />)}</div>
                    <div className="bg-slate-100 rounded-2xl h-40" />
                </div>
            </div>
        </div>
    );
}

export default function InvestPage() {
    const router = useRouter();
    const { data, mutate, isLoading } = useSWR('/api/dashboard/stats', fetcher);

    const [selectedScheme, setSelectedScheme] = useState(SCHEMES[0]);
    const [amount, setAmount] = useState(SCHEMES[0].amounts ? SCHEMES[0].amounts[0] : SCHEMES[0].min);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSchemeSelect = (scheme) => {
        setSelectedScheme(scheme);
        if (scheme.amounts) {
            setAmount(scheme.amounts[0]);
        } else {
            setAmount(scheme.min);
        }
        setError('');
        setSuccess(false);
    };

    const calculateReturn = () => {
        const rate = parseFloat(selectedScheme.rate) / 100;
        return ((amount * rate) / parseFloat(process.env.NEXT_PUBLIC_USDT_RATE || '85')).toFixed(2);
    };

    const handleInvest = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const res = await fetch('/api/invest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Number(amount), schemeType: selectedScheme.id }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Investment failed');
            }

            setSuccess(true);
            mutate(); // Refresh dashboard stats
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return <InvestSkeleton />;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">Investment Plans</h1>
                <p className="text-slate-500 font-medium">Choose a scheme to compound your wealth in USDT.</p>
            </div>

            {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3 font-bold shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    Investment successful! Redirecting to dashboard...
                </motion.div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl font-medium shadow-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SCHEMES.map((scheme) => (
                    <motion.div
                        whileHover={{ y: -4 }}
                        key={scheme.id}
                        onClick={() => handleSchemeSelect(scheme)}
                        className={`p-5 rounded-2xl cursor-pointer transition-all border shadow-sm ${selectedScheme.id === scheme.id ? 'bg-navy border-navy shadow-[0_4px_20px_rgba(11,17,32,0.15)] transform scale-[1.02]' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md text-slate-500'}`}
                    >
                        <h3 className={`font-bold mb-1 ${selectedScheme.id === scheme.id ? 'text-white' : 'text-navy'}`}>{scheme.name}</h3>
                        <div className={`text-3xl font-black my-3 flex items-center gap-1 ${selectedScheme.id === scheme.id ? 'text-white' : 'text-navy'}`}>
                            {scheme.rate}
                            <TrendingUp className="w-5 h-5 text-neon" />
                        </div>
                        <p className={`text-xs uppercase tracking-wider font-bold mb-2 ${selectedScheme.id === scheme.id ? 'text-slate-300' : 'text-slate-400'}`}>{scheme.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm mt-8">
                <h2 className="text-2xl font-black text-navy mb-6">Configure Your Investment</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-navy mb-4">Investment Amount (INR)</label>

                        {selectedScheme.amounts ? (
                            <div className="grid grid-cols-2 gap-3">
                                {selectedScheme.amounts.map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => setAmount(amt)}
                                        className={`py-3 rounded-lg border font-bold transition-all shadow-sm ${amount === amt ? 'bg-neon border-neon text-navy shadow-neon/20' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'}`}
                                    >
                                        ₹{amt.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min={selectedScheme.min}
                                    max={selectedScheme.max || undefined}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy font-bold focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all shadow-sm text-lg"
                                />
                                <p className="text-xs text-slate-500 font-medium mt-2">
                                    Minimum: ₹{selectedScheme.min.toLocaleString()}
                                    {selectedScheme.max && ` | Maximum: ₹${selectedScheme.max.toLocaleString()}`}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-between border border-slate-200 shadow-inner">
                        <div>
                            <p className="text-slate-500 font-bold text-sm mb-1">Expected Return ({selectedScheme.id.replace('m', ' Months').replace('y', ' Years')})</p>
                            <div className="text-4xl font-black text-green-600 mb-4">
                                {calculateReturn()} <span className="text-lg text-slate-400 font-bold">USDT</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium italic">*Based on current conversion rate of 1 USDT = 85 INR</p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleInvest}
                            disabled={loading || !amount}
                            className="w-full mt-6 bg-navy hover:bg-black text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-navy/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>Confirm Investment <ArrowRight className="w-5 h-5 text-neon" /></>
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
