// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

const STATS_COLUMNS_COUNT = 3;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
class CampaignAssessmentCsvLine {
  acquiredBadges: any;
  campaign: any;
  campaignParticipationInfo: any;
  campaignParticipationService: any;
  emptyContent: any;
  organization: any;
  targetProfileWithLearningContent: any;
  targetedKnowledgeElementsByCompetence: any;
  targetedKnowledgeElementsCount: any;
  translate: any;
  constructor({
    organization,
    campaign,
    campaignParticipationInfo,
    targetProfileWithLearningContent,
    participantKnowledgeElementsByCompetenceId,
    acquiredBadges,
    campaignParticipationService,
    translate
  }: any) {
    this.organization = organization;
    this.campaign = campaign;
    this.campaignParticipationInfo = campaignParticipationInfo;
    this.targetProfileWithLearningContent = targetProfileWithLearningContent;
    this.targetedKnowledgeElementsCount = _.sum(
      _.map(participantKnowledgeElementsByCompetenceId, (knowledgeElements: any) => knowledgeElements.length)
    );
    this.targetedKnowledgeElementsByCompetence = participantKnowledgeElementsByCompetenceId;
    this.acquiredBadges = acquiredBadges;
    this.campaignParticipationService = campaignParticipationService;
    this.translate = translate;

    this.emptyContent = translate('campaign-export.common.not-available');

    // To have the good `this` in _getStatsForCompetence, it is necessary to bind it
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'bind' does not exist on type '(competenc... Remove this comment to see the full error message
    this._getStatsForCompetence = this._getStatsForCompetence.bind(this);
  }

  toCsvLine() {
    return [
      ...this._makeCommonColumns(),
      ...(this.campaignParticipationInfo.isShared ? this._makeSharedColumns() : this._makeNotSharedColumns()),
    ];
  }

  _makeSharedStatsColumns({
    targetedSkillCount,
    validatedSkillCount
  }: any) {
    return [_.round(validatedSkillCount / targetedSkillCount, 2), targetedSkillCount, validatedSkillCount];
  }

  _makeEmptyColumns(times: any) {
    return _.times(times, () => this.emptyContent);
  }

  _getStatsForCompetence(competence: any) {
    return {
      targetedSkillCount: competence.skillCount,
      validatedSkillCount: this._countValidatedKnowledgeElementsForCompetence(competence.id),
    };
  }

  _makeCompetenceColumns() {
    return _.flatMap(this.targetProfileWithLearningContent.competences, (competence: any) => this._makeSharedStatsColumns({
      id: competence.id,
      ...this._getStatsForCompetence(competence),
    })
    );
  }

  _makeAreaColumns() {
    return _.flatMap(this.targetProfileWithLearningContent.areas, ({
      id,
      competences
    }: any) => {
      const areaCompetenceStats = competences.map(this._getStatsForCompetence);

      const targetedSkillCount = _.sumBy(areaCompetenceStats, 'targetedSkillCount');
      const validatedSkillCount = _.sumBy(areaCompetenceStats, 'validatedSkillCount');

      return this._makeSharedStatsColumns({
        id,
        targetedSkillCount,
        validatedSkillCount,
      });
    });
  }

  _makeBadgesColumns() {
    return _.flatMap(this.targetProfileWithLearningContent.badges, ({
      title
    }: any) =>
      this._makeYesNoColumns(_.includes(this.acquiredBadges, title))
    );
  }

  _makeCommonColumns() {
    return [
      this.organization.name,
      this.campaign.id,
      this.campaign.name,
      this.targetProfileWithLearningContent.name,
      this.campaignParticipationInfo.participantLastName,
      this.campaignParticipationInfo.participantFirstName,
      ...this._division,
      ...this._group,
      ...this._studentNumber,
      ...(this.campaign.idPixLabel ? [this.campaignParticipationInfo.participantExternalId] : []),
      this.campaignParticipationService.progress(
        this.campaignParticipationInfo.isCompleted,
        this.targetedKnowledgeElementsCount,
        this.targetProfileWithLearningContent.skills.length
      ),
      moment.utc(this.campaignParticipationInfo.createdAt).format('YYYY-MM-DD'),
      this._makeYesNoColumns(this.campaignParticipationInfo.isShared),
      this.campaignParticipationInfo.isShared
        ? moment.utc(this.campaignParticipationInfo.sharedAt).format('YYYY-MM-DD')
        : this.emptyContent,
      ...(this.targetProfileWithLearningContent.hasReachableStages() ? [this._getReachedStage()] : []),
      ...(this.campaignParticipationInfo.isShared
        ? this._makeBadgesColumns()
        : this._makeEmptyColumns(this.targetProfileWithLearningContent.badges.length)),
      this.campaignParticipationInfo.isShared ? this.campaignParticipationInfo.masteryRate : this.emptyContent,
    ];
  }

  _makeSharedColumns() {
    return [
      ...this._makeCompetenceColumns(),
      ...this._makeAreaColumns(),
      ...(this.organization.showSkills
        ? _.map(this.targetProfileWithLearningContent.skills, (targetedSkill: any) => this._makeSkillColumn(targetedSkill))
        : []),
    ];
  }

  _makeYesNoColumns(isTrue: any) {
    return isTrue ? this.translate('campaign-export.common.yes') : this.translate('campaign-export.common.no');
  }

  _makeNotSharedColumns() {
    return [
      ...this._makeEmptyColumns(this.targetProfileWithLearningContent.competences.length * STATS_COLUMNS_COUNT),
      ...this._makeEmptyColumns(this.targetProfileWithLearningContent.areas.length * STATS_COLUMNS_COUNT),
      ...(this.organization.showSkills
        ? this._makeEmptyColumns(this.targetProfileWithLearningContent.skills.length)
        : []),
    ];
  }

  _makeSkillColumn(targetedSkill: any) {
    let knowledgeElementForSkill = null;
    const competenceId = this.targetProfileWithLearningContent.getCompetenceIdOfSkill(targetedSkill.id);
    if (competenceId in this.targetedKnowledgeElementsByCompetence) {
      knowledgeElementForSkill = _.find(
        this.targetedKnowledgeElementsByCompetence[competenceId],
        (knowledgeElement: any) => knowledgeElement.skillId === targetedSkill.id
      );
    }

    return knowledgeElementForSkill
      ? knowledgeElementForSkill.isValidated
        ? this.translate('campaign-export.assessment.status.ok')
        : this.translate('campaign-export.assessment.status.ko')
      : this.translate('campaign-export.assessment.status.not-tested');
  }

  _countValidatedKnowledgeElementsForCompetence(competenceId: any) {
    return this.targetedKnowledgeElementsByCompetence[competenceId].filter(
      (knowledgeElement: any) => knowledgeElement.isValidated
    ).length;
  }

  _getReachedStage() {
    if (!this.campaignParticipationInfo.isShared) {
      return this.emptyContent;
    }

    const masteryPercentage = this.campaignParticipationInfo.masteryRate * 100;

    return this.targetProfileWithLearningContent.reachableStages.filter((stage: any) => masteryPercentage >= stage.threshold)
      .length;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get _studentNumber() {
    if (this.organization.isSup && this.organization.isManagingStudents) {
      return [this.campaignParticipationInfo.studentNumber || ''];
    }

    return [];
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get _division() {
    if (this.organization.isSco && this.organization.isManagingStudents) {
      return [this.campaignParticipationInfo.division || ''];
    }

    return [];
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get _group() {
    if (this.organization.isSup && this.organization.isManagingStudents) {
      return [this.campaignParticipationInfo.group || ''];
    }

    return [];
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignAssessmentCsvLine;
