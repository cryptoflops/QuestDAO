export async function onRequest(context) {
  const { request } = context;
  
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Hiro-Signature',
      },
    });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('x-hiro-signature');
    
    if (!body) {
      return new Response(JSON.stringify({ message: 'Empty body' }), { status: 200 });
    }

    const payload = JSON.parse(body);
    const network = payload?.event?.network || payload?.network || 'mainnet';
    const secret = network === 'mainnet' 
      ? context.env?.HIRO_CHAINHOOK_SECRET_MAINNET 
      : context.env?.HIRO_CHAINHOOK_SECRET_TESTNET;

    if (secret && signature) {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
      const sigBytes = new Uint8Array(signature.match(/.{2}/g).map(b => parseInt(b, 16)));
      const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(body));
      if (!valid) {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401 });
      }
    }

    const applyBlocks = payload?.event?.apply || payload?.apply || [];
    const transactions = applyBlocks?.[0]?.transactions || [];
    let processed = 0;
    transactions.forEach((tx) => {
      const events = tx?.metadata?.receipt?.events || [];
      processed += events.length;
    });

    return new Response(JSON.stringify({ processed: true, events: processed }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal processing error' }), { status: 200 });
  }
}
