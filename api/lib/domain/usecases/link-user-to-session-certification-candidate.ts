// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidate = require('../models/CertificationCandidate');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCandidateAlreadyLinkedToUserError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCandidateByPersonalInfoNotFoundError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MatchingRe... Remove this comment to see the full error message
  MatchingReconciledStudentNotFoundError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCandidateByPersonalInfoTooManyMatchesError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserAlread... Remove this comment to see the full error message
  UserAlreadyLinkedToCandidateInSessionError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionNot... Remove this comment to see the full error message
  SessionNotAccessible,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserLinked... Remove this comment to see the full error message
const UserLinkedToCertificationCandidate = require('../events/UserLinkedToCertificationCandidate');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const UserAlreadyLinkedToCertificationCandidate = require('../events/UserAlreadyLinkedToCertificationCandidate');

async function linkUserToSessionCertificationCandidate({
  userId,
  sessionId,
  firstName,
  lastName,
  birthdate,
  certificationCandidateRepository,
  certificationCenterRepository,
  organizationRepository,
  schoolingRegistrationRepository,
  sessionRepository
}: any) {
  const session = await sessionRepository.get(sessionId);
  if (!session.isAccessible()) {
    throw new SessionNotAccessible();
  }
  const participatingCertificationCandidate = new CertificationCandidate({
    firstName,
    lastName,
    birthdate,
    sessionId,
  });
  participatingCertificationCandidate.validateParticipation();

  const certificationCandidate = await _getSessionCertificationCandidateByPersonalInfo({
    sessionId,
    participatingCertificationCandidate,
    certificationCandidateRepository,
  });

  const isSessionFromAScoAndManagingStudentsOrganization = await _isSessionFromAScoAndManagingStudentsOrganization({
    sessionId,
    certificationCenterRepository,
    organizationRepository,
  });

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'isLinkedToAUser' does not exist on type ... Remove this comment to see the full error message
  if (!certificationCandidate.isLinkedToAUser()) {
    if (isSessionFromAScoAndManagingStudentsOrganization) {
      await _checkCandidateMatchTheReconciledStudent({
        userId,
        certificationCandidate,
        schoolingRegistrationRepository,
      });
    }
    await _linkUserToCandidate({
      sessionId,
      userId,
      certificationCandidate,
      certificationCandidateRepository,
    });
    return new UserLinkedToCertificationCandidate();
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'isLinkedToUserId' does not exist on type... Remove this comment to see the full error message
  if (certificationCandidate.isLinkedToUserId(userId)) {
    return new UserAlreadyLinkedToCertificationCandidate();
  } else {
    throw new CertificationCandidateAlreadyLinkedToUserError();
  }
}

async function _getSessionCertificationCandidateByPersonalInfo({
  sessionId,
  participatingCertificationCandidate,
  certificationCandidateRepository
}: any) {
  const matchingSessionCandidates = await certificationCandidateRepository.findBySessionIdAndPersonalInfo({
    sessionId,
    firstName: participatingCertificationCandidate.firstName,
    lastName: participatingCertificationCandidate.lastName,
    birthdate: participatingCertificationCandidate.birthdate,
  });
  if (_.isEmpty(matchingSessionCandidates)) {
    throw new CertificationCandidateByPersonalInfoNotFoundError(
      'No certification candidate matches with the provided personal info'
    );
  }
  if (matchingSessionCandidates.length > 1) {
    throw new CertificationCandidateByPersonalInfoTooManyMatchesError(
      'More than one candidate match with the provided personal info'
    );
  }

  return _.first(matchingSessionCandidates);
}

async function _isSessionFromAScoAndManagingStudentsOrganization({
  sessionId,
  certificationCenterRepository,
  organizationRepository
}: any) {
  const sessionCertificationCenter = await certificationCenterRepository.getBySessionId(sessionId);

  if (sessionCertificationCenter.isSco) {
    const sessionOrganization = await _getOrganizationLinkedToCertificationCenter({
      certificationCenter: sessionCertificationCenter,
      organizationRepository,
    });
    return sessionOrganization.isScoAndManagingStudents;
  } else {
    return false;
  }
}

function _getOrganizationLinkedToCertificationCenter({
  certificationCenter,
  organizationRepository
}: any) {
  const commonExternalId = certificationCenter.externalId;
  return organizationRepository.getScoOrganizationByExternalId(commonExternalId);
}

async function _linkUserToCandidate({
  sessionId,
  userId,
  certificationCandidate,
  certificationCandidateRepository
}: any) {
  const existingCandidateLinkedToUser = await certificationCandidateRepository.findOneBySessionIdAndUserId({
    sessionId,
    userId,
  });
  if (existingCandidateLinkedToUser) {
    throw new UserAlreadyLinkedToCandidateInSessionError(
      'The user is already linked to a candidate in the given session'
    );
  }

  certificationCandidate.userId = userId;
  await certificationCandidateRepository.linkToUser({
    id: certificationCandidate.id,
    userId: certificationCandidate.userId,
  });
  return certificationCandidate;
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _checkCandidateMatchTheReconciledStudent({
  userId,
  certificationCandidate,
  schoolingRegistrationRepository
}: any) {
  const isSchoolingRegistrationIdLinkedToUserAndSCOOrganization =
    await schoolingRegistrationRepository.isSchoolingRegistrationIdLinkedToUserAndSCOOrganization({
      userId,
      schoolingRegistrationId: certificationCandidate.schoolingRegistrationId,
    });

  if (!isSchoolingRegistrationIdLinkedToUserAndSCOOrganization) {
    throw new MatchingReconciledStudentNotFoundError();
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  linkUserToSessionCertificationCandidate,
};
