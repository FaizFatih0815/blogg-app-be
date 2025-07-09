import { PrismaClient } from "../../generated/prisma";

export class PrismaService extends PrismaClient {
  constructor() {
    super(); // Untuk nge eksekusi dari parent nya
  }
}
