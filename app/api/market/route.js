import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '3', 10);

    const keys = [
        process.env.LIVECOINWATCH_API_KEY_1,
        process.env.LIVECOINWATCH_API_KEY_2
    ].filter(Boolean);

    if (keys.length === 0) {
        console.warn("LiveCoinWatch API keys are missing. Please add them to .env.local");
        return NextResponse.json({ error: 'API keys missing' }, { status: 500 });
    }

    const fetchCryptoData = async (apiKey) => {
        // /coins/list ranks top-N coins without needing specific codes
        // /coins/map is for specific codes (used for the 3-coin ticker)
        const isTicker = limit <= 3;
        const endpoint = isTicker ? 'https://api.livecoinwatch.com/coins/map' : 'https://api.livecoinwatch.com/coins/list';

        const payload = {
            currency: "USD",
            sort: "rank",
            order: "ascending",
            offset: 0,
            limit: limit,
            meta: !isTicker // Full metadata (name, png32, cap etc.) only for markets page
        };

        // coins/map requires a codes array; provide it for the ticker
        if (isTicker) {
            payload.codes = ["BTC", "ETH", "SOL"];
        }

        return await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(payload),
            next: { revalidate: 30 }
        });
    };

    try {
        let response = await fetchCryptoData(keys[0]);

        // If primary key fails (rate limit or auth error) and we have a secondary key, try it
        if (!response.ok && keys.length > 1) {
            console.log("Primary API key failed, switching to fallback key...");
            response = await fetchCryptoData(keys[1]);
        }

        if (!response.ok) {
            throw new Error(`Live Coin Watch API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("API proxy error:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
