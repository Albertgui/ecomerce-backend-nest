import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @IsNumber()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}
