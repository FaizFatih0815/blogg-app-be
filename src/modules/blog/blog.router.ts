import { Router } from "express";
import { BlogController } from "./blog.controller";
import { UploaderMiddleware } from "../../middleware/uploader.middleware";
import { JwtMiddleware } from "../../middleware/jwt.middleware";
import { JWT_SECRET } from "../../config/env";
import { validateBody } from "../../middleware/validation.middleware";
import { CreateBlogDTO } from "./dto/create-blog.dto";

export class BlogRouter {
  private router: Router;
  private blogController: BlogController;
  private uploaderMiddleware: UploaderMiddleware;
  private jwtMiddleware: JwtMiddleware;

  constructor() {
    this.router = Router();
    this.blogController = new BlogController();
    this.uploaderMiddleware = new UploaderMiddleware();
    this.jwtMiddleware = new JwtMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.blogController.getBlogs);
    this.router.get("/:slug", this.blogController.getBlogBySlug);
    this.router.post(
      "/",
      this.jwtMiddleware.verifyToken(JWT_SECRET!),
      this.uploaderMiddleware
        .upload()
        .fields([{ name: "thumbnail", maxCount: 1 }]),
      this.uploaderMiddleware.fileFilter([
        "image/jpeg",
        "image/png",
        "image/avif",
      ]),
      validateBody(CreateBlogDTO),
      this.blogController.createBlog
    );
    this.router.delete(
      "/:id",
      this.jwtMiddleware.verifyToken(JWT_SECRET!),
      this.blogController.deleteBlog
    );
  };

  getRouter = () => {
    return this.router;
  };
}
