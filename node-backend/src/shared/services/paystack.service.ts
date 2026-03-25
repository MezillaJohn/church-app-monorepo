import { env } from '../../config/env';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

const PAYSTACK_BASE = 'https://api.paystack.co';

interface InitializePayload {
  email: string;
  /** Amount in the smallest currency unit (kobo for NGN) */
  amount: number;
  reference: string;
  callbackUrl?: string;
  currency?: string;
  subaccount?: string;
  metadata?: Record<string, unknown>;
}

interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string; // 'success' | 'failed' | 'abandoned'
    reference: string;
    amount: number;
    currency: string;
    channel: string;
  };
}

function getHeaders() {
  if (!env.PAYSTACK_SECRET_KEY) {
    throw new AppError('Paystack is not configured', 503);
  }
  return {
    Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };
}

export const PaystackService = {
  /**
   * Initialize a Paystack transaction.
   * Returns the authorization URL for the user to complete payment.
   */
  async initializeTransaction(payload: InitializePayload) {
    const body: Record<string, unknown> = {
      email: payload.email,
      amount: payload.amount,
      reference: payload.reference,
      currency: payload.currency ?? 'NGN',
    };

    if (payload.callbackUrl) body['callback_url'] = payload.callbackUrl;
    if (payload.subaccount) body['subaccount'] = payload.subaccount;
    if (payload.metadata) body['metadata'] = payload.metadata;

    const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    const json = (await res.json()) as PaystackInitResponse;

    if (!json.status) {
      logger.error('Paystack init failed', { message: json.message });
      throw new AppError('Unable to initialize payment', 502);
    }

    return json.data;
  },

  /**
   * Verify a transaction by reference.
   * Returns the transaction data from Paystack.
   */
  async verifyTransaction(reference: string) {
    const res = await fetch(
      `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: getHeaders() },
    );

    const json = (await res.json()) as PaystackVerifyResponse;

    if (!json.status) {
      logger.error('Paystack verify failed', { message: json.message });
      throw new AppError('Payment verification failed', 502);
    }

    return json.data;
  },

  /**
   * Validate a Paystack webhook signature.
   */
  validateWebhookSignature(body: string, signature: string): boolean {
    if (!env.PAYSTACK_SECRET_KEY) return false;

    // Node crypto is available globally in Node 20+
    const crypto = require('crypto') as typeof import('crypto');
    const hash = crypto
      .createHmac('sha512', env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    return hash === signature;
  },
};
