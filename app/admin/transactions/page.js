'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, Gift, Coins, Filter, AlertCircle, RefreshCcw } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminTransactionsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/admin/transactions', fetcher);
    const [filterType, setFilterType] = useState('all');

    if (isLoading) return <div className="text-slate-400 animate-pulse font-medium">Loading protocol ledger...</div>;
    if (error) return <div className="text-red-500 font-bold">Failed to load ledger data</div>;

    const { transactions = [] } = data || {};

    const filteredTransactions = transactions.filter(tx => {
        if (filterType === 'all') return true;
        return tx.type === filterType;
    });

    const getIcon = (type, amount) => {
        if (type === 'deposit') return <ArrowDownRight className="w-4 h-4 text-green-500" />;
        if (type === 'withdrawal') return <ArrowUpRight className="w-4 h-4 text-red-500" />;
        if (type === 'investment') return amount < 0 ? <Coins className="w-4 h-4 text-blue-500" /> : <Coins className="w-4 h-4 text-green-500" />;
        if (type === 'referral_bonus') return <Gift className="w-4 h-4 text-purple-500" />;
        return <Activity className="w-4 h-4 text-slate-400" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-navy mb-2 tracking-tight flex items-center gap-3">
                        <Activity className="text-neon w-8 h-8" />
                        Global Ledger
                    </h1>
                    <p className="text-slate-500 font-medium">Immutable record of all protocol financial operations and movements.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                    <Filter className="w-4 h-4 text-slate-400 mx-2" />
                    <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'all' ? 'bg-white shadow-sm text-navy' : 'text-slate-500 hover:text-navy'}`}>All Activity</button>
                    <button onClick={() => setFilterType('deposit')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'deposit' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500 hover:text-navy'}`}>Deposits</button>
                    <button onClick={() => setFilterType('withdrawal')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'withdrawal' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-navy'}`}>Withdrawals</button>
                    <button onClick={() => setFilterType('investment')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'investment' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-navy'}`}>Investments</button>
                    <button onClick={() => setFilterType('referral_bonus')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'referral_bonus' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-navy'}`}>Referrals</button>
                    <button onClick={() => mutate()} className="ml-auto p-2 text-slate-400 hover:text-navy hover:bg-white rounded-lg transition-all" title="Refresh Ledger">
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto min-h-[50vh] max-h-[75vh]">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Financial Flow</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 min-w-[250px]">Description</th>
                                <th className="px-6 py-4">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTransactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-mono text-slate-400">
                                            {tx._id.substring(0, 8)}...
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-navy flex items-center gap-2">
                                            {tx.userId?.name || 'System / Unknown'}
                                        </div>
                                        <div className="text-xs font-medium text-slate-500">{tx.userId?.email || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                                                {getIcon(tx.type, tx.amount)}
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                                {tx.type.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`text-sm font-black flex items-center gap-1.5 ${tx.amount > 0 ? 'text-green-600' : 'text-slate-700'}`}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-black">{tx.currency}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-600 truncate max-w-[300px]" title={tx.description}>
                                            {tx.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                        <div className="font-bold text-slate-600">{new Date(tx.createdAt).toLocaleDateString()}</div>
                                        <div>{new Date(tx.createdAt).toLocaleTimeString()}</div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50 flex flex-col items-center justify-center">
                                        <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
                                        No transactions match the current filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
