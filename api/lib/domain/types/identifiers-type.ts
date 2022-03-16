// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

const postgreSQLSequenceDefaultStart = 1;
const postgreSQLSequenceEnd = 2 ** 31 - 1;

const implementationType = {
  positiveInteger32bits: Joi.number()
    .integer()
    .min(postgreSQLSequenceDefaultStart)
    .max(postgreSQLSequenceEnd)
    .required(),
  alphanumeric255: Joi.string().max(255).required(),
  alphanumeric: Joi.string().required(),
};

const valuesToExport = {};

function _assignValueToExport(array: any, implementationType: any) {
  _.each(array, function (value: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    valuesToExport[value] = implementationType;
  });
}

const typesPositiveInteger32bits = [
  'answerId',
  'assessmentId',
  'authenticationMethodId',
  'badgeId',
  'badgeCriterionId',
  'campaignId',
  'campaignParticipationId',
  'certificationCandidateId',
  'certificationCenterId',
  'certificationCenterMembershipId',
  'certificationCourseId',
  'certificationIssueReportId',
  'membershipId',
  'organizationId',
  'organizationInvitationId',
  'ownerId',
  'schoolingRegistrationId',
  'sessionId',
  'stageId',
  'targetProfileId',
  'userId',
  'userOrgaSettingsId',
];

const typesAlphanumeric = ['courseId', 'tutorialId'];
const typesAlphanumeric255 = ['challengeId', 'competenceId'];

_assignValueToExport(typesPositiveInteger32bits, implementationType.positiveInteger32bits);
_assignValueToExport(typesAlphanumeric, implementationType.alphanumeric);
_assignValueToExport(typesAlphanumeric255, implementationType.alphanumeric255);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'positiveInteger32bits' does not exist on... Remove this comment to see the full error message
valuesToExport.positiveInteger32bits = {
  min: postgreSQLSequenceDefaultStart,
  max: postgreSQLSequenceEnd,
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = valuesToExport;
