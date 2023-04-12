import { ImageValidationOptions } from '../../main/validators/validation-images.pipe';

/**
 * Default options for images blog main
 */
export const optionsImageAvatar: ImageValidationOptions = {
  defaultSize: 160000,
  contentTypes: ['image/png', 'image/jpg', 'image/jpeg'],
  defaultWidth: 1280,
  defaultHeight: 720,
};
