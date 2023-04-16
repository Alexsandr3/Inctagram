export class BasePhotoSizeViewModel {
  public width: number;
  /**
   * In pixels
   */
  public height: number;
  /**
   * In bytes
   */
  public fileSize: number;

  constructor(width: number, height: number, fileSize: number) {
    this.width = width;
    this.height = height;
    this.fileSize = fileSize;
  }
}
