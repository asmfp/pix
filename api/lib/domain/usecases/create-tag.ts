// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../models/Tag');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createTag({
  tagName,
  tagRepository
}: any) {
  const tag = new Tag({ name: tagName });
  return tagRepository.create(tag);
};
