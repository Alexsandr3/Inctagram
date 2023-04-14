// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
// import { CreateProfileInputDto } from '../../api/inpu-dto/create-profile.input.dto';
// import { IUsersRepository } from '../../infrastructure/users.repository';
// import { NotificationException } from '../../../../main/validators/result-notification';
// import { NotificationCode } from '../../../../configuration/exception.filter';
// import { ProfileViewDto } from '../../api/view-models/profile-view.dto';
//
// export class CreateProfileCommand {
//   constructor(public readonly userId: number, public readonly body: CreateProfileInputDto) {}
// }
//
// @CommandHandler(CreateProfileCommand)
// export class CreateProfileUseCase
//   extends BaseNotificationUseCase<CreateProfileCommand, ProfileViewDto>
//   implements ICommandHandler<CreateProfileCommand>
// {
//   constructor(private readonly userRepository: IUsersRepository) {
//     super();
//   }
//
//   async executeUseCase(command: CreateProfileCommand): Promise<ProfileViewDto> {
//     const { userId, body } = command;
//     const { userName } = body;
//
//     //find foundUser by id
//     const foundUser = await this.userRepository.findById(userId);
//     if (!foundUser)
//       throw new NotificationException(`User with id ${userId} not found`, 'id', NotificationCode.NOT_FOUND);
//     //check exist profile
//     if (foundUser.profile)
//       throw new NotificationException(`Profile already exists`, 'profile', NotificationCode.BAD_REQUEST);
//
//     //check userName is unique
//     const userWithUserName = await this.userRepository.findUserByUserName(userName);
//     if (userWithUserName && userWithUserName.id !== foundUser.id) {
//       throw new NotificationException(
//         `User with userName ${userName} already exists`,
//         'userName',
//         NotificationCode.BAD_REQUEST,
//       );
//     }
//
//     //create profile
//     foundUser.createProfile(body);
//     //save profile
//     await this.userRepository.updateUser(foundUser);
//     return ProfileViewDto.createView(foundUser.profile, foundUser.userName);
//   }
// }
