// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const ResetPasswordDemand = require('../orm-models/ResetPasswordDemand');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PasswordRe... Remove this comment to see the full error message
const { PasswordResetDemandNotFoundError } = require('../../../lib/domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  create(demand: any) {
    return new ResetPasswordDemand(demand).save();
  },

  markAsBeingUsed(email: any) {
    return ResetPasswordDemand.query((qb: any) => qb.whereRaw('LOWER("email") = ?', email.toLowerCase())).save(
      { used: true },
      {
        patch: true,
        require: false,
      }
    );
  },

  findByTemporaryKey(temporaryKey: any) {
    return ResetPasswordDemand.where({ temporaryKey, used: false })
      .fetch()
      .catch((err: any) => {
        if (err instanceof ResetPasswordDemand.NotFoundError) {
          throw new PasswordResetDemandNotFoundError();
        }
        throw err;
      });
  },

  findByUserEmail(email: any, temporaryKey: any) {
    return ResetPasswordDemand.query((qb: any) => {
      qb.whereRaw('LOWER("email") = ?', email.toLowerCase());
      qb.where({ used: false });
      qb.where({ temporaryKey });
    })
      .fetch()
      .catch((err: any) => {
        if (err instanceof ResetPasswordDemand.NotFoundError) {
          throw new PasswordResetDemandNotFoundError();
        }
        throw err;
      });
  },
};
