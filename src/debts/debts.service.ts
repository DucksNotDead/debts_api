import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { DbService } from '../db/db.service';

@Injectable()
export class DebtsService {
  constructor(private readonly dbService: DbService) {}

  async create({ name, color }: CreateDebtDto, userId: number) {
    return (
      await this.dbService.query(
        `
    INSERT INTO debts (name, color, user_id) 
    VALUES ($1, $2, $3)
    RETURNING *`,
        [name, color, userId],
      )
    )[0];
  }

  async getByUserWithItems(userId: number) {
    return await this.dbService.query(
      `
    SELECT d.*, (
      SELECT json_agg(row_to_json(di))
      FROM debt_items di
      WHERE di.debt_id = d.id
    ) as items
    FROM debts d
    WHERE d.user_id = $1`,
      [userId],
    );
  }

  async update(id: number, { name, color }: UpdateDebtDto, userId: number) {
    return (
      await this.dbService.query(
        `
    UPDATE debts
    SET name = $1, color = $2
    WHERE id = $3 AND user_id = $4
    RETURNING *`,
        [name, color, id, userId],
      )
    )[0];
  }

  async remove(id: number, userId: number) {
    return (
      await this.dbService.query(
        `
    DELETE FROM debts
    WHERE id = $1 AND user_id = $2
    RETURNING id`,
        [id, userId],
      )
    )[0];
  }
}
