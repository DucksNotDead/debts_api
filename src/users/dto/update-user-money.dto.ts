import { IsNumber } from 'class-validator';

export class UpdateUserMoneyDto {
  @IsNumber()
  money: number;
}
