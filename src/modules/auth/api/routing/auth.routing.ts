export const baseUrlAuth = '/auth';

export const authEndpoints = {
  registration: () => `${baseUrlAuth}/registration`,
  registrationConfirmation: () => `${baseUrlAuth}/registration-confirmation`,
  registrationEmailResending: () => `${baseUrlAuth}/registration-email-resending`,
  login: () => `${baseUrlAuth}/login`,
  confirmAddingExternalAccount: () => `${baseUrlAuth}/confirm-external-account`,
  rejectAddingExternalAccount: () => `${baseUrlAuth}/reject-adding-external-account`,
  passwordRecovery: () => `${baseUrlAuth}/password-recovery`,
  checkRecoveryCode: () => `${baseUrlAuth}/check-recovery-code`,
  newPassword: () => `${baseUrlAuth}/new-password`,
  logout: () => `${baseUrlAuth}/logout`,
  updateTokens: () => `${baseUrlAuth}/update-tokens`,
  me: () => `${baseUrlAuth}/me`,
};

//Регистрация и аутентификация пользователей:
// POST /api/auth/registration - создание нового пользователя
// POST /api/auth/registration-confirmation - на этот поинт идет переадресация с майла (Вам надо будет вынять код и положить в body)
// POST /api/auth/registration-email-resending - повторная отправка confirm
// POST /api/auth/login - вход пользователя в систему
// POST /api/auth/password-recovery - восcтановление пароля
// POST /api/auth/check-recovery-code - проверка кода восстановления
// POST /api/auth/new-password - изменение пароля
// POST /api/auth/logout - выход пользователя из системы
// POST /api/auth/updateTokens - обновление токенов
// POST /api/auth/me - получение инфо о залогиненном пользователе
