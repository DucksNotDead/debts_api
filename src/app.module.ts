import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/users.module';
import {APP_GUARD} from '@nestjs/core';
import {DbModule} from './db/db.module';
import {ConfigModule} from '@nestjs/config';
import {AuthModule} from './auth/auth.module';
import {ProtectedGuard} from "./auth/guards/protected.guard";
import {JwtModule} from "@nestjs/jwt";
import { DebtsModule } from './debts/debts.module';
import { DebtItemsModule } from './debt-items/debt-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.SECRET || 'secret',
      global: true,
    }),
    DbModule,
    UsersModule,
    AuthModule,
    DebtsModule,
    DebtItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ProtectedGuard,
  }],
})
export class AppModule {}
