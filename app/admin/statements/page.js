'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { FileText, Upload, Trash2, Search, User, Download, FileSpreadsheet, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminStatementsPage() {
    const { data: userData } = useSWR('/api/admin/users?limit=100', fetcher);
    const { data: statementsData, error, isLoading, mutate } = useSWR('/api/admin/statements', fetcher);

    const [selectedUserId, setSelectedUserId] = useState('');
    const [title, setTitle] = useState('');
    const [base64File, setBase64File] = useState('');
    const [fileName, setFileName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const users = userData?.users || [];
    const statements = statementsData?.statements || [];

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'File size must be under 10 MB.' });
            return;
        }

        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setBase64File(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedUserId || !title || !base64File) {
            setMessage({ type: 'error', text: 'Please fill all fields and select a file.' });
            return;
        }

        setIsUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/admin/statements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedUserId, title, base64File })
            });
            const result = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: 'Statement uploaded successfully!' });
                setTitle('');
                setSelectedUserId('');
                setBase64File('');
                setFileName('');
                mutate();
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to upload statement.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this statement?')) return;

        try {
            const res = await fetch(`/api/admin/statements/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                mutate();
            } else {
                alert('Failed to delete statement.');
            }
        } catch (err) {
            console.error('Delete statement error:', err);
        }
    };

    const filteredStatements = statements.filter(st => {
        const query = searchTerm.toLowerCase();
        const userName = st.userId?.name?.toLowerCase() || '';
        const userEmail = st.userId?.email?.toLowerCase() || '';
        const stTitle = st.title?.toLowerCase() || '';
        return userName.includes(query) || userEmail.includes(query) || stTitle.includes(query);
    });

    if (isLoading) return <div className="text-neutral-400 animate-pulse">Loading statements console...</div>;
    if (error) return <div className="text-red-500 font-bold">Failed to load statements data</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#d4af35]/10 rounded-xl flex items-center justify-center border border-[#d4af35]/20">
                        <FileText className="w-5 h-5 text-[#d4af35]" />
                    </div>
                    Statement Management
                </h1>
                <p className="text-[#d4af35]/60 font-medium ml-13 text-sm">Upload, distribute, and audit account statements for platform investors.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Form */}
                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] h-fit">
                    <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-[#d4af35]" />
                        Upload Statement
                    </h2>

                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm font-medium mb-4 flex items-start gap-2 border ${
                            message.type === 'success' 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Select Investor</label>
                            <select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                required
                                className="w-full bg-[#080808] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-all font-medium text-sm"
                            >
                                <option value="">-- Choose User --</option>
                                {users.map(u => (
                                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Statement Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Monthly Wealth Report June 2026"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full bg-[#080808] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-all font-medium text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Statement File (PDF / XLSX / Image)</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-white/5 border-white/10 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 text-[#d4af35] mb-2 animate-bounce" />
                                        <p className="text-xs font-medium text-slate-500">{fileName || 'Click to select file (Max 10MB)'}</p>
                                    </div>
                                    <input type="file" accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg" onChange={handleFileChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full py-4 rounded-xl bg-[#d4af35] hover:bg-[#f5e0a3] text-black font-black uppercase tracking-widest text-xs transition-colors flex justify-center items-center gap-2 shadow-[0_4px_20px_rgba(212,175,53,0.3)] disabled:opacity-50"
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Distribute Statement'}
                        </button>
                    </form>
                </div>

                {/* Statements List */}
                <div className="lg:col-span-2 bg-[#0A0A0A] border border-[#d4af35]/20 p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-[#d4af35]" />
                            Distributed Statements
                        </h2>
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af35]/40" />
                            <input
                                type="text"
                                placeholder="Search user or statement..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-[#080808] border border-[#d4af35]/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4af35]/40 transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-[#d4af35]/5 border-b border-[#d4af35]/10">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Investor</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Statement Title</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Upload Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#d4af35]/5">
                                {filteredStatements.map((st) => (
                                    <tr key={st._id} className="hover:bg-[#d4af35]/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5 text-[#d4af35]" />
                                                {st.userId?.name || 'Deleted User'}
                                            </div>
                                            <div className="text-xs font-medium text-[#d4af35]/50 ml-5">{st.userId?.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white text-sm">{st.title}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-[#d4af35]/50">
                                            {new Date(st.date || st.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <a
                                                    href={st.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-white/5 border border-white/10 hover:border-[#d4af35] text-slate-300 hover:text-[#d4af35] rounded-lg transition-all"
                                                    title="Download / View"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(st._id)}
                                                    className="p-2 bg-red-500/10 border border-red-500/20 hover:border-red-500 text-red-400 rounded-lg transition-all"
                                                    title="Delete Statement"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStatements.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-[#d4af35]/40 font-medium">No statements found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
