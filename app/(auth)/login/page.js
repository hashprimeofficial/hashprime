'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Eye, EyeOff, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPw, setShowPw] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            if (data.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/60 border border-slate-200">
            {/* Left: Branded Panel */}
            <div className="hidden md:flex flex-col justify-between bg-navy p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-neon/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-neon/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full mb-8">
                        <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Secure Platform</span>
                    </div>
                    <h2 className="text-4xl font-black text-white leading-tight mb-4">
                        Welcome back to <span className="text-neon">HashPrime</span>
                    </h2>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        Your gateway to intelligent crypto investments and passive USDT income.
                    </p>
                </div>

                <div className="relative z-10 space-y-4 mt-10">
                    {[
                        { icon: ShieldCheck, label: 'Bank-Grade Security', desc: 'AES-256 + HttpOnly JWT Cookies' },
                        { icon: TrendingUp, label: 'Up to 500% Returns', desc: 'Across 4 investment plans' },
                        { icon: Users, label: '5% Referral Bonuses', desc: 'Instant USDT for every invite' },
                    ].map(({ icon: Icon, label, desc }) => (
                        <div key={label} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-neon" />
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm">{label}</div>
                                <div className="text-slate-400 text-xs font-medium">{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Login Form */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white/90 backdrop-blur-xl p-8 md:p-10 flex flex-col justify-center"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-navy tracking-tight">Sign In</h1>
                    <p className="text-slate-500 mt-1 font-medium">Access your investment dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-navy mb-1.5">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            autoComplete="email"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all shadow-sm"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-bold text-navy">Password</label>
                            <span className="text-xs text-slate-400 font-medium cursor-default select-none">Forgot password? Contact admin</span>
                        </div>
                        <div className="relative">
                            <input
                                type={showPw ? 'text' : 'password'}
                                name="password"
                                required
                                autoComplete="current-password"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pr-12 text-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all shadow-sm"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors p-1"
                                aria-label={showPw ? 'Hide password' : 'Show password'}
                            >
                                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-neon text-navy font-bold py-3.5 rounded-lg flex justify-center items-center gap-2 transition-all shadow-md shadow-neon/20 hover:shadow-neon/40 disabled:opacity-70 mt-4"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>Sign In <ArrowRight className="w-5 h-5" /></>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-slate-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-navy underline decoration-neon decoration-2 underline-offset-4 hover:text-black transition-colors">
                        Create one now
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
