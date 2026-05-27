import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Put,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Create Product',
  })
  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @ApiOperation({
    summary: 'Get All Products',
  })
  @Get()
  async getProducts(@Query() query: QueryProductDto) {
    return this.productService.getProducts(query);
  }

  @ApiOperation({
    summary: 'Get Product By Id',
  })
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Put(':id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.updateProduct(id, dto);
  }

  @Patch(':id/deactivate')
  deactivateProduct(@Param('id') id: string) {
    return this.productService.deactivateProduct(id);
  }
}
