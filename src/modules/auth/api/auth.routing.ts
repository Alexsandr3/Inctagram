export const baseUrl = '/auth';

export const endpoints = {
  registration: () => baseUrl + '/registration',
  registrationConfirmation: () => baseUrl + '/registration-confirmation',
  login: () => baseUrl + '/login',
  registrationEmailResending: () => baseUrl + '/registration-email-resending',
  passwordRecovery: () => baseUrl + '/password-recovery',
  passwordRecoveryEmailResending: () => baseUrl + '/password-recovery-email-resending',
  newPassword: () => baseUrl + '/new-password',
  logout: () => baseUrl + '/logout',
};

//Регистрация и аутентификация пользователей:
// POST /api/auth/registration - создание нового пользователя
// POST /api/auth/registration-confirmation - на этот поинт идет переадресация с майла (Вам надо будет вынять код и положить в body)
// POST /api/auth/login - вход пользователя в систему
// POST /api/auth/registration-email-resending - повторная отправка confirm
// POST /api/auth/password-recovery - восcтановление пароля
// POST /api/auth/password-recovery-email-resending - повторная отправка pass
// POST /api/auth/new-password - выход пользователя из системы
// POST /api/auth/logout - выход пользователя из системы
