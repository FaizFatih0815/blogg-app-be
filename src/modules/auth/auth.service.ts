import { PrismaService } from "../prisma/prisma.service";
import { User } from "../../generated/prisma";
import { ApiError } from "../../utils/api-error";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { JWT_SECRET } from "../../config/env";

export class AuthService {
  private prisma: PrismaService;
  private passwordService: PasswordService;
  private tokenService: TokenService;

  constructor() {
    this.prisma = new PrismaService();
    this.passwordService = new PasswordService();
    this.tokenService = new TokenService();
  }

  login = async (body: Pick<User, "email" | "password">) => {
    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (!user) {
      throw new ApiError("email not found", 404);
    }

    const isPasswordValid = await this.passwordService.comparedPassword(
      body.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ApiError("invalid password", 404);
    }

    const accessToken = this.tokenService.generateToken(
      {
        id: user.id,
      },
      JWT_SECRET!
    );

    const { password, ...userWithoutPassword } = user;

    return { ...userWithoutPassword, accessToken };
  };
}
