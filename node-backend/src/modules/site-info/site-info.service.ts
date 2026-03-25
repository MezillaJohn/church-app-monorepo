import { Setting } from '../../database/models/setting.model';
import { BankAccount } from '../../database/models/bank-account.model';

export const SiteInfoService = {
  async getInfo() {
    const [settingsRows, bankAccounts] = await Promise.all([
      Setting.find({ group: 'general' }),
      BankAccount.find({ isActive: true }).sort({ createdAt: 1 }),
    ]);

    // Flatten settings rows into a key-value map
    const settings = settingsRows.reduce<Record<string, string>>((acc, row) => {
      acc[row.key] = row.value ?? '';
      return acc;
    }, {});

    return { settings, bankAccounts };
  },
};
