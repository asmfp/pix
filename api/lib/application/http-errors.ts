// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JSONAPIErr... Remove this comment to see the full error message
const JSONAPIError = require('jsonapi-serializer').Error;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BaseHttpEr... Remove this comment to see the full error message
class BaseHttpError extends Error {
  status: any;
  title: any;
  constructor(message: any) {
    super(message);
    this.title = 'Default Bad Request';
    this.status = 400;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Unprocessa... Remove this comment to see the full error message
class UnprocessableEntityError extends BaseHttpError {
  code: any;
  meta: any;
  status: any;
  title: any;
  constructor(message: any, code: any, meta: any) {
    super(message);
    this.title = 'Unprocessable entity';
    this.code = code;
    this.meta = meta;
    this.status = 422;
  }
}

class PreconditionFailedError extends BaseHttpError {
  code: any;
  meta: any;
  status: any;
  title: any;
  constructor(message: any, code: any, meta: any) {
    super(message);
    this.title = 'Precondition Failed';
    this.code = code;
    this.meta = meta;
    this.status = 412;
  }
}

class ConflictError extends BaseHttpError {
  code: any;
  meta: any;
  status: any;
  title: any;
  constructor(message = 'Conflict between request and server state.', code: any, meta: any) {
    super(message);
    this.code = code;
    this.meta = meta;
    this.title = 'Conflict';
    this.status = 409;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MissingQue... Remove this comment to see the full error message
class MissingQueryParamError extends BaseHttpError {
  status: any;
  title: any;
  constructor(missingParamName: any) {
    const message = `Missing ${missingParamName} query parameter.`;
    super(message);
    this.title = 'Missing Query Parameter';
    this.status = 400;
  }
}

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'NotFoundError'.
class NotFoundError extends BaseHttpError {
  status: any;
  title: any;
  constructor(message: any, title: any) {
    super(message);
    this.title = title || 'Not Found';
    this.status = 404;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Unauthoriz... Remove this comment to see the full error message
class UnauthorizedError extends BaseHttpError {
  code: any;
  meta: any;
  status: any;
  title: any;
  constructor(message: any, code: any, meta: any) {
    super(message);
    this.title = 'Unauthorized';
    this.status = 401;
    this.code = code;
    this.meta = meta;
  }
}

class PasswordShouldChangeError extends BaseHttpError {
  code: any;
  status: any;
  title: any;
  constructor(message: any) {
    super(message);
    this.title = 'PasswordShouldChange';
    this.status = 401;
    this.code = 'SHOULD_CHANGE_PASSWORD';
  }
}

class ForbiddenError extends BaseHttpError {
  code: any;
  status: any;
  title: any;
  constructor(message: any, code: any) {
    super(message);
    this.title = 'Forbidden';
    this.status = 403;
    this.code = code;
  }
}

class ServiceUnavailableError extends BaseHttpError {
  status: any;
  title: any;
  constructor(message: any) {
    super(message);
    this.title = 'ServiceUnavailable';
    this.status = 503;
  }
}

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'ImproveCompetenceEvaluationF... Remove this comment to see the full error message
class ImproveCompetenceEvaluationForbiddenError extends BaseHttpError {
  status: any;
  title: any;
  constructor(message: any) {
    super(message);
    this.title = 'ImproveCompetenceEvaluationForbidden';
    this.status = 403;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BadRequest... Remove this comment to see the full error message
class BadRequestError extends BaseHttpError {
  code: any;
  status: any;
  title: any;
  constructor(message: any, code: any) {
    super(message);
    this.title = 'Bad Request';
    this.status = 400;
    this.code = code;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PayloadToo... Remove this comment to see the full error message
class PayloadTooLargeError extends BaseHttpError {
  code: any;
  meta: any;
  status: any;
  title: any;
  constructor(message: any, code: any, meta: any) {
    super(message);
    this.title = 'Payload too large';
    this.code = code;
    this.meta = meta;
    this.status = 413;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionPub... Remove this comment to see the full error message
class SessionPublicationBatchError extends BaseHttpError {
  code: any;
  status: any;
  title: any;
  constructor(batchId: any) {
    super(`${batchId}`);
    this.title = 'One or more error occurred while publishing session in batch';
    (this.code = 'SESSION_PUBLICATION_BATCH_PARTIALLY_FAILED'), (this.status = 207);
  }
}

class InternalServerError extends BaseHttpError {
  status: any;
  title: any;
  constructor(message: any, title: any) {
    super(message);
    this.title = title || 'Internal Server Error';
    this.status = 500;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sendJsonAp... Remove this comment to see the full error message
function sendJsonApiError(httpError: any, h: any) {
  const jsonApiError = new JSONAPIError({
    status: httpError.status.toString(),
    title: httpError.title,
    detail: httpError.message,
    code: httpError.code,
    meta: httpError.meta,
  });
  return h.response(jsonApiError).code(httpError.status).takeover();
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  BadRequestError,
  BaseHttpError,
  ConflictError,
  ForbiddenError,
  ImproveCompetenceEvaluationForbiddenError,
  InternalServerError,
  MissingQueryParamError,
  NotFoundError,
  PasswordShouldChangeError,
  PayloadTooLargeError,
  PreconditionFailedError,
  sendJsonApiError,
  ServiceUnavailableError,
  SessionPublicationBatchError,
  UnauthorizedError,
  UnprocessableEntityError,
};
