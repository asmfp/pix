// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ATTENDANCE... Remove this comment to see the full error message
const ATTENDANCE_SHEET_SESSION_TEMPLATE_VALUES = [
  {
    placeholder: 'SESSION_ID',
    propertyName: 'id',
  },
  {
    placeholder: 'SESSION_START_DATE',
    propertyName: 'date',
  },
  {
    placeholder: 'SESSION_START_TIME',
    propertyName: 'startTime',
  },
  {
    placeholder: 'SESSION_END_TIME',
    propertyName: 'endTime',
  },
  {
    placeholder: 'SESSION_ADDRESS',
    propertyName: 'address',
  },
  {
    placeholder: 'SESSION_ROOM',
    propertyName: 'room',
  },
  {
    placeholder: 'SESSION_EXAMINER',
    propertyName: 'examiner',
  },
  {
    placeholder: 'CERTIFICATION_CENTER_NAME',
    propertyName: 'certificationCenterName',
  },
];

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NON_SCO_AT... Remove this comment to see the full error message
const NON_SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES = [
  {
    placeholder: 'COUNT',
    propertyName: 'count',
  },
  {
    placeholder: 'LAST_NAME',
    propertyName: 'lastName',
  },
  {
    placeholder: 'FIRST_NAME',
    propertyName: 'firstName',
  },
  {
    placeholder: '01/01/1900',
    propertyName: 'birthdate',
  },
  {
    placeholder: 'EXTERNAL_ID',
    propertyName: 'externalId',
  },
  {
    placeholder: '999 %',
    propertyName: 'extraTimePercentage',
  },
];

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SCO_ATTEND... Remove this comment to see the full error message
const SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES = [
  {
    placeholder: 'COUNT',
    propertyName: 'count',
  },
  {
    placeholder: 'LAST_NAME',
    propertyName: 'lastName',
  },
  {
    placeholder: 'FIRST_NAME',
    propertyName: 'firstName',
  },
  {
    placeholder: '01/01/1900',
    propertyName: 'birthdate',
  },
  {
    placeholder: 'DIVISION',
    propertyName: 'division',
  },
  {
    placeholder: '999 %',
    propertyName: 'extraTimePercentage',
  },
];

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EXTRA_EMPT... Remove this comment to see the full error message
const EXTRA_EMPTY_CANDIDATE_ROWS = 20;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  ATTENDANCE_SHEET_SESSION_TEMPLATE_VALUES,
  NON_SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES,
  SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES,
  EXTRA_EMPTY_CANDIDATE_ROWS,
};
