import { User } from "@/models";
import bcrypt from "bcrypt";
import ApiError from "@/errors/ApiError";
import { getPayload } from "@/dtos/user.dto";
import { JwtPayload } from "@/types/jwtPayload";
import { tokenService } from "./tokenService";
import mongoose, { Types } from "mongoose";

class UserService {
  async register(email: string, password: string, role: string[]) {
    const existing = await User.findOne({ email });
    if (existing) throw ApiError.badRequest("User already exists");

    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, password: hashPassword, role });

    const payload = getPayload(user);
    const tokens = tokenService.generateTokens(payload);
    await tokenService.saveToken(user._id, tokens.refreshToken);

    return { tokens, user: payload };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw ApiError.badRequest("User not found");

    const valid = await bcrypt.compare(password, user.password as string);
    if (!valid) throw ApiError.badRequest("Incorrect password");

    const payload = getPayload(user);
    const tokens = tokenService.generateTokens(payload);
    await tokenService.saveToken(user._id, tokens.refreshToken);

    return { tokens, user: payload };
  }

  async refreshSession(refreshToken: string) {
    const userData = tokenService.validateRefreshToken(refreshToken);
    if (!userData) throw ApiError.unauthorizedError();

    const tokenExists = await tokenService.findToken(refreshToken);
    if (!tokenExists) throw ApiError.unauthorizedError();

    const user = await User.findById(userData.id);
    if (!user) throw ApiError.unauthorizedError();

    const payload = getPayload(user);
    const tokens = tokenService.generateTokens(payload);
    await tokenService.saveToken(new mongoose.Types.ObjectId(payload.id), tokens.refreshToken);

    return { tokens, user: payload };
  }

  async issueTokens(user: JwtPayload) {
    const tokens = tokenService.generateTokens(user);
    await tokenService.saveToken(new mongoose.Types.ObjectId(user.id), tokens.refreshToken);
    return tokens;
  }

  async getUsers() {
    return User.find().lean();
  }

  async deleteUser(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest("Invalid ID");
    }

    const user = await User.findById(id).lean();
    if (!user) throw ApiError.badRequest("User not found");

    await User.deleteOne({ _id: id });
    return user;
  }

  async logout(refreshToken: string) {
    await tokenService.removeToken(refreshToken);
  }
}

export const userService = new UserService();
