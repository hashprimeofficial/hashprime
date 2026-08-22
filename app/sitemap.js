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
        '/fiberoptical-services',
        '/trading-services',
        '/tourism-services',
        '/mechanical-machinery-services',
        '/abroad-job-consultancy',
        '/ericsson-specialized-telecom',
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
            url: `${BASE_URL}/company-facts`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.95,
        },
        {
            url: `${BASE_URL}/hash-prime-groups`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/company`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/compliance`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.85,
        },
        {
            url: `${BASE_URL}/grievance-redressal`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.85,
        },
        {
            url: `${BASE_URL}/schemes`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.85,
        },
        {
            url: `${BASE_URL}/features`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },

        // ── Dedicated Business Landing Pages ───────────────────
        ...businessPages.map((slug) => ({
            url: `${BASE_URL}${slug}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
        })),

        // ── Institutional Trust, Security & Legal ──────────────────
        {
            url: `${BASE_URL}/careers`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/security`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ];
}
