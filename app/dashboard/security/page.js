'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert, ShieldCheck, Loader2, Smartphone,
    AlertCircle, Copy, CheckCircle2, KeyRound, Lock, Unlock
} from 'lucide-react';
import Image from 'next/image';

const fetcher = (url) => fetch(url).then((res) => res.json());

// ── Themed alert banners ─────────────────────────────────────────
const ErrorBanner = ({ msg, onClose }) => (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        className="flex items-start gap-3 bg-[#0B1120] border border-red-500/30 p-4 rounded-2xl">
        <div className="w-1 self-stretch rounded-full bg-red-500 flex-shrink-0" />
        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <p className="flex-1 text-sm font-bold text-red-300">{msg}</p>
        <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
    </motion.div>
);

const SuccessBanner = ({ msg, onClose }) => (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        className="flex items-start gap-3 bg-[#0B1120] border border-[#39FF14]/30 p-4 rounded-2xl">
        <div className="w-1 self-stretch rounded-full bg-[#39FF14] flex-shrink-0" />
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#39FF14' }} />
        <p className="flex-1 text-sm font-bold" style={{ color: '#39FF14' }}>{msg}</p>
        <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
    </motion.div>
);

// Themed OTP input
const OtpInput = ({ value, onChange }) => (
    <input
        type="text" inputMode="numeric"
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        required
        placeholder="——————"
        className="w-full bg-[#0B1120] border border-white/10 rounded-2xl px-6 py-5 text-center text-4xl tracking-[0.6em] text-white font-black focus:outline-none transition-all"
        onFocus={e => e.target.style.borderColor = '#39FF14'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
    />
);

export default function SecurityPage() {
    const { data: userStats, mutate: mutateUser } = useSWR('/api/dashboard/stats', fetcher);
    const [setupData, setSetupData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [disableCode, setDisableCode] = useState('');
    const [isDisabling, setIsDisabling] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [copied, setCopied] = useState(false);

    const is2FAEnabled = userStats?.user?.isTwoFactorEnabled;

    const copySecret = () => {
        if (setupData?.secret) {
            navigator.clipboard.writeText(setupData.secret);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleGenerateSetup = async () => {
        setIsGenerating(true); setError('');
        try {
            const res = await fetch('/api/auth/2fa/setup');
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to start 2FA setup');
            setSetupData(result);
        } catch (err) { setError(err.message); }
        finally { setIsGenerating(false); }
    };

    const handleEnable2FA = async (e) => {
        e.preventDefault(); setIsVerifying(true); setError(''); setSuccessMsg('');
        try {
            const res = await fetch('/api/auth/2fa/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret: setupData.secret, token: verifyCode })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Verification failed');
            setSuccessMsg('2FA enabled — your account is now protected.');
            setSetupData(null); setVerifyCode(''); mutateUser();
        } catch (err) { setError(err.message); }
        finally { setIsVerifying(false); }
    };

    const handleDisable2FA = async (e) => {
        e.preventDefault(); setIsDisabling(true); setError(''); setSuccessMsg('');
        try {
            const res = await fetch('/api/auth/2fa/disable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: disableCode })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to disable 2FA');
            setSuccessMsg('2FA disabled successfully.');
            setDisableCode(''); mutateUser();
        } catch (err) { setError(err.message); }
        finally { setIsDisabling(false); }
    };

    return (
        <div className="max-w-3xl space-y-6">

            {/* Page header */}
            <div>
                <h1 className="text-3xl font-black text-[#0B1120] mb-1.5 tracking-tight flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8" style={{ color: '#39FF14' }} />
                    Security Settings
                </h1>
                <p className="text-slate-400 font-medium text-sm">Manage two-factor authentication for your account.</p>
            </div>

            {/* Alert banners */}
            <AnimatePresence>
                {error && <ErrorBanner msg={error} onClose={() => setError('')} />}
                {successMsg && <SuccessBanner msg={successMsg} onClose={() => setSuccessMsg('')} />}
            </AnimatePresence>

            {/* Main card — dark navy */}
            <div className="bg-[#0B1120] rounded-3xl border border-white/[0.07] overflow-hidden">

                {/* Status strip */}
                <div className={`flex items-center gap-4 px-7 py-5 border-b ${is2FAEnabled ? 'border-[#39FF14]/20 bg-[#39FF14]/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${is2FAEnabled ? 'bg-[#39FF14]/10' : 'bg-amber-500/10'}`}>
                        {is2FAEnabled
                            ? <Lock className="w-5 h-5" style={{ color: '#39FF14' }} />
                            : <Unlock className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div className="flex-1">
                        <p className={`font-black text-sm ${is2FAEnabled ? 'text-[#39FF14]' : 'text-amber-400'}`}>
                            {is2FAEnabled ? '2FA is Active' : '2FA is Not Enabled'}
                        </p>
                        <p className="text-slate-500 text-xs font-medium mt-0.5">
                            {is2FAEnabled
                                ? 'Your account requires an authenticator code on each login.'
                                : 'Add an extra layer of protection beyond your password.'}
                        </p>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${is2FAEnabled ? 'bg-[#39FF14] shadow-[0_0_8px_#39FF14]' : 'bg-amber-400'}`} />
                </div>

                <div className="p-7">

                    {/* ── DISABLE FLOW ─────────────────────────────── */}
                    {is2FAEnabled && (
                        <div className="space-y-5">
                            <div>
                                <h4 className="text-white font-black text-lg mb-1">Disable Two-Factor Authentication</h4>
                                <p className="text-slate-500 text-sm">Enter your current authenticator code to confirm and disable 2FA.</p>
                            </div>
                            <form onSubmit={handleDisable2FA} className="max-w-xs space-y-4">
                                <OtpInput value={disableCode} onChange={setDisableCode} />
                                <button type="submit" disabled={isDisabling || disableCode.length !== 6}
                                    className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-black py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-40 text-sm">
                                    {isDisabling ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Unlock className="w-4 h-4" /> Disable 2FA</>}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ── SETUP: START ─────────────────────────────── */}
                    {!is2FAEnabled && !setupData && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-white font-black text-lg mb-1">Set Up Authenticator App</h4>
                                <p className="text-slate-500 text-sm">Use Google Authenticator, Authy, or any TOTP app to scan a QR code and enable 2FA.</p>
                            </div>
                            <div className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                                <Smartphone className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                                <p className="text-slate-400 text-sm font-medium">Once enabled, you will need your authenticator app every time you log in. You can also use email OTP as a fallback.</p>
                            </div>
                            <button onClick={handleGenerateSetup} disabled={isGenerating}
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm transition-all disabled:opacity-50"
                                style={{ background: '#39FF14', color: '#0B1120', boxShadow: '0 0 20px rgba(57,255,20,0.2)' }}>
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><KeyRound className="w-4 h-4" /> Begin Setup</>}
                            </button>
                        </div>
                    )}

                    {/* ── SETUP: QR + VERIFY ───────────────────────── */}
                    {!is2FAEnabled && setupData && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                            {/* Step 1: QR */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0" style={{ background: '#39FF14', color: '#0B1120' }}>1</span>
                                    <h4 className="text-white font-black text-lg">Scan the QR Code</h4>
                                </div>
                                <p className="text-slate-500 text-sm ml-9">Open your authenticator app and scan the image below.</p>

                                <div className="flex flex-col md:flex-row items-center gap-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                                    {/* QR */}
                                    <div className="bg-white p-3 rounded-2xl flex-shrink-0">
                                        <Image src={setupData.qrCodeDataUrl} alt="2FA QR Code" width={180} height={180} className="rounded-xl" />
                                    </div>
                                    {/* Manual entry */}
                                    <div className="space-y-3 w-full text-center md:text-left">
                                        <p className="text-white font-bold text-sm">Can't scan the code?</p>
                                        <p className="text-slate-500 text-xs">Enter this key manually in your app:</p>
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <code className="bg-white/[0.06] border border-white/10 px-3 py-2 rounded-lg font-mono text-sm font-bold tracking-wider" style={{ color: '#39FF14' }}>
                                                {setupData.secret}
                                            </code>
                                            <button onClick={copySecret}
                                                className="p-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                                                {copied ? <CheckCircle2 className="w-4 h-4" style={{ color: '#39FF14' }} /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <p className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg inline-block">
                                            Never share this key with anyone.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Verify */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0" style={{ background: '#39FF14', color: '#0B1120' }}>2</span>
                                    <h4 className="text-white font-black text-lg">Verify & Activate</h4>
                                </div>
                                <p className="text-slate-500 text-sm ml-9">Enter the 6-digit code from your app to confirm setup.</p>

                                <form onSubmit={handleEnable2FA} className="max-w-xs space-y-4 ml-9">
                                    <OtpInput value={verifyCode} onChange={setVerifyCode} />
                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setSetupData(null)}
                                            className="w-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 font-bold py-3.5 rounded-xl transition-all text-sm">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={isVerifying || verifyCode.length !== 6}
                                            className="w-full font-black py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-40 text-sm"
                                            style={{ background: '#39FF14', color: '#0B1120' }}>
                                            {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate 2FA'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
}
