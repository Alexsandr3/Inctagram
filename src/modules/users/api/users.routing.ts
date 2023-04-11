export const baseUrlUser = '/users';

export const usersEndpoints = {
  createProfile: () => `${baseUrlUser}/profile`,
  updateProfile: () => `${baseUrlUser}/profile`,
  uploadPhotoAvatar: () => `${baseUrlUser}/profile/avatar`,
};

//Поиск, создание и удаление пользователей СуперАдмином:
