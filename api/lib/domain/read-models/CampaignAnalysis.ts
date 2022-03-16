// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const recommendationService = require('../services/recommendation-service');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignAn... Remove this comment to see the full error message
class CampaignAnalysis {
  campaignTubeRecommendations: any;
  id: any;
  participantCount: any;
  constructor({
    campaignId,
    targetProfileWithLearningContent,
    tutorials,
    participantCount = 0
  }: any = {}) {
    this.id = campaignId;
    this.participantCount = participantCount;
    const maxSkillLevelInTargetProfile = targetProfileWithLearningContent.maxSkillDifficulty;
    this.campaignTubeRecommendations = targetProfileWithLearningContent.tubes.map((tube: any) => {
      const competence = targetProfileWithLearningContent.getCompetence(tube.competenceId);
      const area = targetProfileWithLearningContent.getArea(competence.areaId);
      const tutorialIds = _.uniq(_.flatMap(tube.skills, 'tutorialIds'));
      const tubeTutorials = _.filter(tutorials, (tutorial: any) => tutorialIds.includes(tutorial.id));
      return new CampaignTubeRecommendation({
        campaignId: campaignId,
        area,
        competence,
        tube,
        maxSkillLevelInTargetProfile,
        tutorials: tubeTutorials,
        participantCount: this.participantCount,
      });
    });
  }

  addToTubeRecommendations({ knowledgeElementsByTube = {} }) {
    this.campaignTubeRecommendations.forEach((campaignTubeRecommendation: any) => {
      const tubeId = campaignTubeRecommendation.tubeId;
      if (tubeId in knowledgeElementsByTube) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        campaignTubeRecommendation.add({ knowledgeElements: knowledgeElementsByTube[tubeId] });
      }
    });
  }

  finalize() {
    this.campaignTubeRecommendations.forEach((campaignTubeRecommendation: any) => {
      campaignTubeRecommendation.finalize();
    });
  }
}

class CampaignTubeRecommendation {
  areaColor: any;
  averageScore: any;
  campaignId: any;
  competenceId: any;
  competenceName: any;
  cumulativeParticipantCount: any;
  cumulativeScore: any;
  maxSkillLevelInTargetProfile: any;
  participantCount: any;
  tube: any;
  tutorials: any;
  constructor({
    campaignId,
    area,
    tube,
    competence,
    maxSkillLevelInTargetProfile,
    tutorials,
    participantCount = 0
  }: any = {}) {
    this.campaignId = campaignId;
    this.tube = tube;
    this.competenceId = competence.id;
    this.competenceName = competence.name;
    this.areaColor = area.color;
    this.maxSkillLevelInTargetProfile = maxSkillLevelInTargetProfile;
    this.tutorials = tutorials;
    this.participantCount = participantCount;
    this.cumulativeScore = 0;
    this.cumulativeParticipantCount = 0;
    this.averageScore = null;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get tubeId() {
    return this.tube.id;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get tubePracticalTitle() {
    return this.tube.practicalTitle;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get tubeDescription() {
    return this.tube.description;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get id() {
    return `${this.campaignId}_${this.tubeId}`;
  }

  add({ knowledgeElements = [] }) {
    const knowledgeElementsByParticipant = _.toArray(_.groupBy(knowledgeElements, 'userId'));
    this._computeCumulativeScore(knowledgeElementsByParticipant);
    this.cumulativeParticipantCount += knowledgeElementsByParticipant.length;
  }

  finalize() {
    if (this.participantCount > 0) {
      const participantCountWithoutKnowledgeElements = this.participantCount - this.cumulativeParticipantCount;
      const emptyKnowledgeElementsByParticipant = _.times(participantCountWithoutKnowledgeElements, () => []);
      this._computeCumulativeScore(emptyKnowledgeElementsByParticipant);
      this.averageScore = this.cumulativeScore / this.participantCount;
    }
  }

  _computeCumulativeScore(knowledgeElementsByParticipant: any) {
    this.cumulativeScore += _(knowledgeElementsByParticipant).sumBy((knowledgeElements: any) => recommendationService.computeRecommendationScore(
      this.tube.skills,
      this.maxSkillLevelInTargetProfile,
      knowledgeElements
    )
    );
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignAnalysis;
