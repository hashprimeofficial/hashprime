'use client';

import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function SecurityRedirectPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-5">
            <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mb-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
                <h1 className="text-2xl font-black text-navy mb-2">Security Moved</h1>
                <p className="text-slate-400 font-medium max-w-sm">
                    Security settings are now managed inside the <strong className="text-navy">Settings</strong> hub.
                </p>
            </div>
            <Link href="/dashboard/profile?tab=security"
                className="inline-flex items-center gap-2 bg-navy text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-all shadow-sm text-sm">
                Go to Settings → Security <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
