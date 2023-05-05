import { Controller, Get, HttpCode, Param, ParseIntPipe, Query } from '@nestjs/common';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { ApiTags } from '@nestjs/swagger';
import { IPostsQueryRepository } from '../infrastructure/posts-query.repository';
import { PaginationPostsInputDto } from './input-dto/pagination-posts.input.dto';
import { SwaggerDecoratorsByGetPosts } from '../swagger/swagger.posts.decorators';
import { ApiOkResponsePaginated } from '../../../main/shared/api-ok-response-paginated';
import { PostViewModel } from './view-models/post-view.dto';
import { Paginated } from '../../../main/shared/paginated';

@ApiTags('Posts')
@Controller('posts')
export class PostsGetController {
  constructor(private readonly postsQueryRepository: IPostsQueryRepository) {}

  /**
   * Get posts by user id
   * @param userId
   * @param paginationInputModel
   */
  @SwaggerDecoratorsByGetPosts()
  @ApiOkResponsePaginated(PostViewModel)
  @Get('/:userId')
  @HttpCode(HTTP_Status.OK_200)
  async getPosts(
    @Param(`userId`, ParseIntPipe) userId: number,
    @Query() paginationInputModel: PaginationPostsInputDto,
  ): Promise<Paginated<PostViewModel[]>> {
    return this.postsQueryRepository.getPosts(userId, paginationInputModel);
  }
}
