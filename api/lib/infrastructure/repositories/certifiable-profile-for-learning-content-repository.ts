// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certifiabl... Remove this comment to see the full error message
const CertifiableProfileForLearningContent = require('../../domain/models/CertifiableProfileForLearningContent');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get({
    id,
    profileDate,
    targetProfileWithLearningContent
  }: any) {
    const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId: id, limitDate: profileDate });
    const answerIds = _.map(knowledgeElements, 'answerId');
    const answerAndChallengeIds = await knex
      .select('answers.id', 'answers.challengeId')
      .from('answers')
      .whereIn('id', answerIds);
    const answerAndChallengeIdsByAnswerId = _.keyBy(answerAndChallengeIds, 'id');

    return new CertifiableProfileForLearningContent({
      userId: id,
      profileDate,
      targetProfileWithLearningContent,
      knowledgeElements,
      answerAndChallengeIdsByAnswerId,
    });
  },
};
