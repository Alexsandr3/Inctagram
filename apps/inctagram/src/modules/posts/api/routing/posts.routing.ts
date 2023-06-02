export const baseUrlPost = '/posts';

export const postsEndpoints = {
  createPostWithUploadImages: () => `${baseUrlPost}`,
  deleteImagePost: (postId: number, uploadId: string) => `${baseUrlPost}/${postId}/images/${uploadId}`,
  getPost: (postId: number) => `${baseUrlPost}/p/${postId}`,
  updatePost: (postId: number) => `${baseUrlPost}/${postId}`,
  deletePost: (postId: number) => `${baseUrlPost}/${postId}`,
  getPosts: (userId: number) => `${baseUrlPost}/${userId}`,
  // uploadImagePost: () => `${baseUrlPost}/image`,
  // deleteImagePost: (uploadId: string) => `${baseUrlPost}/image/${uploadId}`,
  // createPost: () => `${baseUrlPost}`,
};
