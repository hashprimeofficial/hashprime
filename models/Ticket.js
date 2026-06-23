import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            default: 'General',
        },
        subCategory: {
            type: String,
            default: '',
        },
        screenshotUrl: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['open', 'resolved'],
            default: 'open',
        },
        adminReply: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
