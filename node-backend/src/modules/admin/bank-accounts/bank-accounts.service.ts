import { BankAccount } from '../../../database/models/bank-account.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminBankAccountQueryInput, CreateBankAccountInput, UpdateBankAccountInput } from './bank-accounts.schema';

export const AdminBankAccountsService = {
  async findAll(query: AdminBankAccountQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const [data, total] = await Promise.all([
      BankAccount.find().sort({ createdAt: -1 }).skip(skip).limit(take),
      BankAccount.countDocuments(),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const account = await BankAccount.findById(id);
    if (!account) throw new AppError('Bank account not found', 404);
    return account;
  },

  async create(input: CreateBankAccountInput) {
    return BankAccount.create(input);
  },

  async update(id: string, input: UpdateBankAccountInput) {
    const account = await BankAccount.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
    if (!account) throw new AppError('Bank account not found', 404);
    return account;
  },

  async delete(id: string) {
    const account = await BankAccount.findByIdAndDelete(id);
    if (!account) throw new AppError('Bank account not found', 404);
  },
};
