let cachedRate = null;
let lastFetched = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Returns the current USD → INR exchange rate.
 * Priority:
 *   1. In-memory cache (refreshed every 5 min)
 *   2. LiveCoinWatch API (if keys are set)
 *   3. Free open.er-api.com (no key required)
 *   4. env var INR_TO_USDT fallback (default 87)
 */
export async function getExchangeRate() {
    const now = Date.now();

    // Return cached rate if still valid
    if (cachedRate && (now - lastFetched) < CACHE_TTL) {
        return cachedRate;
    }

    const fallbackRate = parseFloat(process.env.INR_TO_USDT || '87');

    // --- Try LiveCoinWatch (USDT/INR via their API) ---
    const lcwKeys = [
        process.env.LIVECOINWATCH_API_KEY_1,
        process.env.LIVECOINWATCH_API_KEY_2
    ].filter(Boolean);

    if (lcwKeys.length > 0) {
        for (const apiKey of lcwKeys) {
            try {
                const response = await fetch('https://api.livecoinwatch.com/coins/map', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey
                    },
                    body: JSON.stringify({ currency: 'INR', codes: ['USDT'], meta: false })
                });
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0 && data[0].rate) {
                        cachedRate = data[0].rate;
                        lastFetched = now;
                        console.log(`[ExchangeRate] LCW live rate: ${cachedRate} INR/USDT`);
                        return cachedRate;
                    }
                }
            } catch (err) {
                console.error(`[ExchangeRate] LCW error: ${err.message}`);
            }
        }
    }

    // --- Try free open.er-api.com (no key needed) ---
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD', {
            next: { revalidate: 300 } // 5-min revalidate for Next.js fetch cache
        });
        if (response.ok) {
            const data = await response.json();
            if (data?.rates?.INR) {
                cachedRate = data.rates.INR;
                lastFetched = now;
                console.log(`[ExchangeRate] open.er-api live rate: ${cachedRate} INR/USD`);
                return cachedRate;
            }
        }
    } catch (err) {
        console.error(`[ExchangeRate] open.er-api error: ${err.message}`);
    }

    // --- Final fallback ---
    console.warn(`[ExchangeRate] All sources failed. Using fallback rate: ${fallbackRate}`);
    return fallbackRate;
}
