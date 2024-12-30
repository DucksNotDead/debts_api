import { Module } from '@nestjs/common';
import { DebtItemsService } from './debt-items.service';
import { DebtItemsController } from './debt-items.controller';

@Module({
  controllers: [DebtItemsController],
  providers: [DebtItemsService],
})
export class DebtItemsModule {}
