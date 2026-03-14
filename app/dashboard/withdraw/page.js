'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowUpRight, Loader2, CheckCircle2, History, AlertCircle,
    DollarSign, IndianRupee, Gift, Landmark, ExternalLink, Copy, X
} from 'lucide-react';

const fetcher = (url) => fetch(url).then(r => r.json());

// ── Helpers ────────────────────────────────────────────────────────────
const WALLET_META = {
    USD: { label: 'USD Wallet', symbol: '$', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10', icon: DollarSign },
    INR: { label: 'INR Wallet', symbol: '₹', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', icon: IndianRupee },
    Referral: { label: 'Referral Wallet', symbol: '$', color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/10', icon: Gift },
};

const STATUS_PILL = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

// ── Saved Bank Card ────────────────────────────────────────────────────
function BankCard({ account, selected, onClick }) {
    return (
        <button type="button" onClick={onClick}
            className={`w-full text-left p-4 rounded-2xl border transition-all ${selected ? 'border-[#d4af35] bg-[#d4af35]/5 shadow-[0_0_12px_rgba(212,175,53,0.1)]' : 'border-[#d4af35]/15 bg-[#080808] hover:border-[#d4af35]/30'}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-[#d4af35]/60" />
                    <span className="font-black text-white text-sm">{account.bankName}</span>
                </div>
                {selected && <CheckCircle2 className="w-4 h-4 text-[#d4af35]" />}
            </div>
            <div className="text-xs text-[#d4af35]/50 space-y-0.5">
                <div><span className="text-white/40">Holder: </span><span className="text-white font-bold">{account.accountHolderName}</span></div>
                <div><span className="text-white/40">Account: </span><span className="font-mono text-white/70">••••{account.accountNumber.slice(-4)}</span> · {account.accountType}</div>
                <div><span className="text-white/40">IFSC: </span><span className="font-mono text-white/70">{account.ifsc}</span></div>
            </div>
        </button>
    );
}

// ── Main Page ───────────────────────────────────────────────────────────
export default function WithdrawPage() {
    const router = useRouter();
    const { data: userData, isLoading: isUserLoading, mutate: mutateUser } = useSWR('/api/auth/me', fetcher);
    const { data: withdrawData, isLoading: isWithdrawLoading, mutate: mutateWithdraws } = useSWR('/api/withdraw', fetcher);
    const { data: bankData, isLoading: isBankLoading } = useSWR('/api/bank-accounts', fetcher);

    const [sourceWallet, setSourceWallet] = useState('USD');
    const [amount, setAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [selectedBankId, setSelectedBankId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReferralWarning, setShowReferralWarning] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const user = userData?.user || {};
    const withdrawals = withdrawData?.withdrawals || [];
    const bankAccounts = bankData?.bankAccounts || [];

    const meta = WALLET_META[sourceWallet];
    const availableBalance = sourceWallet === 'USD' ? (user.usdWallet || 0)
        : sourceWallet === 'INR' ? (user.inrWallet || 0)
            : (user.referralWallet || 0);

    const selectedBank = bankAccounts.find(b => b._id === selectedBankId) || bankAccounts[0] || null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const num = parseFloat(amount);
        if (isNaN(num) || num <= 0) { setError('Please enter a valid amount.'); return; }
        if (num > availableBalance) { setError('Insufficient balance in selected wallet.'); return; }
        if (sourceWallet === 'INR' && !selectedBank) { router.push('/dashboard/bank'); return; }
        if ((sourceWallet === 'USD' || sourceWallet === 'Referral') && !walletAddress.trim()) {
            setError('Please enter your BEP20 wallet address.'); return;
        }
        if (sourceWallet === 'Referral') { setShowReferralWarning(true); return; }
        executeWithdrawal();
    };

    const executeWithdrawal = async () => {
        setShowReferralWarning(false);
        setIsSubmitting(true);
        setError('');
        try {
            const body = {
                amount: parseFloat(amount),
                sourceWallet,
                payoutMethod: sourceWallet === 'INR' ? 'Bank' : 'USDT',
                walletAddress: sourceWallet === 'INR'
                    ? `Bank: ${selectedBank.bankName} — ${selectedBank.accountNumber} (${selectedBank.accountHolderName})`
                    : walletAddress.trim(),
                bankAccountId: sourceWallet === 'INR' ? (selectedBankId || bankAccounts[0]?._id) : undefined,
            };
            const res = await fetch('/api/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setAmount('');
                setWalletAddress('');
                mutateUser();
                mutateWithdraws();
            } else {
                setError(data.error || 'Failed to submit withdrawal.');
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLoading = isUserLoading || isWithdrawLoading || isBankLoading;
    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af35]" />
            <p className="text-[#d4af35]/50 text-sm font-black uppercase tracking-widest">Loading…</p>
        </div>
    );

    return (
        <>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#d4af35]/10 rounded-xl border border-[#d4af35]/20 flex items-center justify-center">
                            <ArrowUpRight className="w-5 h-5 text-[#d4af35]" />
                        </div>
                        Withdraw Funds
                    </h1>
                    <p className="text-[#d4af35]/40 text-sm font-medium mt-1 ml-12">Withdraw to USDT (BEP20) or your saved bank account.</p>
                </div>

                {/* Success State */}
                <AnimatePresence>
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-[#080808] border border-emerald-500/30 rounded-3xl p-8 text-center space-y-4 shadow-[0_0_30px_rgba(52,211,153,0.07)]">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-black text-white">Withdrawal Request Submitted!</h2>
                            <p className="text-white/40 font-medium text-sm max-w-md mx-auto">
                                Your funds are now in escrow and will be processed within <span className="text-[#d4af35] font-black">48 hours</span>.
                                You'll receive confirmation once the admin approves the payout. No action needed from your side.
                            </p>
                            <button onClick={() => setSuccess(false)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[#d4af35]/20 text-[#d4af35] font-black text-sm hover:bg-[#d4af35]/10 transition-all">
                                Make Another Request
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!success && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* ── Left: Form ── */}
                        <div className="bg-[#080808] border border-[#d4af35]/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                            <h2 className="text-lg font-black text-white">New Withdrawal Request</h2>

                            {/* Wallet Selector */}
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(WALLET_META).map(([key, m]) => {
                                    const bal = key === 'USD' ? (user.usdWallet || 0) : key === 'INR' ? (user.inrWallet || 0) : (user.referralWallet || 0);
                                    const Icon = m.icon;
                                    return (
                                        <button key={key} type="button" onClick={() => { setSourceWallet(key); setError(''); setAmount(''); }}
                                            className={`p-3 rounded-2xl border text-left transition-all ${sourceWallet === key ? `${m.border} ${m.bg} shadow-inner` : 'border-[#d4af35]/10 hover:border-[#d4af35]/25'}`}>
                                            <Icon className={`w-4 h-4 mb-2 ${m.color}`} />
                                            <div className={`text-xs font-black ${m.color}`}>{key}</div>
                                            <div className="text-white font-black text-sm mt-0.5">{m.symbol}{bal.toLocaleString(key === 'INR' ? 'en-IN' : 'en-US', { maximumFractionDigits: 2 })}</div>
                                        </button>
                                    );
                                })}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Amount */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#d4af35]/60">Amount</label>
                                        <button type="button" onClick={() => setAmount(availableBalance.toString())}
                                            className="text-[10px] font-black text-[#d4af35]/50 hover:text-[#d4af35] uppercase tracking-widest transition-colors">
                                            MAX
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af35]/40 font-black">{meta.symbol}</span>
                                        <input type="number" min="10" step="0.01" placeholder="Minimum 10.00"
                                            value={amount} onChange={e => setAmount(e.target.value)} required
                                            className="w-full bg-[#040404] border border-[#d4af35]/15 rounded-xl pl-9 pr-4 py-3 text-white font-black focus:outline-none focus:border-[#d4af35]/40 transition-all" />
                                    </div>
                                </div>

                                {/* Payout Details */}
                                {(sourceWallet === 'USD' || sourceWallet === 'Referral') && (
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-[#d4af35]/60 mb-1.5 block">
                                            USDT Receiving Address <span className="normal-case font-normal text-white/20">(BEP20)</span>
                                        </label>
                                        <input type="text" placeholder="0x..." value={walletAddress}
                                            onChange={e => setWalletAddress(e.target.value)} required
                                            className="w-full bg-[#040404] border border-[#d4af35]/15 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#d4af35]/40 transition-all" />
                                        <p className="mt-1.5 text-[10px] text-amber-400/60 font-semibold flex items-center gap-1.5">
                                            <AlertCircle className="w-3 h-3 shrink-0" />
                                            Sending to wrong address or network will result in permanent loss.
                                        </p>
                                    </div>
                                )}

                                {sourceWallet === 'INR' && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#d4af35]/60">Payout Bank Account</label>
                                            <button type="button" onClick={() => router.push('/dashboard/bank')}
                                                className="text-[10px] font-black text-[#d4af35]/50 hover:text-[#d4af35] flex items-center gap-1 transition-colors">
                                                <ExternalLink className="w-3 h-3" /> Manage Banks
                                            </button>
                                        </div>
                                        {bankAccounts.length === 0 ? (
                                            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 text-center space-y-3">
                                                <AlertCircle className="w-8 h-8 text-amber-400/60 mx-auto" />
                                                <p className="text-sm font-bold text-amber-400">No bank account saved</p>
                                                <p className="text-xs text-white/30">You need to add a bank account before withdrawing INR.</p>
                                                <button type="button" onClick={() => router.push('/dashboard/bank')}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af35] text-black font-black text-xs rounded-xl hover:opacity-90 transition-all">
                                                    <ExternalLink className="w-3.5 h-3.5" /> Add Bank Account
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {bankAccounts.map(b => (
                                                    <BankCard key={b._id} account={b}
                                                        selected={(selectedBankId || bankAccounts[0]?._id) === b._id}
                                                        onClick={() => setSelectedBankId(b._id)} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Error */}
                                {error && (
                                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 text-sm text-red-400 font-medium">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
                                    </div>
                                )}

                                <button type="submit" disabled={isSubmitting || availableBalance <= 0 || (sourceWallet === 'INR' && bankAccounts.length === 0)}
                                    className="w-full py-4 bg-[#d4af35] text-black font-black rounded-2xl shadow-[0_0_20px_rgba(212,175,53,0.25)] hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm">
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowUpRight className="w-4 h-4" /> Submit Withdrawal Request</>}
                                </button>
                            </form>
                        </div>

                        {/* ── Right: History ── */}
                        <div>
                            <h2 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                                <History className="w-5 h-5 text-[#d4af35]/50" /> Withdrawal History
                            </h2>
                            <div className="bg-[#080808] border border-[#d4af35]/15 rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                                {withdrawals.length === 0 ? (
                                    <div className="p-12 text-center flex flex-col items-center gap-3">
                                        <div className="w-14 h-14 bg-[#d4af35]/10 rounded-2xl border border-[#d4af35]/15 flex items-center justify-center">
                                            <ArrowUpRight className="w-6 h-6 text-[#d4af35]/30" />
                                        </div>
                                        <p className="text-[#d4af35]/30 font-medium text-sm">No withdrawals yet.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[#d4af35]/5">
                                        {withdrawals.map(w => {
                                            const wm = WALLET_META[w.sourceWallet] || WALLET_META.USD;
                                            return (
                                                <div key={w._id} className="p-4 hover:bg-[#d4af35]/3 transition-colors">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <wm.icon className={`w-4 h-4 ${wm.color}`} />
                                                            <span className={`font-black text-base ${wm.color}`}>
                                                                {wm.symbol}{w.amount?.toFixed(2)}
                                                            </span>
                                                            <span className="text-[10px] font-black text-[#d4af35]/30 uppercase tracking-widest">{w.sourceWallet}</span>
                                                        </div>
                                                        <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${STATUS_PILL[w.status]}`}>
                                                            {w.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-[#d4af35]/30 font-medium truncate">{w.walletAddress}</div>
                                                    <div className="text-[10px] text-white/20 font-medium mt-0.5">{new Date(w.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Referral Warning Modal */}
            <AnimatePresence>
                {showReferralWarning && (
                    <>
                        <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setShowReferralWarning(false)} />
                        <motion.div key="modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="bg-[#080808] border border-amber-500/20 rounded-3xl w-full max-w-md overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-amber-500 to-[#d4af35]" />
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center">
                                                <AlertCircle className="w-5 h-5 text-amber-400" />
                                            </div>
                                            <h3 className="font-black text-white text-base">Referral Payout Notice</h3>
                                        </div>
                                        <button onClick={() => setShowReferralWarning(false)} className="text-white/20 hover:text-white transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-white/40 font-medium leading-relaxed">
                                        Referral payout withdrawals require <span className="text-amber-400 font-black">manual verification</span> and may take up to <span className="text-amber-400 font-black">48–72 hours</span> to process. This prevents gaming of the referral system.
                                    </p>
                                    <div className="flex gap-3 pt-2">
                                        <button onClick={() => setShowReferralWarning(false)}
                                            className="flex-1 py-3 border border-white/10 text-white/40 font-bold rounded-2xl hover:bg-white/5 transition-all text-sm">
                                            Cancel
                                        </button>
                                        <button onClick={executeWithdrawal} disabled={isSubmitting}
                                            className="flex-1 py-3 bg-[#d4af35] text-black font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Acknowledge & Submit</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
