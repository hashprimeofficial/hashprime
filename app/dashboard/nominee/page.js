'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Loader2, Save, ShieldCheck, CheckCircle2, AlertCircle, Upload, FileText, Download, X, FileCheck, Lock } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NomineePage() {
    const { data, error, isLoading, mutate } = useSWR('/api/nominee', fetcher);
    const { data: profileData } = useSWR('/api/profile', fetcher);

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        relationship: '',
        mobileNumber: '',
        idProofType: 'Aadhaar Card',
        idProofUrl: ''
    });

    useEffect(() => {
        if (data?.nominee) {
            setFormData({
                fullName: data.nominee.fullName || '',
                dob: data.nominee.dob || '',
                relationship: data.nominee.relationship || '',
                mobileNumber: data.nominee.mobileNumber || '',
                idProofType: data.nominee.idProofType || 'Aadhaar Card',
                idProofUrl: data.nominee.idProofUrl || ''
            });
        }
    }, [data]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        setUploadError('');
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File size exceeds 5MB limit. Please upload a smaller image or document.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, idProofUrl: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setShowConsentModal(true);
    };

    const confirmSaveNominee = async () => {
        setShowConsentModal(false);
        setIsSaving(true);
        try {
            const method = data?.nominee ? 'PUT' : 'POST';
            const payload = {
                ...formData,
                consentGivenAt: new Date().toISOString()
            };

            const res = await fetch('/api/nominee', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: result.message || 'Nominee and consent details saved successfully' });
                mutate();
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to save nominee' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred while saving' });
        } finally {
            setIsSaving(false);
        }
    };

    const downloadConsentForm = () => {
        const user = profileData?.user || profileData || {};
        const nominee = data?.nominee || formData;
        const consentDate = nominee.consentGivenAt ? new Date(nominee.consentGivenAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' }) : new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' });

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Nominee Asset Transfer Consent Certificate</title>
                <style>
                    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; padding: 40px; max-width: 800px; margin: 0 auto; background: #fff; }
                    .header { text-align: center; border-bottom: 2px solid #d4af35; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { font-size: 28px; font-weight: 900; letter-spacing: 2px; color: #0a0a0a; }
                    .logo span { color: #d4af35; }
                    .title { font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px; color: #444; }
                    .box { background: #fdfbf7; border: 1px solid #e8dfc5; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
                    .box-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #a37f1c; margin-bottom: 12px; letter-spacing: 1px; border-bottom: 1px dashed #e8dfc5; padding-bottom: 5px; }
                    .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 15px; font-size: 14px; }
                    .label { font-weight: 700; color: #666; }
                    .value { font-weight: 600; color: #111; }
                    .declaration { background: #f4f4f5; border-left: 4px solid #d4af35; padding: 15px 20px; font-size: 15px; font-weight: 600; font-style: italic; margin: 30px 0; color: #222; line-height: 1.6; }
                    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
                    .stamp { display: inline-block; border: 2px double #d4af35; color: #a37f1c; font-size: 12px; font-weight: 900; text-transform: uppercase; padding: 8px 16px; border-radius: 4px; margin-top: 15px; }
                    @media print {
                        body { padding: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="no-print" style="margin-bottom: 20px; text-align: right;">
                    <button onclick="window.print()" style="background: #d4af35; color: #000; font-weight: bold; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px;">Print / Save as PDF</button>
                </div>
                <div class="header">
                    <div class="logo">HASH<span>PRIME</span></div>
                    <div class="title">Asset Nominee Transfer & Consent Certificate</div>
                </div>

                <div class="box">
                    <div class="box-title">Account Holder Information</div>
                    <div class="grid">
                        <div><span class="label">Primary Member:</span> <span class="value">${user.name || 'Account Holder'}</span></div>
                        <div><span class="label">Email Address:</span> <span class="value">${user.email || 'N/A'}</span></div>
                        <div><span class="label">Member ID:</span> <span class="value">${user._id || 'Registered Member'}</span></div>
                        <div><span class="label">Verification Status:</span> <span class="value" style="color: #10b981;">KYC Verified</span></div>
                    </div>
                </div>

                <div class="box">
                    <div class="box-title">Registered Nominee Details</div>
                    <div class="grid">
                        <div><span class="label">Nominee Legal Name:</span> <span class="value">${nominee.fullName}</span></div>
                        <div><span class="label">Relationship:</span> <span class="value">${nominee.relationship}</span></div>
                        <div><span class="label">Date of Birth:</span> <span class="value">${nominee.dob}</span></div>
                        <div><span class="label">Mobile Number:</span> <span class="value">${nominee.mobileNumber}</span></div>
                        <div><span class="label">ID Proof Type:</span> <span class="value">${nominee.idProofType || 'Aadhaar Card'}</span></div>
                        <div><span class="label">ID Proof Status:</span> <span class="value" style="color: #10b981;">${nominee.idProofUrl ? 'Document Attached' : 'Provided'}</span></div>
                    </div>
                </div>

                <div class="declaration">
                    "In your absence, this asset will be transferred to this nominee. Do you fully consent to this?"<br/><br/>
                    <strong style="font-style: normal; color: #10b981;">✓ EXPLICIT CONSENT RECORDED: YES</strong>
                </div>

                <div class="grid" style="margin-top: 30px;">
                    <div><span class="label">Consent Timestamp:</span><br/><span class="value">${consentDate}</span></div>
                    <div><span class="label">Digital Authentication:</span><br/><span class="value">Cryptographically Signed & Recorded</span></div>
                </div>

                <div class="footer">
                    <div class="stamp">Official HashPrime Legal Document</div>
                    <p style="margin-top: 10px;">This electronic document serves as an official confirmation of nominee registration under HashPrime Asset Management guidelines.</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    const inputClass = "w-full bg-[#121212] border border-[#d4af35]/20 rounded-xl px-4 py-3.5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#d4af35]/50 focus:border-[#d4af35] transition-all shadow-inner placeholder:text-white/20";
    const labelClass = "block text-[10px] font-black uppercase tracking-widest text-[#d4af35] mb-2";

    if (isLoading) return (
        <div className="space-y-8 max-w-3xl animate-pulse">
            <div className="space-y-2">
                <div className="h-8 bg-[#121212] border border-white/5 shadow-inner rounded-xl w-1/3"></div>
                <div className="h-4 bg-[#121212] border border-white/5 shadow-inner rounded-xl w-1/2"></div>
            </div>
            <div className="h-[450px] bg-[#0A0A0A] border border-[#d4af35]/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"></div>
        </div>
    );

    return (
        <div className="max-w-3xl space-y-8 relative">
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#d4af35]/10 rounded-full blur-[50px] pointer-events-none" />
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-4 relative z-10 drop-shadow-[0_0_15px_rgba(212,175,53,0.1)]">
                        <div className="w-12 h-12 bg-[#d4af35]/10 rounded-2xl flex items-center justify-center border border-[#d4af35]/30 shadow-inner">
                            <Users className="text-[#d4af35] w-6 h-6" />
                        </div>
                        Nominee Details
                    </h1>
                    <p className="text-[#d4af35]/70 font-bold relative z-10 ml-16">Add or update your account nominee information securely.</p>
                </div>

                {data?.nominee && (
                    <button
                        onClick={downloadConsentForm}
                        type="button"
                        className="self-start md:self-auto inline-flex items-center gap-2 bg-[#d4af35]/10 hover:bg-[#d4af35]/20 text-[#d4af35] border border-[#d4af35]/40 font-black text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all shadow-md hover:scale-[1.02]"
                    >
                        <Download className="w-4 h-4" />
                        Download Consent Form
                    </button>
                )}
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af35]/5 rounded-full blur-[60px] pointer-events-none -mt-32 -mr-32" />

                <div className="relative z-10">
                    {data?.nominee && (
                        <div className="mb-8 bg-[#32e512]/10 border border-[#32e512]/30 p-5 rounded-2xl flex items-start gap-4 shadow-inner">
                            <div className="bg-[#32e512]/20 p-2 rounded-xl shrink-0">
                                <ShieldCheck className="w-6 h-6 text-[#32e512]" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-[#32e512] tracking-tight mb-1 drop-shadow-[0_0_8px_rgba(50,229,18,0.3)] flex items-center justify-between">
                                    <span>Nominee Protected</span>
                                    {data.nominee.consentGivenAt && (
                                        <span className="text-[10px] bg-[#32e512]/20 px-2.5 py-1 rounded-full text-[#32e512]">Consented</span>
                                    )}
                                </h4>
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

                    <form onSubmit={handleFormSubmit} className="space-y-6">
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

                        {/* ID Proof (Aadhaar Card) Upload Section */}
                        <div className="pt-4 border-t border-[#d4af35]/10">
                            <label className={labelClass}>Nominee ID Proof (Aadhaar Card)</label>
                            <div className="mt-2 bg-[#121212] border border-dashed border-[#d4af35]/30 rounded-2xl p-6 text-center hover:border-[#d4af35]/60 transition-all">
                                {formData.idProofUrl ? (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0A0A0A] p-4 rounded-xl border border-[#d4af35]/20">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-lg bg-[#32e512]/10 border border-[#32e512]/30 flex items-center justify-center shrink-0">
                                                <FileCheck className="w-5 h-5 text-[#32e512]" />
                                            </div>
                                            <div className="text-left truncate">
                                                <p className="text-sm font-bold text-white truncate">Aadhaar Card ID Proof Uploaded</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Document Attached & Encrypted</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <label className="cursor-pointer text-xs font-bold text-[#d4af35] hover:underline px-3 py-1.5 rounded-lg bg-[#d4af35]/10">
                                                Change
                                                <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, idProofUrl: '' }))}
                                                className="text-xs font-bold text-red-400 hover:text-red-300 p-1.5 rounded-lg bg-red-500/10"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center gap-3 py-3">
                                        <div className="w-12 h-12 rounded-full bg-[#d4af35]/10 flex items-center justify-center border border-[#d4af35]/30 shadow-inner">
                                            <Upload className="w-6 h-6 text-[#d4af35]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Upload Nominee&apos;s Aadhaar Card</p>
                                            <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, JPEG or PDF (Max 5MB)</p>
                                        </div>
                                        <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
                                    </label>
                                )}
                            </div>
                            {uploadError && <p className="text-xs text-red-400 font-bold mt-2">{uploadError}</p>}
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

            {/* Consent Pop-up Modal */}
            <AnimatePresence>
                {showConsentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0A0A0A] border border-[#d4af35]/40 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#d4af35] to-transparent" />
                            
                            <div className="flex items-center justify-between pb-4 border-b border-[#d4af35]/20 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#d4af35]/10 border border-[#d4af35]/30 flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-[#d4af35]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-white uppercase tracking-wider">Asset Transfer Declaration</h3>
                                        <p className="text-xs text-[#d4af35]/70 font-semibold">Confirmation & Legal Consent</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowConsentModal(false)}
                                    className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/5"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-[#121212] border border-[#d4af35]/20 p-5 rounded-2xl mb-6 shadow-inner">
                                <p className="text-base text-white font-bold leading-relaxed text-center">
                                    &quot;In your absence, this asset will be transferred to this nominee. Do you fully consent to this?&quot;
                                </p>
                            </div>

                            <div className="text-xs text-slate-400 font-medium mb-8 text-center px-2">
                                By clicking <strong className="text-white">&quot;Yes, I Consent&quot;</strong>, your authorization will be timestamped and cryptographically recorded for legal compliance.
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowConsentModal(false)}
                                    className="px-6 py-3.5 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmSaveNominee}
                                    className="px-6 py-3.5 rounded-xl bg-[#d4af35] hover:bg-[#f8d76d] text-[#0A0A0A] font-black text-xs uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(212,175,53,0.4)]"
                                >
                                    Yes, I Consent
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
