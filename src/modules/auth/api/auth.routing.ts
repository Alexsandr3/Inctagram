export const baseUrlAuth = '/auth';

export const authEndpoints = {
  registration: () => `${baseUrlAuth}/registration`,
  registrationConfirmation: () => `${baseUrlAuth}/registration-confirmation`,
  registrationEmailResending: () => `${baseUrlAuth}/registration-email-resending`,
  login: () => `${baseUrlAuth}/login`,
  passwordRecovery: () => `${baseUrlAuth}/password-recovery`,
  checkRecoveryCode: () => `${baseUrlAuth}/check-recovery-code`,
  passwordRecoveryEmailResending: () => `${baseUrlAuth}/password-recovery-email-resending`,
  newPassword: () => `${baseUrlAuth}/new-password`,
  logout: () => `${baseUrlAuth}/logout`,
  updateTokens: () => `${baseUrlAuth}/update-tokens`,
};

//Регистрация и аутентификация пользователей:
// POST /api/auth/registration - создание нового пользователя
// POST /api/auth/registration-confirmation - на этот поинт идет переадресация с майла (Вам надо будет вынять код и положить в body)
// POST /api/auth/registration-email-resending - повторная отправка confirm
// POST /api/auth/login - вход пользователя в систему
// POST /api/auth/password-recovery - восcтановление пароля
// POST /api/auth/check-recovery-code - проверка кода восстановления
// POST /api/auth/password-recovery-email-resending - повторная отправка pass
// POST /api/auth/new-password - выход пользователя из системы
// POST /api/auth/logout - выход пользователя из системы
