export interface IAccountRecoveryDemand {
  id?: number;
  userId?: number;
  schoolingRegistrationId?: number;
  oldEmail?: string;
  newEmail?: string;
  temporaryKey?: string;
  used?: boolean;
  createdAt?: Date;
}

export class AccountRecoveryDemand implements IAccountRecoveryDemand {
  id?: number;
  userId?: number;
  schoolingRegistrationId?: number;
  oldEmail?: string;
  newEmail?: string;
  temporaryKey?: string;
  used?: boolean;
  createdAt?: Date;
  constructor({
    id,
    userId,
    schoolingRegistrationId,
    oldEmail,
    newEmail,
    temporaryKey,
    used,
    createdAt,
  }: IAccountRecoveryDemand) {
    this.id = id;
    this.schoolingRegistrationId = schoolingRegistrationId;
    this.userId = userId;
    this.oldEmail = oldEmail;
    this.newEmail = newEmail?.toLowerCase();
    this.temporaryKey = temporaryKey;
    this.used = used;
    this.createdAt = createdAt;
  }
}
