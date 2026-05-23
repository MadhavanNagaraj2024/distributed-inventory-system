import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ProductService } from './product.service';

import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @ApiOperation({
    summary: 'Create Product',
  })
  @Post()
  async createProduct(
    @Body() dto: CreateProductDto,
  ) {
    return this.productService.createProduct(
      dto,
    );
  }

  @ApiOperation({
    summary: 'Get All Products',
  })
  @Get()
  async getProducts(
    @Query() query: QueryProductDto,
  ) {
    return this.productService.getProducts(
      query,
    );
  }

  @ApiOperation({
    summary: 'Get Product By Id',
  })
  @Get(':id')
  async getProductById(
    @Param('id') id: string,
  ) {
    return this.productService.getProductById(
      id,
    );
  }
}