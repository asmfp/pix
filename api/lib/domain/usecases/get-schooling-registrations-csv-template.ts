// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'csvSeriali... Remove this comment to see the full error message
const csvSerializer = require('../../infrastructure/serializers/csv/csv-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'HigherScho... Remove this comment to see the full error message
const HigherSchoolingRegistrationColumns = require('../../infrastructure/serializers/csv/higher-schooling-registration-columns');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getSchoolingRegistrationsCsvTemplate({
  userId,
  organizationId,
  i18n,
  membershipRepository
}: any) {
  const [membership] = await membershipRepository.findByUserIdAndOrganizationId({
    userId,
    organizationId,
    includeOrganization: true,
  });

  if (!_isAdminOrganizationManagingStudent(membership)) {
    throw new UserNotAuthorizedToAccessEntityError('User is not allowed to download csv template.');
  }

  const header = _getCsvColumns(new HigherSchoolingRegistrationColumns(i18n).columns);

  return _createHeaderOfCSV(header);
};

function _getCsvColumns(columns: any) {
  return columns.map((column: any) => column.label);
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _createHeaderOfCSV(header: any) {
  // WHY: add \uFEFF the UTF-8 BOM at the start of the text, see:
  // - https://en.wikipedia.org/wiki/Byte_order_mark
  // - https://stackoverflow.com/a/38192870
  return '\uFEFF' + csvSerializer.serializeLine(header);
}

function _isAdminOrganizationManagingStudent(membership: any) {
  return (
    membership && membership.isAdmin && membership.organization.isManagingStudents && membership.organization.isSup
  );
}
