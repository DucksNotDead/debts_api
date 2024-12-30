import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { CreditsDto } from './dto/credits.dto';
import { DbService } from '../db/db.service';
import { JwtService } from '@nestjs/jwt';
import {AUTH_TOKEN_KEY} from "../../shared/const";

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ login, password }: CreditsDto) {
    return (
      await this.dbService.query<User>(
        `
      SELECT u.id, u.login, u.money
      FROM users u
      WHERE u.login = $1 AND password = $2
    `,
        [login, password],
      )
    )[0];
  }

  async genToken(user: User) {
    const { money, ...payload } = user;
    return this.jwtService.sign(payload);
  }

  userIdFromToken(token: string) {
    try {
      const { id } = this.jwtService.verify(token);
      return id
    } catch {
      return null;
    }
  }

  createCookie(token: string) {
    return [
      AUTH_TOKEN_KEY,
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 1000 * 72,
      },
    ] as const;
  }
}
