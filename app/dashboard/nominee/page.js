'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Users, Loader2, Save, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NomineePage() {
    const { data, error, isLoading, mutate } = useSWR('/api/nominee', fetcher);

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        relationship: '',
        mobileNumber: ''
    });

    useEffect(() => {
        if (data?.nominee) {
            setFormData({
                fullName: data.nominee.fullName,
                dob: data.nominee.dob,
                relationship: data.nominee.relationship,
                mobileNumber: data.nominee.mobileNumber
            });
        }
    }, [data]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setIsSaving(true);
        try {
            const method = data?.nominee ? 'PUT' : 'POST';
            const res = await fetch('/api/nominee', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: result.message || 'Nominee saved successfully' });
                mutate();
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to save nominee' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full bg-[#121212] border border-[#d4af35]/20 rounded-xl px-4 py-3.5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#d4af35]/50 focus:border-[#d4af35] transition-all shadow-inner placeholder:text-white/20";
    const labelClass = "block text-[10px] font-black uppercase tracking-widest text-[#d4af35] mb-2";

    if (isLoading) return (
        <div className="space-y-8 max-w-2xl animate-pulse">
            <div className="space-y-2">
                <div className="h-8 bg-[#121212] border border-white/5 shadow-inner rounded-xl w-1/3"></div>
                <div className="h-4 bg-[#121212] border border-white/5 shadow-inner rounded-xl w-1/2"></div>
            </div>
            <div className="h-[400px] bg-[#0A0A0A] border border-[#d4af35]/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"></div>
        </div>
    );

    return (
        <div className="max-w-3xl space-y-8">
            <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#d4af35]/10 rounded-full blur-[50px] pointer-events-none" />
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-4 relative z-10 drop-shadow-[0_0_15px_rgba(212,175,53,0.1)]">
                    <div className="w-12 h-12 bg-[#d4af35]/10 rounded-2xl flex items-center justify-center border border-[#d4af35]/30 shadow-inner">
                        <Users className="text-[#d4af35] w-6 h-6" />
                    </div>
                    Nominee Details
                </h1>
                <p className="text-[#d4af35]/70 font-bold relative z-10 ml-16">Add or update your account nominee information securely.</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af35]/5 rounded-full blur-[60px] pointer-events-none -mt-32 -mr-32" />

                <div className="relative z-10">
                    {data?.nominee && (
                        <div className="mb-8 bg-[#32e512]/10 border border-[#32e512]/30 p-5 rounded-2xl flex items-start gap-4 shadow-inner">
                            <div className="bg-[#32e512]/20 p-2 rounded-xl shrink-0">
                                <ShieldCheck className="w-6 h-6 text-[#32e512]" />
                            </div>
                            <div>
                                <h4 className="font-black text-[#32e512] tracking-tight mb-1 drop-shadow-[0_0_8px_rgba(50,229,18,0.3)]">Nominee Protected</h4>
                                <p className="text-sm text-[#32e512]/70 font-bold">Your account assets and investments will be transferred to your registered nominee in the event of unforeseen circumstances.</p>
                            </div>
                        </div>
                    )}

                    {message.text && (
                        <div className={`mb-8 p-4 rounded-xl font-bold flex items-center gap-3 text-sm tracking-wide shadow-inner ${message.type === 'success' ? 'bg-[#32e512]/10 text-[#32e512] border border-[#32e512]/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="Nominee's legal name"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    required
                                    className={`${inputClass} [color-scheme:dark]`}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Relationship</label>
                                <select
                                    name="relationship"
                                    value={formData.relationship}
                                    onChange={handleChange}
                                    required
                                    className={`${inputClass} appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23d4af35%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-[size:1.2em] pr-10`}
                                >
                                    <option value="" disabled className="text-white/50">Select Relationship</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Child">Child</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="With country code (e.g., +91...)"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[#d4af35]/10 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-[#d4af35] hover:bg-[#f8d76d] text-[#0A0A0A] font-black text-sm uppercase tracking-widest py-4 px-8 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(212,175,53,0.3)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {data?.nominee ? 'Update Nominee' : 'Save Nominee'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
