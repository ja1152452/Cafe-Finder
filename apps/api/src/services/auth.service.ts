import { prisma } from '../repositories/prisma.js';
import { hashPassword, comparePassword, generateToken } from '../utils/jwt.js';
import { User, UserPreference } from '@cafefinder/shared';
import { memoryStore } from './memoryStore.js';

export class AuthService {
  async register(data: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> {
    const email = data.email.toLowerCase().trim();

    // Check in-memory store
    if (memoryStore.users.has(email)) {
      throw new Error('An account with this email already exists.');
    }

    const passwordHash = await hashPassword(data.password);
    const userId = `user_${Date.now()}`;
    const newUser: User = {
      id: userId,
      email,
      name: data.name.trim(),
      avatarUrl: null,
      role: 'USER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryStore.users.set(email, { ...newUser, passwordHash });
    memoryStore.users.set(userId, { ...newUser, passwordHash });

    const pref: UserPreference = {
      id: `pref_${Date.now()}`,
      userId,
      radius: 5000,
      theme: 'system',
      notificationsEnabled: true,
      favoriteAmenities: ['wifi', 'power_outlets'],
    };
    memoryStore.preferences.set(userId, pref);

    // Optional DB synchronization if DB is connected
    try {
      await prisma.user.create({
        data: {
          id: userId,
          name: newUser.name,
          email,
          passwordHash,
          role: 'USER',
          preference: {
            create: {
              radius: 5000,
              theme: 'system',
              notificationsEnabled: true,
              favoriteAmenities: JSON.stringify(['wifi', 'power_outlets']),
            },
          },
        },
      });
    } catch {
      // ignore if DB is offline/not connected
    }

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return { user: newUser, token };
  }

  async login(data: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const email = data.email.toLowerCase().trim();

    let user = memoryStore.users.get(email);

    // If not found in memory, try DB
    if (!user) {
      try {
        const dbUser = await prisma.user.findUnique({ where: { email } });
        if (dbUser) {
          user = {
            ...this.formatUser(dbUser),
            passwordHash: dbUser.passwordHash,
          };
          memoryStore.users.set(email, user);
          memoryStore.users.set(user.id, user);
        }
      } catch {
        // ignore DB error
      }
    }

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isValid = await comparePassword(data.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.formatUser(user),
      token,
    };
  }

  async getCurrentUser(userId: string): Promise<{ user: User; preference?: UserPreference | null } | null> {
    let user = memoryStore.users.get(userId);

    if (!user) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          include: { preference: true },
        });
        if (dbUser) {
          user = this.formatUser(dbUser);
          memoryStore.users.set(user.id, user);
        }
      } catch {
        // ignore DB error
      }
    }

    if (!user) return null;

    let pref = memoryStore.preferences.get(userId) || null;
    return {
      user: this.formatUser(user),
      preference: pref,
    };
  }

  formatUser(userObj: any): User {
    return {
      id: userObj.id,
      email: userObj.email,
      name: userObj.name,
      avatarUrl: userObj.avatarUrl || null,
      role: userObj.role || 'USER',
      createdAt: typeof userObj.createdAt === 'string' ? userObj.createdAt : userObj.createdAt?.toISOString?.() || new Date().toISOString(),
      updatedAt: typeof userObj.updatedAt === 'string' ? userObj.updatedAt : userObj.updatedAt?.toISOString?.() || new Date().toISOString(),
    };
  }
}

export const authService = new AuthService();
