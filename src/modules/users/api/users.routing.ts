export const baseUrl = '/sa/users';

export const endpoints = {
  findUsers: () => baseUrl + '/',
  createUser: () => baseUrl + '/',
  deleteUser: id => baseUrl + `/${id}`,
};

//Поиск, создание и удаление пользователей СуперАдмином:
// GET /api/sa/users - найти всех пользователей
// POST /api/sa/users - создать пользователя
// DELETE /api/auth/login - удалить пользователя
