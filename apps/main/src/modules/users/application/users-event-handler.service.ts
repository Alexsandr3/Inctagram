import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IUsersRepository } from '../infrastructure/users.repository';
import { SubscriptionEntity } from '../../subscriptions/domain/subscription.entity';
import { SubscriptionEventType } from '@common/main/subscription-event.type';
import { UserEntity } from '../domain/user.entity';

@Injectable()
export class UsersEventHandlerService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  /**
   * Deactivate user payments-ms account
   * @param subscription
   */
  @OnEvent(SubscriptionEventType.notExistingActiveSubscription)
  async deactivateUserBusinessAccount(subscription: SubscriptionEntity) {
    //find user by payments-ms account id from subscription
    const user = await this._findUserByBusinessAccountId(subscription.businessAccountId);
    //deactivate user - hasActiveBusinessAccount = false
    user.deactivateBusinessAccount();
    //save user
    await this._saveUser(user);
  }

  private async _findUserByBusinessAccountId(businessAccountId: number): Promise<UserEntity | null> {
    return await this.usersRepository.findById(businessAccountId);
  }
  private async _saveUser(user: UserEntity): Promise<void> {
    await this.usersRepository.updateExistingUser(user);
  }
}
