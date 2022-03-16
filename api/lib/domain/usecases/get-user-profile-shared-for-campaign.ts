// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
const Scorecard = require('../models/Scorecard');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SharedProf... Remove this comment to see the full error message
const SharedProfileForCampaign = require('../models/SharedProfileForCampaign');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NoCampaign... Remove this comment to see the full error message
const { NoCampaignParticipationForUserAndCampaign } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getUserProfileSharedForCampaign({
  userId,
  campaignId,
  campaignParticipationRepository,
  campaignRepository,
  knowledgeElementRepository,
  competenceRepository,
  schoolingRegistrationRepository,
  locale
}: any) {
  const campaignParticipation = await campaignParticipationRepository.findOneByCampaignIdAndUserId({
    campaignId,
    userId,
  });

  if (!campaignParticipation) {
    throw new NoCampaignParticipationForUserAndCampaign();
  }

  const { multipleSendings: campaignAllowsRetry } = await campaignRepository.get(campaignId);
  const isRegistrationActive = await schoolingRegistrationRepository.isActive({ campaignId, userId });
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  const [knowledgeElementsGroupedByCompetenceId, competencesWithArea] = await Promise.all([
    knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId({
      userId,
      limitDate: campaignParticipation.sharedAt,
    }),
    competenceRepository.listPixCompetencesOnly({ locale }),
  ]);

  const scorecards = _.map(competencesWithArea, (competence: any) => {
    const competenceId = competence.id;
    const knowledgeElements = knowledgeElementsGroupedByCompetenceId[competenceId];

    return Scorecard.buildFrom({
      userId,
      knowledgeElements,
      competence,
    });
  });

  return new SharedProfileForCampaign({
    id: campaignParticipation.id,
    sharedAt: campaignParticipation.sharedAt,
    pixScore: campaignParticipation.pixScore,
    campaignAllowsRetry,
    isRegistrationActive,
    scorecards,
  });
};
