'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, ShieldCheck, TrendingUp, Wallet, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

const INR_SCHEMES = [
    { id: '3m_inr', name: '3-Month Plan (INR)', currency: 'INR', rate: '18%', desc: 'Short-term liquidity', amounts: [50000, 100000, 300000, 500000] },
    { id: '6m_inr', name: '6-Month Plan (INR)', currency: 'INR', rate: '38%', desc: 'Balanced growth', amounts: [100000, 300000, 500000] },
    { id: '1y_inr', name: '1-Year FD (INR)', currency: 'INR', rate: '80%', desc: 'High yield', min: 500000 },
    { id: '5y_inr', name: '5-Year Vision (INR)', currency: 'INR', rate: '500%', desc: 'Wealth generation', min: 1000000, max: 1500000 },
];
const USD_SCHEMES = [
    { id: '3m_usd', name: '3-Month Plan (USDT)', currency: 'USD', rate: '18%', desc: 'Short-term liquidity', amounts: [500, 1000, 1500, 2000] },
    { id: '6m_usd', name: '6-Month Plan (USDT)', currency: 'USD', rate: '38%', desc: 'Balanced growth', amounts: [1000, 1500, 2000] },
    { id: '1y_usd', name: '1-Year FD (USDT)', currency: 'USD', rate: '80%', desc: 'High yield USD', min: 2000 },
    { id: '5y_usd', name: '5-Year Vision (USDT)', currency: 'USD', rate: '500%', desc: 'Massive wealth USD', min: 5000 },
];

export default function InvestPage() {
    const { data: statsData, mutate, isLoading } = useSWR('/api/dashboard/stats', fetcher);
    const { data: profileData } = useSWR('/api/profile', fetcher);
    const { data: rateData } = useSWR('/api/exchange-rate', fetcher);

    const [investmentCurrency, setInvestmentCurrency] = useState('INR');

    // dynamically determine schemes based on selected currency
    const activeSchemes = investmentCurrency === 'USD' ? USD_SCHEMES : INR_SCHEMES;
    const [selectedScheme, setSelectedScheme] = useState(activeSchemes[0]);
    const [amount, setAmount] = useState(activeSchemes[0].amounts[0]);
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

    const liveRate = rateData?.rate || 85;

    const handleCurrencySwitch = (currency) => {
        setInvestmentCurrency(currency);
        const schemes = currency === 'USD' ? USD_SCHEMES : INR_SCHEMES;
        setSelectedScheme(schemes[0]);
        setAmount(schemes[0].amounts ? schemes[0].amounts[0] : schemes[0].min);
        setError('');
        setSuccess(false);
        setShowOtpPrompt(false);
        setOtpToken('');
    };

    const calculateReturnUsdt = () => {
        const rate = parseFloat(selectedScheme.rate) / 100;
        return ((Number(amount) * rate) / liveRate).toFixed(2);
    };

    const calculateReturnInr = () => {
        const rate = parseFloat(selectedScheme.rate) / 100;
        const usdt = (Number(amount) * rate) / liveRate;
        return (usdt * liveRate).toLocaleString('en-IN', { maximumFractionDigits: 0 });
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
                    currency: investmentCurrency,
                    otpToken
                }),
            });

            const resData = await res.json();
            if (!res.ok) throw new Error(resData.error || 'Investment failed');

            setSuccess(true);
            setShowOtpPrompt(false);
            mutate();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af35]" />
        </div>
    );

    const isKycApproved = profileData?.user?.kycStatus === 'approved';
    const activeWalletBalance = investmentCurrency === 'USD' ? (statsData?.user?.usdWallet || 0) : (statsData?.user?.inrWallet || 0);
    const hasSufficientBalance = activeWalletBalance >= Number(amount);
    const curSymbol = investmentCurrency === 'USD' ? '$' : '₹';

    return (
        <div className="max-w-4xl mx-auto space-y-8 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Investment Plans</h1>
                    <p className="text-[#d4af35]/70 font-medium">Choose a scheme to compound your wealth.</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#d4af35]/30 text-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-[0_4px_20px_rgba(212,175,53,0.15)] shrink-0 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#d4af35]/20 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                    <Wallet className="w-6 h-6 text-[#d4af35]" />
                    <div>
                        <div className="text-xs text-[#d4af35]/80 font-bold uppercase tracking-widest">{investmentCurrency} Wallet</div>
                        <div className="text-2xl font-black drop-shadow-[0_0_8px_rgba(212,175,53,0.2)]">{curSymbol}{activeWalletBalance.toLocaleString(investmentCurrency === 'USD' ? 'en-US' : 'en-IN')}</div>
                    </div>
                    <Link href="/dashboard/deposit" className="ml-3 bg-[#d4af35]/10 border border-[#d4af35]/50 text-[#d4af35] text-xs font-black px-4 py-2 rounded-lg hover:bg-[#d4af35] hover:text-[#0A0A0A] transition-colors relative z-10">
                        + Deposit
                    </Link>
                </div>
            </div>

            {/* Currency Switcher */}
            <div className="flex bg-[#0A0A0A] border border-[#d4af35]/20 rounded-xl p-1.5 gap-1.5 max-w-sm relative z-10 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                <button
                    onClick={() => handleCurrencySwitch('INR')}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all uppercase tracking-wider ${investmentCurrency === 'INR' ? 'bg-[#d4af35]/10 border border-[#d4af35]/30 text-[#d4af35] shadow-inner' : 'text-white/40 hover:text-[#d4af35]'}`}
                >
                    INR Investment
                </button>
                <button
                    onClick={() => handleCurrencySwitch('USD')}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all uppercase tracking-wider ${investmentCurrency === 'USD' ? 'bg-[#d4af35]/10 border border-[#d4af35]/30 text-[#d4af35] shadow-inner' : 'text-white/40 hover:text-[#d4af35]'}`}
                >
                    USDT Investment
                </button>
            </div>

            {/* Success / Error Alerts */}
            {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-lime-50 border border-lime-200 text-lime-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 font-bold shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-lime-600 shrink-0" />
                    <span className="flex-1">Investment requested successfully! Awaiting admin approval.</span>
                    <Link href="/dashboard" className="inline-flex items-center gap-1.5 bg-lime-600 hover:bg-lime-700 text-white text-sm font-black px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                        Go to Dashboard →
                    </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                {activeSchemes.map((scheme) => (
                    <motion.div
                        whileHover={{ y: -4 }}
                        key={scheme.id}
                        onClick={() => handleSchemeSelect(scheme)}
                        className={`p-6 rounded-2xl cursor-pointer transition-all border relative overflow-hidden group ${selectedScheme.id === scheme.id
                            ? 'bg-[#0A0A0A] border-[#d4af35] shadow-[0_0_25px_rgba(212,175,53,0.15)] scale-[1.02]'
                            : 'bg-[#0A0A0A] border-[#d4af35]/10 hover:border-[#d4af35]/40 hover:shadow-[0_4px_20px_rgba(212,175,53,0.05)]'
                            }`}
                    >
                        {selectedScheme.id === scheme.id && (
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-[#d4af35]/10 to-transparent pointer-events-none blur-xl -mr-10 -mt-10" />
                        )}
                        <h3 className={`font-bold mb-1 tracking-wide ${selectedScheme.id === scheme.id ? 'text-white' : 'text-white/70 group-hover:text-white transition-colors'}`}>{scheme.name}</h3>
                        <div className={`text-4xl font-black my-3 flex items-center gap-1 ${selectedScheme.id === scheme.id ? 'text-[#d4af35] drop-shadow-[0_0_8px_rgba(212,175,53,0.4)]' : 'text-white drop-shadow-md'}`}>
                            {scheme.rate}
                            <TrendingUp className={`w-6 h-6 ${selectedScheme.id === scheme.id ? 'text-[#d4af35]' : 'text-white/50'}`} />
                        </div>
                        <p className={`text-[10px] uppercase tracking-widest font-bold ${selectedScheme.id === scheme.id ? 'text-[#d4af35]/70' : 'text-white/40'}`}>{scheme.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Config Panel */}
            <div className={`bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10 ${!isKycApproved ? 'opacity-40 pointer-events-none select-none' : ''}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#d4af35]/5 to-transparent rounded-full -mr-32 -mt-32 pointer-events-none" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <h2 className="text-2xl font-black text-white tracking-tight">Configure Your Investment</h2>
                    {!hasSufficientBalance && isKycApproved && (
                        <Link href="/dashboard/deposit" className="text-sm font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1.5 transition-colors bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                            <Wallet className="w-4 h-4" /> Top Up Balance
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    <div>
                        <label className="block text-sm font-bold text-[#d4af35]/80 uppercase tracking-widest mb-4">Investment Amount ({investmentCurrency})</label>
                        {selectedScheme.amounts ? (
                            <div className="grid grid-cols-2 gap-4">
                                {selectedScheme.amounts.map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => setAmount(amt)}
                                        className={`py-4 rounded-xl border font-black transition-all shadow-sm text-lg ${amount === amt
                                            ? 'bg-[#d4af35] border-[#d4af35] text-[#0A0A0A] shadow-[0_0_20px_rgba(212,175,53,0.3)] scale-[1.02]'
                                            : 'bg-[#0A0A0A] border-[#d4af35]/20 text-white/70 hover:border-[#d4af35]/50 hover:text-white'
                                            }`}
                                    >
                                        {curSymbol}{amt.toLocaleString(investmentCurrency === 'USD' ? 'en-US' : 'en-IN')}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#d4af35] font-black text-xl">
                                        {curSymbol}
                                    </div>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        min={selectedScheme.min}
                                        max={selectedScheme.max || undefined}
                                        className="w-full bg-[#0A0A0A] border border-[#d4af35]/30 rounded-xl pl-10 pr-4 py-4 text-white font-black focus:outline-none focus:ring-2 focus:ring-[#d4af35] focus:border-[#d4af35] transition-all text-xl shadow-inner"
                                    />
                                </div>
                                <p className="text-xs text-[#d4af35]/50 font-bold uppercase tracking-widest mt-3">
                                    Min: {curSymbol}{selectedScheme.min.toLocaleString(investmentCurrency === 'USD' ? 'en-US' : 'en-IN')}
                                    {selectedScheme.max && ` | Max: ${curSymbol}${selectedScheme.max.toLocaleString(investmentCurrency === 'USD' ? 'en-US' : 'en-IN')}`}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#0A0A0A] rounded-2xl p-6 flex flex-col justify-between border border-[#d4af35]/20 relative overflow-hidden shadow-inner">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af35] to-transparent opacity-50" />

                        <div>
                            <p className="text-[#d4af35]/80 font-bold uppercase tracking-widest text-xs mb-2">
                                Expected Return ({selectedScheme.id.replace('m', ' Months').replace('y', ' Years')})
                            </p>
                            <div className="text-5xl font-black text-[#d4af35] mb-5 drop-shadow-[0_0_10px_rgba(212,175,53,0.3)]">
                                {selectedScheme.rate}
                            </div>

                            {/* Balance Check Pill */}
                            <div className={`p-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 ${hasSufficientBalance
                                ? 'bg-[#32e512]/10 text-[#32e512] border border-[#32e512]/20 shadow-inner'
                                : 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-inner'
                                }`}>
                                {hasSufficientBalance ? (
                                    <><ShieldCheck className="w-4 h-4" /> Balance OK ({curSymbol}{activeWalletBalance.toLocaleString(investmentCurrency === 'USD' ? 'en-US' : 'en-IN')} available)</>
                                ) : (
                                    <><AlertCircle className="w-4 h-4" /> Need {curSymbol}{(Number(amount) - activeWalletBalance).toLocaleString(investmentCurrency === 'USD' ? 'en-US' : 'en-IN')} more</>
                                )}
                            </div>
                        </div>

                        {showOtpPrompt ? (
                            <div className="mt-6 p-5 bg-[#0A0A0A] border border-[#d4af35]/30 rounded-xl space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-[#d4af35] mb-2 flex justify-between items-center">
                                        Verification Code
                                        <span className="text-[10px] text-white/50">{user.isTwoFactorEnabled ? 'Google Auth' : 'Sent to Email'}</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="6-digit code"
                                        value={otpToken}
                                        onChange={(e) => setOtpToken(e.target.value)}
                                        className="w-full bg-[#0A0A0A] border border-[#d4af35]/40 rounded-lg px-4 py-3 text-center tracking-[0.5em] font-mono text-xl focus:outline-none focus:ring-2 focus:ring-[#d4af35] focus:border-[#d4af35] transition-all text-white shadow-inner placeholder:text-white/10"
                                        maxLength="6"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { setShowOtpPrompt(false); setOtpToken(''); setError(''); }}
                                        className="flex-1 py-3 bg-[#0A0A0A] text-white/60 font-bold uppercase tracking-wider rounded-lg border border-white/10 hover:bg-white/5 hover:text-white transition-colors text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleInvest}
                                        disabled={loading || otpToken.length < 6}
                                        className="flex-[2] bg-[#d4af35] hover:bg-[#f8d76d] text-[#0A0A0A] font-black uppercase tracking-wider text-sm py-3 rounded-lg flex justify-center items-center gap-2 transition-all shadow-[0_4px_15px_rgba(212,175,53,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
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
                                className="w-full mt-6 bg-[#d4af35] hover:bg-[#f8d76d] text-[#0A0A0A] font-black uppercase tracking-widest text-sm py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-[0_4px_20px_rgba(212,175,53,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isOtpSending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>Confirm Investment <ArrowRight className="w-5 h-5 text-[#0A0A0A]" /></>
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
