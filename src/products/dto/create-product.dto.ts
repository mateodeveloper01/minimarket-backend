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
  url:string;

  @IsOptional()
  image:any;

  @IsOptional()
  @IsBoolean()
  stock:boolean;
}
