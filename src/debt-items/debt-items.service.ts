import { Injectable } from '@nestjs/common';
import { CreateDebtItemDto } from './dto/create-debt-item.dto';
import { UpdateDebtItemDto } from './dto/update-debt-item.dto';
import { DbService } from '../db/db.service';

@Injectable()
export class DebtItemsService {
  constructor(private readonly dbService: DbService) {}

  async create({ debt_id, money, deadline }: CreateDebtItemDto) {
    return (
      await this.dbService.query(
        `
    INSERT INTO debt_items (debt_id, money, deadline)
    VALUES ($1, $2, $3)
    RETURNING *`,
        [debt_id, money, deadline],
      )
    )[0];
  }

  async update(id: number, { money, deadline }: UpdateDebtItemDto) {
    return (
      await this.dbService.query(
        `
    UPDATE debt_items 
    SET money = $1, deadline = $2
    WHERE id = $3
    RETURNING *`,
        [money, deadline, id],
      )
    )[0];
  }

  async remove(id: number) {
    return (
      await this.dbService.query(
        `
    DELETE FROM debt_items 
    WHERE id = $1
    RETURNING id`,
        [id],
      )
    )[0];
  }

  async isCurrentUserOwner(id: number, userId: number) {
    return !!(await this.dbService.query(
      `
    SELECT id, user_id
    FROM debt_items
    WHERE id = $1 AND user_id = $2`,
      [id, userId],
    ));
  }
}
