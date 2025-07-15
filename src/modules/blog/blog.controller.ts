import { NextFunction, Request, Response } from "express";

import { BlogService } from "./blog.service";
import { plainToInstance } from "class-transformer";
import { GetBlogsDTO } from "./dto/get-blogs.dto";

export class BlogController {
  blogService: BlogService;

  constructor() {
    this.blogService = new BlogService();
  }

  getBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = plainToInstance(GetBlogsDTO, req.query);
      const result = await this.blogService.getBlogs(query);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
