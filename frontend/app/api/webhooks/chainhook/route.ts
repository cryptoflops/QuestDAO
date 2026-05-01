import { NextResponse } from 'next/server';
import { Chainhook } from '@hirosystems/chainhooks-client';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-hiro-signature');
        
        // Parse payload (using any to support both v1 and v2 SDK structures)
        const payload: any = JSON.parse(body);
        
        // Hiro v2: payload.event.network | Hiro v1: payload.network
        const network = payload.event?.network || payload.network || 'mainnet';
        
        const secret = network === 'mainnet' 
            ? process.env.HIRO_CHAINHOOK_SECRET_MAINNET 
            : process.env.HIRO_CHAINHOOK_SECRET_TESTNET;

        // 1. Verify Signature (if secret is configured for the detected network)
        if (secret && signature) {
            const hmac = crypto.createHmac('sha256', secret);
            const digest = hmac.update(body).digest('hex');
            if (signature !== digest) {
                console.warn(`[Chainhook] Invalid signature detected for ${network}.`);
                return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
        }

        // 2. Log event
        console.log(`[Chainhook] Received event for network: ${network}`);
        
        // 3. Process transactions
        // Hiro v2 structure: payload.event.apply | Hiro v1: payload.apply
        const applyBlocks = payload.event?.apply || payload.apply || [];
        const transactions = applyBlocks[0]?.transactions || [];
        
        transactions.forEach((tx: any) => {
            const events = tx.metadata?.receipt?.events || [];
            events.forEach((event: any) => {
                if (event.type === 'SmartContractEvent') {
                    console.log(`[Chainhook] Event: ${event.data.topic} from ${event.data.contract_identifier}`);
                }
            });
        });

        return NextResponse.json({ processed: true }, { status: 200 });
    } catch (error) {
        console.error('[Chainhook] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Hiro-Signature',
        },
    });
}
