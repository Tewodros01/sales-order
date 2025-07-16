import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { Account } from "@prisma/client";

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAccountDto): Promise<Account> {
    // Check unique accountNumber
    const duplicate = await this.prisma.account.findUnique({
      where: { accountNumber: data.accountNumber },
    });
    if (duplicate) {
      throw new ConflictException(
        `Account Number "${data.accountNumber}" already exists.`
      );
    }

    return this.prisma.account.create({
      data: {
        accountNumber: data.accountNumber,
        title: data.title,
        type: data.type,
        inactive: data.inactive ?? false,
        isAR: data.isAR ?? (data.type === "AccountsReceivable"),
        isGL: data.isGL ?? true, // default all accounts to GL unless explicitly false
      },
    });
  }

  findAll(): Promise<Account[]> {
    return this.prisma.account.findMany({
      orderBy: { title: "asc" },
    });
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID "${id}" not found.`);
    }
    return account;
  }

  async update(id: string, data: UpdateAccountDto): Promise<Account> {
    // Ensure exists
    await this.findOne(id);

    if (data.accountNumber) {
      const existing = await this.prisma.account.findUnique({
        where: { accountNumber: data.accountNumber },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Account Number "${data.accountNumber}" is already in use.`
        );
      }
    }

    return this.prisma.account.update({
      where: { id },
      data: {
        ...data,
        isAR:
          data.isAR !== undefined
            ? data.isAR
            : data.type === "AccountsReceivable",
        isGL:
          data.isGL !== undefined
            ? data.isGL
            : true,
      },
    });
  }

  async remove(id: string): Promise<Account> {
    await this.findOne(id);
    return this.prisma.account.delete({
      where: { id },
    });
  }
}
