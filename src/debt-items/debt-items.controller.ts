import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { DebtItemsService } from './debt-items.service';
import { CreateDebtItemDto } from './dto/create-debt-item.dto';
import { UpdateDebtItemDto } from './dto/update-debt-item.dto';
import { UserParam } from '../auth/decorators/user-param.decorator';
import { User } from '../users/entities/user.entity';
import { Response } from 'express';

@Controller('debt-items')
export class DebtItemsController {
  constructor(private readonly debtItemsService: DebtItemsService) {}

  @Post()
  create(@Body() createDebtItemDto: CreateDebtItemDto) {
    return this.debtItemsService.create(createDebtItemDto);
  }

  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateDebtItemDto: UpdateDebtItemDto,
    @UserParam() { id: userId }: User,
  ) {
    if (!(await this.debtItemsService.isCurrentUserOwner(+id, userId))) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Access denied' });
    }

    return await this.debtItemsService.update(+id, updateDebtItemDto);
  }

  @Delete(':id')
  async remove(
    @Res() res: Response,
    @Param('id') id: string,
    @UserParam() { id: userId }: User,
  ) {
    if (!(await this.debtItemsService.isCurrentUserOwner(+id, userId))) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Access denied' });
    }

    return await this.debtItemsService.remove(+id);
  }
}
