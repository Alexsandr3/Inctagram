/**
 * @description Profile avatar view model
 */
export class ProfileAvatarViewModel {
  /**
   * @param main -> Must contain medium photo size (192x192) and thumbnail photo size (45x45)
   */
  avatar: PhotoSizeViewModel[];

  constructor(...avatar: PhotoSizeViewModel[]) {
    this.avatar = avatar;
  }
}

/**
 * @description Photo size model
 */
export class PhotoSizeViewModel {
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
