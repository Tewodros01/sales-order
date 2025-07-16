import { IsString, IsEnum, IsBoolean, IsOptional } from "class-validator";
import { AccountType } from "@prisma/client";

export class CreateAccountDto {
  @IsString()
  accountNumber: string; // REQUIRED

  @IsString()
  title: string; // REQUIRED

  @IsEnum(AccountType)
  type: AccountType; // REQUIRED

  @IsOptional()
  @IsBoolean()
  inactive?: boolean; // Optional, defaults to false

  @IsOptional()
  @IsBoolean()
  isAR?: boolean; // Optional flag, default handled in service

  @IsOptional()
  @IsBoolean()
  isGL?: boolean; // Optional flag, default handled in service
}
