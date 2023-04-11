export const baseUrlUser = '/users';

export const usersEndpoints = {
  createProfile: () => `${baseUrlUser}/profile/create`,
  uploadPhotoAvatar: () => `${baseUrlUser}/profile/avatar`,
};

//Поиск, создание и удаление пользователей СуперАдмином:
