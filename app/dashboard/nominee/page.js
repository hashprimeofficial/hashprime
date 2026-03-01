'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Users, Loader2, Save, ShieldCheck } from 'lucide-react';

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

    const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all";

    if (isLoading) return <div className="space-y-4 max-w-2xl"><div className="h-10 bg-slate-200 rounded w-1/3 animate-pulse"></div><div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div></div>;

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-3xl font-black text-navy mb-2 tracking-tight flex items-center gap-3">
                    <Users className="text-neon w-8 h-8" />
                    Nominee Details
                </h1>
                <p className="text-slate-500 font-medium">Add or update your account nominee information securely.</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">

                {data?.nominee && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-navy text-sm mb-1">Nominee Protected</h4>
                            <p className="text-xs text-slate-600 font-medium">Your account assets and investments will be transferred to your registered nominee in the event of unforeseen circumstances.</p>
                        </div>
                    </div>
                )}

                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
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
                            <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Relationship</label>
                            <select
                                name="relationship"
                                value={formData.relationship}
                                onChange={handleChange}
                                required
                                className={`${inputClass} appearance-none`}
                            >
                                <option value="" disabled>Select Relationship</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Child">Child</option>
                                <option value="Parent">Parent</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
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

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-navy hover:bg-black text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {data?.nominee ? 'Update Nominee' : 'Save Nominee'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
