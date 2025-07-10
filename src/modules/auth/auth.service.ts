import { PrismaService } from "../prisma/prisma.service";
import { User } from "../../generated/prisma";
import { ApiError } from "../../utils/api-error";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { JWT_SECRET } from "../../config/env";
import { RegisterDTO } from "./dto/register.dto";
import { MailService } from "../mail/mail.service";

export class AuthService {
  private prisma: PrismaService;
  private passwordService: PasswordService;
  private tokenService: TokenService;
  private mailService: MailService;

  constructor() {
    this.prisma = new PrismaService();
    this.passwordService = new PasswordService();
    this.tokenService = new TokenService();
    this.mailService = new MailService();
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

  register = async (body: RegisterDTO) => {
    const existingEmail = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (existingEmail) {
      throw new ApiError("Email already exist", 400);
    }

    const hashedPassword = await this.passwordService.hashPassword(
      body.password
    );

    const newUser = await this.prisma.user.create({
      data: { ...body, password: hashedPassword },
      omit: { password: true },
    });

    await this.mailService.sendEmail(
      body.email,
      "Welcome to BlogHub",
      "welcoming",
      { name: body.name }
    );

    return newUser;
  };
}
