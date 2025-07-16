import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  Res
} from '@nestjs/common';
import { SalesOrderService } from './sales-order.service';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';
import { UpdateSalesOrderDto } from './dto/update-sales-order.dto';
import { Response } from 'express';

@Controller('sales-orders')
export class SalesOrderController {
  constructor(private readonly service: SalesOrderService) {}

  @Post()
  create(@Body() dto: CreateSalesOrderDto) {
    return this.service.create(dto);
  }

@Get()
findAll(
  @Query('search') search?: string,
  @Query('dateFrom') dateFrom?: string,
  @Query('dateTo') dateTo?: string,
  @Query('status') status?: string,
  @Query('skip') skip?: string,
  @Query('take') take?: string,
  @Query('transactionType') transactionType?: string,
  @Query('arAccountId') arAccountId?: string,
) {
  return this.service.findAll({
    search,
    dateFrom,
    dateTo,
    status,
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    transactionType,
    arAccountId,
  });
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSalesOrderDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Patch(':id/submit')
  submit(@Param('id') id: string) {
    return this.service.submit(id);
  }

  @Get('export')
  async export(@Res() res: Response) {
    const data = await this.service.findAll({});
    return res.json(data);
  }
}
