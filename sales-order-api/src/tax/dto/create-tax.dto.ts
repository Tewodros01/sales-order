import { IsString, IsNumber, IsEnum, IsOptional, Length } from 'class-validator';
import { TaxParty } from '@prisma/client';

export class CreateTaxDto {
  @IsString()
  @Length(1, 100)
  taxType: string;

  @IsNumber()
  rate: number;

  @IsOptional()
  @IsString()
  taxAuthorityName?: string;

  @IsOptional()
  @IsString()
  bankAccountNumber?: string;

  @IsEnum(TaxParty)
  vendorOrCustomer: TaxParty;

  @IsOptional()
  @IsString()
  vendorTaxOffice?: string;

  @IsString()
  glAccountId: string;
}
