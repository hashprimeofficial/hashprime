'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { ArrowUpRight, Copy, Loader2, CheckCircle2, History, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function WithdrawPage() {
    const router = useRouter();
    const { data: userData, isLoading: isUserLoading, mutate: mutateUser } = useSWR('/api/user/profile', fetcher);
    const { data: withdrawData, error: withdrawError, isLoading: isWithdrawLoading, mutate: mutateWithdraws } = useSWR('/api/withdraw', fetcher);

    const [amount, setAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const user = userData?.user || {};
    const withdrawals = withdrawData?.withdrawals || [];
    const availableBalance = user.usdtBalance || 0;

    const handleMaxClick = () => {
        setAmount(availableBalance.toString());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount < 10) {
            setMessage({ type: 'error', text: 'Minimum withdrawal amount is 10 USDT' });
            return;
        }

        if (numAmount > availableBalance) {
            setMessage({ type: 'error', text: 'Insufficient USDT Balance' });
            return;
        }

        if (!walletAddress.trim()) {
            setMessage({ type: 'error', text: 'Please enter a valid BEP20 wallet address' });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: numAmount, walletAddress: walletAddress.trim() })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Withdrawal request submitted successfully! Your funds are placed in escrow pending admin approval.' });
                setAmount('');
                setWalletAddress('');
                mutateUser(); // Refresh balance
                mutateWithdraws(); // Refresh history
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to submit withdrawal' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again later.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Address copied to clipboard');
    };

    if (isUserLoading || isWithdrawLoading) return <div className="text-slate-400 animate-pulse font-medium">Loading withdrawal system...</div>;

    return (
        <div className="space-y-8">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">Withdraw Funds</h1>
                    <p className="text-slate-500 font-medium">Withdraw your trading profits to your external USDT (BEP20) wallet.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Col: Request Form */}
                <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm h-fit">
                    <h2 className="text-xl font-black text-navy mb-6 flex items-center gap-2">
                        <ArrowUpRight className="w-5 h-5 text-neon" />
                        New Withdrawal Request
                    </h2>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl mb-6">
                        <div className="text-sm font-medium text-slate-500 mb-1">Available to Withdraw</div>
                        <div className="text-3xl font-black text-navy">{availableBalance.toFixed(2)} <span className="text-lg text-slate-400">USDT</span></div>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-xl mb-6 text-sm flex gap-3 items-start ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                            {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                            <span className="font-medium pt-0.5">{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-navy flex justify-between items-center">
                                Amount (USDT)
                                <button type="button" onClick={handleMaxClick} className="text-xs text-neon hover:text-green-500 font-bold uppercase tracking-wider transition-colors">Max Amount</button>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    min="10"
                                    step="0.01"
                                    placeholder="Minimum 10.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all font-bold text-navy"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-navy flex justify-between items-center">
                                USDT Receiving Address
                                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">BEP20 Network Only</span>
                            </label>
                            <input
                                type="text"
                                placeholder="0x..."
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all font-medium text-navy font-mono text-sm"
                            />
                            <p className="text-xs font-medium text-slate-500 mt-2 flex items-start gap-1.5">
                                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                                Please double-check your address. Withdrawing to an incorrect address or non-BEP20 network will result in permanent loss of funds.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || availableBalance <= 0}
                            className="w-full bg-navy hover:bg-black text-white font-black py-4 rounded-xl shadow-lg shadow-navy/20 transition-all flex justify-center items-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Request'}
                        </button>
                    </form>
                </div>

                {/* Right Col: History */}
                <div>
                    <h2 className="text-xl font-black text-navy mb-6 flex items-center gap-2">
                        <History className="w-5 h-5 text-slate-400" />
                        Withdrawal History
                    </h2>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        {withdrawals.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 font-medium bg-slate-50 flex flex-col items-center justify-center min-h-[300px]">
                                <ArrowUpRight className="w-10 h-10 text-slate-300 mb-3" />
                                No withdrawals requested yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Address</th>
                                            <th className="px-6 py-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {withdrawals.map((withdraw) => (
                                            <tr key={withdraw._id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4 font-black text-navy">
                                                    {withdraw.amount.toFixed(2)} <span className="text-xs font-medium text-slate-400">USDT</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-black shadow-sm ${withdraw.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                            withdraw.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {withdraw.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-mono text-slate-500 truncate max-w-[120px]" title={withdraw.walletAddress}>
                                                            {withdraw.walletAddress.substring(0, 6)}...{withdraw.walletAddress.substring(withdraw.walletAddress.length - 4)}
                                                        </span>
                                                        <button
                                                            onClick={() => copyToClipboard(withdraw.walletAddress)}
                                                            className="text-slate-300 hover:text-navy transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                                    {new Date(withdraw.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
