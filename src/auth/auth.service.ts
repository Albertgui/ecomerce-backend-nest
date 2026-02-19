import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private readonly key = process.env.PASSWORD_KEY;

  async hashPassword(password: string): Promise<string> {
    const passwordWithKey = password + this.key;
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(passwordWithKey, salt);
  }

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('No se encuentra al usuario');
    }

    const isMatch = await bcrypt.compare(pass + this.key, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
    const hashedPassword = await this.hashPassword(password);
    try {
      return await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('El correo ya está registrado');
        }
      }
      throw error;
    }
  }
}
