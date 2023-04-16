export const baseUrlPost = '/posts';

export const postsEndpoints = {
  uploadImagePost: () => `${baseUrlPost}/image`,
  deleteImagePost: (uploadId: number) => `${baseUrlPost}/image/${uploadId}`,
  createPost: () => `${baseUrlPost}`,
  getPost: (postId: number) => `${baseUrlPost}/${postId}`,
  updatePost: (postId: number) => `${baseUrlPost}/${postId}`,
  deletePost: (postId: number) => `${baseUrlPost}/${postId}`,
  getPosts: () => `${baseUrlPost}`,
};
