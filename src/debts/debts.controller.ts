import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { UserParam } from '../auth/decorators/user-param.decorator';
import { User } from '../users/entities/user.entity';

@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  create(@Body() createDebtDto: CreateDebtDto, @UserParam() { id }: User) {
    return this.debtsService.create(createDebtDto, id);
  }

  @Get()
  findAll(@UserParam() { id }: User) {
    return this.debtsService.getByUserWithItems(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDebtDto: UpdateDebtDto,
    @UserParam() { id: userId }: User,
  ) {
    return this.debtsService.update(+id, updateDebtDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserParam() { id: userId }: User) {
    return this.debtsService.remove(+id, userId);
  }
}
