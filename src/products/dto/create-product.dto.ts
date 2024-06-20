import { Category } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  tipo: string;

  @IsString()
  description: string;

  @IsString()
  brand: string;

  @IsString()
  amount: string;

  @IsInt()
  @IsPositive()
  price: number;

  @IsEnum(Category)
  category: Category;

  @IsOptional()
  url;

  @IsOptional()
  image;

  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value == true) return true;
    if (value === 'false' || value == false) return false;
    throw new Error('Invalid boolean value');
  })
  stock:string;
}
