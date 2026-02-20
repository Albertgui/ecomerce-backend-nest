import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll() {
    const data = await this.productsService.findAll();

    return {
      statusCode: HttpStatus.OK,
      message: 'Catálogo de productos obtenido',
      data: data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const data = await this.productsService.create(createProductDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Producto creado exitosamente',
      data: data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const data = await this.productsService.update(id, updateProductDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Producto editado exitosamente',
      data: data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.productsService.delete(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Producto eliminado exitosamente',
      data: data,
    };
  }
}
