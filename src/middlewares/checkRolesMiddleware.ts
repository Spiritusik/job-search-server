import { Request, Response, NextFunction } from "express";
import ApiError from "@/errors/ApiError";
import { tokenService } from "@/services/tokenService";
import { JwtPayload } from "@/types/jwtPayload";

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function checkRolesMiddleware(accessRoles: string | string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS") return next();

    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) return next(ApiError.unauthorizedError());

      const accessToken = authorizationHeader.split(" ")[1];
      if (!accessToken) return next(ApiError.unauthorizedError());

      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) return next(ApiError.unauthorizedError());

      req.user = userData;

      const userRoles = userData.role;

      if (typeof accessRoles === "string") {
        return userRoles.includes(accessRoles)
          ? next()
          : next(ApiError.forbidden());
      }

      if (Array.isArray(accessRoles)) {
        return userRoles.some(role => accessRoles.includes(role))
          ? next()
          : next(ApiError.forbidden());
      }

      return next(ApiError.internal("Ошибка сервера. Неверно указан тип ролей."));
    } catch (e) {
      return next(e);
    }
  };
}
