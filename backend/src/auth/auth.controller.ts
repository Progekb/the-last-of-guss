import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus, NotFoundException, UseGuards, Get, Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard, Public } from 'src/jwt-auth.guard';
import { User } from 'src/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      let user = await this.authService.findUser(loginDto.username);
      if (user) {
        const validate = await this.authService.validateUser(user, loginDto.password);
        if (!validate) {
          throw new NotFoundException('Ошибка авторизации');
        }
      } else {
        user = await this.authService.createUser(loginDto.username, loginDto.password);
      }
      const { access_token } = await this.authService.login(user);

      return {
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        },
        access_token
      };
    } catch (err) {
      console.log(err)
      throw new HttpException(
        { message: err.message || 'Ошибка авторизации' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('userInfo')
  async userInfo(@Req() req: Express.Request) {
    const user = req.user as User
    return this.authService.userInfo(user.id)
  }
}
