'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, ShieldCheck, TrendingUp, Wallet, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

const SCHEMES = [
    { id: '3m', name: '3-Month Plan', rate: '18%', desc: 'Short-term liquidity', amounts: [50000, 100000, 300000, 500000] },
    { id: '6m', name: '6-Month Plan', rate: '38%', desc: 'Balanced growth', amounts: [100000, 300000, 500000] },
    { id: '1y', name: '1-Year FD', rate: '80%', desc: 'High yield fixed deposit', min: 500000 },
    { id: '5y', name: '5-Year Vision', rate: '500%', desc: 'Massive wealth generation', min: 1000000, max: 1500000 },
];

export default function InvestPage() {
    const router = useRouter();
    const { data: statsData, mutate, isLoading } = useSWR('/api/dashboard/stats', fetcher);
    const { data: profileData } = useSWR('/api/profile', fetcher);
    const { data: rateData } = useSWR('/api/exchange-rate', fetcher);

    const [selectedScheme, setSelectedScheme] = useState(SCHEMES[0]);
    const [amount, setAmount] = useState(SCHEMES[0].amounts[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // 2FA / OTP State
    const [showOtpPrompt, setShowOtpPrompt] = useState(false);
    const [otpToken, setOtpToken] = useState('');
    const [isOtpSending, setIsOtpSending] = useState(false);
    const user = profileData?.user || {};

    const handleSchemeSelect = (scheme) => {
        setSelectedScheme(scheme);
        setAmount(scheme.amounts ? scheme.amounts[0] : scheme.min);
        setError('');
        setSuccess(false);
        setShowOtpPrompt(false);
        setOtpToken('');
    };

    const calculateReturn = () => {
        const rate = parseFloat(selectedScheme.rate) / 100;
        const liveRate = rateData?.rate || 85;
        return ((Number(amount) * rate) / liveRate).toFixed(2);
    };

    const initiateInvestment = async () => {
        // If 2FA is active, just show the prompt
        if (user.isTwoFactorEnabled) {
            setShowOtpPrompt(true);
            return;
        }

        // Otherwise, request an email OTP first
        setIsOtpSending(true);
        setError('');
        try {
            const res = await fetch('/api/auth/send-otp', { method: 'POST' });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.error || 'Failed to send OTP');
            setShowOtpPrompt(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsOtpSending(false);
        }
    };

    const handleInvest = async () => {
        if (!otpToken) {
            setError('Please enter your verification code.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const res = await fetch('/api/invest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Number(amount),
                    schemeType: selectedScheme.id,
                    otpToken
                }),
            });

            const resData = await res.json();
            if (!res.ok) throw new Error(resData.error || 'Investment failed');

            setSuccess(true);
            setShowOtpPrompt(false);
            mutate();
            setTimeout(() => router.push('/dashboard'), 2500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-neon" />
        </div>
    );

    const isKycApproved = profileData?.user?.kycStatus === 'approved';
    const walletBalance = statsData?.user?.walletBalance || 0;
    const hasSufficientBalance = walletBalance >= Number(amount);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">Investment Plans</h1>
                    <p className="text-slate-500 font-medium">Choose a scheme to compound your wealth in USDT.</p>
                </div>
                {/* Wallet Balance Card */}
                <div className="bg-navy text-white rounded-2xl px-5 py-4 flex items-center gap-3 shadow-lg shadow-navy/20 shrink-0">
                    <Wallet className="w-5 h-5 text-neon" />
                    <div>
                        <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">Available Balance</div>
                        <div className="text-2xl font-black">₹{walletBalance.toLocaleString('en-IN')}</div>
                    </div>
                    <Link href="/dashboard/deposit" className="ml-2 bg-neon text-navy text-xs font-black px-3 py-1.5 rounded-lg hover:bg-lime-300 transition-colors">
                        + Deposit
                    </Link>
                </div>
            </div>

            {/* Success / Error Alerts */}
            {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-lime-50 border border-lime-200 text-lime-800 p-4 rounded-xl flex items-center gap-3 font-bold shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-lime-600" />
                    Investment requested successfully! Awaiting admin approval. Redirecting to dashboard...
                </motion.div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl font-medium shadow-sm flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                    {error.toLowerCase().includes('wallet') && (
                        <Link href="/dashboard/deposit" className="underline ml-1 font-bold text-red-800 whitespace-nowrap">
                            Deposit Now →
                        </Link>
                    )}
                </div>
            )}

            {/* KYC Gate */}
            {!isKycApproved && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-amber-800 font-bold text-lg mb-1">KYC Verification Required</h3>
                        <p className="text-amber-700 text-sm mb-3">You must complete KYC verification to invest in any scheme.</p>
                        <Link href="/dashboard/profile" className="inline-flex bg-amber-600 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                            Complete KYC Now
                        </Link>
                    </div>
                </div>
            )}

            {/* Scheme Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SCHEMES.map((scheme) => (
                    <motion.div
                        whileHover={{ y: -4 }}
                        key={scheme.id}
                        onClick={() => handleSchemeSelect(scheme)}
                        className={`p-5 rounded-2xl cursor-pointer transition-all border shadow-sm ${selectedScheme.id === scheme.id
                            ? 'bg-navy border-navy shadow-[0_4px_20px_rgba(11,17,32,0.15)] scale-[1.02]'
                            : 'bg-white border-slate-200 hover:border-lime-300 hover:shadow-md'
                            }`}
                    >
                        <h3 className={`font-bold mb-1 ${selectedScheme.id === scheme.id ? 'text-white' : 'text-navy'}`}>{scheme.name}</h3>
                        <div className={`text-3xl font-black my-3 flex items-center gap-1 ${selectedScheme.id === scheme.id ? 'text-neon' : 'text-navy'}`}>
                            {scheme.rate}
                            <TrendingUp className="w-5 h-5 text-neon" />
                        </div>
                        <p className={`text-xs uppercase tracking-wider font-bold ${selectedScheme.id === scheme.id ? 'text-slate-300' : 'text-slate-400'}`}>{scheme.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Config Panel */}
            <div className={`bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm ${!isKycApproved ? 'opacity-40 pointer-events-none select-none' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-navy">Configure Your Investment</h2>
                    {!hasSufficientBalance && isKycApproved && (
                        <Link href="/dashboard/deposit" className="text-sm font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1.5">
                            <Wallet className="w-4 h-4" /> Top Up Balance
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-navy mb-4">Investment Amount (INR)</label>
                        {selectedScheme.amounts ? (
                            <div className="grid grid-cols-2 gap-3">
                                {selectedScheme.amounts.map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => setAmount(amt)}
                                        className={`py-3 rounded-xl border font-bold transition-all shadow-sm ${amount === amt
                                            ? 'bg-neon border-neon text-navy shadow-neon/20'
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-lime-300 hover:bg-lime-50'
                                            }`}
                                    >
                                        ₹{amt.toLocaleString('en-IN')}
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
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-navy font-bold focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all text-lg"
                                />
                                <p className="text-xs text-slate-500 font-medium mt-2">
                                    Min: ₹{selectedScheme.min.toLocaleString('en-IN')}
                                    {selectedScheme.max && ` | Max: ₹${selectedScheme.max.toLocaleString('en-IN')}`}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-between border border-slate-200">
                        <div>
                            <p className="text-slate-500 font-bold text-sm mb-1">
                                Expected Return ({selectedScheme.id.replace('m', ' Months').replace('y', ' Years')})
                            </p>
                            <div className="text-4xl font-black text-lime-600 mb-1">
                                {calculateReturn()} <span className="text-lg text-slate-400 font-bold">USDT</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium italic mb-4">
                                *1 USDT = ₹{rateData?.rate ? rateData.rate.toFixed(2) : '85.00'} (Live Rate)
                            </p>

                            {/* Balance Check Pill */}
                            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${hasSufficientBalance
                                ? 'bg-lime-50 text-lime-700 border border-lime-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {hasSufficientBalance ? (
                                    <><ShieldCheck className="w-4 h-4" /> Balance OK (₹{walletBalance.toLocaleString('en-IN')} available)</>
                                ) : (
                                    <><AlertCircle className="w-4 h-4" /> Need ₹{(Number(amount) - walletBalance).toLocaleString('en-IN')} more</>
                                )}
                            </div>
                        </div>

                        {showOtpPrompt ? (
                            <div className="mt-5 p-4 bg-slate-100 border border-slate-200 rounded-xl space-y-3">
                                <div>
                                    <label className="block text-sm font-bold text-navy mb-1 flex justify-between items-center">
                                        Verification Code
                                        <span className="text-xs text-slate-500 font-medium">{user.isTwoFactorEnabled ? 'Google Authenticator' : 'Sent to Email'}</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="6-digit code"
                                        value={otpToken}
                                        onChange={(e) => setOtpToken(e.target.value)}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-center tracking-[0.5em] font-mono text-lg focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all"
                                        maxLength="6"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setShowOtpPrompt(false); setOtpToken(''); setError(''); }}
                                        className="flex-1 py-3 bg-white text-slate-600 font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleInvest}
                                        disabled={loading || otpToken.length < 6}
                                        className="flex-[2] bg-neon hover:bg-[#32e512] text-navy font-black py-3 rounded-lg flex justify-center items-center gap-2 transition-all shadow-md disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finalize Investment'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: hasSufficientBalance ? 1.02 : 1 }}
                                whileTap={{ scale: hasSufficientBalance ? 0.98 : 1 }}
                                onClick={initiateInvestment}
                                disabled={isOtpSending || !amount || !hasSufficientBalance}
                                className="w-full mt-5 bg-navy hover:bg-black text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-navy/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isOtpSending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>Confirm Investment <ArrowRight className="w-5 h-5 text-neon" /></>
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
