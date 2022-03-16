// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'writeOdsUt... Remove this comment to see the full error message
const writeOdsUtils = require('../../infrastructure/utils/ods/write-ods-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'readOdsUti... Remove this comment to see the full error message
const readOdsUtils = require('../../infrastructure/utils/ods/read-ods-utils');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sessionXmlService = require('../services/session-xml-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EXTRA_EMPT... Remove this comment to see the full error message
  EXTRA_EMPTY_CANDIDATE_ROWS,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NON_SCO_AT... Remove this comment to see the full error message
  NON_SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SCO_ATTEND... Remove this comment to see the full error message
  SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ATTENDANCE... Remove this comment to see the full error message
  ATTENDANCE_SHEET_SESSION_TEMPLATE_VALUES,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./../../infrastructure/files/attendance-sheet/attendance-sheet-placeholders');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getAttendanceSheet({
  userId,
  sessionId,
  sessionRepository,
  sessionForAttendanceSheetRepository,
  endTestScreenRemovalService
}: any) {
  const hasMembership = await sessionRepository.doesUserHaveCertificationCenterMembershipForSession(userId, sessionId);
  if (!hasMembership) {
    throw new UserNotAuthorizedToAccessEntityError('User is not allowed to access session.');
  }

  const isEndTestScreenRemovalEnabled = await endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId(
    sessionId
  );
  const addEndTestScreenColumn = !isEndTestScreenRemovalEnabled;

  const session = await sessionForAttendanceSheetRepository.getWithCertificationCandidates(sessionId);
  const odsFilePath = _getAttendanceSheetTemplatePath(
    session.certificationCenterType,
    session.isOrganizationManagingStudents,
    addEndTestScreenColumn
  );

  const stringifiedXml = await readOdsUtils.getContentXml({
    odsFilePath,
  });

  const updatedStringifiedXml = _updateXmlWithSession(stringifiedXml, session);

  return writeOdsUtils.makeUpdatedOdsByContentXml({
    stringifiedXml: updatedStringifiedXml,
    odsFilePath,
  });
};

function _updateXmlWithSession(stringifiedXml: any, session: any) {
  const sessionData = _.transform(session, _transformSessionIntoAttendanceSheetSessionData);
  const updatedStringifiedXml = sessionXmlService.getUpdatedXmlWithSessionData({
    stringifiedXml,
    sessionData,
    sessionTemplateValues: ATTENDANCE_SHEET_SESSION_TEMPLATE_VALUES,
  });

  return _attendanceSheetWithCertificationCandidates(updatedStringifiedXml, session);
}

function _attendanceSheetWithCertificationCandidates(stringifiedXml: any, session: any) {
  let candidateTemplateValues = NON_SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES;

  if (session.certificationCenterType === 'SCO' && session.isOrganizationManagingStudents) {
    candidateTemplateValues = SCO_ATTENDANCE_SHEET_CANDIDATE_TEMPLATE_VALUES;
  }

  const candidatesData = _.map(session.certificationCandidates, (candidate: any, index: any) => {
    const candidateData = _.transform(candidate, _transformCandidateIntoAttendanceSheetCandidateData);
    candidateData.count = index + 1;
    return candidateData;
  });
  _.times(EXTRA_EMPTY_CANDIDATE_ROWS, () => {
    const emptyCandidateData = {};
    _.each(candidateTemplateValues, (templateVal: any) => {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      emptyCandidateData[templateVal.propertyName] = '';
    });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'count' does not exist on type '{}'.
    emptyCandidateData.count = candidatesData.length + 1;
    candidatesData.push(emptyCandidateData);
  });

  return sessionXmlService.getUpdatedXmlWithCertificationCandidatesData({
    stringifiedXml,
    candidatesData,
    candidateTemplateValues,
  });
}

function _transformSessionIntoAttendanceSheetSessionData(attendanceSheetData: any, value: any, prop: any) {
  switch (prop) {
    case 'time':
      attendanceSheetData.startTime = moment(value, 'HH:mm').format('HH:mm');
      attendanceSheetData.endTime = moment(value, 'HH:mm').add(moment.duration(2, 'hours')).format('HH:mm');
      break;
    case 'date':
      attendanceSheetData.date = moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY');
      break;
    case 'certificationCandidates':
      break;
    default:
      attendanceSheetData[prop] = value;
  }
}

function _transformCandidateIntoAttendanceSheetCandidateData(attendanceSheetData: any, value: any, prop: any) {
  switch (prop) {
    case 'extraTimePercentage':
      if (!_.isFinite(value) || value <= 0) {
        attendanceSheetData.extraTimePercentage = '';
      } else {
        attendanceSheetData.extraTimePercentage = value;
      }
      break;
    case 'birthdate':
      attendanceSheetData[prop] = value === null ? '' : moment(value, 'YYYY-MM-DD').format('YYYY-MM-DD');
      break;
    default:
      attendanceSheetData[prop] = value === null ? '' : value;
      break;
  }
}

function _getAttendanceSheetTemplatePath(
  certificationCenterType: any,
  isOrganizationManagingStudents: any,
  addEndTestScreenColumn: any
) {
  const suffix = addEndTestScreenColumn ? '_with_fdt' : '';
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
  const templatePath = __dirname + '/../../infrastructure/files/attendance-sheet';
  if (certificationCenterType === 'SCO' && isOrganizationManagingStudents) {
    return `${templatePath}/sco_attendance_sheet_template${suffix}.ods`;
  }
  return `${templatePath}/non_sco_attendance_sheet_template${suffix}.ods`;
}
