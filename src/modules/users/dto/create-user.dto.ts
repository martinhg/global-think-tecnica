import { IsEmail, IsInt, IsNotEmpty, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Min(1)
  age: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  username: string;
}
