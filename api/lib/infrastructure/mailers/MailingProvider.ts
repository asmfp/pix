// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MailingPro... Remove this comment to see the full error message
class MailingProvider {
  async sendEmail(/* options */) {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Error'. Did you mean 'ERRORS'?
    throw new Error('Method #sendEmail(options) must be overridden');
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = MailingProvider;
