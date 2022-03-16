// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'events'.
const events = require('../../domain/events');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../infrastructure/serializers/jsonapi/competence-evaluation-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async startOrResume(request: any, h: any) {
    const userId = request.auth.credentials.userId;
    const competenceId = request.payload.competenceId;

    const { competenceEvaluation, created } = await usecases.startOrResumeCompetenceEvaluation({
      competenceId,
      userId,
    });
    const serializedCompetenceEvaluation = serializer.serialize(competenceEvaluation);

    return created ? h.response(serializedCompetenceEvaluation).created() : serializedCompetenceEvaluation;
  },

  async improve(request: any, h: any) {
    const userId = request.auth.credentials.userId;
    const competenceId = request.payload.competenceId;

    const competenceEvaluation = await DomainTransaction.execute(async (domainTransaction: any) => {
      const competenceEvaluation = await usecases.improveCompetenceEvaluation({
        competenceId,
        userId,
        domainTransaction,
      });
      await events.eventDispatcher.dispatch(domainTransaction, competenceEvaluation);
      return competenceEvaluation;
    });

    const serializedCompetenceEvaluation = serializer.serialize(competenceEvaluation);
    return h.response(serializedCompetenceEvaluation);
  },
};
