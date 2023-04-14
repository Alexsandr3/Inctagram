export const baseUrlUser = '/users';

export const usersEndpoints = {
  getProfile: (id: number) => `${baseUrlUser}/profile/${id}`,
  getMyProfile: () => `${baseUrlUser}/profile`,
  updateProfile: () => `${baseUrlUser}/profile`,
  uploadPhotoAvatar: () => `${baseUrlUser}/profile/avatar`,
};

//Поиск, создание и удаление пользователей СуперАдмином:
