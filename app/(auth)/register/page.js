'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const refCode = searchParams.get('ref') || '';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Registration failed');
            }

            router.push('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium text-center">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-navy mb-1.5">Full Name</label>
                <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all shadow-sm"
                    placeholder="John Doe"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-navy mb-1.5 flex justify-between items-center">
                    Email Address
                    <span className="text-slate-400 font-normal text-xs">(Your future referral code)</span>
                </label>
                <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all shadow-sm"
                    placeholder="name@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-navy mb-1.5">Password</label>
                <input
                    type="password"
                    name="password"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all shadow-sm"
                    placeholder="••••••••"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-navy mb-1.5 flex justify-between items-center">
                    Referral Code
                    <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                </label>
                <input
                    type="email"
                    name="referredBy"
                    defaultValue={refCode}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all shadow-sm"
                    placeholder="friend@example.com"
                />
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-neon text-navy font-bold py-3.5 rounded-lg flex justify-center items-center gap-2 transition-all shadow-md shadow-neon/20 hover:shadow-neon/40 disabled:opacity-70 mt-6"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                        Create Account <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </motion.button>
        </form>
    );
}

export default function RegisterPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 border border-slate-200 p-8 rounded-2xl shadow-xl shadow-slate-200/50 backdrop-blur-xl"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-navy tracking-tight">
                    Join HashPrime
                </h1>
                <p className="text-slate-500 mt-2 font-medium">Start your investment journey</p>
            </div>

            <Suspense fallback={<div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-neon" /></div>}>
                <RegisterForm />
            </Suspense>

            <div className="mt-8 text-center text-sm font-medium text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="text-navy underline decoration-neon decoration-2 underline-offset-4 hover:text-black transition-colors">
                    Sign In
                </Link>
            </div>
        </motion.div>
    );
}
