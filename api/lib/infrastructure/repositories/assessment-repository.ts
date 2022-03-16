// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfAssessment = require('../orm-models/Assessment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../domain/models/Assessment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'map'.
const { groupBy, map, head, uniqBy, omit } = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getWithAnswersAndCampaignParticipation(id: any) {
    const bookshelfAssessment = await BookshelfAssessment.where('id', id).fetch({
      require: false,
      withRelated: [
        {
          answers: function (query: any) {
            query.orderBy('createdAt', 'ASC');
          },
        },
        'campaignParticipation',
        'campaignParticipation.campaign',
      ],
    });

    const assessment = bookshelfToDomainConverter.buildDomainObject(BookshelfAssessment, bookshelfAssessment);
    if (assessment) assessment.answers = uniqBy(assessment.answers, 'challengeId');
    return assessment;
  },

  async get(id: any, domainTransaction = DomainTransaction.emptyTransaction()) {
    try {
      const bookshelfAssessment = await BookshelfAssessment.where({ id }).fetch({
        transacting: domainTransaction.knexTransaction,
      });

      return bookshelfToDomainConverter.buildDomainObject(BookshelfAssessment, bookshelfAssessment);
    } catch (err) {
      if (err instanceof BookshelfAssessment.NotFoundError) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        throw new NotFoundError("L'assessment n'existe pas ou son accès est restreint");
      }
      throw err;
    }
  },

  findLastCompletedAssessmentsForEachCompetenceByUser(userId: any, limitDate: any) {
    return BookshelfAssessment.collection()
      .query((qb: any) => {
        qb.join('assessment-results', 'assessment-results.assessmentId', 'assessments.id');
        qb.where({ userId })
          .where(function () {
            this.where({ type: 'PLACEMENT' });
          })
          .where('assessments.createdAt', '<', limitDate)
          .where('assessment-results.createdAt', '<', limitDate)
          .where('assessments.state', '=', 'completed')
          .orderBy('assessments.createdAt', 'desc');
      })
      .fetch({ require: false })
      .then((bookshelfAssessmentCollection: any) => bookshelfAssessmentCollection.models)
      .then(_selectLastAssessmentForEachCompetence)
      .then((assessments: any) => bookshelfToDomainConverter.buildDomainObjects(BookshelfAssessment, assessments));
  },

  getByAssessmentIdAndUserId(assessmentId: any, userId: any) {
    return BookshelfAssessment.query({ where: { id: assessmentId }, andWhere: { userId } })
      .fetch()
      .then((assessment: any) => bookshelfToDomainConverter.buildDomainObject(BookshelfAssessment, assessment))
      .catch((error: any) => {
        if (error instanceof BookshelfAssessment.NotFoundError) {
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 0.
          throw new NotFoundError();
        }

        throw error;
      });
  },

  save({
    assessment,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    return assessment
      .validate()
      .then(() => new BookshelfAssessment(_adaptModelToDb(assessment)))
      .then((bookshelfAssessment: any) => bookshelfAssessment.save(null, { transacting: domainTransaction.knexTransaction }))
      .then((assessment: any) => bookshelfToDomainConverter.buildDomainObject(BookshelfAssessment, assessment));
  },

  findNotAbortedCampaignAssessmentsByUserId(userId: any) {
    return BookshelfAssessment.where({ userId, type: 'CAMPAIGN' })
      .where('state', '!=', 'aborted')
      .fetchAll()
      .then((assessments: any) => bookshelfToDomainConverter.buildDomainObjects(BookshelfAssessment, assessments));
  },

  abortByAssessmentId(assessmentId: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
    return this._updateStateById({ id: assessmentId, state: Assessment.states.ABORTED });
  },

  completeByAssessmentId(assessmentId: any, domainTransaction = DomainTransaction.emptyTransaction()) {
    return this._updateStateById(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
      { id: assessmentId, state: Assessment.states.COMPLETED },
      domainTransaction.knexTransaction
    );
  },

  endBySupervisorByAssessmentId(assessmentId: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
    return this._updateStateById({ id: assessmentId, state: Assessment.states.ENDED_BY_SUPERVISOR });
  },

  async getByCertificationCandidateId(certificationCandidateId: any) {
    const assessment = await knex('assessments')
      .select('assessments.*')
      .innerJoin('certification-courses', 'certification-courses.id', 'assessments.certificationCourseId')
      .innerJoin('certification-candidates', function () {
        this.on('certification-candidates.userId', 'certification-courses.userId').andOn(
          'certification-candidates.sessionId',
          'certification-courses.sessionId'
        );
      })
      .where({ 'certification-candidates.id': certificationCandidateId })
      .first();
    return new Assessment({ ...assessment });
  },

  async ownedByUser({
    id,
    userId = null
  }: any) {
    const assessment = await knex('assessments').select('userId').where({ id }).first();

    if (!assessment) {
      return false;
    }

    return assessment.userId === userId;
  },

  async _updateStateById({
    id,
    state
  }: any, knexTransaction: any) {
    const assessment = await BookshelfAssessment.where({ id }).save(
      { state },
      { require: true, patch: true, transacting: knexTransaction }
    );
    return bookshelfToDomainConverter.buildDomainObject(BookshelfAssessment, assessment);
  },

  // @ts-expect-error ts-migrate(7010) FIXME: 'updateLastQuestionDate', which lacks return-type ... Remove this comment to see the full error message
  async updateLastQuestionDate({
    id,
    lastQuestionDate
  }: any) {
    try {
      await BookshelfAssessment.where({ id }).save(
        { lastQuestionDate },
        { require: true, patch: true, method: 'update' }
      );
    } catch (err) {
      if (err instanceof BookshelfAssessment.NoRowsUpdatedError) {
        return null;
      }
      throw err;
    }
  },

  // @ts-expect-error ts-migrate(7010) FIXME: 'updateWhenNewChallengeIsAsked', which lacks retur... Remove this comment to see the full error message
  async updateWhenNewChallengeIsAsked({
    id,
    lastChallengeId
  }: any) {
    try {
      await BookshelfAssessment.where({ id }).save(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'statesOfLastQuestion' does not exist on ... Remove this comment to see the full error message
        { lastChallengeId, lastQuestionState: Assessment.statesOfLastQuestion.ASKED },
        { require: true, patch: true, method: 'update' }
      );
    } catch (err) {
      if (err instanceof BookshelfAssessment.NoRowsUpdatedError) {
        return null;
      }
      throw err;
    }
  },

  // @ts-expect-error ts-migrate(7010) FIXME: 'updateLastQuestionState', which lacks return-type... Remove this comment to see the full error message
  async updateLastQuestionState({
    id,
    lastQuestionState
  }: any) {
    try {
      await BookshelfAssessment.where({ id }).save(
        { lastQuestionState },
        { require: true, patch: true, method: 'update' }
      );
    } catch (err) {
      if (err instanceof BookshelfAssessment.NoRowsUpdatedError) {
        return null;
      }
      throw err;
    }
  },
};

function _selectLastAssessmentForEachCompetence(bookshelfAssessments: any) {
  const assessmentsGroupedByCompetence = groupBy(bookshelfAssessments, (bookshelfAssessment: any) => bookshelfAssessment.get('competenceId')
  );
  return map(assessmentsGroupedByCompetence, head);
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _adaptModelToDb(assessment: any) {
  return omit(assessment, [
    'id',
    'course',
    'createdAt',
    'updatedAt',
    'successRate',
    'answers',
    'targetProfile',
    'campaign',
    'campaignParticipation',
    'title',
  ]);
}
