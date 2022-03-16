// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JSONAPIErr... Remove this comment to see the full error message
const JSONAPIError = require('jsonapi-serializer').Error;

function _formatAttribute({
  attribute,
  message
}: any) {
  return {
    status: '422',
    source: {
      pointer: `/data/attributes/${_.kebabCase(attribute)}`,
    },
    title: `Invalid data attribute "${attribute}"`,
    detail: message,
  };
}

function _formatRelationship({
  attribute,
  message
}: any) {
  const relationship = attribute.replace('Id', '');
  return {
    status: '422',
    source: {
      pointer: `/data/relationships/${_.kebabCase(relationship)}`,
    },
    title: `Invalid relationship "${relationship}"`,
    detail: message,
  };
}

function _formatUndefinedAttribute({
  message
}: any) {
  return {
    status: '422',
    title: 'Invalid data attributes',
    detail: message,
  };
}

function _formatInvalidAttribute({
  attribute,
  message
}: any) {
  if (!attribute) {
    return _formatUndefinedAttribute({ message });
  }
  if (attribute.endsWith('Id')) {
    return _formatRelationship({ attribute, message });
  }
  return _formatAttribute({ attribute, message });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (invalidAttributes: any) => {
  return new JSONAPIError(invalidAttributes.map(_formatInvalidAttribute));
};
