import { BasePhotoSizeViewModel } from '../../../images/api/view-models/base-photo-size-view.dto';

export class PostImageViewModel extends BasePhotoSizeViewModel {
  uploadId: number;

  constructor(url: string, width: number, height: number, fileSize: number, uploadId: number) {
    super(url, width, height, fileSize);
    this.uploadId = uploadId;
  }
}
