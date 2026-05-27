import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProductRepository } from './product.repository';

import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(dto: CreateProductDto) {
    /* CHECK DUPLICATE SKU */
    const existingSku = await this.productRepository.findBySku(dto.sku);

    if (existingSku) {
      throw new BadRequestException('SKU already exists');
    }
    /* CREATE SLUG */

    const slug = dto.name.toLowerCase().replace(/\s+/g, '-');

    /* CREATE PRODUCT */

    const product = await this.productRepository.create({
      name: dto.name,
      sku: dto.sku,
      slug,
      description: dto.description,
      barcode: dto.barcode,
      sellingPrice: dto.sellingPrice,
      costPrice: dto.costPrice,
      taxPercentage: dto.taxPercentage,
      reorderLevel: dto.reorderLevel ?? 0,
      trackInventory: dto.trackInventory ?? true,
      unit: dto.unit ?? 'pcs',

      category: dto.categoryId
        ? {
            connect: {
              id: dto.categoryId,
            },
          }
        : undefined,

      brand: dto.brandId
        ? {
            connect: {
              id: dto.brandId,
            },
          }
        : undefined,
    });

    return {
      message: 'Product created successfully',

      data: product,
    };
  }

  async getProducts(query: QueryProductDto) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.productRepository.findAll(skip, limit, query.search),
      this.productRepository.count(query.search),
    ]);

    return {
      message: 'Products fetched successfully',

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },

      data: products,
    };
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      message: 'Product fetched successfully',

      data: product,
    };
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    /* CHECK PRODUCT EXISTS */

    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    /* CHECK DUPLICATE SKU */

    if (dto.sku) {
      const existingSku = await this.productRepository.findBySku(dto.sku);

      if (existingSku && existingSku.id !== id) {
        throw new BadRequestException('SKU already exists');
      }
    }

    /* GENERATE SLUG */

    const slug = dto.name
      ? dto.name.toLowerCase().replace(/\s+/g, '-')
      : existingProduct.slug;

    /* UPDATE PRODUCT */

    const updatedProduct = await this.productRepository.update(id, {
      ...dto,
      slug,
    });

    return {
      message: 'Product updated successfully',
      data: updatedProduct,
    };
  }

  async deactivateProduct(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = await this.productRepository.changeStatus(id, {
      status: 'ACTIVE',
    });

    return {
      message: 'Product deactivated successfully',
      data: updatedProduct,
    };
  }
}
