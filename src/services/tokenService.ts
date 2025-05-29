import { env } from "@/config/env";
import { Token } from "@/models";
import { JwtPayload } from "@/types/jwtPayload";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

class TokenService {
    generateTokens(payload: JwtPayload) {
        const { exp, ...cleanPayload } = payload;

        const accessToken = jwt.sign(
            cleanPayload,
            env.JWT_ACCESS_SECRET,
            { expiresIn: `${env.JWT_ACCESS_EXPIRES_IN}m` }
        );

        const refreshToken = jwt.sign(
            cleanPayload,
            env.JWT_ACCESS_SECRET,
            { expiresIn: `${env.JWT_REFRESH_EXPIRES_IN}d` }
        );

        return { accessToken, refreshToken };
    }

    validateAccessToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
        } catch {
            return null;
        }
    }

    validateRefreshToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
        } catch {
            return null;
        }
    }

    async saveToken(userId: Types.ObjectId, refreshToken: string) {
        const tokenData = await Token.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return await tokenData.save();
        }
        return await Token.create({ user: userId, refreshToken });
    }

    async removeToken(refreshToken: string) {
        return await Token.deleteOne({ refreshToken }).lean();
    }

    async findToken(refreshToken: string) {
        return await Token.findOne({ refreshToken }).lean();
    }
}

export const tokenService = new TokenService();
