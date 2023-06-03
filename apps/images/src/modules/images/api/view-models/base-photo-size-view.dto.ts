/**
 * @description Base photo size view model
 */
export class BasePhotoSizeViewModel {
  public url: string;
  public width: number;
  public height: number;
  public fileSize: number;

  constructor(url: string, width: number, height: number, fileSize: number) {
    this.url = url;
    this.width = width;
    this.height = height;
    this.fileSize = fileSize;
  }
}
