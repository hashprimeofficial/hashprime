'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { User, CheckCircle2, AlertCircle, Loader2, Clock } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

function ProfileSkeleton() {
    // ... basic skeleton
    return (
        <div className="space-y-8 animate-pulse">
            <div>
                <div className="h-9 bg-slate-100 rounded-lg w-48 mb-2" />
                <div className="h-5 bg-slate-100 rounded-lg w-72" />
            </div>
            <div className="h-64 bg-slate-100 rounded-2xl" />
            <div className="h-64 bg-slate-100 rounded-2xl" />
        </div>
    );
}

export default function ProfilePage() {
    const { data: authData, mutate: mutateAuth } = useSWR('/api/auth/me', fetcher);
    const { data: profileData, error, isLoading, mutate: mutateProfile } = useSWR('/api/profile', fetcher);



    // Profile & KYC State
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', address: '', pincode: '', city: '', state: '', country: '',
        panNumber: '', aadhaarNumber: '', occupation: '', sourceOfIncome: '', incomeRange: '',
        panDocumentUrl: '', aadhaarDocumentUrl: ''
    });

    // Base64 Images specifically for uploading
    const [uploadImages, setUploadImages] = useState({
        panImageBase64: '',
        aadhaarImageBase64: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (profileData?.user) {
            const u = profileData.user;
            setFormData({
                firstName: u.firstName || '',
                lastName: u.lastName || '',
                address: u.address || '',
                pincode: u.pincode || '',
                city: u.city || '',
                state: u.state || '',
                country: u.country || '',
                panNumber: u.panNumber || '',
                aadhaarNumber: u.aadhaarNumber || '',
                occupation: u.occupation || '',
                sourceOfIncome: u.sourceOfIncome || '',
                incomeRange: u.incomeRange || '',
                panDocumentUrl: u.panDocumentUrl || '',
                aadhaarDocumentUrl: u.aadhaarDocumentUrl || ''
            });
        }
    }, [profileData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Merge text form data with base64 images that need uploading
            const payload = { ...formData, ...uploadImages };

            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                mutateProfile();
                // Clear the base64 states after successful upload so we don't re-upload
                setUploadImages({ panImageBase64: '', aadhaarImageBase64: '' });
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsSaving(false);
            setTimeout(() => {
                if (message.type === 'success') setMessage({ type: '', text: '' });
            }, 3000);
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];

            // Validate size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: `${name === 'panImage' ? 'PAN' : 'Aadhaar'} image must be less than 5MB` });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                if (name === 'panImage') {
                    setUploadImages(prev => ({ ...prev, panImageBase64: base64String }));
                } else if (name === 'aadhaarImage') {
                    setUploadImages(prev => ({ ...prev, aadhaarImageBase64: base64String }));
                }
            };
            reader.readAsDataURL(file);
        }
    };



    if (isLoading || !authData) return <ProfileSkeleton />;
    if (error) return <div className="text-red-500 font-bold">Failed to load profile.</div>;

    const authUser = authData.user;
    const user = profileData?.user;

    const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all";

    const renderKycBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>;
            case 'pending': return <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200"><Clock className="w-3.5 h-3.5" /> Verification Pending</span>;
            case 'rejected': return <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200"><AlertCircle className="w-3.5 h-3.5" /> Rejected</span>;
            default: return <span className="flex items-center gap-1 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200"><AlertCircle className="w-3.5 h-3.5" /> Unsubmitted</span>;
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">Profile & Security</h1>
                <p className="text-slate-500 font-medium">Manage your personal information, KYC, and account security.</p>
            </div>

            {/* Account Overview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-navy text-white rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-neon/10 blur-3xl rounded-full" />
                <div className="flex items-center gap-5 relative z-10 text-left">
                    <div className="w-16 h-16 rounded-2xl bg-neon flex items-center justify-center text-3xl font-black text-navy shrink-0 shadow-lg">
                        {authUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="text-xl font-black">{authUser.name}</div>
                        <div className="text-slate-300 text-sm font-medium mt-0.5">{authUser.email}</div>
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-neon" />
                            {authUser.role}
                        </div>
                    </div>
                </div>
                <div className="relative z-10 w-full md:w-auto">
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <p className="text-sm text-slate-300 font-bold mb-1">KYC Status</p>
                        {renderKycBadge(user?.kycStatus)}
                    </div>
                </div>
            </motion.div>

            {message.text && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl font-medium shadow-sm border ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                    {message.text}
                </motion.div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                        <User className="text-blue-500 w-5 h-5" />
                        <h2 className="text-xl font-bold text-navy">Personal Details</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                            <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Pincode</label>
                            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                            <input type="text" name="country" value={formData.country} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* KYC Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                        <CheckCircle2 className="text-green-500 w-5 h-5" />
                        <h2 className="text-xl font-bold text-navy">KYC Information</h2>
                    </div>

                    {user?.kycStatus === 'approved' && (
                        <div className="p-4 mx-6 mt-6 bg-green-50 border border-green-200 text-green-800 rounded-xl font-medium text-sm flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-green-600" />
                            <div>Your KYC is fully verified. You are eligible to invest in all schemes. You cannot modify these details anymore. If you need to make changes, please raise a ticket.</div>
                        </div>
                    )}

                    {user?.kycStatus === 'pending' && (
                        <div className="p-4 mx-6 mt-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl font-medium text-sm flex items-start gap-3">
                            <Clock className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                            <div>Your KYC is currently under review by our admin team. Updating these fields will keep it in pending state.</div>
                        </div>
                    )}

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">PAN Number</label>
                            <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} disabled={user?.kycStatus === 'approved'}
                                className={`${inputClass} uppercase disabled:opacity-60 disabled:cursor-not-allowed`} placeholder="ABCDE1234F" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Aadhaar Number</label>
                            <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} disabled={user?.kycStatus === 'approved'}
                                className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`} placeholder="1234 5678 9012" />
                        </div>

                        {/* PAN Document Upload */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2">PAN Card Document</label>
                            {formData.panDocumentUrl && !uploadImages.panImageBase64 ? (
                                <div className="mb-3 relative group rounded-xl overflow-hidden border border-slate-200">
                                    <img src={formData.panDocumentUrl} alt="PAN Card" className="w-full h-40 object-cover" />
                                    {user?.kycStatus !== 'approved' && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">Replace Image</span>
                                        </div>
                                    )}
                                </div>
                            ) : uploadImages.panImageBase64 ? (
                                <div className="mb-3 relative rounded-xl overflow-hidden border border-neon">
                                    <img src={uploadImages.panImageBase64} alt="New PAN Card" className="w-full h-40 object-cover" />
                                    <div className="absolute top-2 right-2 bg-neon text-navy text-xs font-bold px-2 py-1 rounded">New</div>
                                </div>
                            ) : null}
                            <input
                                type="file"
                                name="panImage"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={user?.kycStatus === 'approved'}
                                className={`w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed ${(!formData.panDocumentUrl && !uploadImages.panImageBase64) ? 'file:bg-neon file:text-navy hover:file:bg-[#32e512]' : ''}`}
                            />
                        </div>

                        {/* Aadhaar Document Upload */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Aadhaar Card Document</label>
                            {formData.aadhaarDocumentUrl && !uploadImages.aadhaarImageBase64 ? (
                                <div className="mb-3 relative group rounded-xl overflow-hidden border border-slate-200">
                                    <img src={formData.aadhaarDocumentUrl} alt="Aadhaar Card" className="w-full h-40 object-cover" />
                                    {user?.kycStatus !== 'approved' && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">Replace Image</span>
                                        </div>
                                    )}
                                </div>
                            ) : uploadImages.aadhaarImageBase64 ? (
                                <div className="mb-3 relative rounded-xl overflow-hidden border border-neon">
                                    <img src={uploadImages.aadhaarImageBase64} alt="New Aadhaar Card" className="w-full h-40 object-cover" />
                                    <div className="absolute top-2 right-2 bg-neon text-navy text-xs font-bold px-2 py-1 rounded">New</div>
                                </div>
                            ) : null}
                            <input
                                type="file"
                                name="aadhaarImage"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={user?.kycStatus === 'approved'}
                                className={`w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed ${(!formData.aadhaarDocumentUrl && !uploadImages.aadhaarImageBase64) ? 'file:bg-neon file:text-navy hover:file:bg-[#32e512]' : ''}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Occupation</label>
                            <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} disabled={user?.kycStatus === 'approved'}
                                className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Source of Income</label>
                            <input type="text" name="sourceOfIncome" value={formData.sourceOfIncome} onChange={handleChange} disabled={user?.kycStatus === 'approved'}
                                className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`} placeholder="e.g. Salary, Business" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Income Range</label>
                            <select name="incomeRange" value={formData.incomeRange} onChange={handleChange} disabled={user?.kycStatus === 'approved'}
                                className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`}>
                                <option value="">Select Range</option>
                                <option value="Below 5L">Below 5L</option>
                                <option value="5L - 10L">5L - 10L</option>
                                <option value="10L - 25L">10L - 25L</option>
                                <option value="Above 25L">Above 25L</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={isSaving || user?.kycStatus === 'approved'}
                        className="bg-neon hover:bg-[#32e512] text-navy font-black py-4 px-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Profile & KYC'}
                    </button>
                </div>
            </form>


        </div>
    );
}
