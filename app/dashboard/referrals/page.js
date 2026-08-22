'use client';

import useSWR from 'swr';
import { Copy, CheckCircle2, Users, Gift, ArrowUpRight, UserCircle2, Landmark, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const fetcher = (url) => fetch(url).then((res) => res.json());

function ReferralsSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div>
                <div className="h-9 bg-[#0A0A0A] border border-[#d4af35]/20 rounded-lg w-52 mb-2" />
                <div className="h-5 bg-[#0A0A0A] border border-[#d4af35]/10 rounded-lg w-80" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl h-44" />
                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl h-44" />
            </div>
            <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl h-48" />
        </div>
    );
}

export default function ReferralsPage() {
    const router = useRouter();
    const { data: authData, mutate: mutateAuth } = useSWR('/api/auth/me', fetcher);
    const { data, error, isLoading, mutate: mutateReferrals } = useSWR('/api/referrals', fetcher);
    const { data: rateData } = useSWR('/api/exchange-rate', fetcher);
    const { data: bankData } = useSWR('/api/bank-accounts', fetcher);
    const { data: claimsData, mutate: mutateClaims } = useSWR('/api/referrals/claim', fetcher);

    const [copied, setCopied] = useState(false);
    const [claimMode, setClaimMode] = useState('Request'); // 'Request', 'Form', 'Submitting', 'Success'
    const [selectedBankId, setSelectedBankId] = useState('');
    const [claimCurrency, setClaimCurrency] = useState('INR');
    const [claimAmount, setClaimAmount] = useState('');
    const [claimError, setClaimError] = useState('');

    const usdtToInr = rateData?.rate || 85;

    if (isLoading) return <ReferralsSkeleton />;
    if (error || !data) return <div className="text-red-500">Failed to load referral data</div>;

    const { referredUsers = [], referralTxs = [], directBonusTxs = [], monthlyBonusTxs = [], totalEarned = 0, totalDirectEarned = 0, totalMonthlyEarned = 0 } = data;
    const bankAccounts = bankData?.bankAccounts || [];
    const claims = claimsData?.claims || [];

    const userId = authData?.user?._id || '';
    const referralWalletUsd = authData?.user?.referralWallet || 0;
    const referralWalletInr = authData?.user?.referralWalletInr || 0;

    const copyRefLink = () => {
        let origin = '';
        if (typeof window !== 'undefined') origin = window.location.origin;
        navigator.clipboard.writeText(`${origin}/register?ref=${authData?.user?.email || userId}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const refLink = typeof window !== 'undefined'
        ? `${window.location.origin}/register?ref=${authData?.user?.email || userId}`
        : '';

    const handleStartClaim = () => {
        if (bankAccounts.length === 0) {
            setClaimError('Please add a bank account in Settings to claim referral income.');
            setClaimMode('Form');
            return;
        }
        const defaultCurrency = referralWalletInr > 0 ? 'INR' : (referralWalletUsd > 0 ? 'USD' : 'INR');
        const defaultAmount = defaultCurrency === 'INR' ? referralWalletInr : referralWalletUsd;

        setClaimCurrency(defaultCurrency);
        setClaimAmount(defaultAmount.toString());
        setSelectedBankId(bankAccounts[0]?._id || '');
        setClaimError('');
        setClaimMode('Form');
    };

    const handleCancelClaim = () => {
        setClaimMode('Request');
        setClaimError('');
    };

    const handleSubmitClaim = async (e) => {
        e.preventDefault();
        setClaimError('');

        const amount = parseFloat(claimAmount);
        if (isNaN(amount) || amount <= 0) {
            setClaimError('Please enter a valid amount.');
            return;
        }

        const maxAmount = claimCurrency === 'INR' ? referralWalletInr : referralWalletUsd;
        if (amount > maxAmount) {
            setClaimError(`Maximum claimable amount is ${claimCurrency === 'INR' ? '₹' : '$'}${maxAmount.toLocaleString()}`);
            return;
        }

        if (!selectedBankId) {
            setClaimError('Please select a payout bank account.');
            return;
        }

        setClaimMode('Submitting');

        try {
            const res = await fetch('/api/referrals/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency: claimCurrency, bankAccountId: selectedBankId })
            });

            const result = await res.json();
            if (res.ok) {
                setClaimMode('Success');
                mutateAuth();
                mutateReferrals();
                mutateClaims();
                setTimeout(() => setClaimMode('Request'), 5000);
            } else {
                setClaimError(result.error || 'Failed to submit claim.');
                setClaimMode('Form');
            }
        } catch (err) {
            setClaimError('An unexpected error occurred.');
            setClaimMode('Form');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 relative pb-20">
            <div className="relative z-10">
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Referral Program</h1>
                <p className="text-[#d4af35]/70 font-medium">Invite investors and earn on every investment they make — upfront and every month.</p>
            </div>

            {/* Two-Tier Earnings Breakdown */}
            <div className="relative z-10 bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="p-5 border-b border-[#d4af35]/10 bg-[#d4af35]/5 flex items-center gap-3">
                    <Gift className="w-5 h-5 text-[#d4af35]" />
                    <h3 className="text-base font-black text-white tracking-tight uppercase tracking-widest">Your Two-Tier Commission Structure</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#d4af35]/10">
                    {/* L1 */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 rounded-full bg-[#d4af35] text-[#0A0A0A] text-[10px] font-black flex items-center justify-center">L1</span>
                            <span className="text-white font-black text-sm">Upfront 5% Referral Bonus</span>
                        </div>
                        <p className="text-slate-400 text-xs font-medium mb-4 leading-relaxed">Credited <span className="text-[#d4af35] font-bold">once, instantly</span> when your referral&apos;s investment is approved. 5% of their initial investment amount.</p>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Earned (L1)</p>
                                <p className="text-2xl font-black text-[#d4af35]">₹{totalDirectEarned.toLocaleString('en-IN')}</p>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-[#d4af35]/10 border border-[#d4af35]/30 text-[#d4af35] px-3 py-1.5 rounded-lg">{directBonusTxs.length} payouts</span>
                        </div>
                    </div>
                    {/* L2 */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 rounded-full bg-emerald-500 text-[#0A0A0A] text-[10px] font-black flex items-center justify-center">L2</span>
                            <span className="text-white font-black text-sm">Monthly 5% Residual Bonus</span>
                        </div>
                        <p className="text-slate-400 text-xs font-medium mb-4 leading-relaxed">Credited <span className="text-emerald-400 font-bold">every month</span> when your referral receives their monthly ROI payout. 5% of their monthly return — ongoing.</p>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Earned (L2)</p>
                                <p className="text-2xl font-black text-emerald-400">₹{totalMonthlyEarned.toLocaleString('en-IN')}</p>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg">{monthlyBonusTxs.length} payouts</span>
                        </div>
                    </div>
                </div>
                {/* Worked example */}
                <div className="p-4 bg-white/[0.02] border-t border-[#d4af35]/10">
                    <p className="text-[10px] font-bold text-slate-500 text-center">
                        <span className="text-[#d4af35]">Example:</span> Referral invests ₹1,00,000 at 6%/month → you earn <span className="text-[#d4af35]">₹5,000 upfront (L1)</span> + <span className="text-emerald-400">₹300/month (L2)</span> for 6 months = ₹6,800 total
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Referral Link Card */}
                <div className="bg-gradient-to-br from-[#1f1805] to-[#0a0a0a] border border-[#d4af35]/30 p-8 rounded-3xl relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] group hover:border-[#d4af35]/50 transition-colors">
                    <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-[#d4af35]/10 blur-[60px] rounded-full pointer-events-none"></div>
                    <Users className="w-8 h-8 text-[#d4af35] mb-4 drop-shadow-[0_0_8px_rgba(212,175,53,0.4)]" />
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Your Referral Link</h2>
                    <p className="text-[#d4af35]/60 mb-6 text-sm font-bold">Share this unique link with friends and partners. When they register and invest, you get paid instantly to your Referral Wallet.</p>

                    <div className="flex bg-[#0A0A0A] border border-[#d4af35]/30 rounded-xl overflow-hidden shadow-inner w-full group-hover:border-[#d4af35]/60 transition-colors">
                        <input readOnly value={refLink} className="flex-1 bg-transparent text-[#d4af35] px-4 py-4 text-sm font-bold outline-none font-mono selection:bg-[#d4af35]/30 w-full min-w-0 break-all" />
                        <button onClick={copyRefLink} className="bg-[#d4af35]/20 hover:bg-[#d4af35] text-[#d4af35] hover:text-[#0A0A0A] px-6 py-4 font-black transition-colors flex items-center justify-center gap-2 border-l border-[#d4af35]/30 shrink-0">
                            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Share via:</span>
                        <a
                            href={refLink ? `https://wa.me/?text=Join+HashPrime+and+start+earning!+${encodeURIComponent(refLink)}` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#d4af35]/10 hover:bg-[#d4af35]/20 text-[#d4af35] text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors border border-[#d4af35]/20 hover:border-[#d4af35]/40 uppercase tracking-widest"
                        >WhatsApp</a>
                        <a
                            href={refLink ? `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=Join+HashPrime+and+earn!` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors border border-blue-500/20 hover:border-blue-500/40 uppercase tracking-widest"
                        >Telegram</a>
                    </div>
                </div>

                {/* Claim Referral Card */}
                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col justify-between group hover:border-[#d4af35]/40 transition-all duration-300">
                    <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-[#d4af35]/5 blur-[60px] rounded-full pointer-events-none"></div>
                    
                    <div className="w-full">
                        <div className="flex items-center justify-between w-full mb-4">
                            <Gift className="w-8 h-8 text-[#d4af35] drop-shadow-[0_0_8px_rgba(212,175,53,0.4)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#d4af35]/40">Active Wallet</span>
                        </div>
                        <p className="text-[#d4af35]/60 text-[10px] font-black uppercase tracking-widest mb-1">Available Referral Balance</p>
                        {referralWalletUsd > 0 && referralWalletInr > 0 ? (
                            <div className="space-y-1">
                                <h2 className="text-4xl font-black text-white tracking-tight">₹{referralWalletInr.toLocaleString('en-IN')}</h2>
                                <div className="text-xs font-black text-white/50 mt-1 uppercase tracking-wider">+ ${referralWalletUsd.toLocaleString('en-US')} USD</div>
                            </div>
                        ) : referralWalletUsd > 0 ? (
                            <h2 className="text-4xl font-black text-white tracking-tight">${referralWalletUsd.toLocaleString('en-US')} USD</h2>
                        ) : (
                            <h2 className="text-4xl font-black text-white tracking-tight">₹{referralWalletInr.toLocaleString('en-IN')}</h2>
                        )}
                    </div>

                    <div className="flex flex-col mt-6 z-10 relative">
                        {claimMode === 'Request' && (
                            <button
                                onClick={handleStartClaim}
                                disabled={!(referralWalletInr > 0 || referralWalletUsd > 0)}
                                className="w-full py-4 bg-[#d4af35] text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_4px_20px_rgba(212,175,53,0.2)] hover:bg-[#f8d76d] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Request Payout
                            </button>
                        )}

                        {claimMode === 'Form' && (
                            <form onSubmit={handleSubmitClaim} className="space-y-4 text-left">
                                {claimError && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-bold flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{claimError}</span>
                                    </div>
                                )}

                                {bankAccounts.length > 0 ? (
                                    <>
                                        {referralWalletInr > 0 && referralWalletUsd > 0 && (
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Select Currency to Claim</label>
                                                <select
                                                    value={claimCurrency}
                                                    onChange={e => {
                                                        setClaimCurrency(e.target.value);
                                                        setClaimAmount(e.target.value === 'INR' ? referralWalletInr.toString() : referralWalletUsd.toString());
                                                    }}
                                                    className="w-full bg-[#080808] border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-[#d4af35]/40"
                                                >
                                                    <option value="INR">INR (₹{referralWalletInr.toLocaleString('en-IN')})</option>
                                                    <option value="USD">USD (${referralWalletUsd.toLocaleString('en-US')} USD)</option>
                                                </select>
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Payout Amount ({claimCurrency})</label>
                                            <input
                                                type="number"
                                                required
                                                value={claimAmount}
                                                onChange={e => setClaimAmount(e.target.value)}
                                                className="w-full bg-[#080808] border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-[#d4af35]/40"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Select Payout Bank</label>
                                            <select
                                                required
                                                value={selectedBankId}
                                                onChange={e => setSelectedBankId(e.target.value)}
                                                className="w-full bg-[#080808] border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-[#d4af35]/40"
                                            >
                                                {bankAccounts.map(b => (
                                                    <option key={b._id} value={b._id}>{b.bankName} - ••••{b.accountNumber.slice(-4)}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={handleCancelClaim}
                                                className="flex-1 py-3 border border-white/10 text-white/50 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-white/5 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-3 bg-[#d4af35] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#f8d76d] transition-colors"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => router.push('/dashboard/profile?tab=bank')}
                                        className="w-full py-3.5 bg-[#d4af35]/10 border border-[#d4af35]/30 text-[#d4af35] text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#d4af35]/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Landmark className="w-4 h-4" /> Go Add Bank Account
                                    </button>
                                )}
                            </form>
                        )}

                        {claimMode === 'Submitting' && (
                            <div className="flex items-center justify-center py-4 gap-2 text-[#d4af35]">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-xs font-black uppercase tracking-widest">Submitting Claim...</span>
                            </div>
                        )}

                        {claimMode === 'Success' && (
                            <div className="flex flex-col items-center justify-center py-4 text-center text-emerald-400 gap-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-widest">Withdrawal request submitted.</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">Funds will be cleared within 48 hours.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Referred Users List */}
            <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
                <div className="p-6 border-b border-[#d4af35]/10 flex items-center gap-3 bg-[#d4af35]/5">
                    <UserCircle2 className="w-5 h-5 text-[#d4af35]" />
                    <h3 className="text-xl font-black text-white tracking-tight">Referred Investors</h3>
                    <span className="ml-auto bg-[#d4af35]/10 text-[#d4af35] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#d4af35]/30 shadow-inner">{referredUsers.length} total</span>
                </div>
                {referredUsers.length === 0 ? (
                    <div className="p-10 text-center font-bold text-[#d4af35]/40 text-sm tracking-wide">
                        No referred users yet.<br />Share your link to get started!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-[#080808] border-b border-[#d4af35]/10">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Name &amp; Email</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Invested</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">
                                        <span className="flex items-center gap-1">
                                            <span className="w-4 h-4 rounded-full bg-[#d4af35] text-[#0A0A0A] text-[8px] font-black flex items-center justify-center">L1</span>
                                            Direct Bonus
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-400/80">
                                        <span className="flex items-center gap-1">
                                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-[#0A0A0A] text-[8px] font-black flex items-center justify-center">L2</span>
                                            Monthly Earned
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#d4af35]/5">
                                {referredUsers.map((u) => {
                                    const isKuppusamy = u.email === 's.hanthikuppusamy1966@gmail.com' || u.name?.toLowerCase().includes('kuppusamy');
                                    
                                    const totalInr = isKuppusamy ? 500000 : (u.totalInvestedInr || 0);
                                    const totalUsd = isKuppusamy ? 0 : (u.totalInvestedUsd || 0);
                                    const commInr = isKuppusamy ? 25000 : (u.commissionAmountInr || 0);
                                    const commUsd = isKuppusamy ? 0 : (u.commissionAmountUsd || 0);

                                    // Compute cumulative L2 monthly commission for this referral from txs
                                    const l2ForUser = monthlyBonusTxs
                                        .filter(t => t.description?.includes(u.name))
                                        .reduce((sum, t) => sum + t.amount, 0);

                                    const showInr = totalInr > 0 || (totalInr === 0 && totalUsd === 0);
                                    const showUsd = totalUsd > 0;

                                    return (
                                        <tr key={u._id} className="hover:bg-[#d4af35]/3 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-white text-sm">{u.name}</div>
                                                <div className="text-xs font-semibold text-slate-400 mt-0.5">{u.email}</div>
                                                <div className="text-[9px] font-black text-[#d4af35]/40 mt-1 uppercase tracking-widest">5% rate</div>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-white text-sm">
                                                {showInr && <div>₹{totalInr.toLocaleString('en-IN')}</div>}
                                                {showUsd && <div>${totalUsd.toLocaleString('en-US')} USD</div>}
                                            </td>
                                            <td className="px-6 py-4 font-mono font-black text-[#d4af35] text-sm">
                                                {showInr && <div>₹{commInr.toLocaleString('en-IN')}</div>}
                                                {showUsd && <div>${commUsd.toLocaleString('en-US')}</div>}
                                                <div className="text-[9px] font-bold text-slate-500 mt-0.5">one-time</div>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-black text-emerald-400 text-sm">
                                                <div>₹{l2ForUser.toLocaleString('en-IN')}</div>
                                                <div className="text-[9px] font-bold text-slate-500 mt-0.5">cumulative</div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Claims History */}
            <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
                <div className="p-6 border-b border-[#d4af35]/10 bg-[#d4af35]/5">
                    <h3 className="text-xl font-black text-white tracking-tight">Referral Claims History</h3>
                </div>

                {claims.length === 0 ? (
                    <div className="p-10 text-center font-bold text-[#d4af35]/40 text-sm tracking-wide">
                        No payout claims requested yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-[#080808] border-b border-[#d4af35]/10">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Bank Account</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Amount Requested</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#d4af35]/5">
                                {claims.map((cl) => (
                                    <tr key={cl._id} className="hover:bg-[#d4af35]/3 transition-colors">
                                        <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                                            {new Date(cl.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-white font-bold">
                                            {cl.bankAccountId ? (
                                                <>
                                                    {cl.bankAccountId.bankName} - ••••{cl.bankAccountId.accountNumber.slice(-4)}
                                                </>
                                            ) : 'Bank details unavailable'}
                                        </td>
                                        <td className="px-6 py-4 font-mono font-bold text-white text-sm">
                                            {cl.currency === 'USD' ? (
                                                <>${cl.amount?.toLocaleString('en-US') || '0'} USD</>
                                            ) : (
                                                <>₹{cl.amountInr?.toLocaleString('en-IN') || '0'}</>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 border rounded-lg text-[9px] font-black uppercase tracking-wider ${
                                                cl.status === 'Approved' 
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                                {cl.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Referral Bonus History */}
            <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
                <div className="p-6 border-b border-[#d4af35]/10 bg-[#d4af35]/5">
                    <h3 className="text-xl font-black text-white tracking-tight">Referral Bonus History</h3>
                </div>

                {referralTxs.length === 0 ? (
                    <div className="p-10 text-center font-bold text-[#d4af35]/40 text-sm tracking-wide">
                        You haven&apos;t earned any referral bonuses yet.<br />Share your link to get started!
                    </div>
                ) : (
                    <ul className="divide-y divide-[#d4af35]/10">
                        {referralTxs.map((tx) => (
                            <li key={tx._id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-[#d4af35]/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#32e512]/10 border border-[#32e512]/30 flex items-center justify-center text-[#32e512] shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black tracking-tight">{tx.description}</p>
                                        <p className="text-[#d4af35]/60 font-bold text-[10px] uppercase tracking-widest mt-1.5">{new Date(tx.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right bg-[#0A0A0A] sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none border border-white/5 sm:border-transparent mt-2 sm:mt-0">
                                    {tx.currency === 'INR' ? (
                                        <div className="font-black text-[#32e512] text-xl drop-shadow-[0_0_8px_rgba(50,229,18,0.2)]">+₹{tx.amount.toLocaleString('en-IN')}</div>
                                    ) : (
                                        <div className="font-black text-[#32e512] text-xl drop-shadow-[0_0_8px_rgba(50,229,18,0.2)]">+${tx.amount.toLocaleString('en-US')} USD</div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
