/**
 * User status type ['PENDING', 'ACTIVE', 'BANNED', 'DELETED']
 * @field 'PENDING' - user registered but not activated; 'ACTIVE' - user registered and activated; 'BANNED' - user banned by admin; 'DELETED' - user deleted by admin
 */
export enum UserStatusType {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  DELETED = 'DELETED',
}
