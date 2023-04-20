import { Controller, Get, HttpCode, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { ApiTags } from '@nestjs/swagger';
import { IPostsQueryRepository } from '../infrastructure/posts-query.repository';
import { PaginationPostsInputDto } from './input-dto/pagination-posts.input.dto';
import { SwaggerDecoratorsByGetPosts } from '../swagger.posts.decorators';
import { ApiOkResponsePaginated } from '../../../main/shared/api-ok-response-paginated';
import { PostViewModel } from './view-models/post-view.dto';
import { PaginationViewModel } from '../../../main/shared/pagination-view.dto';

// @ApiBearerAuth()
@ApiTags('Posts')
// @UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsGetController {
  constructor(private readonly commandBus: CommandBus, private readonly postsQueryRepository: IPostsQueryRepository) {}

  @SwaggerDecoratorsByGetPosts()
  @ApiOkResponsePaginated(PostViewModel)
  @Get('all/:userId')
  @HttpCode(HTTP_Status.OK_200)
  async getPosts(
    // @CurrentUserId() userId: number,
    @Param(`userId`, ParseIntPipe) userId: number,
    @Query() paginationInputModel: PaginationPostsInputDto,
  ): Promise<PaginationViewModel<PostViewModel>> {
    return this.postsQueryRepository.getPosts(userId, paginationInputModel);
  }
}
