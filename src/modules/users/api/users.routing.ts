export const baseUrlUser = '/users';

export const usersEndpoints = {
  getMyProfile: () => `${baseUrlUser}/profile`,
  updateProfile: () => `${baseUrlUser}/profile`,
  deletePhotosAvatar: () => `${baseUrlUser}/profile/avatar`, //
  uploadPhotoAvatar: () => `${baseUrlUser}/profile/avatar`,
};

//Поиск, создание и удаление пользователей СуперАдмином:

//accounts/edit/    //редактирование аккаунта
//accounts/password/change/    //смена пароля
//session/login_activity/    //активность сессии
//api/:userName/   //получение данных пользователя
