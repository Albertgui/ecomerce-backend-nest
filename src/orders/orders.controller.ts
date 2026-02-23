import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/auth/strategy/jwt-strategy.interface';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const userId: string = req.user.id;

    const data = await this.ordersService.create(userId, createOrderDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Orden de compra procesada exitosamente',
      data: data,
    };
  }

  @Get()
  async findMyOrders(@Req() req: RequestWithUser) {
    const userId: string = req.user.id;
    const data = await this.ordersService.findUserOrders(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Historial de compras obtenido',
      data: data,
    };
  }
}
