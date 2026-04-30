import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Viva Payments API - Create Payment Order with Basic Auth
 * This serverless function handles the secure creation of a payment order
 * and triggers an automatic email notification to the customer.
 */

// Configuration
// Use demo or prod URL based on environment.
const VIVA_API_URL = process.env.VIVA_API_URL || "https://demo-api.vivapayments.com";
const MERCHANT_ID = process.env.VIVA_MERCHANT_ID;
const API_KEY = process.env.VIVA_API_KEY;
const SOURCE_CODE = process.env.VIVA_SOURCE_CODE || "Default";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { amount, customerEmail, customerName, planName, language } = req.body;

  if (!amount || !customerEmail) {
    return res.status(400).json({ error: 'Missing required payment data' });
  }

  if (!MERCHANT_ID || !API_KEY) {
    console.error('[Viva API] Missing VIVA_MERCHANT_ID or VIVA_API_KEY');
    return res.status(500).json({ error: 'Server misconfiguration: Missing Viva Wallet credentials' });
  }

  try {
    console.log(`[Viva API] Creating order for ${customerEmail} - ${amount} cents`);

    const auth = Buffer.from(`${MERCHANT_ID?.trim()}:${API_KEY?.trim()}`).toString("base64");

    // Map application language to Viva supported languages
    const langMap: Record<string, string> = {
      'en': 'en-GB',
      'pt': 'pt-PT',
      'es': 'es-ES'
    };
    const requestLang = langMap[language] || 'en-GB';

    const vivaUrl = `${VIVA_API_URL}/checkout/v2/orders`;
    console.log(`[Viva API] Posting to: ${vivaUrl}`);

    const response = await fetch(vivaUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        customer: {
          email: customerEmail,
          fullName: customerName || 'Visionary Customer',
          requestLang: requestLang
        },
        paymentNotification: true,
        customerTrns: `Euler Market: ${planName}`,
        merchantTrns: `EULR-ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sourceCode: SOURCE_CODE,
      })
    });

    // Safely parse response — Viva may return empty body on auth failures
    const responseText = await response.text();
    console.log(`[Viva API] Status: ${response.status}, Body: ${responseText.substring(0, 500)}`);

    let data: any;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = { rawBody: responseText };
    }

    if (!response.ok) {
      console.error('[Viva API] Error response from Viva:', data);
      return res.status(response.status).json({
        error: 'Viva API error',
        status: response.status,
        vivaUrl: vivaUrl,
        merchantIdPrefix: MERCHANT_ID ? MERCHANT_ID.trim().substring(0, 5) : 'MISSING',
        apiKeyLength: API_KEY ? API_KEY.trim().length : 0,
        message: data.message || data.rawBody || `Viva returned HTTP ${response.status}`
      });
    }

    // Success! Viva will now handle the email sending.
    return res.status(200).json({ 
      success: true, 
      orderCode: data.orderCode 
    });

  } catch (error: any) {
    console.error('[Viva API] Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}

