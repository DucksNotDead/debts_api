import {Body, Controller, Get, HttpStatus, Post, Res,} from '@nestjs/common';
import {AuthService} from './auth.service';
import {Response} from 'express';
import {CreditsDto} from './dto/credits.dto';
import {UsersService} from '../users/users.service';
import {AUTH_TOKEN_KEY} from '../../shared/const';
import {Public} from './guards/public.decorator';
import {UserParam} from './decorators/user-param.decorator';
import {User} from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() credits: CreditsDto, @Res() res: Response) {
    const candidate = await this.authService.validateUser(credits);
    if (candidate) {
      return res.status(HttpStatus.FOUND).json({ message: 'Already exists' });
    }

    const user = await this.usersService.create(credits);
    const token = await this.authService.genToken(user);
    return res.cookie(...this.authService.createCookie(token)).json(user);
  }

  @Public()
  @Post('login')
  async login(@Body() credits: CreditsDto, @Res() res: Response) {
    const user = await this.authService.validateUser(credits);
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }

    const token = await this.authService.genToken(user);
    return res.cookie(...this.authService.createCookie(token)).json(user);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    return res.clearCookie(AUTH_TOKEN_KEY).json({ message: 'Logout successful' });
  }

  @Get()
  async auth(@UserParam() user: User, @Res() res: Response) {
    return res.status(HttpStatus.OK).json(user);
  }
}
