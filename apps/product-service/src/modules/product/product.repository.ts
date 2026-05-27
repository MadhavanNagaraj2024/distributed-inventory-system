import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }

  async findBySku(sku: string) {
    return this.prisma.product.findUnique({
      where: { sku },
    });
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },

      include: {
        category: true,
        brand: true,
      },
    });
  }

  async findAll(skip: number, take: number, search?: string) {
    return this.prisma.product.findMany({
      skip,
      take,

      where: search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },

              {
                sku: {
                  contains: search,
                  mode: 'insensitive',
                },
              },

              {
                barcode: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {},

      include: {
        category: true,
        brand: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async count(search?: string) {
    return this.prisma.product.count({
      where: search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },

              {
                sku: {
                  contains: search,
                  mode: 'insensitive',
                },
              },

              {
                barcode: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {},
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async changeStatus(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }
}
