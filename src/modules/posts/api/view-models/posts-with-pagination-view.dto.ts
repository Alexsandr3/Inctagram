import { Paginated } from '../../../../main/shared/paginated';
import { PostViewModel } from './post-view.dto';

export class PostsWithPaginationViewDto extends Paginated<PostViewModel> {
  items: PostViewModel;
}
