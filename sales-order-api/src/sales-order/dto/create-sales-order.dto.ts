import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsEnum,
  ValidateNested,
  IsArray,
  IsDecimal,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType, TransactionOrigin, ShipVia, SalesOrderStatus } from '@prisma/client';
import { CreateSalesOrderLineItemDto } from './create-sales-order-line-item.dto';

export class CreateSalesOrderDto {
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  oneTimeCustomerName?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  customerPO?: string;

  @IsUUID()
  arAccountId: string;

  @IsDateString()
  @IsOptional()
  shipBy?: string;

  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @IsEnum(TransactionOrigin)
  @IsOptional()
  transactionOrigin?: TransactionOrigin;

  @IsEnum(ShipVia)
  @IsOptional()
  shipVia?: ShipVia;

  @IsEnum(SalesOrderStatus)
  @IsOptional()
  status?: SalesOrderStatus;

  @IsDecimal()
  @IsOptional()
  totalAmount?: number;

  @IsString()
  @IsOptional()
  soNumber?: string;


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSalesOrderLineItemDto)
  lineItems?: CreateSalesOrderLineItemDto[];
}
