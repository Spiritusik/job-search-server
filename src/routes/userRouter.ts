import { Router } from "express";
import { body } from "express-validator";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { checkRolesMiddleware } from "../middlewares/checkRolesMiddleware";

const router = Router();

router.post(
    "/registration",
    body("email").isEmail(),
    body("password").isLength({ min: 6, max: 50 }),
    userController.register
);

router.post(
    "/login",
    body("email").isEmail(),
    body("password").isLength({ min: 6, max: 50 }),
  userController.login
);

router.post("/logout", userController.logout);

router.get("/refresh", userController.refresh);

router.get("/auth", authMiddleware, userController.check);

router.get("/", checkRolesMiddleware(["ADMIN"]), userController.getUsers);

router.delete("/:id", checkRolesMiddleware(["ADMIN"]), userController.deleteOne);

export default router;
