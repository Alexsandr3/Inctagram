/*
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../application/auth.service';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { LoginInputDto } from './input-dto/login.input.dto';
import { LoginSuccessViewDto } from './view-dto/login-success.view.dto';
import { UsersModule } from '../../users/users.module';
import { TokensType } from '../application/types/types';
import { NotificationStatus, ResultNotification } from '../../../main/validators/result-notification';
import { NotificationCode } from '../../../configuration/exception.filter';

describe('Login', () => {
  let controller: AuthController;
  let authService: AuthService;
  let response: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    response = {
      cookie: jest.fn(),
    } as any;
  });

  describe('login', () => {
    it('should return an access token and set a refresh token cookie', async () => {
      const userId = 1;
      const ip = '127.0.0.1';
      const deviceName = 'Test Device';
      const accessToken = 'test-access-token';
      const refreshToken = 'test-refresh-token';
      const notification: ResultNotification<TokensType> = {
        extensions: [], // array of mistakes
        status: NotificationStatus.SUCCESS, // status code {0 - success, 1 - error}
        code: NotificationCode.OK,
        data: {
          accessToken,
          refreshToken,
        },
      };
      jest.spyOn(controller, 'login').mockImplementation(notification);

      const loginInput: LoginInputDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const expectedResponse: LoginSuccessViewDto = {
        accessToken,
      };

      const res = response as Response;
      const result = await controller.login(ip, deviceName, res, userId, loginInput);

      expect(result).toEqual(expectedResponse);
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', refreshToken, { httpOnly: true, secure: true });
    });
  });
});
*/
