import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginInputDto } from '../../modules/auth/api/input-dto/login.input.dto';

@Injectable()
export class CheckLoginBodyFieldsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const object2 = plainToInstance(LoginInputDto, req.body);
    const res = await validate(object2, { stopAtFirstError: true });

    if (res.length > 0) {
      const error = res.map(e => {
        const values = Object.values(e.constraints);
        return { field: e.property, message: values[0] };
      });
      throw new BadRequestException('bad email or password');
    }

    return true;
  }
}
