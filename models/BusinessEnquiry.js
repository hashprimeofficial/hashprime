import mongoose from 'mongoose';

const businessEnquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    fieldOfInquiry: { type: String, required: true },
    contactDateTime: { type: String, required: true },
    status: { type: String, enum: ['pending', 'contacted', 'closed'], default: 'pending' },
}, {
    timestamps: true,
});

export default mongoose.models.BusinessEnquiry || mongoose.model('BusinessEnquiry', businessEnquirySchema);
