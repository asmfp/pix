// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentCompleted = require('../events/AssessmentCompleted');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('./check-event-types');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'eventTypes... Remove this comment to see the full error message
const eventTypes = [AssessmentCompleted];

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
const handleBadgeAcquisition = async function ({
  event,
  badgeCriteriaService,
  badgeAcquisitionRepository,
  badgeRepository,
  knowledgeElementRepository,
  targetProfileRepository
}: any) {
  checkEventTypes(event, eventTypes);

  if (event.isCampaignType) {
    const associatedBadges = await _fetchPossibleCampaignAssociatedBadges(event, badgeRepository);
    if (_.isEmpty(associatedBadges)) {
      return;
    }
    const targetProfile = await targetProfileRepository.getByCampaignParticipationId(event.campaignParticipationId);
    const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId: event.userId });

    const validatedBadgesByUser = associatedBadges.filter((badge: any) => badgeCriteriaService.areBadgeCriteriaFulfilled({ knowledgeElements, targetProfile, badge })
    );

    const badgesAcquisitionToCreate = validatedBadgesByUser.map((badge: any) => {
      return {
        badgeId: badge.id,
        userId: event.userId,
        campaignParticipationId: event.campaignParticipationId,
      };
    });

    if (!_.isEmpty(badgesAcquisitionToCreate)) {
      await badgeAcquisitionRepository.createOrUpdate(badgesAcquisitionToCreate);
    }
  }
};

function _fetchPossibleCampaignAssociatedBadges(event: any, badgeRepository: any) {
  return badgeRepository.findByCampaignParticipationId(event.campaignParticipationId);
}

handleBadgeAcquisition.eventTypes = eventTypes;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = handleBadgeAcquisition;
