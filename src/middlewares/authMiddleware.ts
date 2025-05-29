import { Request, Response, NextFunction } from "express";
import ApiError from "../errors/ApiError";
import { tokenService } from "../services/tokenService";
import { JwtPayload } from "../types/jwtPayload";

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.method === "OPTIONS") return next();

    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return next(ApiError.unauthorizedError());
        }

        const accessToken = authorizationHeader.split(" ")[1];
        const userData = tokenService.validateAccessToken(accessToken);

        if (!accessToken || !userData) {
            return next(ApiError.unauthorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.forbidden());
    }
};
