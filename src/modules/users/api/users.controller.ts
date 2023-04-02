import { Controller, Delete, Get, HttpCode, Post } from '@nestjs/common';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('sa/users')
export class UsersController {
  @Get()
  async findUsers() {
    return { route: 'findUsers', status: 'OK' };
  }

  @Post()
  @HttpCode(HTTP_Status.CREATED_201)
  async createUser() {
    return { route: 'createUser', status: 'OK' };
  }

  @Delete(':id')
  @HttpCode(HTTP_Status.OK_200)
  async deleteUser() {
    return { route: 'deleteUser', status: 'OK' };
  }
}
