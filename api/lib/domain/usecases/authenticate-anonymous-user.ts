// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'User'.
const User = require('../models/User');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserCantBe... Remove this comment to see the full error message
const { UserCantBeCreatedError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function authenticateAnonymousUser({
  campaignCode,
  lang = 'fr',
  campaignToJoinRepository,
  userRepository,
  tokenService
}: any) {
  const campaign = await campaignToJoinRepository.getByCode(campaignCode);
  if (!campaign.isSimplifiedAccess) {
    throw new UserCantBeCreatedError();
  }

  const newUser = await userRepository.create({
    user: new User({
      firstName: '',
      lastName: '',
      cgu: false,
      mustValidateTermsOfService: false,
      isAnonymous: true,
      lang,
    }),
  });

  const accessToken = tokenService.createAccessTokenFromUser(newUser.id, 'pix').accessToken;
  return accessToken;
};
