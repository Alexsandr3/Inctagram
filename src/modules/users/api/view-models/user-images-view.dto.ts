/**
 * @description Blog images view model
 */
export class UserImagesViewModel {
  /**
   * @param main -> Must contain original photo size (156x156) and small photo size (48x48)
   */
  avatar: PhotoSizeModel[];

  constructor(avatar: PhotoSizeModel[]) {
    this.avatar = avatar;
  }
}

/**
 * @description Photo size model
 */
export class PhotoSizeModel {
  public url: string;
  /**
   * In pixels
   */
  public width: number;
  /**
   * In pixels
   */
  public height: number;
  /**
   * In bytes
   */
  public fileSize: number;

  constructor(url: string, width: number, height: number, fileSize: number) {
    this.url = url;
    this.width = width;
    this.height = height;
    this.fileSize = fileSize;
  }
}
