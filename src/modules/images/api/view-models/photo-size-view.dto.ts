import { BasePhotoSizeViewModel } from './base-photo-size-view.dto';

/**
 * @description Photo size model
 */
export class PhotoSizeViewModel extends BasePhotoSizeViewModel {
  /**
   * Upload id
   */
  public uploadId: number;
  public url: string;
  /**
   * In pixels
   */
  constructor(width: number, height: number, fileSize: number, uploadId: number, url: string) {
    super(width, height, fileSize);
    this.uploadId = uploadId;
    this.url = url;
  }
}
