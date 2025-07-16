import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCustomerDto) {
    return this.prisma.customer.create({ data });
  }

  findAll() {
    return this.prisma.customer.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) throw new NotFoundException("Customer not found");
    return customer;
  }

  async update(id: string, data: UpdateCustomerDto) {
    await this.findOne(id);
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
