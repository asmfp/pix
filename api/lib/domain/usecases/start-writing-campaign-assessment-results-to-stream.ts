// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../../infrastructure/constants');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToGetCampaignResultsError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'csvSeriali... Remove this comment to see the full error message
const csvSerializer = require('../../infrastructure/serializers/csv/csv-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function startWritingCampaignAssessmentResultsToStream({
  userId,
  campaignId,
  writableStream,
  i18n,
  campaignRepository,
  userRepository,
  targetProfileWithLearningContentRepository,
  campaignParticipationInfoRepository,
  organizationRepository,
  knowledgeElementRepository,
  badgeAcquisitionRepository,
  campaignCsvExportService
}: any) {
  const campaign = await campaignRepository.get(campaignId);
  const translate = i18n.__;

  await _checkCreatorHasAccessToCampaignOrganization(userId, campaign.organizationId, userRepository);

  const targetProfileWithLearningContent = await targetProfileWithLearningContentRepository.get({
    id: campaign.targetProfileId,
    locale: i18n.getLocale(),
  });
  const organization = await organizationRepository.get(campaign.organizationId);
  const campaignParticipationInfos = await campaignParticipationInfoRepository.findByCampaignId(campaign.id);

  // Create HEADER of CSV
  const headers = _createHeaderOfCSV(targetProfileWithLearningContent, campaign.idPixLabel, organization, translate);

  // WHY: add \uFEFF the UTF-8 BOM at the start of the text, see:
  // - https://en.wikipedia.org/wiki/Byte_order_mark
  // - https://stackoverflow.com/a/38192870
  const headerLine = '\uFEFF' + csvSerializer.serializeLine(headers);

  writableStream.write(headerLine);

  // No return/await here, we need the writing to continue in the background
  // after this function's returned promise resolves. If we await the map
  // function, node will keep all the data in memory until the end of the
  // complete operation.
  const campaignParticipationInfoChunks = _.chunk(
    campaignParticipationInfos,
    constants.CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING
  );
  bluebird
    .map(
      campaignParticipationInfoChunks,
      // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
      async (campaignParticipationInfoChunk: any) => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
        const userIdsAndDates = Object.fromEntries(
          campaignParticipationInfoChunk.map((campaignParticipationInfo: any) => {
            return [campaignParticipationInfo.userId, campaignParticipationInfo.sharedAt];
          })
        );
        const knowledgeElementsByUserIdAndCompetenceId =
          await knowledgeElementRepository.findTargetedGroupedByCompetencesForUsers(
            userIdsAndDates,
            targetProfileWithLearningContent
          );

        let acquiredBadgesByCampaignParticipations;
        if (targetProfileWithLearningContent.hasBadges()) {
          const campaignParticipationsIds = campaignParticipationInfoChunk.map(
            (campaignParticipationInfo: any) => campaignParticipationInfo.campaignParticipationId
          );
          acquiredBadgesByCampaignParticipations =
            await badgeAcquisitionRepository.getAcquiredBadgesByCampaignParticipations({ campaignParticipationsIds });
        }

        let csvLines = '';
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
        for (const [strParticipantId, participantKnowledgeElementsByCompetenceId] of Object.entries(
          knowledgeElementsByUserIdAndCompetenceId
        )) {
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
          const participantId = parseInt(strParticipantId);
          const campaignParticipationInfo = campaignParticipationInfoChunk.find(
            (campaignParticipationInfo: any) => campaignParticipationInfo.userId === participantId
          );
          const acquiredBadges =
            acquiredBadgesByCampaignParticipations &&
            acquiredBadgesByCampaignParticipations[campaignParticipationInfo.campaignParticipationId]
              ? acquiredBadgesByCampaignParticipations[campaignParticipationInfo.campaignParticipationId].map(
                  (badge: any) => badge.title
                )
              : [];
          const csvLine = campaignCsvExportService.createOneCsvLine({
            organization,
            campaign,
            campaignParticipationInfo,
            targetProfileWithLearningContent,
            participantKnowledgeElementsByCompetenceId,
            acquiredBadges,
            translate,
          });
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'concat' does not exist on type 'string'.
          csvLines = csvLines.concat(csvLine);
        }

        writableStream.write(csvLines);
      },
      { concurrency: constants.CONCURRENCY_HEAVY_OPERATIONS }
    )
    .then(() => {
      writableStream.end();
    })
    .catch((error: any) => {
      writableStream.emit('error', error);
      throw error;
    });

  const fileName = translate('campaign-export.common.file-name', {
    name: campaign.name,
    id: campaign.id,
    date: moment.utc().format('YYYY-MM-DD-hhmm'),
  });
  return { fileName };
};

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
async function _checkCreatorHasAccessToCampaignOrganization(userId: any, organizationId: any, userRepository: any) {
  const user = await userRepository.getWithMemberships(userId);

  if (!user.hasAccessToOrganization(organizationId)) {
    throw new UserNotAuthorizedToGetCampaignResultsError(
      `User does not have an access to the organization ${organizationId}`
    );
  }
}

function _createHeaderOfCSV(targetProfile: any, idPixLabel: any, organization: any, translate: any) {
  const forSupStudents = organization.isSup && organization.isManagingStudents;
  const displayDivision = organization.isSco && organization.isManagingStudents;

  return [
    translate('campaign-export.common.organization-name'),
    translate('campaign-export.common.campaign-id'),
    translate('campaign-export.common.campaign-name'),
    translate('campaign-export.assessment.target-profile-name'),
    translate('campaign-export.common.participant-lastname'),
    translate('campaign-export.common.participant-firstname'),
    ...(displayDivision ? [translate('campaign-export.common.participant-division')] : []),
    ...(forSupStudents ? [translate('campaign-export.common.participant-group')] : []),
    ...(forSupStudents ? [translate('campaign-export.common.participant-student-number')] : []),
    ...(idPixLabel ? [idPixLabel] : []),

    translate('campaign-export.assessment.progress'),
    translate('campaign-export.assessment.started-on'),
    translate('campaign-export.assessment.is-shared'),
    translate('campaign-export.assessment.shared-on'),
    ...(targetProfile.hasReachableStages()
      ? [translate('campaign-export.assessment.success-rate', { value: targetProfile.reachableStages.length })]
      : []),

    ..._.flatMap(targetProfile.badges, (badge: any) => [
      translate('campaign-export.assessment.thematic-result-name', { name: badge.title }),
    ]),
    translate('campaign-export.assessment.mastery-percentage-target-profile'),

    ..._.flatMap(targetProfile.competences, (competence: any) => [
      translate('campaign-export.assessment.skill.mastery-percentage', { name: competence.name }),
      translate('campaign-export.assessment.skill.total-items', { name: competence.name }),
      translate('campaign-export.assessment.skill.items-successfully-completed', { name: competence.name }),
    ]),

    ..._.flatMap(targetProfile.areas, (area: any) => [
      translate('campaign-export.assessment.competence-area.mastery-percentage', { name: area.title }),
      translate('campaign-export.assessment.competence-area.total-items', { name: area.title }),
      translate('campaign-export.assessment.competence-area.items-successfully-completed', { name: area.title }),
    ]),

    ...(organization.showSkills ? targetProfile.skillNames : []),
  ];
}
