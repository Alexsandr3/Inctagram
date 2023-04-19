import { BasePhotoSizeViewModel } from '../../../images/api/view-models/base-photo-size-view.dto';

export class PostImageViewModel extends BasePhotoSizeViewModel {
  uploadId: string;

  constructor(url: string, width: number, height: number, fileSize: number, uploadId: string) {
    super(url, width, height, fileSize);
    this.uploadId = uploadId;
  }
}
