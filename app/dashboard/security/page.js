'use client';

import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function SecurityRedirectPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-5">
            <div className="w-16 h-16 bg-[#d4af35]/10 rounded-3xl flex items-center justify-center mb-2 border border-[#d4af35]/30 shadow-[0_4px_20px_rgba(212,175,53,0.2)]">
                <ShieldCheck className="w-8 h-8 text-[#d4af35]" />
            </div>
            <div>
                <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Security Moved</h1>
                <p className="text-[#d4af35]/70 font-medium max-w-sm">
                    Security settings are now managed inside the <strong className="text-white">Settings</strong> hub.
                </p>
            </div>
            <Link href="/dashboard/profile?tab=security"
                className="inline-flex items-center gap-2 bg-[#d4af35] hover:bg-[#f8d76d] text-[#0A0A0A] font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,53,0.3)] text-sm">
                Go to Settings → Security <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
