export const baseUrlUser = '/users';

export const usersEndpoints = {
  createProfile: () => `${baseUrlUser}/profile`,
  getProfile: (id: number) => `${baseUrlUser}/profile/${id}`,
  updateProfile: () => `${baseUrlUser}/profile`,
  uploadPhotoAvatar: () => `${baseUrlUser}/profile/avatar`,
};

//Поиск, создание и удаление пользователей СуперАдмином:
