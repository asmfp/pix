// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BadgeResul... Remove this comment to see the full error message
const BadgeResult = require('./BadgeResult');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ReachedSta... Remove this comment to see the full error message
const ReachedStage = require('./ReachedStage');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceResult = require('./CompetenceResult');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../../constants');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
class AssessmentResult {
  badgeResults: any;
  canImprove: any;
  canRetry: any;
  competenceResults: any;
  estimatedFlashLevel: any;
  id: any;
  isCompleted: any;
  isDisabled: any;
  isShared: any;
  masteryRate: any;
  participantExternalId: any;
  reachedStage: any;
  stageCount: any;
  testedSkillsCount: any;
  totalSkillsCount: any;
  validatedSkillsCount: any;
  constructor(
    participationResults: any,
    targetProfile: any,
    isCampaignMultipleSendings: any,
    isRegistrationActive: any,
    isCampaignArchived: any
  ) {
    const { knowledgeElements, sharedAt, assessmentCreatedAt } = participationResults;
    const { competences } = targetProfile;

    this.id = participationResults.campaignParticipationId;
    this.isCompleted = participationResults.isCompleted;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    this.isShared = Boolean(participationResults.sharedAt);
    this.participantExternalId = participationResults.participantExternalId;
    this.estimatedFlashLevel = participationResults.estimatedFlashLevel;

    this.totalSkillsCount = competences.flatMap(({
      skillIds
    }: any) => skillIds).length;
    this.testedSkillsCount = knowledgeElements.length;
    this.validatedSkillsCount = knowledgeElements.filter(({
      isValidated
    }: any) => isValidated).length;
    this.masteryRate = this._computeMasteryRate(
      participationResults.masteryRate,
      this.isShared,
      this.totalSkillsCount,
      this.validatedSkillsCount
    );

    this.competenceResults = competences.map((competence: any) => _buildCompetenceResults(competence, knowledgeElements));
    this.badgeResults = targetProfile.badges.map((badge: any) => new BadgeResult(badge, participationResults));

    this.stageCount = targetProfile.stages.length;
    if (targetProfile.stages.length > 0) {
      this.reachedStage = new ReachedStage(this.masteryRate, targetProfile.stages);
    }
    this.canImprove = this._computeCanImprove(knowledgeElements, assessmentCreatedAt, this.isShared);
    this.isDisabled = this._computeIsDisabled(isCampaignArchived, participationResults.isDeleted);
    this.canRetry = this._computeCanRetry(
      isCampaignMultipleSendings,
      sharedAt,
      isRegistrationActive,
      this.masteryRate,
      this.isDisabled
    );
  }

  _computeMasteryRate(masteryRate: any, isShared: any, totalSkillsCount: any, validatedSkillsCount: any) {
    if (isShared) {
      return masteryRate;
    } else if (totalSkillsCount > 0) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'toPrecision' does not exist on type 'num... Remove this comment to see the full error message
      const rate = (validatedSkillsCount / totalSkillsCount).toPrecision(2);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseFloat'.
      return parseFloat(rate);
    } else {
      return 0;
    }
  }

  _computeCanImprove(knowledgeElements: any, assessmentCreatedAt: any, isShared: any) {
    const isImprovementPossible =
      knowledgeElements.filter((knowledgeElement: any) => {
        const isOldEnoughToBeImproved =
          moment(assessmentCreatedAt).diff(knowledgeElement.createdAt, 'days', true) >=
          constants.MINIMUM_DELAY_IN_DAYS_BEFORE_IMPROVING;
        return knowledgeElement.isInvalidated && isOldEnoughToBeImproved;
      }).length > 0;
    return isImprovementPossible && !isShared;
  }

  _computeCanRetry(isCampaignMultipleSendings: any, sharedAt: any, isRegistrationActive: any, masteryRate: any, isDisabled: any) {
    return (
      isCampaignMultipleSendings &&
      this._timeBeforeRetryingPassed(sharedAt) &&
      masteryRate < constants.MAX_MASTERY_RATE &&
      isRegistrationActive &&
      !isDisabled
    );
  }

  _computeIsDisabled(isCampaignArchived: any, isParticipationDeleted: any) {
    return isCampaignArchived || isParticipationDeleted;
  }

  _timeBeforeRetryingPassed(sharedAt: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    const isShared = Boolean(sharedAt);
    if (!isShared) return false;
    return sharedAt && moment().diff(sharedAt, 'days', true) >= constants.MINIMUM_DELAY_IN_DAYS_BEFORE_RETRYING;
  }
}

function _buildCompetenceResults(competence: any, knowledgeElements: any) {
  const competenceKnowledgeElements = knowledgeElements.filter(({
    skillId
  }: any) => competence.skillIds.includes(skillId));
  return new CompetenceResult(competence, competenceKnowledgeElements);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AssessmentResult;
