export const baseUrlPost = '/posts';

export const postsEndpoints = {
  uploadImagePost: () => `${baseUrlPost}/image`,
  deleteImagePost: (uploadId: string) => `${baseUrlPost}/image/${uploadId}`,
  createPost: () => `${baseUrlPost}`,
  getPost: (postId: number) => `${baseUrlPost}/${postId}`,
  updatePost: (postId: number) => `${baseUrlPost}/${postId}`,
  deletePost: (postId: number) => `${baseUrlPost}/${postId}`,
  getPosts: (userId: number) => `${baseUrlPost}/all/${userId}`,
};
