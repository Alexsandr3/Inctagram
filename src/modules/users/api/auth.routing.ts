const baseUrl = '/auth';

export const endpoints = {
  registration: () => baseUrl,
  registrationConfirmation: () => baseUrl,
  login: () => baseUrl,
  registrationEmailResending: () => baseUrl,
  passwordRecovery: () => baseUrl,
  newPassword: () => baseUrl,
  logout: () => baseUrl,
};

//Регистрация и аутентификация пользователей:
// POST /api/auth/registration - создание нового пользователя
// POST /api/auth/registration-confirmation - на этот поинт идет переадресация с майла (Вам надо будет вынять код и положить в body)
// POST /api/auth/login - вход пользователя в систему
// POST /api/auth/registration-email-resending - повторная отправка
// POST /api/auth/password-recovery - востановление пароля
// POST /api/auth/new-password - выход пользователя из системы
// POST /api/auth/logout - выход пользователя из системы
