'use client';

import useSWR from 'swr';
import { FileText, Download, AlertCircle, FileSpreadsheet } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function UserStatementsPage() {
    const { data, error, isLoading } = useSWR('/api/statements', fetcher);

    const statements = data?.statements || [];

    if (isLoading) return <div className="text-neutral-400 animate-pulse font-medium">Loading account statements...</div>;
    if (error) return <div className="text-red-500 font-bold">Failed to load statements</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 relative pb-20">
            <div>
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#d4af35]/10 rounded-xl flex items-center justify-center border border-[#d4af35]/20">
                        <FileText className="w-5 h-5 text-[#d4af35]" />
                    </div>
                    Account Statements
                </h1>
                <p className="text-[#d4af35]/70 font-medium ml-13">View and download your official platform statements and performance reports.</p>
            </div>

            <div className="bg-[#0A0A0A] border border-[#d4af35]/20 p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-[#d4af35]" />
                    My Statements
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[#d4af35]/5 border-b border-[#d4af35]/10">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Statement Title</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Statement Date</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d4af35]/5">
                            {statements.map((st) => (
                                <tr key={st._id} className="hover:bg-[#d4af35]/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 font-bold text-white text-sm">
                                            <FileText className="w-5 h-5 text-[#d4af35]" />
                                            {st.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-[#d4af35]/50">
                                        {new Date(st.date || st.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <a
                                            href={st.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest bg-[#d4af35]/10 hover:bg-[#d4af35] text-[#d4af35] hover:text-[#0A0A0A] border border-[#d4af35]/30 rounded-xl transition-all shadow-sm"
                                        >
                                            <Download className="w-3.5 h-3.5" /> Download
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            {statements.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-[#d4af35]/40 font-medium">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <AlertCircle className="w-8 h-8 text-[#d4af35]/30" />
                                            <span>No statements have been issued for your account yet.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
