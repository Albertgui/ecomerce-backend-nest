import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    return await this.prisma.$transaction(async (tx) => {
      const productIds = createOrderDto.items.map((item) => item.productId);

      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new NotFoundException(
          'Uno o más productos en el carrito no existen',
        );
      }

      let orderTotal = 0;
      const orderItemsData: {
        productId: string;
        quantity: number;
        price: number;
      }[] = [];

      for (const item of createOrderDto.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          throw new NotFoundException(
            `El producto con ID ${item.productId} no fue encontrado`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Inventario insuficiente para el producto: ${product.name}. Quedan en inventario: ${product.stock}`,
          );
        }

        const currentPrice = Number(product.price);
        orderTotal += currentPrice * item.quantity;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: currentPrice,
        });

        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      const order = await tx.order.create({
        data: {
          userId: userId,
          total: orderTotal,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });
  }

  async findUserOrders(userId: string) {
    return await this.prisma.order.findMany({
      where: { userId: userId },
      include: {
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
