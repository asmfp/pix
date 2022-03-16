import { AccountRecoveryDemand } from '../../../../lib/domain/models/AccountRecoveryDemand';

export function buildAccountRecoveryDemand({
  userId = 7,
  schoolingRegistrationId = 0,
  newEmail = 'new-email@example.net',
  oldEmail = 'old-email@example.net',
  used = false,
  temporaryKey = '1234567890AZERTY',
} = {}) {
  return new AccountRecoveryDemand({
    userId,
    schoolingRegistrationId,
    newEmail,
    oldEmail,
    used,
    temporaryKey,
  });
};
