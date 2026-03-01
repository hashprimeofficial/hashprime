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
                body: JSON.stringify({ amount, paymentMethod, screenshotBase64 })
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
            <Loader2 className="w-8 h-8 animate-spin text-neon" />
        </div>
    );

    const user = profileData.user;
    const isKycApproved = user?.kycStatus === 'approved';

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">Deposit Funds</h1>
                <p className="text-slate-500 font-medium">Add funds to your wallet to start investing.</p>
            </div>

            {!isKycApproved ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-amber-800 font-bold text-lg mb-1">KYC Verification Required</h3>
                        <p className="text-amber-700 text-sm mb-3">
                            You must complete your KYC verification before depositing funds or making investments.
                        </p>
                        <Link href="/dashboard/profile" className="inline-flex bg-amber-600 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                            Complete KYC Now
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Deposit Form */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon/10 rounded-full blur-2xl" />
                        <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-6 relative z-10">
                            <Wallet className="w-5 h-5 text-blue-500" /> New Deposit Request
                        </h2>

                        {message.text && (
                            <div className={`p-4 rounded-xl font-medium text-sm mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            <div>
                                <label className="block text-sm font-bold text-navy mb-1.5">
                                    {paymentMethod === 'usdt' ? 'Amount (USD)' : 'Amount (INR)'}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-base">
                                        {paymentMethod === 'usdt' ? '$' : '₹'}
                                    </div>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-3 text-navy font-bold text-lg focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all"
                                        placeholder={paymentMethod === 'usdt' ? '0.00 USD' : '0.00 INR'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-navy mb-1.5">Payment Method</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all"
                                >
                                    <option value="usdt">USDC (BEP20) — Pay in USD</option>
                                    <option value="bank">Bank Transfer (IMPS/NEFT) — Pay in INR</option>
                                </select>
                            </div>

                            {/* Payment Instructions */}
                            <div className="my-4">
                                {paymentMethod === 'usdt' && (
                                    <>
                                        {/* QR Lightbox */}
                                        {qrExpanded && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
                                                onClick={() => setQrExpanded(false)}>
                                                <div className="bg-white p-5 rounded-3xl shadow-2xl" onClick={e => e.stopPropagation()}>
                                                    <Image src="/qr.jpeg" alt="USDC BEP20 QR" width={280} height={280} className="rounded-2xl" />
                                                    <p className="text-center text-xs font-bold text-slate-400 mt-3">USDC BEP20 Wallet QR</p>
                                                    <button onClick={() => setQrExpanded(false)}
                                                        className="mt-3 w-full text-xs font-black text-slate-400 hover:text-slate-700 transition-colors py-2">✕ Close</button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-[#0B1120] border border-[#39FF14]/20 rounded-2xl overflow-hidden"
                                            style={{ boxShadow: '0 0 40px rgba(57,255,20,0.04)' }}>
                                            {/* Header */}
                                            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-black text-[#39FF14] uppercase tracking-widest">USDC · BEP20</p>
                                                    <p className="text-slate-500 text-xs font-medium mt-0.5">Binance Smart Chain network</p>
                                                </div>
                                                <span className="text-xs font-black px-2.5 py-1 rounded-full"
                                                    style={{ background: 'rgba(57,255,20,0.1)', color: '#39FF14', border: '1px solid rgba(57,255,20,0.2)' }}>BSC</span>
                                            </div>

                                            {/* QR Code — centered, large */}
                                            <div className="flex flex-col items-center py-7 gap-2">
                                                <div className="relative group cursor-pointer" onClick={() => setQrMenu(v => !v)}>
                                                    <div className="bg-white p-3 rounded-2xl" style={{ boxShadow: '0 0 30px rgba(57,255,20,0.12)' }}>
                                                        <Image src="/qr.jpeg" alt="USDC BEP20 QR Code" width={200} height={200} className="rounded-xl" />
                                                    </div>
                                                    {/* Hover hint */}
                                                    <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center">
                                                        <span className="opacity-0 group-hover:opacity-100 transition-all text-white text-xs font-black bg-black/60 px-3 py-1.5 rounded-full">Tap for options</span>
                                                    </div>
                                                    {/* Context menu */}
                                                    {qrMenu && (
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 bg-[#0F1929] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[160px]"
                                                            onClick={e => e.stopPropagation()}>
                                                            <button onClick={() => { setQrExpanded(true); setQrMenu(false); }}
                                                                className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all text-left border-b border-white/[0.06]">
                                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>
                                                                Expand / View
                                                            </button>
                                                            <a href="/qr.jpeg" download="HashPrime-USDC-BEP20-QR.jpeg"
                                                                onClick={() => setQrMenu(false)}
                                                                className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                                Save to Device
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-slate-500 text-xs font-medium">Tap QR to expand or save</p>
                                            </div>

                                            {/* Address + copy */}
                                            <div className="px-6 pb-6 space-y-3">
                                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Wallet Address</p>
                                                <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3">
                                                    <code className="text-[#39FF14] font-mono text-sm font-bold break-all leading-relaxed">
                                                        0xc95ee77d785bb7c8b8777750e034a824594dd615
                                                    </code>
                                                </div>
                                                <button type="button" onClick={copyAddress}
                                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all"
                                                    style={{
                                                        background: copied ? '#39FF14' : 'rgba(57,255,20,0.08)',
                                                        color: copied ? '#0B1120' : '#39FF14',
                                                        border: '1px solid rgba(57,255,20,0.25)',
                                                    }}>
                                                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Wallet Address</>}
                                                </button>
                                                <p className="text-red-400 text-xs font-bold text-center pt-1">
                                                    ⚠ BEP20 only — wrong network = permanent loss
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {paymentMethod === 'bank' && (
                                    <div className="bg-[#0B1120] border border-[#39FF14]/20 rounded-2xl p-5">
                                        <p className="text-xs font-black text-[#39FF14] uppercase tracking-widest mb-4">Bank Transfer Details</p>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Account Name', value: 'VG ENTERPRISES' },
                                                { label: 'Account Number', value: '005702000000626' },
                                                { label: 'IFS Code', value: 'IOBA0000057' },
                                                { label: 'MICR Code', value: '611020012' },
                                                { label: 'Bank', value: 'Indian Overseas Bank' },
                                            ].map(({ label, value }) => (
                                                <div key={label} className="flex justify-between items-center py-2 border-b border-white/[0.06] last:border-0">
                                                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</span>
                                                    <span className="text-white font-black text-sm tracking-widest">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {paymentMethod === 'cash' && (
                                    <div className="bg-[#0B1120] border border-[#39FF14]/20 rounded-2xl p-5">
                                        <p className="text-xs font-black text-[#39FF14] uppercase tracking-widest mb-2">Cash Drop-off</p>
                                        <p className="text-slate-400 text-sm">Visit our office to submit cash. Upload the receipt photo below after payment.</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-navy mb-1.5">Payment Screenshot / Receipt</label>

                                {previewUrl ? (
                                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mb-3 group h-40">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                        <button type="button" onClick={() => { setPreviewUrl(''); setScreenshotBase64(''); setScreenshotFile(null); }} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm">
                                            Change Image
                                        </button>
                                    </div>
                                ) : (
                                    <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-[#39FF14]/5 hover:border-[#39FF14]/40 transition-all cursor-pointer">
                                        <ImageIcon className="w-8 h-8 text-slate-400 mb-3" />
                                        <span className="text-sm font-bold text-slate-600">Click to upload screenshot</span>
                                        <span className="text-xs text-slate-400 mt-1">Image must be &lt; 5MB</span>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                )}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-neon text-navy font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-neon/20 hover:shadow-neon/40 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <><UploadCloud className="w-5 h-5" /> Submit Deposit For Review</>
                                )}
                            </motion.button>
                        </form>
                    </div>

                    {/* Deposit History */}
                    <div>
                        <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-6">
                            Recent Deposits
                        </h2>

                        {!depositsData ? (
                            <div className="animate-pulse space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl border border-slate-200" />)}
                            </div>
                        ) : depositsData.deposits?.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 font-medium">
                                No deposits found.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {depositsData.deposits.map(dep => (
                                    <div key={dep._id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-neon/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                                                {dep.paymentMethod === 'usdt' ? (
                                                    <Coins className="w-6 h-6 text-blue-500" />
                                                ) : (
                                                    <IndianRupee className="w-6 h-6 text-slate-400" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-lg font-black text-navy leading-tight">
                                                    {dep.paymentMethod === 'usdt' ? '$' : '₹'}{dep.amount.toLocaleString(dep.paymentMethod === 'usdt' ? 'en-US' : 'en-IN')}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                                    {new Date(dep.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })} • {dep.paymentMethod === 'usdt' ? 'USDC (BEP20)' : 'Bank Transfer'}
                                                </div>
                                                <div className="mt-1.5 overflow-hidden">
                                                    {dep.status === 'approved' && <span className="inline-flex items-center gap-1 text-[10px] font-black text-green-700 bg-green-50 px-2 py-0.5 rounded uppercase tracking-tighter border border-green-100"><CheckCircle2 className="w-3 h-3" /> Approved</span>}
                                                    {dep.status === 'pending' && <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-tighter border border-amber-100">Pending</span>}
                                                    {dep.status === 'rejected' && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-700 bg-red-50 px-2 py-0.5 rounded uppercase tracking-tighter border border-red-100">
                                                            <AlertCircle className="w-3 h-3" /> Rejected
                                                        </span>
                                                    )}
                                                    {dep.status === 'rejected' && dep.adminNote && (
                                                        <p className="text-red-600 text-sm mt-1">Reason: {dep.adminNote}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {dep.screenshotUrl && (
                                            <a href={dep.screenshotUrl} target="_blank" rel="noopener noreferrer" className="ml-4 shrink-0">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100">
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
