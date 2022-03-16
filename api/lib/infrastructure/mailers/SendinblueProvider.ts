// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const SibApiV3Sdk = require('sib-api-v3-sdk');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MailingPro... Remove this comment to see the full error message
const MailingProvider = require('./MailingProvider');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'mailing'.
const { mailing } = require('../../config');

function _formatPayload({
  to,
  fromName,
  from,
  subject,
  template,
  variables,
  tags
}: any) {
  const payload = {
    to: [
      {
        email: to,
      },
    ],
    sender: {
      name: fromName,
      email: from,
    },
    subject,
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
    templateId: parseInt(template),
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
  };

  if (variables) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'params' does not exist on type '{ to: {}... Remove this comment to see the full error message
    payload.params = variables;
  }

  if (_.isArray(tags) && !_.isEmpty(tags)) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'tags' does not exist on type '{ to: {}; ... Remove this comment to see the full error message
    payload.tags = tags;
  }

  return payload;
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Sendinblue... Remove this comment to see the full error message
class SendinblueProvider extends MailingProvider {
  _client: any;
  constructor() {
    super();

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    defaultClient.authentications['api-key'].apiKey = mailing.sendinblue.apiKey;

    this._client = SendinblueProvider.createSendinblueSMTPApi();
  }

  static createSendinblueSMTPApi() {
    return new SibApiV3Sdk.TransactionalEmailsApi();
  }

  // @ts-expect-error ts-migrate(2416) FIXME: Property 'sendEmail' in type 'SendinblueProvider' ... Remove this comment to see the full error message
  sendEmail(options: any) {
    const payload = _formatPayload(options);
    return this._client.sendTransacEmail(payload);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SendinblueProvider;
