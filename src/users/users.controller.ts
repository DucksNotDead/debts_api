import {Body, Controller, Delete, Patch} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserMoneyDto} from './dto/update-user-money.dto';
import {UserParam} from '../auth/decorators/user-param.decorator';
import {User} from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Patch('money')
  updateMoney(
    @UserParam() { id }: User,
    @Body() { money }: UpdateUserMoneyDto,
  ) {
    return this.usersService.updateMoney(id, money);
  }

  @Delete()
  remove(@UserParam() { id }: User) {
    return this.usersService.remove(id);
  }
}
