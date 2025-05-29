// controllers/user.controller.ts

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { JwtPayload } from "@/types/jwtPayload";
import { env } from "@/config/env";
import { userService } from "@/services/userService";
import ApiError from "@/errors/ApiError";

interface AuthRequest extends Request {
  user?: JwtPayload;
}

class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next(ApiError.badRequest("Validation error"));

      const { email, password, role } = req.body;
      const { tokens } = await userService.register(email, password, role);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: +env.JWT_REFRESH_EXPIRES_IN * 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.status(200).json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { tokens } = await userService.login(email, password);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: +env.JWT_REFRESH_EXPIRES_IN * 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.status(200).json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) return next(ApiError.unauthorizedError());

      const { tokens } = await userService.refreshSession(refreshToken);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: +env.JWT_REFRESH_EXPIRES_IN * 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.status(200).json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async check(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) return next(ApiError.unauthorizedError());

      const tokens = await userService.issueTokens(user);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: +env.JWT_REFRESH_EXPIRES_IN * 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.status(200).json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.status(200).json("Logout complete!");
    } catch (e) {
      next(e);
    }
  }

  async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUsers();
      res.status(200).json({ users });
    } catch (e) {
      next(e);
    }
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.deleteUser(req.params.id);
      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();