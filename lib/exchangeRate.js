let cachedRate = null;
let lastFetched = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getExchangeRate() {
    const now = Date.now();

    // Return cached rate if still valid
    if (cachedRate && (now - lastFetched) < CACHE_TTL) {
        return cachedRate;
    }

    const keys = [
        process.env.LIVECOINWATCH_API_KEY_1,
        process.env.LIVECOINWATCH_API_KEY_2
    ].filter(Boolean);

    const fallbackRate = parseFloat(process.env.INR_TO_USDT || '85');

    if (keys.length === 0) {
        console.warn("LiveCoinWatch API keys missing. Using fallback rate.");
        return fallbackRate;
    }

    const fetchRate = async (apiKey) => {
        const response = await fetch('https://api.livecoinwatch.com/coins/map', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify({
                currency: "INR",
                codes: ["USDT"],
                meta: false
            })
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        // The API returns an array for /coins/map
        if (Array.isArray(data) && data.length > 0 && data[0].rate) {
            return data[0].rate;
        }

        throw new Error("Invalid rate data format");
    };

    // Try each key until one works
    for (const key of keys) {
        try {
            const rate = await fetchRate(key);
            cachedRate = rate;
            lastFetched = now;
            console.log(`Successfully fetched live rate: ${rate} using LCW API`);
            return rate;
        } catch (error) {
            console.error(`LCW API Key error: ${error.message}. Trying next key...`);
        }
    }

    // All keys failed
    console.warn("All LiveCoinWatch API calls failed. Using fallback rate.");
    return fallbackRate;
}
