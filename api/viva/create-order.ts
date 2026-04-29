import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Viva Payments API - Create Payment Order with Notification
 * This serverless function handles the secure creation of a payment order
 * and triggers an automatic email notification to the customer.
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { amount, customerEmail, customerName, planName, language } = req.body;

  if (!amount || !customerEmail) {
    return res.status(400).json({ error: 'Missing required payment data' });
  }

  const MERCHANT_ID = process.env.VIVA_MERCHANT_ID;
  const API_KEY = process.env.VIVA_API_KEY;
  // Source code is usually defined in Viva dashboard for specific tracking
  const SOURCE_CODE = process.env.VIVA_SOURCE_CODE || 'Default';

  if (!MERCHANT_ID || !API_KEY) {
    console.error('[Viva API] Missing environment variables: VIVA_MERCHANT_ID or VIVA_API_KEY');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Determine if we should use Demo or Production API
    const isProd = process.env.NODE_ENV === 'production';
    const baseUrl = isProd 
      ? 'https://api.vivapayments.com' 
      : 'https://demo-api.vivapayments.com';

    console.log(`[Viva API] Creating order for ${customerEmail} - ${amount} cents on ${baseUrl}`);

    // Map application language to Viva supported languages
    const langMap: Record<string, string> = {
      'en': 'en-GB',
      'pt': 'pt-PT',
      'es': 'es-ES'
    };
    const requestLang = langMap[language] || 'en-GB';

    const response = await fetch(`${baseUrl}/checkout/v2/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${MERCHANT_ID}:${API_KEY}`).toString('base64')
      },
      body: JSON.stringify({
        amount: amount,
        customer: {
          email: customerEmail,
          fullName: customerName,
          requestLang: requestLang
        },
        paymentNotification: true,
        customerTrns: `Euler Market: ${planName}`,
        merchantTrns: `EULR-ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sourceCode: SOURCE_CODE,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Viva API] Viva Error:', data);
      return res.status(response.status).json({ 
        error: 'Viva API error', 
        details: data 
      });
    }

    // Success! Viva will now handle the email sending.
    return res.status(200).json({ 
      success: true, 
      orderCode: data.orderCode 
    });

  } catch (error) {
    console.error('[Viva API] Exception:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
