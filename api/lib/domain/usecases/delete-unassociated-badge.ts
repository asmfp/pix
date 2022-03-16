// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AcquiredBa... Remove this comment to see the full error message
const { AcquiredBadgeForbiddenDeletionError, CertificationBadgeForbiddenDeletionError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function deleteUnassociatedBadge({
  badgeId,
  badgeRepository
}: any) {
  return DomainTransaction.execute(async (domainTransaction: any) => {
    const isAssociated = await badgeRepository.isAssociated(badgeId, domainTransaction);
    const isRelatedToCertification = await badgeRepository.isRelatedToCertification(badgeId, domainTransaction);

    if (isAssociated) {
      throw new AcquiredBadgeForbiddenDeletionError();
    }

    if (isRelatedToCertification) {
      throw new CertificationBadgeForbiddenDeletionError();
    }

    return badgeRepository.delete(badgeId, domainTransaction);
  });
};
