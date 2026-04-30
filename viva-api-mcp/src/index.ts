#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios, { AxiosError } from "axios";

/**
 * MCP Server for Viva.com Payment API.
 * Provides tools for creating payment orders and managing transactions.
 */

// Configuration
const VIVA_API_URL = process.env.VIVA_API_URL || "https://demo-api.vivapayments.com";
const VIVA_ACCOUNTS_URL = process.env.VIVA_ACCOUNTS_URL || "https://demo-accounts.vivapayments.com";
const CLIENT_ID = process.env.VIVA_CLIENT_ID;
const CLIENT_SECRET = process.env.VIVA_CLIENT_SECRET;
const SOURCE_CODE = process.env.VIVA_SOURCE_CODE || "Default";

// Create MCP server instance
const server = new McpServer({
  name: "viva-api-mcp",
  version: "1.0.0"
});

// Helper: Get OAuth2 Token
async function getAccessToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("VIVA_CLIENT_ID and VIVA_CLIENT_SECRET environment variables are required");
  }

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  try {
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
  } catch (error) {
    console.error("Failed to get Viva access token:", (error as AxiosError).response?.data || (error as Error).message);
    throw new Error("Authentication with Viva failed");
  }
}

// Tool: Create Payment Order
server.registerTool(
  "viva_create_payment_order",
  {
    title: "Create Viva Payment Order",
    description: `Creates a new payment order in Viva.com and optionally sends a notification email to the customer.
    
Args:
  - amount (number): Amount in cents (e.g., 999 for 9.99)
  - email (string): Customer email address
  - fullName (string): Customer full name
  - customerTrns (string): A description of the transaction that the customer will see
  - merchantTrns (string): Internal merchant transaction reference
  - paymentNotification (boolean): Whether to send a payment notification email (default: true)
  - sourceCode (string): The source code for the payment (default: from env or 'Default')

Returns:
  The order code and redirect URL for the payment.`,
    inputSchema: z.object({
      amount: z.number().int().positive().describe("Amount in cents"),
      email: z.string().email().describe("Customer email"),
      fullName: z.string().min(1).describe("Customer full name"),
      customerTrns: z.string().describe("Customer-facing transaction description"),
      merchantTrns: z.string().optional().describe("Merchant-facing transaction reference"),
      paymentNotification: z.boolean().default(true).describe("Send email notification"),
      sourceCode: z.string().optional().describe("Viva source code")
    }).strict(),
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false
    }
  },
  async (params) => {
    try {
      const token = await getAccessToken();
      
      const response = await axios.post(
        `${VIVA_API_URL}/checkout/v2/orders`,
        {
          amount: params.amount,
          customerTrns: params.customerTrns,
          customer: {
            email: params.email,
            fullName: params.fullName,
            requestLang: "en-GB", // Default to English
            countryCode: "GB"      // Default to GB
          },
          paymentNotification: params.paymentNotification,
          sourceCode: params.sourceCode || SOURCE_CODE,
          merchantTrns: params.merchantTrns || `order_${Date.now()}`
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const orderData = response.data;
      const checkoutUrl = `${VIVA_API_URL.replace('api', 'www')}/web/checkout?ref=${orderData.orderCode}`;

      const output = {
        orderCode: orderData.orderCode,
        checkoutUrl,
        message: params.paymentNotification 
          ? `Payment order created. Notification sent to ${params.email}.`
          : `Payment order created. Redirect the user to: ${checkoutUrl}`
      };

      return {
        content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
        structuredContent: output
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data 
        ? JSON.stringify(axiosError.response.data) 
        : axiosError.message;
      
      return {
        content: [{ type: "text", text: `Error creating Viva order: ${errorMessage}` }],
        isError: true
      };
    }
  }
);

// Main entry point
const transport = new StdioServerTransport();
server.connect(transport).catch(error => {
  console.error("Fatal error in Viva MCP server:", error);
  process.exit(1);
});
