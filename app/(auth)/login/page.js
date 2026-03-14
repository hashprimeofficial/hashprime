'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

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

    const inputClass = "w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none transition-all font-medium text-sm";
    const focusGold = (e) => (e.target.style.boxShadow = '0 0 0 2px rgba(212,175,53,0.4)', e.target.style.borderColor = 'rgba(212,175,53,0.5)');
    const blurGold = (e) => (e.target.style.boxShadow = '', e.target.style.borderColor = '');

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">Welcome back</h1>
                <p className="text-slate-400 text-sm font-medium">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-bold text-[#d4af35] hover:text-[#f5e0a3] transition-colors">Sign up for free</Link>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium flex items-start gap-2">
                            <span className="mt-0.5">⚠</span> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
                    <input type="email" name="email" required autoComplete="email" className={inputClass} placeholder="you@example.com"
                        onFocus={focusGold} onBlur={blurGold} />
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                        <Link href="/forgot-password" className="text-xs font-bold text-slate-500 hover:text-[#d4af35] transition-colors">Forgot password?</Link>
                    </div>
                    <div className="relative">
                        <input type={showPw ? 'text' : 'password'} name="password" required autoComplete="current-password"
                            className={`${inputClass} pr-12`} placeholder="••••••••"
                            onFocus={focusGold} onBlur={blurGold} />
                        <button type="button" onClick={() => setShowPw(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#d4af35] transition-colors">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading}
                    className="w-full font-black py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all text-sm mt-2 bg-[#d4af35] text-[#0A0A0A] hover:bg-[#f5e0a3] shadow-[0_8px_24px_rgba(212,175,53,0.2)]">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
                </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af35]" />
                <p className="text-xs text-slate-500 font-medium">Secured by end-to-end encryption</p>
            </div>
        </motion.div>
    );
}
