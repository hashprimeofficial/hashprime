'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Eye, EyeOff, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';

const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-medium shadow-sm text-sm";

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
    const [referralCode, setReferralCode] = useState(refCode);

    const [resolvedReferrer, setResolvedReferrer] = useState(refCode);
    const [isResolving, setIsResolving] = useState(false);
    const [referralValid, setReferralValid] = useState(!!refCode);
    const [referralError, setReferralError] = useState('');

    useEffect(() => {
        if (refCode) {
            setIsResolving(true);
            fetch(`/api/auth/referrer/${refCode}`)
                .then(res => res.json())
                .then(data => {
                    if (data.email) {
                        setResolvedReferrer(data.email);
                        setReferralCode(data.email);
                        setReferralValid(true);
                    }
                })
                .catch(err => console.error('Failed to resolve referrer:', err))
                .finally(() => setIsResolving(false));
        }
    }, [refCode]);

    const validateReferral = async (code) => {
        if (!code.trim()) {
            setReferralValid(false);
            setReferralError('Referral code is required.');
            return false;
        }
        try {
            const res = await fetch(`/api/auth/referrer/${encodeURIComponent(code.trim())}`);
            const data = await res.json();
            if (res.ok && data.email) {
                setReferralValid(true);
                setReferralError('');
                return true;
            } else {
                setReferralValid(false);
                setReferralError('Invalid referral code. Please enter a valid referral code.');
                return false;
            }
        } catch {
            setReferralValid(false);
            setReferralError('Could not validate referral code.');
            return false;
        }
    };

    const focus = (e) => (e.target.style.boxShadow = '0 0 0 3px rgba(57,255,20,0.2)');
    const blur = (e) => (e.target.style.boxShadow = '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        setEmail(data.email);

        // Validate referral code before submitting
        const isRefValid = await validateReferral(referralCode);
        if (!isRefValid) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, referredBy: referralCode.trim() }),
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
        background: 'linear-gradient(135deg, #39FF14, #22c55e)',
        color: '#0b1120',
        boxShadow: '0 8px 24px rgba(57,255,20,0.25)',
    };

    if (requiresOTP) {
        return (
            <motion.div
                key="otp"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
            >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-md" style={btnStyle}>
                    <Mail className="w-7 h-7" style={{ color: '#0b1120' }} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">Check your email</h1>
                <p className="text-slate-500 text-sm font-medium mb-8">
                    We sent a verification code to <strong className="text-slate-700">{email}</strong>
                </p>

                <form onSubmit={handleVerifyEmail} className="space-y-5">
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
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-center text-4xl tracking-[0.6em] text-slate-900 font-black focus:outline-none shadow-inner transition-all"
                        placeholder="——————"
                        onFocus={focus} onBlur={blur}
                    />

                    <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        type="submit" disabled={loading || otpCode.length !== 6}
                        className="w-full font-black py-3.5 rounded-xl flex justify-center items-center gap-2 shadow-lg text-sm disabled:opacity-50 transition-all"
                        style={btnStyle}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <><CheckCircle2 className="w-4 h-4" /> Verify & Activate</>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        );
    }

    return (
        <motion.div
            key="register"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
        >
            <div className="my-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">Create your account</h1>
                <p className="text-slate-500 text-sm font-medium">
                    Already registered?{' '}
                    <Link href="/login" className="font-bold transition-colors hover:underline" style={{ color: '#14a32a' }}>
                        Sign in
                    </Link>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-start gap-2">
                            <span className="mt-0.5">⚠</span> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <Field label="Full Name">
                    <input type="text" name="name" required className={inputClass} placeholder="John Smith" onFocus={focus} onBlur={blur} />
                </Field>

                <Field label="Email Address">
                    <input type="email" name="email" required className={inputClass} placeholder="you@example.com" onFocus={focus} onBlur={blur} />
                </Field>

                <Field label="Password">
                    <div className="relative">
                        <input
                            type={showPw ? 'text' : 'password'} name="password" required autoComplete="new-password"
                            className={`${inputClass} pr-12`} placeholder="Minimum 6 characters"
                            onFocus={focus} onBlur={blur}
                        />
                        <button type="button" onClick={() => setShowPw(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </Field>

                <Field label="Referral Code *">
                    <div className="relative">
                        <input type="text" name="referredBy"
                            value={referralCode}
                            key={resolvedReferrer}
                            onChange={(e) => {
                                setReferralCode(e.target.value);
                                setReferralValid(false);
                                setReferralError('');
                            }}
                            className={`${inputClass} pr-28 ${isResolving ? 'animate-pulse bg-slate-50' :
                                referralError ? 'border-red-300 bg-red-50' :
                                    referralValid ? 'border-green-300 bg-green-50' : ''
                                }`}
                            placeholder="Enter referral code"
                            required
                            onFocus={focus}
                            onBlur={(e) => { blur(e); if (referralCode.trim()) validateReferral(referralCode); }} />
                        <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded-md ${isResolving ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                            referralError ? 'bg-red-50 text-red-600 border border-red-200' :
                                referralValid ? 'bg-green-50 text-green-700 border border-green-200' :
                                    'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                            {isResolving ? 'Validating...' : referralError ? 'Invalid' : referralValid ? '✓ Valid' : 'Required'}
                        </span>
                    </div>
                    {referralError && (
                        <p className="text-xs text-red-500 font-medium mt-1">⚠ {referralError}</p>
                    )}
                </Field>

                <motion.button
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    type="submit" disabled={loading}
                    className="w-full font-black py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg text-sm mt-2"
                    style={btnStyle}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <>Create Account <ArrowRight className="w-4 h-4" /></>
                    )}
                </motion.button>

                <p className="text-center text-xs text-slate-400 font-medium pt-1">
                    By signing up you agree to our{' '}
                    <span className="text-slate-500 font-semibold cursor-pointer hover:underline">Terms</span>{' '}
                    &amp;{' '}
                    <span className="text-slate-500 font-semibold cursor-pointer hover:underline">Privacy Policy</span>
                </p>
            </form>


        </motion.div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#39FF14' }} />
            </div>
        }>
            <AnimatePresence mode="wait">
                <RegisterForm />
            </AnimatePresence>
        </Suspense>
    );
}
