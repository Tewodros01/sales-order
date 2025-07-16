import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';

@Injectable()
export class TaxService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateTaxDto) {
    return this.prisma.tax.create({ data });
  }

  findAll() {
    return this.prisma.tax.findMany({
      include: { glAccount: true },
      orderBy: { taxType: 'asc' },
    });
  }

  async findOne(id: string) {
    const tax = await this.prisma.tax.findUnique({
      where: { id },
      include: { glAccount: true },
    });
    if (!tax) throw new NotFoundException('Tax not found');
    return tax;
  }

  async update(id: string, data: UpdateTaxDto) {
    await this.findOne(id);
    return this.prisma.tax.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.tax.delete({ where: { id } });
  }
}
