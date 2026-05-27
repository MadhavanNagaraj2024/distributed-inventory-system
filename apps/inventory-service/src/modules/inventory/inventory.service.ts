import {
  Injectable,
} from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';
import { CreateInventoryDto } from './dto/create-inventory.dto';


@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async createInventory(dto: CreateInventoryDto) {
    const inventory = await this.inventoryRepository.create({
      productId: dto.productId,
      warehouseId: dto.warehouseId,
      availableStock: dto.availableStock,
    });

    return {
      message: 'Inventory created successfully',
      data: inventory,
    };
  }

  async getInventory(productId: string) {
    const inventory = await this.inventoryRepository.findByProduct(productId);

    return {
      message: 'Inventory fetched successfully',
      data: inventory,
    };
  }
}
