import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'iPhone 15 Pro',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'APL-IP15P-001',
  })
  @IsString()
  sku: string;

  @ApiPropertyOptional({
    example: 'iphone-15-pro',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: '256GB Black Titanium',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiProperty({
    example: 150000,
  })
  @IsNumber()
  @Min(0)
  sellingPrice: number;

  @ApiProperty({
    example: 120000,
  })
  @IsNumber()
  @Min(0)
  costPrice: number;

  @ApiPropertyOptional({
    example: 18,
  })
  @IsOptional()
  @IsNumber()
  taxPercentage?: number;

  @ApiPropertyOptional({
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  reorderLevel?: number;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @ApiPropertyOptional({
    example: 'pcs',
  })
  @IsOptional()
  @IsString()
  unit?: string;
}