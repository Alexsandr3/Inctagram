/**
 * @description Profile avatar view model
 */
export class ProfileAvatarViewModel {
  /**
   * @param main -> Must contain medium photo size (192x192) and thumbnail photo size (45x45)
   */
  avatars: AvatarViewDto[];

  constructor(...avatars: AvatarViewDto[]) {
    this.avatars = avatars;
  }
}

/**
 * @description Photo size model
 */
export class AvatarViewDto {
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
