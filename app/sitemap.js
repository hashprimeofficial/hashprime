const BASE_URL = 'https://hashprime.in';

export default function sitemap() {
    const lastModified = new Date('2026-03-15');

    return [
        // ── Core public pages ─────────────────────────────────────
        {
            url: BASE_URL,
            lastModified,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/features`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/markets`,
            lastModified,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/schemes`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/company`,
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.6,
        },

        // ── Authentication ────────────────────────────────────────
        {
            url: `${BASE_URL}/login`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/register`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/forgot-password`,
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
    ];
}
