import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/types";
import envConfig from "../config/env.provider";

const JWT_SECRET = envConfig.jwtSecret || "supersecret";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      role: string;
    };
    req.user = decoded;
    console.log(req);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const authorize =
  (roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    

    if (!req.user) return res.status(401).json({ error: "No User provided" });

    if (!req.user) return res.status(401).json({ error: "Not authenticated" });

    // Make comparison case-insensitive
    const userRole = req.user.role.toLowerCase();
    const allowedRoles = roles.map((r) => r.toLowerCase());
  
    if (!allowedRoles.includes(userRole)) {
     
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
