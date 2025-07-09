import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateBody } from "../../middleware/validation.middleware";
import { LoginDTO } from "./dto/login.dto";

export class AuthRouter {
  router: Router;
  authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.post(
      "/login",
      validateBody(LoginDTO),
      this.authController.login
    );
  };

  getRouter = () => {
    return this.router;
  };
}
