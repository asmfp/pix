// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
class PoleEmploiTokens {
  accessToken: any;
  expiresIn: any;
  idToken: any;
  refreshToken: any;
  constructor({
    accessToken,
    idToken,
    expiresIn,
    refreshToken
  }: any) {
    this.accessToken = accessToken;
    this.idToken = idToken;
    this.expiresIn = expiresIn;
    this.refreshToken = refreshToken;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PoleEmploiTokens;
