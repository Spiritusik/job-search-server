import { Types } from "mongoose";

export interface JwtPayload {
  id: string;
  email: string;
  role: string[];
  exp?: string;
}