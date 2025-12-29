import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const payload = await request.json();

        // Log the incoming event for debugging
        console.log('[Chainhook] Received event:', JSON.stringify(payload, null, 2));

        // Note: Hiro Chainhooks send a payload containing an array of transactions.
        // Each transaction might contain one or more events.

        const applyAction = payload.apply?.[0];
        if (applyAction) {
            const transactions = applyAction.transactions || [];

            transactions.forEach((tx: any) => {
                const metadata = tx.metadata || {};
                const events = metadata.receipt?.events || [];

                events.forEach((event: any) => {
                    if (event.type === 'SmartContractEvent') {
                        const contractEvent = event.data;
                        console.log(`[Chainhook] Processing Contract Event: ${contractEvent.topic}`);

                        // Actionable logic here:
                        // e.g., Trigger a Discord webhook, invalidate a Vercel cache,
                        // or update a localized state if we had a persistent backend.
                    }
                });
            });
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('[Chainhook] Error processing webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Ensure the endpoint is reachable (avoiding some CSRF/CORS issues with external hooks)
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
