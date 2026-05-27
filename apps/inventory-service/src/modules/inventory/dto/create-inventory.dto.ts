import { IsInt, IsString, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  productId: string;

  @IsString()
  warehouseId: string;

  @IsInt()
  @Min(0)
  availableStock: number;
}
