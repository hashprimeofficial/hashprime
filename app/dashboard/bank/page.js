'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Building2, Plus, Landmark, Loader2, CheckCircle2 } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function BankAccountsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/bank-accounts', fetcher);

    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        accountHolderName: '', accountNumber: '', confirmAccountNumber: '', ifsc: '', bankName: '', branch: '', accountType: 'Savings'
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (formData.accountNumber !== formData.confirmAccountNumber) {
            setMessage('Account numbers do not match');
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/bank-accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                mutate();
                setIsAdding(false);
                setFormData({ accountHolderName: '', accountNumber: '', confirmAccountNumber: '', ifsc: '', bankName: '', branch: '', accountType: 'Savings' });
            } else {
                const result = await res.json();
                setMessage(result.error || 'Failed to add bank account');
            }
        } catch (error) {
            setMessage('An unexpected error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all";

    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-navy mb-2 tracking-tight flex items-center gap-3">
                        <Landmark className="text-blue-500 w-8 h-8" />
                        Bank Accounts
                    </h1>
                    <p className="text-slate-500 font-medium">Manage your bank accounts for withdrawals.</p>
                </div>
                {!isAdding && (
                    <button onClick={() => setIsAdding(true)} className="bg-neon hover:bg-[#32e512] text-navy font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-sm">
                        <Plus className="w-5 h-5" /> Add Account
                    </button>
                )}
            </div>

            {isAdding && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold text-navy mb-6">Add New Bank Account</h2>

                    {message && <div className="mb-4 text-sm font-bold text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">{message}</div>}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Account Holder Name</label>
                            <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} required className={inputClass} placeholder="As per bank records" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Account Number</label>
                            <input type="password" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Account Number</label>
                            <input type="text" name="confirmAccountNumber" value={formData.confirmAccountNumber} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">IFSC Code</label>
                            <input type="text" name="ifsc" value={formData.ifsc} onChange={handleChange} required className={`${inputClass} uppercase`} placeholder="e.g. SBIN0001234" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Bank Name</label>
                            <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} required className={inputClass} placeholder="e.g. State Bank of India" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Branch</label>
                            <input type="text" name="branch" value={formData.branch} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Account Type</label>
                            <select name="accountType" value={formData.accountType} onChange={handleChange} className={inputClass}>
                                <option value="Savings">Savings</option>
                                <option value="Current">Current</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                            <button type="submit" disabled={isSaving} className="bg-navy hover:bg-black text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Bank Account'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {!isLoading && data?.bankAccounts?.length === 0 && !isAdding && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center">
                    <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-navy mb-2">No bank accounts added</h3>
                    <p className="text-slate-500 font-medium mb-6">You need to add a bank account to process withdrawals.</p>
                    <button onClick={() => setIsAdding(true)} className="bg-white border border-slate-200 text-navy font-bold py-2.5 px-6 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                        Add Your First Account
                    </button>
                </div>
            )}

            {isLoading && <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />}

            {!isLoading && data?.bankAccounts?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.bankAccounts.map((account) => (
                        <div key={account._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-10 group-hover:bg-neon/10 transition-colors" />
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-black text-navy text-lg">{account.bankName}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{account.accountType} Account</p>
                                </div>
                                <div className="bg-green-50 text-green-700 p-1.5 rounded-full border border-green-200"><CheckCircle2 className="w-4 h-4" /></div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Account Number</p>
                                    <p className="font-bold text-navy font-mono text-lg tracking-wider">
                                        {'•••• •••• ' + account.accountNumber.slice(-4)}
                                    </p>
                                </div>
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">IFSC</p>
                                        <p className="font-bold text-navy uppercase">{account.ifsc}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Holder</p>
                                        <p className="font-bold text-navy">{account.accountHolderName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
