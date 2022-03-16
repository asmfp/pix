// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCenterMembershipRepository = require('../../infrastructure/repositories/certification-center-membership-repository');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async execute(userId: any, certificationCenterId: any) {
    return await certificationCenterMembershipRepository.isMemberOfCertificationCenter({
      userId,
      certificationCenterId,
    });
  },
};
