import { ImageValidationOptions } from '../../main/validators/validation-params-image.pipe';
import { ImageValidationType } from '../../main/validators/validation-type-image.pipe';

/**
 * Default options for images profile
 */
export const optionsImageAvatar: ImageValidationOptions = {
  defaultSize: 1572864, //1,5MB
  contentTypes: ['image/png', 'image/jpg', 'image/jpeg'],
  defaultWidth: 1280,
  defaultHeight: 720,
};

/**
 * Default type for images profile
 */
export const typeImageAvatar: ImageValidationType = {
  contentTypes: ['image/png', 'image/jpg', 'image/jpeg'],
};
