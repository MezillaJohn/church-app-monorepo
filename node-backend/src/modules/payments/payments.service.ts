import mongoose from 'mongoose';
import { Book } from '../../database/models/book.model';
import { BookPurchase } from '../../database/models/book-purchase.model';
import { User } from '../../database/models/user.model';
import { AppError } from '../../shared/middleware/error.middleware';
import { PaystackService } from '../../shared/services/paystack.service';
import { env } from '../../config/env';
import { logger } from '../../shared/utils/logger';

export const PaymentsService = {
  async purchaseBook(userId: string, bookId: string) {
    const book = await Book.findOne({ _id: bookId, isPublished: true }).populate('subaccountId');
    if (!book) throw new AppError('Book not found', 404);

    const alreadyPurchased = await BookPurchase.findOne({
      userId,
      bookId,
      status: 'completed',
    });
    if (alreadyPurchased) throw new AppError('You have already purchased this book', 409);

    // Free books → mark as completed immediately
    if (book.price === 0) {
      const purchase = await BookPurchase.create({
        userId,
        bookId,
        amount: 0,
        transactionReference: `free_${bookId}_${userId}_${Date.now()}`,
        status: 'completed',
      });
      await Book.updateOne({ _id: bookId }, { $inc: { purchasesCount: 1 } });
      return { purchased: true, reference: purchase.transactionReference };
    }

    const user = await User.findById(userId).select('email');
    if (!user) throw new AppError('User not found', 404);

    const reference = `book_${bookId}_user_${userId}_${Date.now()}`;

    await BookPurchase.create({
      userId,
      bookId,
      amount: book.price,
      transactionReference: reference,
      status: 'pending',
    });

    // Amount in kobo (smallest unit)
    const amountInKobo = Math.round(book.price * 100);
    const subaccount = (book.subaccountId as any)?.paystackSubaccountCode;

    const paystackData = await PaystackService.initializeTransaction({
      email: user.email,
      amount: amountInKobo,
      reference,
      callbackUrl: env.APP_URL,
      ...(subaccount && { subaccount }),
      metadata: { type: 'book_purchase', bookId, userId },
    });

    return {
      authorization_url: paystackData.authorization_url,
      access_code: paystackData.access_code,
      reference: paystackData.reference,
    };
  },

  async verifyPayment(reference: string) {
    const purchase = await BookPurchase.findOne({ transactionReference: reference });
    if (!purchase) throw new AppError('Payment record not found', 404);

    if (purchase.status === 'completed') return purchase;

    // Verify with Paystack
    const paystackData = await PaystackService.verifyTransaction(reference);

    if (paystackData.status !== 'success') {
      await BookPurchase.updateOne({ _id: purchase._id }, { $set: { status: 'failed' } });
      throw new AppError('Payment was not successful', 400);
    }

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await BookPurchase.updateOne(
          { _id: purchase._id },
          { $set: { status: 'completed' } },
        ).session(session);
        await Book.updateOne(
          { _id: purchase.bookId },
          { $inc: { purchasesCount: 1 } },
        ).session(session);
      });
    } finally {
      await session.endSession();
    }

    return BookPurchase.findById(purchase._id);
  },

  async handleWebhook(payload: Record<string, unknown>, signature: string) {
    const body = JSON.stringify(payload);
    if (!PaystackService.validateWebhookSignature(body, signature)) {
      logger.warn('Invalid Paystack webhook signature');
      throw new AppError('Invalid signature', 401);
    }

    const event = payload['event'] as string;
    const data = payload['data'] as Record<string, unknown>;
    const reference = data?.['reference'] as string | undefined;

    if (event === 'charge.success' && reference) {
      // Check if it's a book purchase
      const purchase = await BookPurchase.findOne({ transactionReference: reference, status: 'pending' });
      if (purchase) {
        await this.verifyPayment(reference);
      }

      // Check if it's a donation
      const { Donation } = await import('../../database/models/donation.model');
      const donation = await Donation.findOne({ transactionReference: reference, status: 'pending' });
      if (donation) {
        await Donation.updateOne({ _id: donation._id }, { $set: { status: 'completed' } });
      }
    }

    return { received: true };
  },
};
