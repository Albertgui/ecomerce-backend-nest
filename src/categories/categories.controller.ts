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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = await this.categoriesService.create(createCategoryDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Categoría creada exitosamente',
      data: data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.categoriesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Categorías obtenidas',
      data: data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const data = await this.categoriesService.update(id, updateCategoryDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Categoría editada exitosamente',
      data: data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('id')
  async delete(@Param('id') id: string) {
    const data = await this.categoriesService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Categoría eliminada con éxito',
      data: data,
    };
  }
}
