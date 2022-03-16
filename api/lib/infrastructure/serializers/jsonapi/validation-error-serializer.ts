// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

function _buildError(field: any, message: any) {
  return {
    status: '400',
    title: 'Invalid Attribute',
    detail: message,
    source: { pointer: '/data/attributes/' + _.kebabCase(field) },
    meta: { field },
  };
}

function _buildEntirePayloadError(message: any) {
  return {
    status: '400',
    title: 'Invalid Payload',
    detail: message,
    source: { pointer: '/data/attributes' },
  };
}

function serialize(validationErrors: any) {
  const errors: any = [];

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  Object.keys(validationErrors.data).forEach(function (field: any) {
    validationErrors.data[field].forEach((message: any) => {
      if (_.isEmpty(field)) {
        errors.push(_buildEntirePayloadError(message));
      } else {
        errors.push(_buildError(field, message));
      }
    });
  });

  return {
    errors,
  };
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { serialize };
