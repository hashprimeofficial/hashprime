'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';

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
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all font-medium shadow-sm text-sm";

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
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
    );
}
