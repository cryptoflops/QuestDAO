import { API_URL } from './constants';

const bnsCache: Record<string, string | null> = {};

/**
 * Resolves a Stacks address to a BNS name (e.g., satoshi.btc).
 * Uses caching to avoid redundant API calls.
 */
export async function resolveBnsName(address: string): Promise<string | null> {
    if (bnsCache[address] !== undefined) {
        return bnsCache[address];
    }

    try {
        const response = await fetch(`${API_URL}/v1/names/address/${address}`);
        if (!response.ok) {
            bnsCache[address] = null;
            return null;
        }

        const data = await response.json();
        // The API returns an object with a 'names' array
        if (data.names && data.names.length > 0) {
            const name = data.names[0];
            bnsCache[address] = name;
            return name;
        }

        bnsCache[address] = null;
        return null;
    } catch (error) {
        console.error(`BNS resolution failed for ${address}:`, error);
        return null;
    }
}
