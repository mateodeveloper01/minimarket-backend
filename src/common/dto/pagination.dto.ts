import { Category } from '@prisma/client';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsPositive()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsString()
  category?: Category;

  @IsOptional()
  @IsBoolean()
  stock?: boolean;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  tipo?: string;
}
