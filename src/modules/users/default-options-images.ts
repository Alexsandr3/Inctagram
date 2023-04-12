import { ImageValidationOptions } from '../../main/validators/validation-images.pipe';

/**
 * Default options for images blog main
 */
export const optionsImageAvatar: ImageValidationOptions = {
  defaultSize: 1572864, //1,5MB
  contentTypes: ['image/png', 'image/jpg', 'image/jpeg'],
  defaultWidth: 1280,
  defaultHeight: 720,
};
