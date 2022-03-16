// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationAssessment = require('../../domain/models/CertificationAssessment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationChallengeWithType = require('../../domain/models/CertificationChallengeWithType');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Answer'.
const Answer = require('../../domain/models/Answer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'challengeR... Remove this comment to see the full error message
const challengeRepository = require('./challenge-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'answerStat... Remove this comment to see the full error message
const answerStatusDatabaseAdapter = require('../adapters/answer-status-database-adapter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

async function _getCertificationChallenges(certificationCourseId: any, knexConn: any) {
  const allChallenges = await challengeRepository.findOperative();
  const certificationChallengeRows = await knexConn('certification-challenges')
    .where({ courseId: certificationCourseId })
    .orderBy('challengeId', 'asc');

  return _.map(certificationChallengeRows, (certificationChallengeRow: any) => {
    const challenge = _.find(allChallenges, { id: certificationChallengeRow.challengeId });
    return new CertificationChallengeWithType({
      ...certificationChallengeRow,
      type: challenge?.type,
    });
  });
}

async function _getCertificationAnswersByDate(certificationAssessmentId: any, knexConn: any) {
  const answerRows = await knexConn('answers').where({ assessmentId: certificationAssessmentId }).orderBy('createdAt');
  const answerRowsWithoutDuplicate = _.uniqBy(answerRows, 'challengeId');

  return _.map(
    answerRowsWithoutDuplicate,
    (answerRow: any) => new Answer({
      ...answerRow,
      result: answerStatusDatabaseAdapter.fromSQLString(answerRow.result),
    })
  );
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: any) {
    const certificationAssessmentRows = await knex('assessments')
      .join('certification-courses', 'certification-courses.id', 'assessments.certificationCourseId')
      .select({
        id: 'assessments.id',
        userId: 'assessments.userId',
        certificationCourseId: 'certification-courses.id',
        createdAt: 'certification-courses.createdAt',
        completedAt: 'certification-courses.completedAt',
        isV2Certification: 'certification-courses.isV2Certification',
        state: 'assessments.state',
      })
      .where('assessments.id', '=', id)
      .limit(1);
    if (!certificationAssessmentRows[0]) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`L'assessment de certification ${id} n'existe pas ou son accès est restreint`);
    }
    const certificationChallenges = await _getCertificationChallenges(
      certificationAssessmentRows[0].certificationCourseId,
      knex
    );
    const certificationAnswersByDate = await _getCertificationAnswersByDate(certificationAssessmentRows[0].id, knex);

    return new CertificationAssessment({
      ...certificationAssessmentRows[0],
      certificationChallenges,
      certificationAnswersByDate,
    });
  },

  async getByCertificationCourseId({
    certificationCourseId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    const knexConn = domainTransaction.knexTransaction || knex;
    const certificationAssessmentRow = await knexConn('assessments')
      .join('certification-courses', 'certification-courses.id', 'assessments.certificationCourseId')
      .select({
        id: 'assessments.id',
        userId: 'assessments.userId',
        certificationCourseId: 'certification-courses.id',
        createdAt: 'certification-courses.createdAt',
        completedAt: 'certification-courses.completedAt',
        isV2Certification: 'certification-courses.isV2Certification',
        state: 'assessments.state',
      })
      .where('assessments.certificationCourseId', '=', certificationCourseId)
      .first();
    if (!certificationAssessmentRow) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(
        `L'assessment de certification avec un certificationCourseId de ${certificationCourseId} n'existe pas ou son accès est restreint`
      );
    }
    const certificationChallenges = await _getCertificationChallenges(
      certificationAssessmentRow.certificationCourseId,
      knexConn
    );
    const certificationAnswersByDate = await _getCertificationAnswersByDate(certificationAssessmentRow.id, knexConn);

    return new CertificationAssessment({
      ...certificationAssessmentRow,
      certificationChallenges,
      certificationAnswersByDate,
    });
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async save(certificationAssessment: any) {
    for (const challenge of certificationAssessment.certificationChallenges) {
      await knex('certification-challenges')
        .where({ id: challenge.id })
        .update(_.pick(challenge, ['isNeutralized', 'hasBeenSkippedAutomatically']));
    }
  },
};
