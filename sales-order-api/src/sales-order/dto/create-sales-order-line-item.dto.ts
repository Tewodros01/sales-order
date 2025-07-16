import { IsString, IsNumber, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class CreateSalesOrderLineItemDto {
  @ValidateIf((o) => o.transactionType === 'GOODS')
  @IsUUID()
  @IsOptional()
  inventoryItemId?: string;

  @IsUUID()
  glAccountId: string;

  @IsUUID()
  @IsOptional()
  taxId?: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  @IsOptional()
  shipped?: number;

  @IsString()
  description: string;

  @IsNumber()
  unitPrice: number;

  @IsOptional()
  @IsString()
  project?: string;

  @IsOptional()
  @IsString()
  phase?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

}
