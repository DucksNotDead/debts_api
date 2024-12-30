import {Injectable} from '@nestjs/common';
import {DbService} from '../db/db.service';
import {User} from './entities/user.entity';
import {CreditsDto} from '../auth/dto/credits.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  async create({ login, password }: CreditsDto) {
    return (
      await this.dbService.query<User>(
        `
    INSERT INTO users (login, password, money) 
    VALUES ($1, $2, 0) 
    RETURNING id, login, money`,
        [login, password],
      )
    )[0];
  }

  async getById(id: number) {
    return (
      await this.dbService.query<User>(
        `
    SELECT u.id, u.login, u.money
    FROM users u
    WHERE u.id = $1`,
        [id],
      )
    )[0];
  }

  async updateMoney(id: number, money: number) {
    return (
      await this.dbService.query<User>(
        `
    UPDATE users SET money = $2
    WHERE id = $1
    RETURNING id, login, money`,
        [id, money],
      )
    )[0];
  }

  async remove(id: number) {
    return (
      await this.dbService.query(
        `
    DELETE FROM users 
    WHERE id = $1 
    RETURNING id`,
        [id],
      )
    )[0];
  }
}
