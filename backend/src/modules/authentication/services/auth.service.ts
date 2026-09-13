import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserModel } from '../../../models/User';
import { FarmerModel } from '../../../models/Farmer';
import { config } from '../../../config/env';
import { ApiError } from '../../../utils/apiError';
import { UserRole } from '../../../types';
import { isDbConnected } from '../../../config/db';
import { buildIdQuery } from '../../../utils/dbHelper';
import { RegisterDTO } from '../types';

// In-Memory store for Demo Aadhaar OTP verification (keyed by SHA-256 aadhaarHash)
const aadhaarOtpStore = new Map<string, { otp: string; expiresAt: number }>();

export class AuthService {
  public static hashAadhaar(aadhaar: string): string {
    const clean = (aadhaar || '').replace(/\D/g, '');
    return crypto.createHash('sha256').update(clean).digest('hex');
  }

  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  public static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public static generateToken(user: { id: string; email: string; role: string; name: string }): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      config.jwtSecret,
      { expiresIn: (config.jwtExpiresIn || '7d') as any }
    );
  }

  public static async register(data: RegisterDTO) {
    let aadhaarHash: string | undefined;
    let aadhaarLast4: string | undefined;

    if (data.aadhaarNumber) {
      const cleanAadhaar = data.aadhaarNumber.replace(/\D/g, '');
      if (cleanAadhaar.length !== 12) {
        throw ApiError.badRequest('Aadhaar number must be exactly 12 digits');
      }
      aadhaarHash = this.hashAadhaar(cleanAadhaar);
      aadhaarLast4 = cleanAadhaar.slice(-4);
    }

    if (isDbConnected()) {
      const existing = await UserModel.findOne({ email: data.email.toLowerCase().trim() });
      if (existing) {
        throw ApiError.conflict('A user with this email address already exists');
      }

      if (aadhaarHash) {
        const existingAadhaar = await UserModel.findOne({ aadhaarHash });
        if (existingAadhaar) {
          throw ApiError.conflict('An account with this Aadhaar number is already registered. Please login directly.');
        }
      }

      const hashedPassword = await this.hashPassword(data.password);
      const user = await UserModel.create({
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        role: data.role || 'farmer',
        phone: data.phone || '',
        state: data.state || 'Madhya Pradesh',
        district: data.district || 'Indore',
        village: data.village || 'Sanwer',
        language: data.language || 'en',
        authMethod: 'email',
        aadhaarHash,
        aadhaarLast4,
      });

      const userId = user.id || user._id.toString();

      // If user role is Farmer, create/sync the corresponding Farmer profile
      if (user.role === 'farmer') {
        try {
          await FarmerModel.findOneAndUpdate(
            { userId },
            {
              userId,
              farmerId: `farmer-${userId}`,
              experienceYears: 5,
              totalLandAcres: 5,
              primaryCrops: ['Wheat', 'Mustard'],
              kycStatus: 'verified',
              govtIdType: 'Aadhaar (Demo)',
              govtIdNumber: aadhaarLast4 ? `XXXX-XXXX-${aadhaarLast4}` : '',
            },
            { upsert: true, new: true }
          );
        } catch (e: any) {
          console.warn('[AuthService] Could not auto-seed Farmer profile:', e.message);
        }
      }

      const token = this.generateToken({
        id: userId,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return {
        user: {
          id: userId,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          state: user.state,
          district: user.district,
          village: user.village,
          language: user.language,
          avatar: user.avatar,
          aadhaarLast4: user.aadhaarLast4,
        },
        token,
      };
    }

    // In-memory fallback (when database is offline)
    const fallbackUser = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      role: data.role || 'farmer',
      phone: data.phone || '+91 98765 43210',
      state: data.state || 'Madhya Pradesh',
      district: data.district || 'Indore',
      village: data.village || 'Sanwer',
      language: data.language || 'en',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      aadhaarLast4,
    };

    const token = this.generateToken({
      id: fallbackUser.id,
      email: fallbackUser.email,
      role: fallbackUser.role,
      name: fallbackUser.name,
    });

    return { user: fallbackUser, token };
  }

  public static async login(emailOrPhone: string, password?: string, role: UserRole = 'farmer') {
    const identifier = (emailOrPhone || '').trim();
    if (!identifier) {
      throw ApiError.badRequest('Email or phone number is required for login');
    }

    if (isDbConnected()) {
      const query = identifier.includes('@')
        ? { email: identifier.toLowerCase() }
        : { phone: identifier };

      const user = await UserModel.findOne(query).select('+password');

      if (!user) {
        throw ApiError.unauthorized('Invalid email or password');
      }

      if (password) {
        const isMatch = await this.comparePassword(password, user.password || '');
        if (!isMatch) {
          throw ApiError.unauthorized('Invalid email or password');
        }
      } else if (user.password) {
        throw ApiError.badRequest('Password is required for this account');
      }

      const token = this.generateToken({
        id: user.id || user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return {
        user: {
          id: user.id || user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          state: user.state,
          district: user.district,
          village: user.village,
          language: user.language,
          avatar: user.avatar,
          aadhaarLast4: user.aadhaarLast4,
        },
        token,
      };
    }

    // In-memory demo user authentication when MongoDB is disconnected
    const demoUser = {
      id: 'usr-farmer-01',
      name: role === 'farmer' ? 'Rajesh Kumar Patel' : 'AGRINEXT User',
      email: identifier.includes('@') ? identifier.toLowerCase() : 'rajesh.patel@agrinext.in',
      role: role || 'farmer',
      phone: identifier.includes('@') ? '+91 98765 43210' : identifier,
      state: 'Madhya Pradesh',
      district: 'Indore',
      village: 'Sanwer',
      language: 'en',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    };

    const token = this.generateToken({
      id: demoUser.id,
      email: demoUser.email,
      role: demoUser.role,
      name: demoUser.name,
    });

    return { user: demoUser, token };
  }

  public static async sendAadhaarDemoOtp(aadhaarNumber: string) {
    const clean = (aadhaarNumber || '').replace(/\D/g, '');
    if (clean.length !== 12) {
      throw ApiError.badRequest('Please enter a valid 12-digit Aadhaar number');
    }

    const aadhaarHash = this.hashAadhaar(clean);
    const aadhaarLast4 = clean.slice(-4);

    if (isDbConnected()) {
      const user = await UserModel.findOne({ aadhaarHash });
      if (!user) {
        throw ApiError.notFound('No account found with this Aadhaar number. Please register first.');
      }

      // Store demo OTP with 5 minute expiration
      const expiresAt = Date.now() + 5 * 60 * 1000;
      aadhaarOtpStore.set(aadhaarHash, { otp: '1234', expiresAt });

      return {
        message: 'Demo OTP generated successfully (Development Mode: 1234)',
        demoOtp: '1234',
        aadhaarLast4: user.aadhaarLast4 || aadhaarLast4,
        isDemoMode: true,
        expiresAt: new Date(expiresAt).toISOString(),
      };
    }

    // Fallback for offline mode
    const expiresAt = Date.now() + 5 * 60 * 1000;
    aadhaarOtpStore.set(aadhaarHash, { otp: '1234', expiresAt });
    return {
      message: 'Demo OTP generated successfully (Development Mode: 1234)',
      demoOtp: '1234',
      aadhaarLast4,
      isDemoMode: true,
      expiresAt: new Date(expiresAt).toISOString(),
    };
  }

  public static async verifyAadhaarDemoOtp(aadhaarNumber: string, otp: string) {
    const clean = (aadhaarNumber || '').replace(/\D/g, '');
    if (clean.length !== 12) {
      throw ApiError.badRequest('Please enter a valid 12-digit Aadhaar number');
    }

    const aadhaarHash = this.hashAadhaar(clean);
    const record = aadhaarOtpStore.get(aadhaarHash);

    if (!record || Date.now() > record.expiresAt) {
      throw ApiError.badRequest('OTP expired. Please request a new OTP.');
    }

    if ((otp || '').trim() !== record.otp) {
      throw ApiError.unauthorized('Invalid OTP');
    }

    // Clear consumed OTP
    aadhaarOtpStore.delete(aadhaarHash);

    if (isDbConnected()) {
      const user = await UserModel.findOne({ aadhaarHash });
      if (!user) {
        throw ApiError.notFound('No account found with this Aadhaar number. Please register first.');
      }

      const token = this.generateToken({
        id: user.id || user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return {
        user: {
          id: user.id || user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          state: user.state,
          district: user.district,
          village: user.village,
          language: user.language,
          avatar: user.avatar,
          aadhaarLast4: user.aadhaarLast4,
        },
        token,
      };
    }

    // Offline fallback
    const demoUser = {
      id: 'usr-farmer-01',
      name: 'Rajesh Kumar Patel',
      email: 'rajesh.patel@agrinext.in',
      role: 'farmer' as UserRole,
      phone: '+91 98765 43210',
      state: 'Madhya Pradesh',
      district: 'Indore',
      village: 'Sanwer',
      language: 'en',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      aadhaarLast4: clean.slice(-4),
    };

    const token = this.generateToken({
      id: demoUser.id,
      email: demoUser.email,
      role: demoUser.role,
      name: demoUser.name,
    });

    return { user: demoUser, token };
  }

  public static async getUserById(id: string) {
    if (isDbConnected()) {
      const query = buildIdQuery(id);
      const user = await UserModel.findOne(query);
      if (user) return user;
    }
    return {
      id,
      name: 'Rajesh Kumar Patel',
      email: 'rajesh.patel@agrinext.in',
      role: 'farmer' as UserRole,
      phone: '+91 98765 43210',
      state: 'Madhya Pradesh',
      district: 'Indore',
      village: 'Sanwer',
      language: 'en',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    };
  }
}


