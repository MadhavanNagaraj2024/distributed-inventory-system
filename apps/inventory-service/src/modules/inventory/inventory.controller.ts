import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  createInventory(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.createInventory(dto);
  }

  @Get(':productId')
  getInventory(@Param('productId') productId: string) {
    return this.inventoryService.getInventory(productId);
  }

  @Get('test')
  getTestInventory() {
    return 'Inventory test endpoint';
  }
}
