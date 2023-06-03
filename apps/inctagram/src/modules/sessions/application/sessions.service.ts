import { Injectable } from '@nestjs/common';
import { ISessionsRepository } from '../infrastructure/sessions-repository';
import { NotificationException } from '@common/main/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: ISessionsRepository) {}

  /**
   * @description Find session by device id and check if user has permission to delete it
   * @param deviceId
   * @param userId
   */
  public async findSessionByDeviceId(deviceId: number, userId: number) {
    const foundSession = await this.sessionsRepository.findSessionByDeviceId(deviceId);
    if (!foundSession) throw new NotificationException('Session not found', 'session', NotificationCode.NOT_FOUND);
    if (!foundSession.hasOwner(userId))
      throw new NotificationException(
        "You don't have permission to delete this session",
        'session',
        NotificationCode.FORBIDDEN,
      );
    return foundSession;
  }
}
