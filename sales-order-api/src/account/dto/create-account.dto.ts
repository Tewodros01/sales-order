import { IsString, IsEnum, IsBoolean, IsOptional } from "class-validator";
import { AccountType } from "@prisma/client";

export class CreateAccountDto {
  @IsString()
  accountNumber: string;

  @IsString()
  title: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsOptional()
  @IsBoolean()
  inactive?: boolean;

  @IsOptional()
  @IsBoolean()
  isAR?: boolean;

  @IsOptional()
  @IsBoolean()
  isGL?: boolean;
}
