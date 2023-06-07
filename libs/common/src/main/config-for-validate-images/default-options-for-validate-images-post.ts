import { BaseParametersImageValidation } from '@common/main/validators/image-validation.type';

/**
 * Default type for modules post [png, jpg, jpeg]
 */
export const typeImagePost: BaseParametersImageValidation = {
  contentTypes: ['image/png', 'image/jpg', 'image/jpeg', 'application/octet-stream'],
};
