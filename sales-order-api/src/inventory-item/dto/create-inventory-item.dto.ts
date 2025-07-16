import { IsString, IsNumber, Length, IsOptional } from 'class-validator';

export class CreateInventoryItemDto {
  @IsString()
  @Length(1, 100)
  sku: string;

  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  @IsOptional()
  quantity?: number;
}
