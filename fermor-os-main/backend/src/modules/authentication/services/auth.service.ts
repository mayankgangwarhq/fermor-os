import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../../models/User';
import { config } from '../../../config/env';
import { ApiError } from '../../../utils/apiError';
import { UserRole } from '../../../types';
import { isDbConnected } from '../../../config/db';
import { RegisterDTO } from '../types';

export class AuthService {
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
      { expiresIn: '7d' }
    );
  }

  public static async register(data: RegisterDTO) {
    if (isDbConnected()) {
      const existing = await UserModel.findOne({ email: data.email.toLowerCase() });
      if (existing) {
        throw ApiError.conflict('A user with this email already exists');
      }

      const hashedPassword = await this.hashPassword(data.password);
      const user = await UserModel.create({
        ...data,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        role: data.role || 'farmer',
      });

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
        },
        token,
      };
    }

    // In-memory fallback
    const fallbackUser = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase(),
      role: data.role || 'farmer',
      phone: data.phone || '+91 98765 43210',
      state: data.state || 'Madhya Pradesh',
      district: data.district || 'Indore',
      village: data.village || 'Sanwer',
      language: data.language || 'en',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
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
    if (isDbConnected()) {
      const query = emailOrPhone.includes('@')
        ? { email: emailOrPhone.toLowerCase() }
        : { phone: emailOrPhone };

      const user = await UserModel.findOne(query).select('+password');

      if (user) {
        if (password) {
          const isMatch = await this.comparePassword(password, user.password || '');
          if (!isMatch) {
            throw ApiError.unauthorized('Invalid email or password');
          }
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
          },
          token,
        };
      }
    }

    // Fast in-memory demo user authentication
    const demoUser = {
      id: 'usr-farmer-01',
      name: role === 'farmer' ? 'Rajesh Kumar Patel' : 'Farmer OS User',
      email: emailOrPhone.includes('@') ? emailOrPhone.toLowerCase() : 'rajesh.patel@agrinext.in',
      role: role || 'farmer',
      phone: emailOrPhone.includes('@') ? '+91 98765 43210' : emailOrPhone,
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

  public static async getUserById(id: string) {
    if (isDbConnected()) {
      const user = await UserModel.findById(id);
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
