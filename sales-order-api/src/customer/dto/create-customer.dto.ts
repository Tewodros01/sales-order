import { IsString, IsOptional, IsEmail, Length } from "class-validator";

export class CreateCustomerDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
