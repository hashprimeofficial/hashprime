'use client';

import Link from 'next/link';
import { Landmark, ArrowRight } from 'lucide-react';

export default function BankRedirectPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-5">
            <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-2">
                <Landmark className="w-8 h-8 text-blue-400" />
            </div>
            <div>
                <h1 className="text-2xl font-black text-navy mb-2">Bank Accounts Moved</h1>
                <p className="text-slate-400 font-medium max-w-sm">
                    Bank accounts are now managed inside the <strong className="text-navy">Settings</strong> hub.
                </p>
            </div>
            <Link href="/dashboard/profile?tab=bank"
                className="inline-flex items-center gap-2 bg-navy text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-all shadow-sm text-sm">
                Go to Settings → Bank <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
