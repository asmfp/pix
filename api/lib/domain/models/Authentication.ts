class Authentication {
  token: any;
  userId: any;
  constructor({
    token,
    userId
  }: any = {}) {
    this.token = token;
    this.userId = userId;
  }

  toJSON() {
    return {
      user_id: this.userId,
      token: this.token,
    };
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Authentication;
