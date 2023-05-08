import { BasePhotoSizeViewModel } from '../../../images/api/view-models/base-photo-size-view.dto';

export class PostImageVersionViewModel {
  huge?: BasePhotoSizeViewModel;
  large?: BasePhotoSizeViewModel;
}

export class PostImageViewModel {
  uploadId: string;
  versions: PostImageVersionViewModel;

  constructor(resourceId: string, postImageVersionViewModels: PostImageVersionViewModel) {
    this.uploadId = resourceId;
    this.versions = postImageVersionViewModels;
  }
}
