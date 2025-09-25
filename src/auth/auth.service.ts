import { comparePassword, generateToken, hashPassword } from "../../utils/auth";
import { prisma } from "../prisma";

export class AuthService {
  static async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("User already exists");

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });

    return { id: user.id, email: user.email };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error("Invalid password");

    const token = generateToken(user.id, user.role);

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
  static async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, createdAt: true },
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  // New function: Get all users (admin/moderator only)
  static async getAllUsers() {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
    });
    return users;
  }
}
