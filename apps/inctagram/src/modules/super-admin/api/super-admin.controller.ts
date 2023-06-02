import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

export const Patterns = {
  GET_USERS_FOR_SUPER_ADMIN: 'getUsersForSuperAdmin',
};

// @UseGuards(BasicAuthForGraphqlGuard)
// @Resolver(() => UserForSuperAdminViewModel)
@Controller('super-admin')
export class SuperAdminResolver {
  constructor() // private readonly userQueryRepository: IUsersQueryRepository,
  // private readonly commandBus: CommandBus,
  // private readonly postsRepository: IPostsRepository,
  {}

  @MessagePattern({ cmd: Patterns.GET_USERS_FOR_SUPER_ADMIN })
  // @EventPattern({ cmd: 'add-subscribers' })
  async addSubscriber(@Payload() subscriber: any) {
    console.log('subscriber', subscriber);
    return 'ok';
  }

  /*
  @Query(() => UsersWithPaginationViewModel)
  async users(@Args() usersArgs: PaginationUsersInputDto): Promise<Paginated<UserForSuperAdminViewModel[]>> {
    return this.userQueryRepository.getUsersForSuperAdmin(usersArgs);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('userId') userId: number): Promise<boolean> {
    const notification = await this.commandBus.execute<DeleteUserCommand, ResultNotification<boolean>>(
      new DeleteUserCommand(userId),
    );
    return notification.getData();
  }

  @Mutation(() => Boolean)
  async updateUserStatus(@Args() inputArgs: UpdateUserStatusInputArgs): Promise<boolean> {
    const notification = await this.commandBus.execute<UpdateUserStatusCommand, ResultNotification<boolean>>(
      new UpdateUserStatusCommand(inputArgs.userId, inputArgs.banReason, inputArgs.isBanned),
    );
    return notification.getData();
  }

  @ResolveField(() => [PostForSuperAdminViewModel])
  async posts(
    @Parent() user: UserForSuperAdminViewModel,
    @Loader(PostLoader) postsLoader: DataLoader<number, PostForSuperAdminViewModel[]>,
  ): Promise<PostForSuperAdminViewModel[]> {
    const { userId } = user;
    return postsLoader.load(userId);
    // return this.postsRepository.getPostsById(userId);
  }

  @ResolveField(() => Number)
  async postsCount(@Parent() user: UserForSuperAdminViewModel): Promise<number> {
    const { userId } = user;
    return this.postsRepository.getPostsCountByUserId(userId);
  }

  @ResolveField(() => Number)
  async imagesCount(@Parent() user: UserForSuperAdminViewModel): Promise<number> {
    const { userId } = user;
    return this.postsRepository.getImagesCountByUserId(userId);
  }
}*/
}
