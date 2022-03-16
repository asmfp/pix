// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const errorManager = require('./error-manager');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BaseHttpEr... Remove this comment to see the full error message
const { BaseHttpError, UnauthorizedError } = require('./http-errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainErro... Remove this comment to see the full error message
const { DomainError } = require('../domain/errors');

function handleDomainAndHttpErrors(request: any, h: any) {
  const response = request.response;

  if (response instanceof DomainError || response instanceof BaseHttpError) {
    return errorManager.handle(request, h, response);
  }

  // Ne devrait pas etre necessaire
  if (response.isBoom && response.output.statusCode === 401) {
    return errorManager.handle(request, h, new UnauthorizedError(undefined, 401));
  }

  return h.continue;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  handleDomainAndHttpErrors,
};
