import { PartialType } from '@nestjs/mapped-types';
import { CreateDebtItemDto } from './create-debt-item.dto';

export class UpdateDebtItemDto extends PartialType(CreateDebtItemDto) {}
