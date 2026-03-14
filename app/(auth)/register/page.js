'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Eye, EyeOff, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';

const inputClass = "w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none transition-all font-medium text-sm";
const focusGold = (e) => (e.target.style.boxShadow = '0 0 0 2px rgba(212,175,53,0.4)', e.target.style.borderColor = 'rgba(212,175,53,0.5)');
const blurGold = (e) => (e.target.style.boxShadow = '', e.target.style.borderColor = '');

function Field({ label, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
            {children}
        </div>
    );
}

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const refCode = searchParams.get('ref') || '';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [requiresOTP, setRequiresOTP] = useState(false);
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');

    const [resolvedReferrer, setResolvedReferrer] = useState(refCode);
    const [isResolving, setIsResolving] = useState(false);

    useEffect(() => {
        if (refCode) {
            setIsResolving(true);
            fetch(`/api/auth/referrer/${refCode}`)
                .then(res => res.json())
                .then(data => { if (data.email) setResolvedReferrer(data.email); })
                .catch(err => console.error('Failed to resolve referrer:', err))
                .finally(() => setIsResolving(false));
        }
    }, [refCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        setEmail(data.email);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Registration failed');
            if (result.requiresEmailVerification) {
                setRequiresOTP(true);
            } else {
                router.push('/login');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpCode }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Verification failed');
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const btnStyle = {
        background: '#d4af35',
        color: '#0A0A0A',
        boxShadow: '0 8px 24px rgba(212,175,53,0.2)',
    };

    if (requiresOTP) {
        return (
            <motion.div key="otp" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-[#d4af35]/10 border border-[#d4af35]/30">
                    <Mail className="w-7 h-7 text-[#d4af35]" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-1.5">Check your email</h1>
                <p className="text-slate-400 text-sm font-medium mb-8">
                    We sent a verification code to <strong className="text-white">{email}</strong>
                </p>

                <form onSubmit={handleVerifyEmail} className="space-y-5">
                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium">
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <input
                        type="text" inputMode="numeric"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-5 text-center text-4xl tracking-[0.6em] text-white font-black focus:outline-none transition-all"
                        placeholder="——————"
                        onFocus={focusGold} onBlur={blurGold}
                    />

                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        type="submit" disabled={loading || otpCode.length !== 6}
                        className="w-full font-black py-3.5 rounded-xl flex justify-center items-center gap-2 text-sm disabled:opacity-50 transition-all hover:bg-[#f5e0a3]"
                        style={btnStyle}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <><CheckCircle2 className="w-4 h-4" /> Verify &amp; Activate</>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        );
    }

    return (
        <motion.div key="register" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">Create your account</h1>
                <p className="text-slate-400 text-sm font-medium">
                    Already registered?{' '}
                    <Link href="/login" className="font-bold text-[#d4af35] hover:text-[#f5e0a3] transition-colors">Sign in</Link>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium flex items-start gap-2">
                            <span className="mt-0.5">⚠</span> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <Field label="Full Name">
                    <input type="text" name="name" required className={inputClass} placeholder="John Smith" onFocus={focusGold} onBlur={blurGold} />
                </Field>

                <Field label="Email Address">
                    <input type="email" name="email" required className={inputClass} placeholder="you@example.com" onFocus={focusGold} onBlur={blurGold} />
                </Field>

                <Field label="Password">
                    <div className="relative">
                        <input
                            type={showPw ? 'text' : 'password'} name="password" required autoComplete="new-password"
                            className={`${inputClass} pr-12`} placeholder="Minimum 6 characters"
                            onFocus={focusGold} onBlur={blurGold}
                        />
                        <button type="button" onClick={() => setShowPw(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#d4af35] transition-colors">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </Field>

                <Field label="Referral Code / Email">
                    <div className="relative">
                        <input type="text" name="referredBy"
                            defaultValue={resolvedReferrer}
                            key={resolvedReferrer}
                            className={`${inputClass} pr-24 ${isResolving ? 'animate-pulse' : ''}`}
                            placeholder="Optional"
                            onFocus={focusGold} onBlur={blurGold} />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold bg-[#d4af35]/10 text-[#d4af35] border border-[#d4af35]/20 px-2 py-0.5 rounded-md">
                            {isResolving ? 'Loading...' : 'Optional'}
                        </span>
                    </div>
                </Field>

                <motion.button
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    type="submit" disabled={loading}
                    className="w-full font-black py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all text-sm mt-2 bg-[#d4af35] text-[#0A0A0A] hover:bg-[#f5e0a3] shadow-[0_8px_24px_rgba(212,175,53,0.2)]">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <>Create Account <ArrowRight className="w-4 h-4" /></>
                    )}
                </motion.button>

                <p className="text-center text-xs text-slate-500 font-medium pt-1">
                    By signing up you agree to our{' '}
                    <span className="text-[#d4af35] font-semibold cursor-pointer hover:underline">Terms</span>{' '}
                    &amp;{' '}
                    <span className="text-[#d4af35] font-semibold cursor-pointer hover:underline">Privacy Policy</span>
                </p>
            </form>
        </motion.div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#d4af35]" />
            </div>
        }>
            <AnimatePresence mode="wait">
                <RegisterForm />
            </AnimatePresence>
        </Suspense>
    );
}
