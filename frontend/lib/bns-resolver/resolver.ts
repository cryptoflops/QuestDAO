/**
 * Stacks BNS Resolver
 * A standalone utility to resolve Stacks addresses to BNS names.
 */

export interface BnsResponse {
    names: string[];
}

const DEFAULT_API_URL = 'https://api.hiro.so';

export class BnsResolver {
    private apiUrl: string;
    private cache: Map<string, string | null>;

    constructor(apiUrl: string = DEFAULT_API_URL) {
        this.apiUrl = apiUrl;
        this.cache = new Map();
    }

    /**
     * Resolves a Stacks address to its primary BNS name.
     * @param address The Stacks address (SP... or ST...)
     * @returns The primary BNS name (e.g., satoshi.btc) or null if not found.
     */
    async resolveName(address: string): Promise<string | null> {
        const cached = this.cache.get(address);
        if (cached !== undefined) {
            return cached;
        }

        try {
            const response = await fetch(`${this.apiUrl}/v1/names/address/${address}`);
            if (!response.ok) {
                this.cache.set(address, null);
                return null;
            }

            const data = (await response.json()) as BnsResponse;
            if (data.names && data.names.length > 0) {
                const primaryName = data.names[0] ?? null;
                this.cache.set(address, primaryName);
                return primaryName;
            }

            this.cache.set(address, null);
            return null;
        } catch (error) {
            console.error(`[BnsResolver] Error resolving ${address}:`, error);
            return null;
        }
    }

    /**
     * Clears the internal cache.
     */
    clearCache(): void {
        this.cache.clear();
    }
}

/**
 * Singleton instance for easy usage.
 */
export const defaultResolver: BnsResolver = new BnsResolver();
