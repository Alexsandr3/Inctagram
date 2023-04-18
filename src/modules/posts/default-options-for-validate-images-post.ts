import { ImageValidationType } from '../../main/validators/validation-type-image.pipe';

/**
 * Default type for images post
 */
export const typeImagePost: ImageValidationType = {
  contentTypes: ['image/png', 'image/jpg', 'image/jpeg'],
};
