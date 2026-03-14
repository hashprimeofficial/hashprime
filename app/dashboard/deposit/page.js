'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Loader2, UploadCloud, IndianRupee, Image as ImageIcon, CheckCircle2, AlertCircle, Wallet, Copy, Check, Coins } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DepositPage() {
    const { data: authData } = useSWR('/api/auth/me', fetcher);
    const { data: profileData } = useSWR('/api/profile', fetcher);
    const { data: depositsData, mutate: mutateDeposits } = useSWR('/api/deposits', fetcher);

    const [step, setStep] = useState(1);
    const [targetWallet, setTargetWallet] = useState('USD');

    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('usdt');
    const [screenshotBase64, setScreenshotBase64] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [screenshotFile, setScreenshotFile] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [copied, setCopied] = useState(false);
    const [qrExpanded, setQrExpanded] = useState(false);
    const [qrMenu, setQrMenu] = useState(false);

    const handleWalletSelect = (wallet) => {
        setTargetWallet(wallet);
        setPaymentMethod(wallet === 'USD' ? 'usdt' : 'bank');
        setStep(2);
    };


    const copyAddress = () => {
        navigator.clipboard.writeText('0xc95ee77d785bb7c8b8777750e034a824594dd615');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'Screenshot must be less than 5MB' });
                return;
            }
            setScreenshotFile(file);
            setPreviewUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotBase64(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!amount || Number(amount) <= 0) {
            setMessage({ type: 'error', text: 'Please enter a valid amount' });
            return;
        }

        if (!screenshotBase64) {
            setMessage({ type: 'error', text: 'Please upload a payment screenshot' });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/deposits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, paymentMethod, currency: targetWallet, screenshotBase64 })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: data.message });
                setAmount('');
                setScreenshotBase64('');
                setPreviewUrl('');
                setScreenshotFile(null);
                mutateDeposits();
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to submit deposit' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!authData || !profileData) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af35]" />
        </div>
    );

    const user = profileData.user;
    const isKycApproved = user?.kycStatus === 'approved';

    return (
        <div className="max-w-4xl space-y-8 relative">
            <div className="relative z-10">
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Deposit Funds</h1>
                <p className="text-[#d4af35]/70 font-medium">Add funds to your wallet to start investing.</p>
            </div>

            {!isKycApproved ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex items-start gap-4 shadow-[0_4px_20px_rgba(245,158,11,0.05)] relative z-10 backdrop-blur-sm">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0 border border-amber-500/30">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-amber-500 font-black text-lg mb-1 tracking-tight">KYC Verification Required</h3>
                        <p className="text-amber-500/70 text-sm mb-4 font-medium">
                            You must complete your KYC verification before depositing funds or making investments.
                        </p>
                        <Link href="/dashboard/profile" className="inline-flex bg-amber-500 text-[#0A0A0A] font-black uppercase tracking-widest text-xs px-5 py-2.5 rounded-lg hover:bg-amber-400 transition-colors shadow-[0_4px_15px_rgba(245,158,11,0.2)]">
                            Complete KYC Now
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {/* Deposit Form */}
                    <div className="bg-[#0A0A0A] rounded-3xl p-6 md:p-8 border border-[#d4af35]/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#d4af35]/5 to-transparent rounded-full -mr-32 -mt-32 pointer-events-none" />
                        <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-8 relative z-10 tracking-tight">
                            <Wallet className="w-6 h-6 text-[#d4af35]" /> New Deposit Request
                        </h2>

                        {message.text && (
                            <div className={`p-4 rounded-xl font-bold text-sm mb-6 shadow-inner ${message.type === 'success' ? 'bg-[#32e512]/10 text-[#32e512] border border-[#32e512]/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            {step === 1 ? (
                                <div className="space-y-4">
                                    <p className="text-white font-bold mb-4">Select the wallet you want to deposit into:</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleWalletSelect('USD')}
                                            className="bg-[#0A0A0A] border border-[#d4af35]/30 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-[#d4af35]/10 hover:border-[#d4af35] transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-[#d4af35]/10 flex items-center justify-center border border-[#d4af35]/20 group-hover:scale-110 transition-transform">
                                                <Coins className="w-6 h-6 text-[#d4af35]" />
                                            </div>
                                            <span className="font-black text-white text-lg">USD Wallet</span>
                                            <span className="text-xs text-[#d4af35]/70 font-bold uppercase tracking-widest">Via USDT / Crypto</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleWalletSelect('INR')}
                                            className="bg-[#0A0A0A] border border-[#d4af35]/30 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-[#d4af35]/10 hover:border-[#d4af35] transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-[#d4af35]/10 flex items-center justify-center border border-[#d4af35]/20 group-hover:scale-110 transition-transform">
                                                <IndianRupee className="w-6 h-6 text-[#d4af35]" />
                                            </div>
                                            <span className="font-black text-white text-lg">INR Wallet</span>
                                            <span className="text-xs text-[#d4af35]/70 font-bold uppercase tracking-widest">Via Bank Transfer</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <button type="button" onClick={() => setStep(1)} className="text-[#d4af35]/70 hover:text-[#d4af35] text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
                                            ← Back to Wallet Selection
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest font-bold text-[#d4af35]/80 mb-2">
                                            Deposit Amount ({targetWallet})
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#d4af35] font-black text-xl">
                                                {targetWallet === 'USD' ? '$' : '₹'}
                                            </div>
                                            <input
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                required
                                                className="w-full bg-[#0A0A0A] border border-[#d4af35]/30 rounded-xl pl-10 pr-4 py-4 text-white font-black text-xl focus:outline-none focus:ring-2 focus:ring-[#d4af35] focus:border-[#d4af35] transition-all shadow-inner"
                                                placeholder={targetWallet === 'USD' ? '0.00' : '0.00'}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-widest font-bold text-[#d4af35]/80 mb-2">Payment Method</label>
                                        <div className="relative">
                                            <select
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-full bg-[#0A0A0A] border border-[#d4af35]/30 rounded-xl pl-4 pr-10 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#d4af35] focus:border-[#d4af35] transition-all shadow-inner appearance-none cursor-pointer"
                                            >
                                                {targetWallet === 'USD' ? (
                                                    <option value="usdt">USDT (BEP20) — Pay in Crypto</option>
                                                ) : (
                                                    <>
                                                        <option value="bank">Bank Transfer (IMPS/NEFT)</option>
                                                        <option value="cash">Cash Drop-off</option>
                                                    </>
                                                )}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                                <svg className="w-5 h-5 text-[#d4af35]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Instructions */}
                                    <div className="my-4">
                                        {paymentMethod === 'usdt' && (
                                            <>
                                                {/* QR Lightbox */}
                                                {qrExpanded && (
                                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/10/80 backdrop-blur-md"
                                                        onClick={() => setQrExpanded(false)}>
                                                        <div className="bg-[#121212] p-5 rounded-3xl shadow-2xl" onClick={e => e.stopPropagation()}>
                                                            <Image src="/qr.jpeg" alt="USDC BEP20 QR" width={280} height={280} className="rounded-2xl" />
                                                            <p className="text-center text-xs font-bold text-slate-300 mt-3">USDT BEP20 Wallet QR</p>
                                                            <button onClick={() => setQrExpanded(false)}
                                                                className="mt-3 w-full text-xs font-black text-slate-300 hover:text-slate-700 transition-colors py-2">✕ Close</button>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="bg-gradient-to-br from-[#1f1805] to-[#0a0a0a] border-2 border-[#d4af35]/40 rounded-3xl overflow-hidden relative shadow-[0_10px_40px_rgba(212,175,53,0.15)]"
                                                >
                                                    {/* Header */}
                                                    <div className="px-6 py-5 border-b border-[#d4af35]/20 flex items-center justify-between relative z-10 bg-[#000000]/20 backdrop-blur-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-[#d4af35]/20 flex items-center justify-center border border-[#d4af35]/30 shadow-inner">
                                                                <Coins className="w-5 h-5 text-[#d4af35]" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-[#d4af35] uppercase tracking-widest drop-shadow-[0_0_8px_rgba(212,175,53,0.4)]">USDT <span className="text-white/40 font-normal">·</span> BEP20</p>
                                                                <p className="text-[#d4af35]/60 text-[10px] uppercase font-bold tracking-widest mt-0.5">Binance Smart Chain</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-[#d4af35]/10 text-[#d4af35] border border-[#d4af35]/30 tracking-widest uppercase shadow-inner">BSC</span>
                                                    </div>

                                                    {/* QR Code — centered, large */}
                                                    <div className="flex flex-col items-center py-10 gap-4 relative z-10">
                                                        <div className="relative group cursor-pointer" onClick={() => setQrMenu(v => !v)}>
                                                            <div className="bg-white p-3 rounded-2xl border-4 border-[#d4af35]/40 shadow-[0_0_30px_rgba(212,175,53,0.2)] group-hover:scale-105 transition-transform duration-300">
                                                                <Image src="/qr.jpeg" alt="USDT BEP20 QR Code" width={220} height={220} className="rounded-xl" />
                                                            </div>
                                                            {/* Hover hint */}
                                                            <div className="absolute inset-0 rounded-2xl bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/80 transition-all flex items-center justify-center">
                                                                <span className="opacity-0 group-hover:opacity-100 transition-all text-[#d4af35] text-xs font-black shadow-lg bg-[#121212] px-4 py-2 rounded-xl border border-[#d4af35]/50 flex items-center gap-2">Tap Options</span>
                                                            </div>
                                                            {/* Context menu */}
                                                            {qrMenu && (
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 bg-[#0A0A0A] border border-[#d4af35]/30 rounded-xl shadow-[0_8px_25px_rgba(0,0,0,0.8)] overflow-hidden min-w-[170px] backdrop-blur-xl"
                                                                    onClick={e => e.stopPropagation()}>
                                                                    <button onClick={() => { setQrExpanded(true); setQrMenu(false); }}
                                                                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-white/80 hover:bg-[#d4af35]/10 hover:text-[#d4af35] transition-all text-left border-b border-[#d4af35]/10">
                                                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>
                                                                        Expand / View
                                                                    </button>
                                                                    <a href="/qr.jpeg" download="HashPrime-USDT-BEP20-QR.jpeg"
                                                                        onClick={() => setQrMenu(false)}
                                                                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-white/80 hover:bg-[#d4af35]/10 hover:text-[#d4af35] transition-all">
                                                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                                        Save to Device
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-[#d4af35]/60 text-xs font-bold uppercase tracking-widest mt-2">Tap QR to expand</p>
                                                    </div>

                                                    {/* Address + copy */}
                                                    <div className="px-6 pb-6 space-y-4">
                                                        <p className="text-[#d4af35]/80 text-xs font-black uppercase tracking-widest text-center">Wallet Address</p>
                                                        <div className="bg-[#0A0A0A]/60 p-4 rounded-xl flex items-center justify-between gap-3 shadow-inner border border-[#d4af35]/20 group hover:border-[#d4af35]/50 transition-colors w-full">
                                                            <div className="font-mono text-sm tracking-wider text-white break-all flex-1 selection:bg-[#d4af35]/30 font-medium">
                                                                0xc95ee77d785bb7c8b8777750e034a824594dd615
                                                            </div>
                                                            <button type="button" onClick={copyAddress}
                                                                className="bg-[#d4af35]/20 hover:bg-[#d4af35] text-[#d4af35] hover:text-[#0A0A0A] p-3 rounded-lg transition-colors flex-shrink-0 shadow-sm border border-[#d4af35]/30 hover:border-transparent">
                                                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="bg-amber-500/10 p-5 border-t border-amber-500/20 text-center relative z-10 backdrop-blur-sm">
                                                        <p className="text-[11px] font-bold text-amber-500 max-w-[280px] mx-auto uppercase tracking-widest leading-relaxed">
                                                            <AlertCircle className="w-4 h-4 inline mr-1.5 -mt-0.5" /> Send only USDT (BEP20) to this address.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {paymentMethod === 'bank' && (
                                            <div className="bg-[#0A0A0A] border border-[#d4af35]/30 rounded-2xl p-6 shadow-inner relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-2 h-full bg-[#d4af35]" />
                                                <p className="text-[10px] font-black text-[#d4af35] uppercase tracking-widest mb-5 ml-2">Bank Transfer Details</p>
                                                <div className="space-y-4 ml-2">
                                                    {[
                                                        { label: 'Account Name', value: 'VG ENTERPRISES' },
                                                        { label: 'Account Number', value: '005702000000626' },
                                                        { label: 'IFS Code', value: 'IOBA0000057' },
                                                        { label: 'MICR Code', value: '611020012' },
                                                        { label: 'Bank', value: 'Indian Overseas Bank' },
                                                    ].map(({ label, value }) => (
                                                        <div key={label} className="flex justify-between items-center py-2.5 border-b border-[#d4af35]/10 last:border-0">
                                                            <span className="text-[#d4af35]/60 text-[10px] font-black uppercase tracking-widest">{label}</span>
                                                            <span className="text-white font-black text-sm tracking-wide">{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {paymentMethod === 'cash' && (
                                            <div className="bg-[#0A0A0A] border border-[#d4af35]/30 rounded-2xl p-6 shadow-inner relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-2 h-full bg-[#d4af35]" />
                                                <p className="text-xs font-black text-[#d4af35] uppercase tracking-widest mb-2 ml-2">Cash Drop-off</p>
                                                <p className="text-white/70 text-sm ml-2 font-medium">Visit our office to submit cash. Upload the receipt photo below after payment.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Removed Conversion Widget here */}

                                    <div>
                                        <label className="block text-xs uppercase tracking-widest font-bold text-[#d4af35]/80 mb-2">Payment Screenshot / Receipt</label>

                                        {previewUrl ? (
                                            <div className="relative rounded-xl overflow-hidden border border-[#d4af35]/30 bg-[#0A0A0A] mb-3 group h-40 shadow-inner">
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                                <button type="button" onClick={() => { setPreviewUrl(''); setScreenshotBase64(''); setScreenshotFile(null); }} className="absolute inset-0 bg-[#0A0A0A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm tracking-widest uppercase backdrop-blur-sm">
                                                    Change Image
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="border-2 border-dashed border-[#d4af35]/30 rounded-xl p-8 flex flex-col items-center justify-center bg-[#0A0A0A] hover:bg-[#d4af35]/5 hover:border-[#d4af35]/60 transition-all cursor-pointer shadow-inner group">
                                                <ImageIcon className="w-8 h-8 text-[#d4af35]/50 group-hover:text-[#d4af35] transition-colors mb-3" />
                                                <span className="text-sm font-bold text-white tracking-wide">Click to upload screenshot</span>
                                                <span className="text-[10px] text-[#d4af35]/60 uppercase tracking-widest mt-2 font-bold">Max file size: 5MB</span>
                                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                            </label>
                                        )}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full mt-6 bg-[#d4af35] text-[#0A0A0A] font-black uppercase tracking-widest text-sm py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,53,0.3)] hover:bg-[#f8d76d] hover:shadow-[0_4px_25px_rgba(212,175,53,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <><UploadCloud className="w-5 h-5" /> Submit Deposit For Review</>
                                        )}
                                    </motion.button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Deposit History */}
                    <div>
                        <h2 className="text-2xl font-black text-white flex items-center gap-2 mb-8 tracking-tight">
                            Recent Deposits
                        </h2>

                        {!depositsData ? (
                            <div className="animate-pulse space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-[#0A0A0A] rounded-2xl border border-[#d4af35]/10" />)}
                            </div>
                        ) : depositsData.deposits?.length === 0 ? (
                            <div className="text-center py-12 bg-[#0A0A0A] rounded-3xl border border-[#d4af35]/20 text-white/50 font-bold tracking-wide shadow-inner">
                                No deposits found.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {depositsData.deposits.map(dep => (
                                    <div key={dep._id} className="bg-[#0A0A0A] rounded-2xl p-5 border border-[#d4af35]/20 shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex items-center justify-between group hover:border-[#d4af35]/50 transition-all hover:bg-[#d4af35]/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#d4af35]/10 flex items-center justify-center border border-[#d4af35]/20 shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                                                {dep.paymentMethod === 'usdt' ? (
                                                    <Coins className="w-6 h-6 text-[#d4af35]" />
                                                ) : (
                                                    <IndianRupee className="w-6 h-6 text-[#d4af35]" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-xl font-black text-white leading-tight tracking-tight shadow-sm">
                                                    {dep.paymentMethod === 'usdt' ? '$' : '₹'}{dep.amount.toLocaleString(dep.paymentMethod === 'usdt' ? 'en-US' : 'en-IN')}
                                                </div>
                                                <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">
                                                    {new Date(dep.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })} • {dep.paymentMethod === 'usdt' ? 'USDT (BEP20)' : 'Bank Transfer'}
                                                </div>
                                                <div className="mt-2 overflow-hidden flex gap-2 w-full max-w-full">
                                                    {dep.status === 'approved' && <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#32e512] bg-[#32e512]/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-[#32e512]/30"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>}
                                                    {dep.status === 'pending' && <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-amber-500/30">Pending</span>}
                                                    {dep.status === 'rejected' && (
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-red-500/30">
                                                            <AlertCircle className="w-3.5 h-3.5" /> Rejected
                                                        </span>
                                                    )}
                                                </div>
                                                {dep.status === 'rejected' && dep.adminNote && (
                                                    <p className="text-red-500/80 text-xs font-bold mt-2 bg-red-500/5 px-3 py-1.5 rounded-lg border border-red-500/10 inline-block">Note: {dep.adminNote}</p>
                                                )}
                                            </div>
                                        </div>
                                        {dep.screenshotUrl && (
                                            <a href={dep.screenshotUrl} target="_blank" rel="noopener noreferrer" className="ml-4 shrink-0">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#d4af35]/30 bg-[#0A0A0A] grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100 shadow-inner group-hover:shadow-[0_0_15px_rgba(212,175,53,0.3)]">
                                                    <img src={dep.screenshotUrl} alt="Deposit receipt" className="w-full h-full object-cover" />
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
