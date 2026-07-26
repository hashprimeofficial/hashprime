'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function LoginError({ error, reset }) {
    useEffect(() => {
        console.error('Unhandled client-side exception in Login route:', error);
    }, [error]);

    return (
        <div className="bg-[#0A0A0A] border border-red-500/30 rounded-2xl p-6 shadow-2xl text-center space-y-4 my-auto">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-xl font-black text-white mb-1">Something went wrong</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                    An unexpected client-side error occurred. Please try reloading the page or click below to retry.
                </p>
            </div>
            <div className="flex gap-3 pt-2">
                <button
                    onClick={() => reset()}
                    className="flex-1 py-3 bg-[#d4af35] text-[#0A0A0A] font-black uppercase text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#f5e0a3] transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Retry
                </button>
                <Link
                    href="/"
                    className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Home
                </Link>
            </div>
        </div>
    );
}
