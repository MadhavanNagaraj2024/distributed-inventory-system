import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from 'generated/prisma';


@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.InventoryCreateInput) {
    return this.prisma.inventory.create({
      data,
    });
  }

  async findByProduct(productId: string) {
    return this.prisma.inventory.findMany({
      where: {
        productId,
      },
    });
  }
}
