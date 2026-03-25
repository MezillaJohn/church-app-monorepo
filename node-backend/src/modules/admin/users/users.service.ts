import bcrypt from 'bcryptjs';
import { User } from '../../../database/models/user.model';
import { AppError } from '../../../shared/middleware/error.middleware';
import { paginate, buildPaginationMeta } from '../../../shared/utils/pagination';
import type { AdminUserQueryInput, CreateUserInput, UpdateUserInput } from './users.schema';

const populate = [{ path: 'churchCentreId', select: 'name' }];

export const AdminUsersService = {
  async findAll(query: AdminUserQueryInput) {
    const { skip, take, page, perPage } = paginate(query);
    const filter: Record<string, unknown> = {};

    if (query.search) {
      filter['$or'] = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.gender) filter['gender'] = query.gender;
    if (query.churchMember !== undefined) filter['churchMember'] = query.churchMember;
    if (query.isAdmin !== undefined) filter['isAdmin'] = query.isAdmin;
    if (query.churchCentreId) filter['churchCentreId'] = query.churchCentreId;
    if (query.emailVerified !== undefined) {
      filter['emailVerifiedAt'] = query.emailVerified ? { $ne: null } : null;
    }

    const [data, total] = await Promise.all([
      User.find(filter).populate(populate).sort({ createdAt: -1 }).skip(skip).limit(take),
      User.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(total, page, perPage) };
  },

  async findById(id: string) {
    const user = await User.findById(id).populate(populate);
    if (!user) throw new AppError('User not found', 404);
    return user;
  },

  async create(input: CreateUserInput) {
    const existing = await User.findOne({ email: input.email.toLowerCase() });
    if (existing) throw new AppError('Email already in use', 409);

    const hashed = await bcrypt.hash(input.password, 10);
    const user = await User.create({ ...input, password: hashed });
    return User.findById(user._id).populate(populate);
  },

  async update(id: string, input: UpdateUserInput) {
    const update: Record<string, unknown> = { ...input };
    if (input.password) {
      update['password'] = await bcrypt.hash(input.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true }).populate(populate);
    if (!user) throw new AppError('User not found', 404);
    return user;
  },

  async delete(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError('User not found', 404);
  },

  async toggleAdmin(id: string) {
    const user = await User.findById(id);
    if (!user) throw new AppError('User not found', 404);
    user.isAdmin = !user.isAdmin;
    await user.save();
    return user;
  },
};
