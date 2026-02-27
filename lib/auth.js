import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET;
if (!secretKey && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is missing. Halting execution.');
} else if (!secretKey) {
    console.warn('WARNING: Using default JWT_SECRET for development. Do not use in production.');
}
const key = new TextEncoder().encode(secretKey || 'thisismysupersecretkeyforhashprimeapp');

export async function signToken(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d') // 1 day expiration
        .sign(key);
}

export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch (error) {
        return null;
    }
}
