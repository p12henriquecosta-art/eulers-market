import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Viva Payments API - Create Payment Order with OAuth 2.0
 * This serverless function handles the secure creation of a payment order
 * and triggers an automatic email notification to the customer.
 */

// Configuration
// Use demo or prod URL based on environment.
const VIVA_API_URL = process.env.VIVA_API_URL || "https://demo-api.vivapayments.com";
const VIVA_ACCOUNTS_URL = process.env.VIVA_ACCOUNTS_URL || "https://demo-accounts.vivapayments.com";
const CLIENT_ID = process.env.VIVA_CLIENT_ID;
const CLIENT_SECRET = process.env.VIVA_CLIENT_SECRET;
const SOURCE_CODE = process.env.VIVA_SOURCE_CODE || "Default";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { amount, customerEmail, customerName, planName, language } = req.body;

  if (!amount || !customerEmail) {
    return res.status(400).json({ error: 'Missing required payment data' });
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('[Viva API] Missing VIVA_CLIENT_ID or VIVA_CLIENT_SECRET');
    return res.status(500).json({ error: 'Server misconfiguration: Missing Viva Wallet Smart Checkout credentials' });
  }

  try {
    console.log(`[Viva API] Step 1: Getting access token...`);

    const auth = Buffer.from(`${CLIENT_ID.trim()}:${CLIENT_SECRET.trim()}`).toString("base64");
    
    // Step 1: Get Access Token
    const tokenResponse = await fetch(`${VIVA_ACCOUNTS_URL}/connect/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const tokenText = await tokenResponse.text();
    let tokenData: any;
    try {
      tokenData = tokenText ? JSON.parse(tokenText) : {};
    } catch {
      console.error('[Viva API] Failed to parse token response:', tokenText);
      return res.status(500).json({ error: 'Invalid response from token endpoint' });
    }

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('[Viva API] Token request failed:', tokenData);
      return res.status(tokenResponse.status || 500).json({
        error: 'Failed to obtain access token',
        details: tokenData
      });
    }

    const accessToken = tokenData.access_token;
    console.log(`[Viva API] Step 2: Creating order for ${customerEmail} - ${amount} cents`);

    // Map application language to Viva supported languages
    const langMap: Record<string, string> = {
      'en': 'en-GB',
      'pt': 'pt-PT',
      'es': 'es-ES'
    };
    const requestLang = langMap[language] || 'en-GB';

    const vivaUrl = `${VIVA_API_URL}/checkout/v2/orders`;
    console.log(`[Viva API] Posting to: ${vivaUrl}`);

    // Step 2: Create Order
    const response = await fetch(vivaUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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

