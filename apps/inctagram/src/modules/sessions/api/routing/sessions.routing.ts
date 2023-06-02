export const baseUrlSession = '/sessions';

export const sessionsEndpoints = {
  getUserSession: () => `${baseUrlSession}`,
  deleteSelectedSession: (deviceId: number) => `${baseUrlSession}/${deviceId}`,
  terminateAllSessionsExceptCurrent: () => `${baseUrlSession}`,
};
