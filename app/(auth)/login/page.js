'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Eye, EyeOff, ShieldCheck, ArrowRight, ChevronLeft, Mail, Smartphone } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [requires2FA, setRequires2FA] = useState(false);
    const [authMethod, setAuthMethod] = useState(''); // 'authenticator' | 'email'
    const [twoFactorCode, setTwoFactorCode] = useState('');

    // Email OTP fallback state (only when authMethod='authenticator')
    const [usingEmailFallback, setUsingEmailFallback] = useState(false);
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [maskedEmail, setMaskedEmail] = useState('');
    const [sendingEmailOtp, setSendingEmailOtp] = useState(false);

    // ── Step 1: Login ────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const formData = new FormData(e.target);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            if (data.requires2FA) {
                setRequires2FA(true);
                setAuthMethod(data.method);
                return;
            }
            router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2a: Verify authenticator TOTP ──────────────────────
    const handle2FASubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const endpoint = usingEmailFallback ? '/api/auth/2fa/email-otp' : '/api/auth/2fa/verify';
            const body = usingEmailFallback
                ? { action: 'verify', code: twoFactorCode }
                : { code: twoFactorCode };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Verification failed');
            router.push(data.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2b: Send email OTP fallback ─────────────────────────
    const handleSendEmailOtp = async () => {
        setSendingEmailOtp(true);
        setError('');
        try {
            const res = await fetch('/api/auth/2fa/email-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'send' }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send email OTP');
            setEmailOtpSent(true);
            setMaskedEmail(data.maskedEmail);
            setTwoFactorCode('');
        } catch (err) {
            setError(err.message);
        } finally {
            setSendingEmailOtp(false);
        }
    };

    // Switch to email fallback
    const switchToEmailFallback = async () => {
        setUsingEmailFallback(true);
        setTwoFactorCode('');
        setError('');
        await handleSendEmailOtp();
    };

    // Switch back to authenticator
    const switchToAuthenticator = () => {
        setUsingEmailFallback(false);
        setEmailOtpSent(false);
        setTwoFactorCode('');
        setError('');
    };

    const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all font-medium shadow-sm text-sm";

    // Current 2FA mode label
    const is2FAEmail = authMethod === 'email' || usingEmailFallback;
    const modeLabel = usingEmailFallback
        ? `Enter the code sent to ${maskedEmail || 'your email'}`
        : authMethod === 'authenticator'
            ? 'Enter the 6-digit code from your Authenticator app.'
            : 'Enter the 6-digit code sent to your email address.';

    return (
        <AnimatePresence mode="wait">
            {!requires2FA ? (
                <motion.div key="login" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                    <div className="mb-9">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">Welcome back</h1>
                        <p className="text-slate-500 text-sm font-medium">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="font-bold transition-colors hover:underline" style={{ color: '#14a32a' }}>Sign up for free</Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-start gap-2">
                                    <span className="mt-0.5">⚠</span> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
                            <input type="email" name="email" required autoComplete="email" className={inputClass} placeholder="you@example.com"
                                onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(57,255,20,0.2)'}
                                onBlur={e => e.target.style.boxShadow = ''} />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                                <Link href="/forgot-password" className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <input type={showPw ? 'text' : 'password'} name="password" required autoComplete="current-password"
                                    className={`${inputClass} pr-12`} placeholder="••••••••"
                                    onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(57,255,20,0.2)'}
                                    onBlur={e => e.target.style.boxShadow = ''} />
                                <button type="button" onClick={() => setShowPw(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                    {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                </button>
                            </div>
                        </div>

                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading}
                            className="w-full font-black py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg text-sm mt-2"
                            style={{ background: 'linear-gradient(135deg, #39FF14, #22c55e)', color: '#0b1120', boxShadow: '0 8px 24px rgba(57,255,20,0.25)' }}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400 font-medium">Secured by end-to-end encryption</p>
                    </div>
                </motion.div>
            ) : (
                <motion.div key="2fa" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                    <button onClick={() => { setRequires2FA(false); setError(''); setUsingEmailFallback(false); setEmailOtpSent(false); }}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors text-sm font-bold mb-8">
                        <ChevronLeft className="w-4 h-4" /> Back to login
                    </button>

                    <div className="mb-6">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-md"
                            style={{ background: 'linear-gradient(135deg, #39FF14, #22c55e)', boxShadow: '0 8px 24px rgba(57,255,20,0.2)' }}>
                            {usingEmailFallback
                                ? <Mail className="w-7 h-7" style={{ color: '#0b1120' }} />
                                : <ShieldCheck className="w-7 h-7" style={{ color: '#0b1120' }} />}
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Verify identity</h1>
                        <p className="text-slate-500 text-sm font-medium">{modeLabel}</p>
                    </div>

                    {/* Method toggle pills — only shown when 2FA is authenticator */}
                    {authMethod === 'authenticator' && (
                        <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
                            <button
                                onClick={switchToAuthenticator}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-black transition-all ${!usingEmailFallback ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                                <Smartphone className="w-3.5 h-3.5" /> Authenticator app
                            </button>
                            <button
                                onClick={switchToEmailFallback}
                                disabled={sendingEmailOtp}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-black transition-all ${usingEmailFallback ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                                {sendingEmailOtp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                                Email OTP
                            </button>
                        </div>
                    )}

                    <form onSubmit={handle2FASubmit} className="space-y-4">
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <input
                            type="text" inputMode="numeric"
                            value={twoFactorCode}
                            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            required
                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-center text-4xl tracking-[0.6em] text-slate-900 font-black focus:outline-none shadow-inner transition-all"
                            placeholder="——————"
                            onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(57,255,20,0.2)'}
                            onBlur={e => e.target.style.boxShadow = ''}
                        />

                        {/* Resend button for email OTP modes */}
                        {(usingEmailFallback || authMethod === 'email') && (
                            <button type="button" onClick={usingEmailFallback ? handleSendEmailOtp : undefined}
                                disabled={sendingEmailOtp}
                                className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-1">
                                {sendingEmailOtp ? 'Sending…' : 'Resend code'}
                            </button>
                        )}

                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                            type="submit" disabled={loading || twoFactorCode.length !== 6}
                            className="w-full font-black py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg text-sm disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #39FF14, #22c55e)', color: '#0b1120', boxShadow: '0 8px 24px rgba(57,255,20,0.25)' }}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
                        </motion.button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
