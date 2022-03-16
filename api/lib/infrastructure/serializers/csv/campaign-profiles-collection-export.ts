// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'csvSeriali... Remove this comment to see the full error message
const csvSerializer = require('./csv-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../../constants');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfilesCollectionResultLine = require('../../exports/campaigns/campaign-profiles-collection-result-line');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
class CampaignProfilesCollectionExport {
  campaign: any;
  competences: any;
  idPixLabel: any;
  organization: any;
  stream: any;
  translate: any;
  constructor(outputStream: any, organization: any, campaign: any, competences: any, translate: any) {
    this.stream = outputStream;
    this.organization = organization;
    this.campaign = campaign;
    this.idPixLabel = campaign.idPixLabel;
    this.competences = competences;
    this.translate = translate;
  }

  export(campaignParticipationResultDatas: any, placementProfileService: any) {
    // WHY: add \uFEFF the UTF-8 BOM at the start of the text, see:
    // - https://en.wikipedia.org/wiki/Byte_order_mark
    // - https://stackoverflow.com/a/38192870
    this.stream.write(this._buildHeader());

    const campaignParticipationResultDataChunks = _.chunk(
      campaignParticipationResultDatas,
      constants.CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING
    );

    // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
    return bluebird.map(campaignParticipationResultDataChunks, async (campaignParticipationResultDataChunk: any) => {
      const placementProfiles = await this._getUsersPlacementProfiles(
        campaignParticipationResultDataChunk,
        placementProfileService
      );
      const csvLines = this._buildLines(placementProfiles, campaignParticipationResultDatas);

      this.stream.write(csvLines);
    });
  }

  _buildHeader() {
    const displayStudentNumber = this.organization.isSup && this.organization.isManagingStudents;
    const displayGroup = this.organization.isSup && this.organization.isManagingStudents;
    const displayDivision = this.organization.isSco && this.organization.isManagingStudents;

    const header = [
      this.translate('campaign-export.common.organization-name'),
      this.translate('campaign-export.common.campaign-id'),
      this.translate('campaign-export.common.campaign-name'),
      this.translate('campaign-export.common.participant-lastname'),
      this.translate('campaign-export.common.participant-firstname'),
      displayGroup && this.translate('campaign-export.common.participant-group'),
      displayDivision && this.translate('campaign-export.common.participant-division'),
      displayStudentNumber && this.translate('campaign-export.common.participant-student-number'),
      this.idPixLabel,
      this.translate('campaign-export.profiles-collection.is-sent'),
      this.translate('campaign-export.profiles-collection.sent-on'),
      this.translate('campaign-export.profiles-collection.pix-score'),
      this.translate('campaign-export.profiles-collection.is-certifiable'),
      this.translate('campaign-export.profiles-collection.certifiable-skills'),
      ...this._competenceColumnHeaders(),
    ];

    return '\uFEFF' + csvSerializer.serializeLine(_.compact(header));
  }

  async _getUsersPlacementProfiles(campaignParticipationResultDataChunk: any, placementProfileService: any) {
    const userIdsAndDates = {};
    campaignParticipationResultDataChunk.forEach(({
      userId,
      sharedAt
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    }: any) => (userIdsAndDates[userId] = sharedAt));

    const placementProfiles = await placementProfileService.getPlacementProfilesWithSnapshotting({
      userIdsAndDates,
      competences: this.competences,
      allowExcessPixAndLevels: false,
    });

    return placementProfiles;
  }

  _buildLines(placementProfiles: any, campaignParticipationResultDatas: any) {
    let csvLines = '';
    for (const placementProfile of placementProfiles) {
      const campaignParticipationResultData = campaignParticipationResultDatas.find(
        ({
          userId
        }: any) => userId === placementProfile.userId
      );

      const line = new CampaignProfilesCollectionResultLine(
        this.campaign,
        this.organization,
        campaignParticipationResultData,
        this.competences,
        placementProfile,
        this.translate
      );
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'concat' does not exist on type 'string'.
      csvLines = csvLines.concat(line.toCsvLine());
    }
    return csvLines;
  }

  _competenceColumnHeaders() {
    return _.flatMap(this.competences, (competence: any) => [
      this.translate('campaign-export.profiles-collection.skill-level', { name: competence.name }),
      this.translate('campaign-export.profiles-collection.skill-ranking', { name: competence.name }),
    ]);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignProfilesCollectionExport;
