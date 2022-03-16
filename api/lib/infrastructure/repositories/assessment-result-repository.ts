// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfAssessmentResult = require('../orm-models/AssessmentResult');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MissingAss... Remove this comment to see the full error message
const { MissingAssessmentId, AssessmentResultNotCreatedError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../domain/models/AssessmentResult');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../../domain/models/CompetenceMark');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain({
  assessmentResultDTO,
  competencesMarksDTO
}: any) {
  const competenceMarks = competencesMarksDTO.map((competenceMark: any) => new CompetenceMark(competenceMark));

  return new AssessmentResult({
    id: assessmentResultDTO.id,
    assessmentId: assessmentResultDTO.assessmentId,
    status: assessmentResultDTO.status,
    commentForCandidate: assessmentResultDTO.commentForCandidate,
    commentForOrganization: assessmentResultDTO.commentForOrganization,
    commentForJury: assessmentResultDTO.commentForJury,
    createdAt: assessmentResultDTO.createdAt,
    emitter: assessmentResultDTO.emitter,
    juryId: assessmentResultDTO.juryId,
    pixScore: assessmentResultDTO.pixScore,
    competenceMarks: competenceMarks,
  });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(
    {
      pixScore,
      status,
      emitter,
      commentForJury,
      commentForCandidate,
      commentForOrganization,
      id,
      juryId,
      assessmentId
    }: any,
    domainTransaction = DomainTransaction.emptyTransaction()
  ) {
    if (_.isNil(assessmentId)) {
      throw new MissingAssessmentId();
    }
    try {
      const savedAssessmentResultBookshelf = await new BookshelfAssessmentResult({
        pixScore,
        status,
        emitter,
        commentForJury,
        commentForCandidate,
        commentForOrganization,
        id,
        juryId,
        assessmentId,
      }).save(null, { require: true, transacting: domainTransaction.knexTransaction });

      return bookshelfToDomainConverter.buildDomainObject(BookshelfAssessmentResult, savedAssessmentResultBookshelf);
    } catch (error) {
      throw new AssessmentResultNotCreatedError();
    }
  },

  async findLatestLevelAndPixScoreByAssessmentId({
    assessmentId,
    limitDate
  }: any) {
    const result = await knex('assessment-results')
      .select('level', 'pixScore')
      .where((qb: any) => {
        qb.where({ assessmentId });
        if (limitDate) {
          qb.where('createdAt', '<', limitDate);
        }
      })
      .orderBy('createdAt', 'desc')
      .first();

    return {
      level: _.get(result, 'level', 0),
      pixScore: _.get(result, 'pixScore', 0),
    };
  },

  async getByCertificationCourseId({
    certificationCourseId
  }: any) {
    const assessment = await knex('assessments')
      .select('id')
      .where({ certificationCourseId })
      .orderBy('createdAt', 'desc')
      .first();

    if (assessment) {
      const assessmentId = assessment.id;

      const latestAssessmentResult = await knex('assessment-results')
        .where({ assessmentId })
        .orderBy('createdAt', 'desc')
        .first();

      if (latestAssessmentResult) {
        const competencesMarksDTO = await knex('competence-marks').where({
          assessmentResultId: latestAssessmentResult.id,
        });

        return _toDomain({
          assessmentResultDTO: latestAssessmentResult,
          competencesMarksDTO,
        });
      }

      return AssessmentResult.buildStartedAssessmentResult({ assessmentId });
    }
    return AssessmentResult.buildStartedAssessmentResult({ assessmentId: null });
  },
};
