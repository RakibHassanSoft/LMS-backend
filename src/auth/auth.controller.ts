import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthRequest } from "../../types/types";


export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.register(email, password);
      res.json({ message: "User registered", user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login(email, password);
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
  // Get logged-in user's profile
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) throw new Error("Not authenticated");
      const user = await AuthService.getProfile(req.user.userId);
      res.json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // Get all users (admin/moderator)
  static async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const users = await AuthService.getAllUsers();
      res.json(users);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
