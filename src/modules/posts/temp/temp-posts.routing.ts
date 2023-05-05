export const baseUrlTempPost = '/test/posts';

export const tempPostsEndpoints = {
  uploadImagePost: () => `${baseUrlTempPost}/images`,
  deleteImagePost: (postId: number, uploadId: string) => `${baseUrlTempPost}/${postId}/images/${uploadId}`,
};
