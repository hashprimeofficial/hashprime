import mongoose from 'mongoose';

const businessEnquirySchema = new mongoose.Schema({
    name:            { type: String, required: true, trim: true },
    phone:           { type: String, required: true, trim: true },
    email:           { type: String, required: true, trim: true, lowercase: true },
    fieldOfInquiry:  { type: String, required: true },
    // Page/service source — e.g. 'telecom', 'ac', 'construction', 'tourism', etc.
    source:          { type: String, default: 'general' },
    // Free-form extra details from extended forms
    details:         { type: String, default: '' },
    contactDateTime: { type: String, required: true },
    status:          { type: String, enum: ['pending', 'contacted', 'closed'], default: 'pending' },
}, {
    timestamps: true,
});

export default mongoose.models.BusinessEnquiry || mongoose.model('BusinessEnquiry', businessEnquirySchema);
