import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64 string to Cloudinary
 * @param {string} fileStr - Base64 encoded string of the file
 * @param {string} folder - The folder in Cloudinary to store the image
 * @returns {Promise<string>} The secure URL of the uploaded image
 */
export async function uploadToCloudinary(fileStr, folder = 'hashprime_kyc') {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.warn('⚠️ Cloudinary keys are missing! Upload will fail or return a dummy URL.');
        // For development/testing purposes without keys, you might just throw an error or return a fake URL.
        // It's safer to throw so we don't save fake data if the intention is to use Cloudinary.
        throw new Error('Cloudinary environment variables not set');
    }

    try {
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            folder: folder,
            resource_type: 'auto', // supports images, pdfs, etc.
        });
        return uploadResponse.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
}
