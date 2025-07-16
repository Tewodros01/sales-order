import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';
import { UpdateSalesOrderDto } from './dto/update-sales-order.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class SalesOrderService {
  constructor(private prisma: PrismaService) {}

  private calculateAmount(
    quantity: number,
    unitPrice: number,
    taxRate: number
  ): number {
    const lineAmount = quantity * unitPrice;
    const taxAmount = lineAmount * (taxRate / 100);
    return lineAmount + taxAmount;
  }

  private async getTaxRate(taxId: string): Promise<number> {
    const tax = await this.prisma.tax.findUnique({ where: { id: taxId } });
    if (!tax) {
      throw new BadRequestException(`Tax with id ${taxId} not found.`);
    }
    return (tax.rate as Decimal).toNumber();
  }

  async create(dto: CreateSalesOrderDto) {
    // Ensure that at least one line item exists, regardless of the transaction type
    if (!dto.lineItems || dto.lineItems.length === 0) {
      throw new BadRequestException('At least one line item is required.');
    }

    const soNumber = dto.soNumber || `SO-${Date.now()}`;

    // Process line items for both GOODS and SERVICES
    const lineItemsData = dto.lineItems.map(async (item) => {
      // For GOODS transactions, ensure that inventoryItemId is provided
      if (dto.transactionType === 'GOODS' && !item.inventoryItemId) {
        throw new BadRequestException('Inventory item is required for GOODS transaction.');
      }

      // Get tax rate if applicable
      const taxRate = item.taxId ? await this.getTaxRate(item.taxId) : 0;
      const amount = this.calculateAmount(item.quantity, item.unitPrice, taxRate);

      // Create line item for both GOODS and SERVICES
      return {
        quantity: item.quantity,
        shipped: item.shipped ?? 0,
        inventoryItemId: dto.transactionType === 'GOODS' ? item.inventoryItemId : null,
        glAccountId: item.glAccountId,
        taxId: item.taxId,
        description: item.description,
        unitPrice: item.unitPrice,
        amount,
        project: item.project,
        phase: item.phase,
      };
    });

    // Wait for all line items to be processed
    const lineItems = await Promise.all(lineItemsData);
    const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);

    // Create sales order with line items for both GOODS and SERVICES
    return this.prisma.salesOrder.create({
      data: {
        soNumber,
        customerId: dto.customerId,
        oneTimeCustomerName: dto.oneTimeCustomerName,
        date: dto.date ? new Date(dto.date) : undefined,
        customerPO: dto.customerPO,
        arAccountId: dto.arAccountId,
        shipBy: dto.shipBy ? new Date(dto.shipBy) : undefined,
        transactionType: dto.transactionType,
        transactionOrigin: dto.transactionOrigin,
        shipVia: dto.shipVia,
        status: dto.status || 'DRAFT',
        lineItems: {
          create: lineItems,
        },
        totalAmount,
      },
      include: { lineItems: true },
    });
  }


  async findAll(query: {
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    transactionType?: string;
    arAccountId?: string;
    skip?: number;
    take?: number;
  }) {
    const filters: any = {};

    console.log('Query parameters:', query);
    // Apply status filter
    if (query.status) {
      filters.status = query.status;
    }

    // Apply date filters
    if (query.dateFrom || query.dateTo) {
      filters.date = {};
      if (query.dateFrom) filters.date.gte = new Date(query.dateFrom);
      if (query.dateTo) filters.date.lte = new Date(query.dateTo);
    }

    // Apply transaction type filter
    if (query.transactionType) {
      filters.transactionType = query.transactionType;
    }

    // Apply arAccountId filter
    if (query.arAccountId) {
      filters.arAccount = { id: query.arAccountId };  // Filter by AR Account's ID
    }

    // Apply search filter
    if (query.search) {
      const isNumber = !isNaN(Number(query.search));
      filters.OR = [
        {
          customerPO: {
            contains: query.search,
          },
        },
        {
          oneTimeCustomerName: {
            contains: query.search,
          },
        },
        {
          customer: {
            is: {
              name: {
                contains: query.search,
              },
            },
          },
        },
        ...(isNumber ? [{ soNumber: Number(query.search) }] : []),
      ];
    }

    // Execute Prisma query with filters
    const salesOrders = await this.prisma.salesOrder.findMany({
      where: filters,
      orderBy: { date: 'desc' },
      include: {
        customer: true,
        arAccount: true,
        lineItems: {
          include: {
            inventoryItem: true,
            glAccount: true,
            tax: true,
          },
        },
      },
      skip: query.skip,
      take: query.take,
    });

    return salesOrders;
  }


  async findOne(id: string) {
    const so = await this.prisma.salesOrder.findUnique({
      where: { id },
      include: { customer: true, arAccount: true, lineItems: true },
    });
    if (!so) throw new NotFoundException('Sales Order not found');
    return so;
  }

  async update(id: string, dto: UpdateSalesOrderDto) {
    await this.findOne(id);

    // Check if lineItems is defined before mapping through them
    const lineItemsData = dto.lineItems?.map((item) => ({
      quantity: item.quantity,
      shipped: item.shipped ?? 0,
      inventoryItemId: item.inventoryItemId,
      glAccountId: item.glAccountId,
      taxId: item.taxId,
      description: item.description,
      unitPrice: item.unitPrice,
      amount: item.quantity * item.unitPrice,
      project: item.project,
      phase: item.phase,
    })) ?? []; // Default to empty array if lineItems is undefined

    // Calculate total amount
    const totalAmount = lineItemsData.reduce((sum, item) => sum + item.amount, 0);

    return this.prisma.$transaction([
      this.prisma.salesOrderLineItem.deleteMany({
        where: { salesOrderId: id },
      }),
      this.prisma.salesOrder.update({
        where: { id },
        data: {
          customerId: dto.customerId,
          oneTimeCustomerName: dto.oneTimeCustomerName,
          date: dto.date ? new Date(dto.date) : undefined,
          customerPO: dto.customerPO,
          arAccountId: dto.arAccountId,
          shipBy: dto.shipBy ? new Date(dto.shipBy) : undefined,
          transactionType: dto.transactionType,
          transactionOrigin: dto.transactionOrigin,
          shipVia: dto.shipVia,
          lineItems: dto.lineItems
            ? {
                create: lineItemsData,
              }
            : undefined,
          totalAmount, // Update total amount
        },
        include: { lineItems: true },
      }),
    ]);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.salesOrder.delete({ where: { id } });
  }

  async submit(id: string) {
    const so = await this.findOne(id);
    if (so.status === 'SUBMITTED') {
      throw new BadRequestException('Sales Order is already submitted.');
    }
    return this.prisma.salesOrder.update({
      where: { id },
      data: { status: 'SUBMITTED' },
    });
  }
}
