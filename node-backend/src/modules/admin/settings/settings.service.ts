import { Setting } from '../../../database/models/setting.model';
import type { UpsertSettingInput, BatchUpsertSettingsInput } from './settings.schema';

export const AdminSettingsService = {
  async findAll(group?: string) {
    const filter = group ? { group } : {};
    return Setting.find(filter).sort({ group: 1, key: 1 });
  },

  async upsert(input: UpsertSettingInput) {
    return Setting.findOneAndUpdate(
      { key: input.key },
      { $set: input },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  },

  async batchUpsert(input: BatchUpsertSettingsInput) {
    const ops = input.settings.map((s) => ({
      updateOne: {
        filter: { key: s.key },
        update: { $set: s },
        upsert: true,
      },
    }));
    await Setting.bulkWrite(ops);
    return Setting.find().sort({ group: 1, key: 1 });
  },

  async delete(key: string) {
    return Setting.findOneAndDelete({ key });
  },
};
