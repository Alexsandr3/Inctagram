import { ParametersImageValidation } from '../../main/validators/parameters-image.validation';
import { BaseParametersImageValidation } from '../../main/validators/image-validation.type';

/**
 * Default type for images profile
 */
export const typeImageAvatar: BaseParametersImageValidation = {
  contentTypes: ['image/png', 'image/jpg', 'image/jpeg'],
};

/**
 * Default options for images profile
 */
export const optionsImageAvatar: ParametersImageValidation = {
  defaultSize: 1572864, //1,5MB
  contentTypes: ['image/png', 'image/jpg', 'image/jpeg'],
  defaultWidth: 1280,
  defaultHeight: 720,
};
