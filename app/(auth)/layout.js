'use client';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen relative overflow-hidden flex" style={{ background: 'linear-gradient(135deg, #f8fafb 0%, #eef7f0 50%, #f4f9f5 100%)' }}>
            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between p-12 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0b1120 0%, #0f1f14 40%, #0b1120 100%)' }}>
                {/* subtle grid */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(57,255,20,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                {/* top glow */}
                <div className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(57,255,20,0.12) 0%, transparent 70%)' }} />
                {/* bottom-right glow */}
                <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(57,255,20,0.08) 0%, transparent 70%)' }} />

                {/* Brand */}
                <div className="relative z-10">
                    <div className=" items-center hidden md:flex lg:flex gap-3 mb-16">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: '#39FF14', color: '#0b1120' }}>H</div>
                        <span className="text-white text-xl font-black tracking-tight">HashPrime</span>
                    </div>

                    <div className="space-y-1 mb-10">
                        <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#39FF14' }}>Investment Platform</div>
                        <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight">
                            Grow your wealth<br />
                            <span style={{ color: '#39FF14' }}>intelligently.</span>
                        </h2>
                        <p className="text-slate-400 text-base font-medium mt-4 leading-relaxed max-w-xs">
                            Earn passive USDT income through our structured investment plans.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-10">
                        {[
                            { val: '500%', label: 'Max Returns' },
                            { val: '5%', label: 'Referral Bonus' },
                            { val: '4', label: 'Investment Plans' },
                            { val: 'USDT', label: 'Reward Currency' },
                        ].map(({ val, label }) => (
                            <div key={label} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                <div className="text-2xl font-black text-white mb-0.5">{val}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer text */}
                <div className="relative z-10">
                    <p className="text-slate-600 text-xs font-medium">© 2025 HashPrime. All rights reserved.</p>
                </div>
            </div>

            {/* Right — form panel */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2.5 mb-10">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: '#39FF14', color: '#0b1120' }}>H</div>
                        <span className="text-xl font-black tracking-tight" style={{ color: '#0b1120' }}>HashPrime</span>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
