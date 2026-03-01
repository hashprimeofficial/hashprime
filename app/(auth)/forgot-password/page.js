'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, Mail, KeyRound, EyeOff, Eye, CheckCircle2, AlertCircle, ChevronLeft } from 'lucide-react';

const neonStyle = { background: 'linear-gradient(135deg, #39FF14, #22c55e)', color: '#0b1120', boxShadow: '0 8px 24px rgba(57,255,20,0.25)' };

const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-medium shadow-sm text-sm";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [step, setStep] = useState('request'); // 'request' | 'reset'
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');

    const handleRequestOTP = async (e) => {
        e.preventDefault(); setLoading(true); setError(''); setSuccessMsg('');
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send code');
            setSuccessMsg(data.message);
            setStep('reset');
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        const formData = new FormData(e.target);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpCode, newPassword: formData.get('newPassword') }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to reset password');
            router.push('/login?reset=success');
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <AnimatePresence mode="wait">
            {step === 'request' ? (
                <motion.div key="request" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                    {/* Header */}
                    <div className="mb-9">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg,#39FF14,#22c55e)', boxShadow: '0 8px 24px rgba(57,255,20,0.2)' }}>
                            <Mail className="w-6 h-6" style={{ color: '#0b1120' }} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">Reset password</h1>
                        <p className="text-slate-500 text-sm font-medium">Enter your email and we'll send a 6-digit reset code.</p>
                    </div>

                    <form onSubmit={handleRequestOTP} className="space-y-5">
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="flex items-start gap-3 bg-[#0B1120] border border-red-500/30 p-3.5 rounded-xl">
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-red-300 text-sm font-bold">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                className={inputClass} placeholder="you@example.com"
                                onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(57,255,20,0.2)'}
                                onBlur={e => e.target.style.boxShadow = ''} />
                        </div>

                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                            type="submit" disabled={loading || !email}
                            className="w-full font-black py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg text-sm mt-2 disabled:opacity-60"
                            style={neonStyle}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Reset Code <ArrowRight className="w-4 h-4" /></>}
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <Link href="/login" className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center gap-1">
                            <ChevronLeft className="w-3.5 h-3.5" /> Back to sign in
                        </Link>
                    </div>
                </motion.div>
            ) : (
                <motion.div key="reset" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                    {/* Header */}
                    <div className="mb-9">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg,#39FF14,#22c55e)', boxShadow: '0 8px 24px rgba(57,255,20,0.2)' }}>
                            <KeyRound className="w-6 h-6" style={{ color: '#0b1120' }} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">Set new password</h1>
                        {successMsg && (
                            <div className="flex items-center gap-2 mt-3 text-xs font-bold p-2.5 rounded-lg bg-[#39FF14]/10 border border-[#39FF14]/20" style={{ color: '#14a32a' }}>
                                <CheckCircle2 className="w-4 h-4" style={{ color: '#39FF14' }} />
                                Code sent to <span className="text-slate-700">{email}</span>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="flex items-start gap-3 bg-[#0B1120] border border-red-500/30 p-3.5 rounded-xl">
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-red-300 text-sm font-bold">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* OTP */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">6-Digit Code</label>
                            <input type="text" inputMode="numeric" value={otpCode}
                                onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                required placeholder="——————"
                                className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-center text-3xl tracking-[0.5em] text-slate-900 font-black focus:outline-none shadow-inner transition-all"
                                onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(57,255,20,0.2)'}
                                onBlur={e => e.target.style.boxShadow = ''} />
                        </div>

                        {/* New Password */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">New Password</label>
                            <div className="relative">
                                <input type={showPw ? 'text' : 'password'} name="newPassword" required autoComplete="new-password"
                                    className={`${inputClass} pr-12`} placeholder="••••••••"
                                    onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(57,255,20,0.2)'}
                                    onBlur={e => e.target.style.boxShadow = ''} />
                                <button type="button" onClick={() => setShowPw(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                            type="submit" disabled={loading || otpCode.length !== 6}
                            className="w-full font-black py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg text-sm disabled:opacity-50"
                            style={neonStyle}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm New Password'}
                        </motion.button>

                        <button type="button" onClick={() => { setStep('request'); setError(''); setOtpCode(''); }}
                            className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1 pt-1">
                            <ChevronLeft className="w-3.5 h-3.5" /> Use a different email
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
