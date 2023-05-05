import { BaseParametersImageValidation } from '../../main/validators/image-validation.type';

/**
 * Default type for images post
 */
export const typeImagePost: BaseParametersImageValidation = {
  contentTypes: ['image/png', 'image/jpg', 'image/jpeg'],
};
