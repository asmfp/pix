// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SendingEma... Remove this comment to see the full error message
const { SendingEmailToResultRecipientError, SessionAlreadyPublishedError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'mailServic... Remove this comment to see the full error message
const mailService = require('../../domain/services/mail-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'uniqBy'.
const uniqBy = require('lodash/uniqBy');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'some'.
const some = require('lodash/some');

async function publishSession({
  sessionId,
  certificationRepository,
  finalizedSessionRepository,
  sessionRepository,
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
  publishedAt = new Date()
}: any) {
  const session = await sessionRepository.getWithCertificationCandidates(sessionId);
  if (session.isPublished()) {
    throw new SessionAlreadyPublishedError();
  }

  await certificationRepository.publishCertificationCoursesBySessionId(sessionId);

  await sessionRepository.updatePublishedAt({ id: sessionId, publishedAt });

  await _updateFinalizedSession(finalizedSessionRepository, sessionId, publishedAt);

  const emailingAttempts = await _sendPrescriberEmails(session);
  if (_someHaveSucceeded(emailingAttempts) && _noneHaveFailed(emailingAttempts)) {
    await sessionRepository.flagResultsAsSentToPrescriber({
      id: sessionId,
      resultsSentToPrescriberAt: publishedAt,
    });
  }
  if (_someHaveFailed(emailingAttempts)) {
    const failedEmailsRecipients = _failedAttemptsRecipients(emailingAttempts);
    throw new SendingEmailToResultRecipientError(failedEmailsRecipients);
  }
}

async function _sendPrescriberEmails(session: any) {
  const recipientEmails = _distinctCandidatesResultRecipientEmails(session.certificationCandidates);

  const emailingAttempts = [];
  for (const recipientEmail of recipientEmails) {
    const emailingAttempt = await mailService.sendCertificationResultEmail({
      email: recipientEmail,
      sessionId: session.id,
      sessionDate: session.date,
      certificationCenterName: session.certificationCenter,
      resultRecipientEmail: recipientEmail,
      daysBeforeExpiration: 30,
    });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
    emailingAttempts.push(emailingAttempt);
  }
  return emailingAttempts;
}

function _distinctCandidatesResultRecipientEmails(certificationCandidates: any) {
  return uniqBy(certificationCandidates, 'resultRecipientEmail')
    .map((candidate: any) => candidate.resultRecipientEmail)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    .filter(Boolean);
}

function _someHaveSucceeded(emailingAttempts: any) {
  return some(emailingAttempts, (emailAttempt: any) => emailAttempt.hasSucceeded());
}

function _noneHaveFailed(emailingAttempts: any) {
  return !some(emailingAttempts, (emailAttempt: any) => emailAttempt.hasFailed());
}

function _someHaveFailed(emailingAttempts: any) {
  return some(emailingAttempts, (emailAttempt: any) => emailAttempt.hasFailed());
}

function _failedAttemptsRecipients(emailingAttempts: any) {
  return emailingAttempts
    .filter((emailAttempt: any) => emailAttempt.hasFailed())
    .map((emailAttempt: any) => emailAttempt.recipientEmail);
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
async function _updateFinalizedSession(finalizedSessionRepository: any, sessionId: any, publishedAt: any) {
  const finalizedSession = await finalizedSessionRepository.get({ sessionId });
  finalizedSession.publish(publishedAt);
  await finalizedSessionRepository.save(finalizedSession);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  publishSession,
};
