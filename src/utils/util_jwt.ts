import jwt from 'jsonwebtoken';
import { User } from "../entities/User";
import { Room } from "../entities/Room";
import { Device } from "../entities/Device";

const JWT_SECRET = process.env.JWT_SECRET || 'my-secure-secret';
const EXPIRES_IN = '30d';

export interface JwtPayload {
  user: {
    id: number;
    username: string;
    email?: string;
    phone?: string;
  };
  room: {
    id: number;
    name: string;
  };
  device: {
    id: number;
    fingerprint: string;
  };
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};