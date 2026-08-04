const BASE_URL = 'https://hashprime.in';

export default function sitemap() {
    const now = new Date();

    const businessPages = [
        '/total-telecom-services',
        '/ac-sales-and-service',
        '/construction-and-works',
        '/real-estate-services',
        '/legal-services',
        '/generator-services',
        '/shelter-and-enclosure-works',
        '/ericsson-specialized-telecom',
        '/fiberoptical-services',
        '/trading-services',
        '/tourism-services',
        '/mechanical-machinery-services',
    ];

    return [
        // ── Core public pages ──────────────────────────────────────
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/features`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/markets`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/schemes`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/company`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/hash-prime-groups`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
        },

        // ── 10 Dedicated Business Landing Pages ───────────────────
        ...businessPages.map((slug) => ({
            url: `${BASE_URL}${slug}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
        })),

        // ── Authentication ─────────────────────────────────────────
        {
            url: `${BASE_URL}/login`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/register`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/forgot-password`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: `${BASE_URL}/careers`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/security`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];
}
