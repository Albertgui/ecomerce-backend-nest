import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Usuario registrado exitosamente',
      data: data,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Autenticación exitosa',
      data: data,
    };
  }
}
