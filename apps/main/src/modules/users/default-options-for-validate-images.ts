import { ParametersImageValidation } from '@common/main/validators/parameters-image.validation';
import { BaseParametersImageValidation } from '@common/main/validators/image-validation.type';

/**
 * Default type for modules profile
 */
export const typeImageAvatar: BaseParametersImageValidation = {
  contentTypes: ['image/png', 'image/jpg', 'image/jpeg', 'application/octet-stream'],
};

/**
 * Default options for modules profile
 */
export const optionsImageAvatar: ParametersImageValidation = {
  defaultSize: 1572864, //1,5MB
  contentTypes: ['image/png', 'image/jpg', 'image/jpeg'],
  defaultWidth: 1280,
  defaultHeight: 720,
};
