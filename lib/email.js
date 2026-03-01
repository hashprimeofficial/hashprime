import nodemailer from 'nodemailer';

// Configure the nodemailer transporter using environment variables.
// Users must provide these in .env.local for emails to actually send.
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Sends an email with the provided options.
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body (HTML format)
 */
export async function sendEmail({ to, subject, html }) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ SMTP credentials not found in environment variables. Email will not be sent.');
        console.warn(`Email intended for ${to} | Subject: ${subject}`);
        console.warn(`Content: ${html}`);
        return; // Early return to prevent crashing in dev if keys aren't set
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"HashPrime" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log(`Email sent successfully to ${to} (MessageId: ${info.messageId})`);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
