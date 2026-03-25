/**
 * Mongoose seed script — run with: npm run db:seed
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { Category } from './models/category.model';
import { ChurchCentre } from './models/church-centre.model';
import { DonationType } from './models/donation-type.model';
import { Setting } from './models/setting.model';
import { HeroSlider } from './models/hero-slider.model';
import { User } from './models/user.model';

async function seed() {
  await mongoose.connect(env.MONGODB_URI);
  console.log('🌱 Connected to MongoDB — seeding...');

  // ── Categories ────────────────────────────────────────────────────────────────
  const sermonCategories = ['General', 'Youth', 'Women', 'Men', 'Children', 'Evangelism'].map(
    (name) => ({ name, slug: name.toLowerCase(), type: 'sermon' as const, isActive: true }),
  );
  const bookCategories = ['Christian Living', 'Theology', 'Leadership', 'Prayer', 'Devotional'].map(
    (name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-'), type: 'book' as const, isActive: true }),
  );
  await Category.deleteMany({});
  await Category.insertMany([...sermonCategories, ...bookCategories]);
  console.log('  ✓ Categories seeded');

  // ── Church Centres ─────────────────────────────────────────────────────────────
  await ChurchCentre.deleteMany({});
  await ChurchCentre.insertMany([
    { name: 'Main Headquarters', city: 'Lagos', state: 'Lagos', country: 'Nigeria', isActive: true },
    { name: 'Abuja Centre', city: 'Abuja', state: 'FCT', country: 'Nigeria', isActive: true },
    { name: 'Port Harcourt Centre', city: 'Port Harcourt', state: 'Rivers', country: 'Nigeria', isActive: true },
  ]);
  console.log('  ✓ Church Centres seeded');

  // ── Donation Types ─────────────────────────────────────────────────────────────
  await DonationType.deleteMany({});
  await DonationType.insertMany([
    { name: 'Tithe', description: 'Monthly tithes', isActive: true },
    { name: 'Offering', description: 'General offering', isActive: true },
    { name: 'Mission', description: 'Mission support', isActive: true },
    { name: 'Building Fund', description: 'Church building project', isActive: true },
  ]);
  console.log('  ✓ Donation Types seeded');

  // ── Settings ──────────────────────────────────────────────────────────────────
  await Setting.deleteMany({});
  await Setting.insertMany([
    { key: 'app_name', value: 'Church App', type: 'string', group: 'general', description: 'Application name' },
    { key: 'church_name', value: 'My Church', type: 'string', group: 'general', description: 'Church name' },
    { key: 'church_address', value: '', type: 'string', group: 'general', description: 'Church address' },
    { key: 'church_phone', value: '', type: 'string', group: 'general', description: 'Church phone number' },
    { key: 'church_email', value: '', type: 'string', group: 'general', description: 'Church email' },
    { key: 'temporary_paid_access', value: 'false', type: 'boolean', group: 'general', description: 'Grant free access to paid content' },
  ]);
  console.log('  ✓ Settings seeded');

  // ── Hero Sliders ──────────────────────────────────────────────────────────────
  await HeroSlider.deleteMany({});
  await HeroSlider.insertMany([
    { title: 'Welcome', imageUrl: 'https://placehold.co/1200x400', order: 1, isActive: true, isFeatured: true },
    { title: 'New Sermon', imageUrl: 'https://placehold.co/1200x400', order: 2, isActive: true, isFeatured: false },
  ]);
  console.log('  ✓ Hero Sliders seeded');

  // ── Admin User ────────────────────────────────────────────────────────────────
  const adminEmail = 'admin@church.org';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash('Admin@1234', 10);
    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: hashed,
      isAdmin: true,
      churchMember: true,
      emailVerifiedAt: new Date(),
    });
    console.log('  ✓ Admin user created');
  } else {
    console.log('  ✓ Admin user already exists — skipped');
  }

  await mongoose.disconnect();
  console.log('🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
