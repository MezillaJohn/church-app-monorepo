import { Types } from 'mongoose';
import { DonationType } from '../../database/models/donation-type.model';
import { Donation } from '../../database/models/donation.model';
import { User } from '../../database/models/user.model';
import { AppError } from '../../shared/middleware/error.middleware';
import { PaystackService } from '../../shared/services/paystack.service';
import { env } from '../../config/env';
import type { DonateInput } from './donations.schema';

export const DonationsService = {
  async getDonationTypes() {
    return DonationType.find({ isActive: true })
      .populate({ path: 'subaccountId', select: 'paystackSubaccountCode businessName' })
      .sort({ name: 1 });
  },

  async donate(userId: string, input: DonateInput) {
    const user = await User.findById(userId).select('email');
    if (!user) throw new AppError('User not found', 404);

    const reference = `donation_${userId}_${Date.now()}`;

    // Look up subaccount code if donationTypeId is provided
    let subaccount: string | undefined;
    if (input.donationTypeId) {
      const donationType = await DonationType.findById(input.donationTypeId)
        .populate({ path: 'subaccountId', select: 'paystackSubaccountCode' });
      if (donationType) {
        subaccount = (donationType.subaccountId as any)?.paystackSubaccountCode;
      }
    }

    const donation = await Donation.create({
      userId,
      ...(input.donationTypeId && { donationTypeId: input.donationTypeId }),
      amount: input.amount,
      currency: input.currency,
      paymentMethod: input.paymentMethod,
      transactionReference: reference,
      note: input.note,
      isAnonymous: input.isAnonymous ?? false,
      status: 'pending',
    });

    // For Paystack payments, initialize a transaction
    if (input.paymentMethod === 'paystack') {
      const amountInKobo = Math.round(input.amount * 100);

      const paystackData = await PaystackService.initializeTransaction({
        email: user.email,
        amount: amountInKobo,
        reference,
        currency: input.currency ?? 'NGN',
        callbackUrl: env.APP_URL,
        ...(subaccount && { subaccount }),
        metadata: { type: 'donation', donationId: donation._id.toString(), userId },
      });

      return {
        donation,
        payment_url: paystackData.authorization_url,
        access_code: paystackData.access_code,
        reference: paystackData.reference,
      };
    }

    // Manual payment — just return the donation record
    return { donation };
  },

  async getHistory(userId: string) {
    return Donation.find({ userId })
      .sort({ createdAt: -1 })
      .populate({ path: 'donationTypeId', select: 'name' });
  },

  async getTotalDonations(userId: string) {
    const [result] = await Donation.aggregate([
      { $match: { userId: new Types.ObjectId(userId), status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return { total: result?.total ?? 0 };
  },
};
