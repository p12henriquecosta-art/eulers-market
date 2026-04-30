import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

/**
 * Viva Payments API - Create Payment Order with OAuth2
 * This serverless function handles the secure creation of a payment order
 * and triggers an automatic email notification to the customer.
 */

// Configuration
const VIVA_API_URL = process.env.VIVA_API_URL || "https://demo-api.vivapayments.com";
const VIVA_ACCOUNTS_URL = process.env.VIVA_ACCOUNTS_URL || "https://demo-accounts.vivapayments.com";
const CLIENT_ID = process.env.VIVA_CLIENT_ID;
const CLIENT_SECRET = process.env.VIVA_CLIENT_SECRET;
const SOURCE_CODE = process.env.VIVA_SOURCE_CODE || "Default";

async function getAccessToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("VIVA_CLIENT_ID and VIVA_CLIENT_SECRET environment variables are required");
  }

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const response = await axios.post(
    `${VIVA_ACCOUNTS_URL}/connect/token`,
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${auth}`
      }
    }
  );
  return response.data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { amount, customerEmail, customerName, planName, language } = req.body;

  if (!amount || !customerEmail) {
    return res.status(400).json({ error: 'Missing required payment data' });
  }

  try {
    console.log(`[Viva API] Creating order for ${customerEmail} - ${amount} cents`);

    const token = await getAccessToken();

    // Map application language to Viva supported languages
    const langMap: Record<string, string> = {
      'en': 'en-GB',
      'pt': 'pt-PT',
      'es': 'es-ES'
    };
    const requestLang = langMap[language] || 'en-GB';

    const response = await axios.post(
      `${VIVA_API_URL}/checkout/v2/orders`,
      {
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
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data;

    // Success! Viva will now handle the email sending.
    return res.status(200).json({ 
      success: true, 
      orderCode: data.orderCode 
    });

  } catch (error: any) {
    console.error('[Viva API] Error:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'Internal server error';
    
    return res.status(status).json({ 
      error: 'Viva API error', 
      message 
    });
  }
}

