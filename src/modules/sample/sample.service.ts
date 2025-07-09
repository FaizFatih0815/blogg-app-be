import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";

export class SampleService {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  getSample = async (id: number) => {
    const sample = await this.prisma.sample.findFirst({
      where: { id },
    });

    if (!sample) {
      throw new ApiError("Sample not found", 404);
    }

    return sample;
  };
}
